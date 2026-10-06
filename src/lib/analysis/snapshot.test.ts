import { describe, it, expect, beforeEach } from 'vitest';
import { buildSnapshot, loadSnapshot, saveSnapshot, clearSnapshot } from './snapshot';
import type { AnalysisResult } from './types';
import { emptyInsights } from './parsers';

/** Minimal in-memory localStorage stub for the node test environment. */
function installLocalStorage() {
    const store = new Map<string, string>();
    (globalThis as unknown as { localStorage: Storage }).localStorage = {
        getItem: (k: string) => store.get(k) ?? null,
        setItem: (k: string, v: string) => void store.set(k, v),
        removeItem: (k: string) => void store.delete(k),
        clear: () => store.clear(),
        key: () => null,
        length: 0,
    } as Storage;
}

const result: AnalysisResult = {
    followers: [{ username: 'alice', href: 'https://x/alice', timestamp: 1 }],
    following: [{ username: 'bob', href: 'https://x/bob', timestamp: 2 }],
    nonFollowbacks: [],
    notFollowingBack: [],
    insights: emptyInsights(),
};

describe('snapshot persistence', () => {
    beforeEach(() => installLocalStorage());

    it('round-trips a snapshot through storage', () => {
        saveSnapshot(buildSnapshot('instagram', result));
        const loaded = loadSnapshot('instagram');
        expect(loaded?.followerNames).toEqual(['alice']);
        expect(loaded?.followingNames).toEqual(['bob']);
    });

    it('returns null when no snapshot exists', () => {
        expect(loadSnapshot('tiktok')).toBeNull();
    });

    it('returns null for corrupt JSON', () => {
        localStorage.setItem('iarty.snapshot.instagram', '{not json');
        expect(loadSnapshot('instagram')).toBeNull();
    });

    it('clears a stored snapshot', () => {
        saveSnapshot(buildSnapshot('instagram', result));
        clearSnapshot('instagram');
        expect(loadSnapshot('instagram')).toBeNull();
    });
});
