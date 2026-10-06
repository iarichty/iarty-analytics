/**
 * Pure parsing / comparison logic for Instagram, TikTok, Threads and X
 * (Twitter) data exports.
 *
 * Everything here is side-effect free so it can run inside a Web Worker and
 * be unit-tested in isolation. The UI layer only deals with `AnalysisResult`.
 */
import type {
    AnalysisResult,
    AnalysisInsights,
    ConnectionUser,
    InstagramRawUser,
    SnapshotDiff,
    ThreadsRawUser,
    TikTokRawData,
    TikTokRawUser,
    XRawAccount,
    XRawEntry,
} from './types';

/** Every platform the insight/parser layer understands. */
export type ParserPlatform = 'instagram' | 'tiktok' | 'threads' | 'x';

/** Empty insight bundle, used when an export has no follower/following data. */
export function emptyInsights(): AnalysisInsights {
    return {
        mutuals: [],
        fans: [],
        followingOnly: [],
        growth: [],
        averageFollowAgeDays: 0,
        oldestFollowing: null,
    };
}

/** Error type that carries a message safe to show directly to the user. */
export class AnalysisError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'AnalysisError';
    }
}

/**
 * Canonical key for an Instagram profile URL.
 *
 * Instagram exports are inconsistent: follower rows may be written as
 * `https://www.instagram.com/_u/username` while following rows use
 * `https://www.instagram.com/username` (and vice-versa across export
 * versions). Comparing the raw strings therefore produces false positives
 * (everyone looks like a non-follower).
 *
 * We strip the protocol, host, the `/_u` marker, query/hash and any trailing
 * slash, then lowercase — so both sides always compare equal.
 */
