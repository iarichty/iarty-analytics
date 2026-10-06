import { describe, it, expect } from 'vitest';
import {
    normalizeInstagramHref,
    instagramUsernameFromHref,
    analyzeInstagram,
    analyzeTikTok,
    mergeInstagramResults,
    filterAndSort,
    computeInsights,
    emptyInsights,
    diffAgainstSnapshot,
    toCsv,
    AnalysisError,
} from './parsers';
import type { AnalysisResult, ConnectionUser, InstagramRawUser, TikTokRawData } from './types';

/** Helper to build a raw Instagram row. */
function igRow(username: string, href?: string, timestamp = 0): InstagramRawUser {
    return {
        string_list_data: [
            {
                href: href ?? `https://www.instagram.com/${username}`,
                timestamp,
                value: username,
            },
        ],
    };
}

describe('normalizeInstagramHref', () => {
    it('normalizes the "/_u/" variant to match the plain profile URL', () => {
        expect(normalizeInstagramHref('https://www.instagram.com/_u/alice')).toBe(
            normalizeInstagramHref('https://www.instagram.com/alice'),
        );
    });

    it('ignores protocol, host casing, query strings and trailing slashes', () => {
        expect(
            normalizeInstagramHref('HTTP://WWW.Instagram.com/Alice/?hl=en#frag'),
        ).toBe('alice');
    });

    it('returns an empty string for empty input', () => {
        expect(normalizeInstagramHref('')).toBe('');
    });
});

describe('instagramUsernameFromHref', () => {
    it('derives the username from a profile URL', () => {
        expect(instagramUsernameFromHref('https://www.instagram.com/bob/')).toBe('bob');
    });
});

describe('analyzeInstagram', () => {
    it('detects non-followbacks in both directions', () => {
        const followers = [igRow('alice'), igRow('bob')];
        const following = [igRow('alice'), igRow('carol')];
        const result = analyzeInstagram(followers, following);

        // carol is followed but does not follow back.
        expect(result.nonFollowbacks.map((u) => u.username)).toEqual(['carol']);
        // bob follows you but you do not follow back.
        expect(result.notFollowingBack.map((u) => u.username)).toEqual(['bob']);
    });

    it('does not report false positives when one side uses the "/_u/" URL form', () => {
        const followers = [igRow('alice', 'https://www.instagram.com/_u/alice')];
        const following = [igRow('alice', 'https://www.instagram.com/alice')];
        const result = analyzeInstagram(followers, following);

        expect(result.nonFollowbacks).toHaveLength(0);
        expect(result.notFollowingBack).toHaveLength(0);
    });

    it('converts Instagram second-based timestamps to milliseconds', () => {
        const result = analyzeInstagram([igRow('alice', undefined, 1600000000)], []);
        expect(result.followers[0].timestamp).toBe(1600000000000);
    });

    it('tolerates empty followers/following arrays', () => {
        const result = analyzeInstagram([], []);
        expect(result.followers).toEqual([]);
        expect(result.following).toEqual([]);
        expect(result.nonFollowbacks).toEqual([]);
        expect(result.notFollowingBack).toEqual([]);
        expect(result.insights.mutuals).toEqual([]);
    });
});

describe('analyzeTikTok', () => {
    const makeData = (followers: string[], following: string[]): TikTokRawData => ({
        'Profile And Settings': {
            Follower: {
                FansList: followers.map((u) => ({ Date: '2023-01-01', UserName: u })),
            },
            Following: {
                Following: following.map((u) => ({ Date: '2023-01-01', UserName: u })),
            },
        },
    });

    it('compares usernames case-insensitively', () => {
        const result = analyzeTikTok(makeData(['Alice'], ['alice']));
        expect(result.nonFollowbacks).toHaveLength(0);
        expect(result.notFollowingBack).toHaveLength(0);
    });

    it('builds profile links from the username', () => {
        const result = analyzeTikTok(makeData(['alice'], []));
        expect(result.followers[0].href).toBe('https://www.tiktok.com/@alice');
    });

    it('throws an AnalysisError when both lists are empty', () => {
        expect(() => analyzeTikTok(makeData([], []))).toThrow(AnalysisError);
    });
});

describe('mergeInstagramResults', () => {
    it('recomputes differences across all follower chunks', () => {
        const chunk1: AnalysisResult = {
            followers: [],
            following: [igRow('carol')].map((r) => ({
                username: 'carol',
                href: r.string_list_data[0].href,
                timestamp: 0,
            })),
            nonFollowbacks: [],
            notFollowingBack: [],
            insights: emptyInsights(),
        };
        const followedUser = {
            username: 'alice',
            href: 'https://www.instagram.com/alice',
            timestamp: 0,
        };
        const chunk2: AnalysisResult = {
            followers: [followedUser],
            following: [],
            nonFollowbacks: [],
            notFollowingBack: [],
            insights: emptyInsights(),
        };

        const merged = mergeInstagramResults([chunk1, chunk2]);
        expect(merged.followers).toHaveLength(1);
        expect(merged.following).toHaveLength(1);
        // carol is followed but appears in no follower chunk -> non-followback.
        expect(merged.nonFollowbacks.map((u) => u.username)).toEqual(['carol']);
    });

    it('dedupes followers that appear in multiple chunks', () => {
        const shared = {
            username: 'alice',
            href: 'https://www.instagram.com/alice',
            timestamp: 0,
        };
        const makeChunk = (): AnalysisResult => ({
            followers: [shared],
            following: [],
            nonFollowbacks: [],
            notFollowingBack: [],
            insights: emptyInsights(),
        });
        const merged = mergeInstagramResults([makeChunk(), makeChunk()]);
        expect(merged.followers).toHaveLength(1);
    });
});

