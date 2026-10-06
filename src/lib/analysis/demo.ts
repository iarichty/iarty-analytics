/**
 * Deterministic sample data for the "try before you upload" demo mode.
 *
 * Generates a believable `AnalysisResult` without touching the network, so the
 * whole UI can be explored (charts, tabs, export, snapshot diff) with one click.
 * The data is fully reproducible — same seed, same result.
 */
import { computeInsights } from '@/lib/analysis/parsers';
import type { AnalysisResult, ConnectionUser } from '@/lib/analysis/types';

/** Tiny seeded PRNG (mulberry32) for reproducible demo data. */
function mulberry32(seed: number): () => number {
    let a = seed;
    return () => {
        a |= 0;
        a = (a + 0x6d2b79f5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

const ADJECTIVES = [
    'sunny', 'cosmic', 'quiet', 'brave', 'lazy', 'swift', 'golden', 'velvet',
    'urban', 'pixel', 'neon', 'misty', 'wild', 'calm', 'retro', 'frost',
];
const NOUNS = [
    'fox', 'wave', 'pilot', 'noodle', 'panda', 'river', 'ember', 'koala',
    'tiger', 'comet', 'lotus', 'raven', 'mango', 'otter', 'husky', 'sakura',
];

function makeUser(rand: () => number, platform: string, i: number): ConnectionUser {
    const adj = ADJECTIVES[Math.floor(rand() * ADJECTIVES.length)];
    const noun = NOUNS[Math.floor(rand() * NOUNS.length)];
    const username = `${adj}_${noun}${i}`;
    const daysAgo = Math.floor(rand() * 900) + 5;
    const timestamp = Date.now() - daysAgo * 86_400_000;
    const href = platformHref(platform, username);
    return { username, href, timestamp };
}

/** Profile URL for a demo user, matching each platform's public domain. */
function platformHref(platform: string, username: string): string {
    switch (platform) {
        case 'instagram':
            return `https://www.instagram.com/${username}`;
        case 'tiktok':
            return `https://www.tiktok.com/@${username}`;
        case 'threads':
            return `https://www.threads.net/@${username}`;
        case 'x':
            return `https://x.com/${username}`;
        default:
            return `https://example.com/${username}`;
    }
}

/** Distinct, reproducible PRNG seeds per platform so demo data differs. */
const DEMO_SEEDS: Record<string, number> = {
    instagram: 1337,
    tiktok: 4242,
    threads: 2024,
    x: 5150,
};

/** Build a complete, coherent `AnalysisResult` for demo purposes. */
export function generateDemoResult(
    platform: 'instagram' | 'tiktok' | 'threads' | 'x' = 'instagram',
): AnalysisResult {
    const rand = mulberry32(DEMO_SEEDS[platform] ?? 1337);

    const followerCount = 220;
    const followingCount = 300;

    const followers = Array.from({ length: followerCount }, (_, i) =>
        makeUser(rand, platform, i),
    );
    const following = Array.from({ length: followingCount }, (_, i) =>
        makeUser(rand, platform, i + 1000),
    );

    // Make a chunk of accounts mutual so the "mutuals" insight is non-empty.
    const mutualCount = 140;
    for (let i = 0; i < mutualCount && i < following.length && i < followers.length; i++) {
        following[i] = { ...followers[i] };
    }

    const followerKeys = new Set(followers.map((u) => u.username.toLowerCase()));
    const followingKeys = new Set(following.map((u) => u.username.toLowerCase()));

    return {
        followers,
        following,
        nonFollowbacks: following.filter((u) => !followerKeys.has(u.username.toLowerCase())),
        notFollowingBack: followers.filter((u) => !followingKeys.has(u.username.toLowerCase())),
        insights: computeInsights(platform, followers, following),
    };
}