export function normalizeInstagramHref(href: string): string {
    return href
        .trim()
        .toLowerCase()
        .replace(/^https?:\/\//, '')
        .replace(/^www\./, '')
        .replace(/^instagram\.com\//, '')
        .replace(/^_u\//, '')
        .replace(/[?#].*$/, '')
        .replace(/\/+$/, '');
}

/** Derive a display username from an Instagram profile URL. */
export function instagramUsernameFromHref(href: string): string {
    return normalizeInstagramHref(href);
}

/**
 * Canonical comparison key for a connection on a given platform.
 *
 * Instagram (and Threads, which shares its export shape) compares on the
 * normalized profile URL (so the `/_u/` variants match); TikTok and X have no
 * reliable URL in the export, so we compare the lower-cased username.
 */
function comparisonKey(platform: ParserPlatform, user: ConnectionUser): string {
    return platform === 'instagram'
        ? normalizeInstagramHref(user.href)
        : user.username.toLowerCase();
}

/**
 * Derive the extra "insights" bundle from already-normalized followers /
 * following lists. Pure and worker-safe; shared by every platform.
 */
export function computeInsights(
    platform: ParserPlatform,
    followers: ConnectionUser[],
    following: ConnectionUser[],
): AnalysisInsights {
    const followerKeys = new Set(followers.map((u) => comparisonKey(platform, u)));
    const followingKeys = new Set(following.map((u) => comparisonKey(platform, u)));

    const mutuals = following.filter((u) => followerKeys.has(comparisonKey(platform, u)));
    const fans = followers.filter((u) => !followingKeys.has(comparisonKey(platform, u)));
    const followingOnly = following.filter((u) => !followerKeys.has(comparisonKey(platform, u)));

    // Follower growth, bucketed by calendar month ("YYYY-MM").
    const buckets = new Map<string, number>();
    let ageTotal = 0;
    let ageCount = 0;
    const now = Date.now();
    for (const f of followers) {
        if (!f.timestamp) continue;
        const d = new Date(f.timestamp);
        const month = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
        buckets.set(month, (buckets.get(month) ?? 0) + 1);
        ageTotal += Math.max(0, (now - f.timestamp) / 86_400_000);
        ageCount += 1;
    }
    const growth = [...buckets.entries()]
        .map(([month, count]) => ({ month, count }))
        .sort((a, b) => a.month.localeCompare(b.month));

    // Longest-standing follow = the following entry with the oldest timestamp.
    const oldestFollowing = following.reduce<ConnectionUser | null>((oldest, user) => {
        if (!user.timestamp) return oldest;
        if (!oldest || user.timestamp < oldest.timestamp) return user;
        return oldest;
    }, null);

    return {
        mutuals,
        fans,
        followingOnly,
        growth,
        averageFollowAgeDays: ageCount ? Math.round(ageTotal / ageCount) : 0,
        oldestFollowing,
    };
}

/** Convert a raw Instagram row into the normalized user shape. */
function mapInstagramUser(raw: InstagramRawUser): ConnectionUser {
    const entry = raw.string_list_data?.[0];
    const href = entry?.href ?? '';
    const username = entry?.value || instagramUsernameFromHref(href);
    return {
        username,
        href,
        // Instagram timestamps are in seconds.
        timestamp: (entry?.timestamp ?? 0) * 1000,
    };
}

/**
 * Parse the Instagram ZIP contents.
 * @param followersRaw parsed contents of `followers_1.json`
 * @param followingRaw parsed contents of `following.json` (`relationships_following`)
 */
export function analyzeInstagram(
    followersRaw: InstagramRawUser[],
    followingRaw: InstagramRawUser[],
): AnalysisResult {
    const followers = followersRaw.map(mapInstagramUser);
    const following = followingRaw.map(mapInstagramUser);

    // Compare using the normalized key on BOTH sides.
    const followerKeys = new Set(
        followers.map((u) => normalizeInstagramHref(u.href)),
    );
    const followingKeys = new Set(
        following.map((u) => normalizeInstagramHref(u.href)),
    );

    return {
        followers,
        following,
        nonFollowbacks: following.filter(
            (u) => !followerKeys.has(normalizeInstagramHref(u.href)),
        ),
        notFollowingBack: followers.filter(
            (u) => !followingKeys.has(normalizeInstagramHref(u.href)),
        ),
        insights: computeInsights('instagram', followers, following),
    };
}

/** Convert a raw TikTok row into the normalized user shape. */
function mapTikTokUser(raw: TikTokRawUser): ConnectionUser {
    const parsed = raw?.Date ? Date.parse(raw.Date) : NaN;
    return {
        username: raw?.UserName ?? '',
        href: `https://www.tiktok.com/@${raw?.UserName ?? ''}`,
        timestamp: Number.isNaN(parsed) ? 0 : parsed,
    };
}

/** Parse the TikTok ZIP contents (already-decoded JSON object). */
export function analyzeTikTok(data: TikTokRawData): AnalysisResult {
    const followersRaw = data['Profile And Settings']?.Follower?.FansList ?? [];
    const followingRaw = data['Profile And Settings']?.Following?.Following ?? [];

    if (followersRaw.length === 0 && followingRaw.length === 0) {
        throw new AnalysisError(
            'The data is empty or the TikTok format is not supported.',
        );
    }

    const followers = followersRaw.map(mapTikTokUser);
    const following = followingRaw.map(mapTikTokUser);

    const followerNames = new Set(followers.map((u) => comparisonKey('tiktok', u)));
    const followingNames = new Set(following.map((u) => comparisonKey('tiktok', u)));

    return {
        followers,
        following,
        nonFollowbacks: following.filter(
            (u) => !followerNames.has(comparisonKey('tiktok', u)),
        ),
        notFollowingBack: followers.filter(
            (u) => !followingNames.has(comparisonKey('tiktok', u)),
        ),
        insights: computeInsights('tiktok', followers, following),
    };
}

/**
 * Parse Threads connections.
 *
 * Threads is exported via Meta's Accounts Center using the same
 * `followers_*.json` / `following.json` structure as Instagram, so we reuse
 * the Instagram mapping but build profile links against `threads.net` and
 * compare by username.
 */
export function analyzeThreads(
    followersRaw: ThreadsRawUser[],
    followingRaw: ThreadsRawUser[],
): AnalysisResult {
    const mapUser = (raw: ThreadsRawUser): ConnectionUser => {
        const entry = raw.string_list_data?.[0];
        const username = entry?.value || instagramUsernameFromHref(entry?.href ?? '');
        return {
            username,
            href: `https://www.threads.net/@${username}`,
            // Threads timestamps are in seconds, like Instagram's.
            timestamp: (entry?.timestamp ?? 0) * 1000,
        };
    };

    const followers = followersRaw.map(mapUser);
    const following = followingRaw.map(mapUser);

    const followerKeys = new Set(followers.map((u) => comparisonKey('threads', u)));
    const followingKeys = new Set(following.map((u) => comparisonKey('threads', u)));

    return {
        followers,
        following,
        nonFollowbacks: following.filter(
            (u) => !followerKeys.has(comparisonKey('threads', u)),
        ),
        notFollowingBack: followers.filter(
            (u) => !followingKeys.has(comparisonKey('threads', u)),
        ),
        insights: computeInsights('threads', followers, following),
    };
}

/** Build a `accountId -> username` lookup from an X `account.js` export. */
export function buildXAccountMap(accounts: XRawAccount[]): Map<string, string> {
    const map = new Map<string, string>();
    for (const entry of accounts) {
        const id = entry?.account?.accountId;
        const username = entry?.account?.username;
        if (id && username) map.set(id, username);
    }
    return map;
}

/**
 * Parse the X (Twitter) archive's follower/following lists.
 *
 * Entries only carry a numeric `accountId`, so we resolve usernames through
 * `accountMap` (built from `account.js`). When an id cannot be resolved we
 * fall back to the raw id, so nothing is silently dropped.
 *
 * @param followerRaw parsed contents of `follower.js`
 * @param followingRaw parsed contents of `following.js`
 * @param accountMap `accountId -> username` lookup (may be empty)
 */
export function analyzeX(
    followerRaw: XRawEntry[],
    followingRaw: XRawEntry[],
    accountMap: Map<string, string> = new Map(),
): AnalysisResult {
    const mapUser = (
        accountId: string | undefined,
        userLink?: string,
    ): ConnectionUser => {
        const id = accountId ?? '';
        const username = accountMap.get(id) ?? id;
        return {
            username,
            href: userLink ?? `https://x.com/${username}`,
            // X archives do not include a follow timestamp.
            timestamp: 0,
        };
    };

    const followers = followerRaw
        .map((e) => e.follower)
        .filter((e): e is NonNullable<XRawEntry['follower']> => Boolean(e))
        .map((e) => mapUser(e.accountId, e.userLink));
    const following = followingRaw
        .map((e) => e.following)
        .filter((e): e is NonNullable<XRawEntry['following']> => Boolean(e))
        .map((e) => mapUser(e.accountId, e.userLink));

    const followerNames = new Set(followers.map((u) => comparisonKey('x', u)));
    const followingNames = new Set(following.map((u) => comparisonKey('x', u)));

    return {
        followers,
        following,
        nonFollowbacks: following.filter(
            (u) => !followerNames.has(comparisonKey('x', u)),
        ),
        notFollowingBack: followers.filter(
            (u) => !followingNames.has(comparisonKey('x', u)),
        ),
        insights: computeInsights('x', followers, following),
    };
}

/**
 * Parse the pseudo-JavaScript files shipped inside an X archive.
 *
 * X stores lists as `window.YTD.follower.part0 = [ ... ]` rather than plain
 * JSON. We strip the assignment prefix and parse the array body.
 */
export function parseXArchive<T>(text: string): T[] {
    const start = text.indexOf('[');
    const end = text.lastIndexOf(']');
    if (start === -1 || end === -1 || end < start) {
        throw new AnalysisError(
            'Could not read the X archive file. Make sure you uploaded the original ZIP.',
        );
    }
    try {
        const parsed = JSON.parse(text.slice(start, end + 1));
        return Array.isArray(parsed) ? (parsed as T[]) : [];
    } catch {
        throw new AnalysisError(
            'The X archive file could not be parsed. It may be corrupted or incomplete.',
        );
    }
}

/** Deduplicate a list of users by their comparison key, keeping the first. */
function dedupeByKey(
    users: ConnectionUser[],
    keyFn: (u: ConnectionUser) => string,
): ConnectionUser[] {
    const seen = new Set<string>();
    const out: ConnectionUser[] = [];
    for (const u of users) {
        const key = keyFn(u);
        if (seen.has(key)) continue;
        seen.add(key);
        out.push(u);
    }
    return out;
}

/** Merge results when an export contains several followers_*.json chunks. */
export function mergeInstagramResults(results: AnalysisResult[]): AnalysisResult {
    // Chunks can overlap across export versions, so dedupe by profile URL.
    const followers = dedupeByKey(
        results.flatMap((r) => r.followers),
        (u) => normalizeInstagramHref(u.href),
    );
    const following = dedupeByKey(
        results.flatMap((r) => r.following),
        (u) => normalizeInstagramHref(u.href),
    );
    const followerKeys = new Set(followers.map((u) => normalizeInstagramHref(u.href)));
    const followingKeys = new Set(following.map((u) => normalizeInstagramHref(u.href)));

    return {
        followers,
        following,
        nonFollowbacks: following.filter(
            (u) => !followerKeys.has(normalizeInstagramHref(u.href)),
        ),
        notFollowingBack: followers.filter(
            (u) => !followingKeys.has(normalizeInstagramHref(u.href)),
        ),
        insights: computeInsights('instagram', followers, following),
    };
}

/** Filter + sort a result list for display. Pure, worker-safe. */
export function filterAndSort(
    users: ConnectionUser[],
    query: string,
    order: 'newest' | 'oldest',
): ConnectionUser[] {
    const needle = query.trim().toLowerCase();
    const filtered = needle
        ? users.filter((u) => u.username.toLowerCase().includes(needle))
        : users;
    return [...filtered].sort((a, b) =>
        order === 'newest' ? b.timestamp - a.timestamp : a.timestamp - b.timestamp,
    );
}

/** Look up a user by username (case-insensitive) from a list. */
function findByName(list: ConnectionUser[], username: string): ConnectionUser | undefined {
    const needle = username.toLowerCase();
    return list.find((u) => u.username.toLowerCase() === needle);
}

/**
 * Diff the current analysis against a previously saved snapshot.
 *
 * Only usernames are compared, so the result is stable regardless of the raw
 * ZIP. Returns the accounts that changed in each direction. Pure & testable.
 */
export function diffAgainstSnapshot(
    current: Pick<AnalysisResult, 'followers' | 'following'>,
    snapshot: { followerNames: string[]; followingNames: string[]; capturedAt: number },
): SnapshotDiff {
    const currFollowers = new Set(current.followers.map((u) => u.username.toLowerCase()));
    const currFollowing = new Set(current.following.map((u) => u.username.toLowerCase()));
    const prevFollowers = new Set(snapshot.followerNames.map((n) => n.toLowerCase()));
    const prevFollowing = new Set(snapshot.followingNames.map((n) => n.toLowerCase()));

    const unfollowedYou = snapshot.followerNames
        .filter((n) => !currFollowers.has(n.toLowerCase()))
        .map((n) => findByName(current.followers, n) ?? emptyUser(n));

    const newFollowers = current.followers.filter(
        (u) => !prevFollowers.has(u.username.toLowerCase()),
    );

    const youUnfollowed = snapshot.followingNames
        .filter((n) => !currFollowing.has(n.toLowerCase()))
        .map((n) => findByName(current.following, n) ?? emptyUser(n));

    const youNowFollow = current.following.filter(
        (u) => !prevFollowing.has(u.username.toLowerCase()),
    );

    return {
        unfollowedYou,
        newFollowers,
        youUnfollowed,
        youNowFollow,
        previousCapturedAt: snapshot.capturedAt,
    };
}

/** Placeholder user for a name we only know from a snapshot. */
function emptyUser(username: string): ConnectionUser {
    return { username, href: '', timestamp: 0 };
}

/** Escape a single CSV field (RFC 4180: wrap in quotes, double inner quotes). */
function csvField(value: string | number): string {
    const str = String(value);
    return /[",\n\r]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
}

/** Serialize a list of users to CSV text (username, profile URL, date). */
export function toCsv(users: ConnectionUser[]): string {
    const header = 'username,profile_url,timestamp';
    const rows = users.map((u) =>
        [csvField(u.username), csvField(u.href), csvField(u.timestamp)].join(','),
    );
    return [header, ...rows].join('\r\n');
}