describe('filterAndSort', () => {
    const users = [
        { username: 'alice', href: 'a', timestamp: 1000 },
        { username: 'bob', href: 'b', timestamp: 3000 },
        { username: 'carol', href: 'c', timestamp: 2000 },
    ];

    it('filters case-insensitively by username substring', () => {
        const result = filterAndSort(users, 'BO', 'newest');
        expect(result.map((u) => u.username)).toEqual(['bob']);
    });

    it('sorts newest first by default', () => {
        const result = filterAndSort(users, '', 'newest');
        expect(result.map((u) => u.username)).toEqual(['bob', 'carol', 'alice']);
    });

    it('sorts oldest first when requested', () => {
        const result = filterAndSort(users, '', 'oldest');
        expect(result.map((u) => u.username)).toEqual(['alice', 'carol', 'bob']);
    });

    it('does not mutate the input array', () => {
        const original = [...users];
        filterAndSort(users, '', 'oldest');
        expect(users).toEqual(original);
    });
});

describe('computeInsights', () => {
    const user = (username: string, timestamp = 0): ConnectionUser => ({
        username,
        href: `https://www.instagram.com/${username}`,
        timestamp,
    });

    it('computes mutuals, fans and followingOnly', () => {
        const followers = [user('alice'), user('bob')];
        const following = [user('alice'), user('carol')];
        const insights = computeInsights('instagram', followers, following);

        expect(insights.mutuals.map((u) => u.username)).toEqual(['alice']);
        expect(insights.fans.map((u) => u.username)).toEqual(['bob']);
        expect(insights.followingOnly.map((u) => u.username)).toEqual(['carol']);
    });

    it('buckets followers into monthly growth sorted ascending', () => {
        const followers = [
            user('a', Date.UTC(2024, 0, 15)), // 2024-01
            user('b', Date.UTC(2024, 0, 20)), // 2024-01
            user('c', Date.UTC(2024, 2, 1)), // 2024-03
        ];
        const growth = computeInsights('instagram', followers, []).growth;
        expect(growth).toEqual([
            { month: '2024-01', count: 2 },
            { month: '2024-03', count: 1 },
        ]);
    });

    it('picks the oldest following entry', () => {
        const following = [user('new', 2000), user('old', 1000)];
        const insights = computeInsights('instagram', [], following);
        expect(insights.oldestFollowing?.username).toBe('old');
    });

    it('reports a zero average follow age when timestamps are missing', () => {
        const insights = computeInsights('instagram', [user('a')], []);
        expect(insights.averageFollowAgeDays).toBe(0);
    });
});

describe('diffAgainstSnapshot', () => {
    const user = (username: string): ConnectionUser => ({
        username,
        href: `https://x/${username}`,
        timestamp: 0,
    });

    it('detects unfollowers, new followers and follows you toggled', () => {
        const current = {
            followers: [user('alice'), user('dave')],
            following: [user('bob'), user('erin')],
        };
        const snapshot = {
            followerNames: ['alice', 'carol'],
            followingNames: ['bob', 'frank'],
            capturedAt: 12345,
        };
        const diff = diffAgainstSnapshot(current, snapshot);

        expect(diff.unfollowedYou.map((u) => u.username)).toEqual(['carol']);
        expect(diff.newFollowers.map((u) => u.username)).toEqual(['dave']);
        expect(diff.youUnfollowed.map((u) => u.username)).toEqual(['frank']);
        expect(diff.youNowFollow.map((u) => u.username)).toEqual(['erin']);
        expect(diff.previousCapturedAt).toBe(12345);
    });

    it('returns empty diffs when nothing changed', () => {
        const current = { followers: [user('alice')], following: [user('bob')] };
        const snapshot = {
            followerNames: ['alice'],
            followingNames: ['bob'],
            capturedAt: 0,
        };
        const diff = diffAgainstSnapshot(current, snapshot);
        expect(diff.unfollowedYou).toEqual([]);
        expect(diff.newFollowers).toEqual([]);
    });
});

describe('toCsv', () => {
    it('writes a header and escapes fields with commas/quotes', () => {
        const csv = toCsv([
            { username: 'alice', href: 'https://x/alice', timestamp: 1 },
            { username: 'bob,inc', href: 'https://x/bob', timestamp: 2 },
        ]);
        const lines = csv.split('\r\n');
        expect(lines[0]).toBe('username,profile_url,timestamp');
        expect(lines[1]).toBe('alice,https://x/alice,1');
        expect(lines[2]).toBe('"bob,inc",https://x/bob,2');
    });
});
