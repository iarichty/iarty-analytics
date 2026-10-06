import { describe, it, expect } from 'vitest';
import { generateDemoResult } from './demo';

describe('generateDemoResult', () => {
    it('produces coherent, non-empty lists', () => {
        const result = generateDemoResult('instagram');
        expect(result.followers.length).toBeGreaterThan(0);
        expect(result.following.length).toBeGreaterThan(0);
        expect(result.insights.mutuals.length).toBeGreaterThan(0);
    });

    it('is deterministic for a given platform', () => {
        const a = generateDemoResult('instagram');
        const b = generateDemoResult('instagram');
        expect(a.followers.map((u) => u.username)).toEqual(
            b.followers.map((u) => u.username),
        );
    });

    it('builds platform-appropriate profile URLs', () => {
        const tt = generateDemoResult('tiktok');
        expect(tt.followers[0].href).toContain('tiktok.com/@');
    });

    it('keeps nonFollowbacks a subset of following', () => {
        const result = generateDemoResult('instagram');
        const followingNames = new Set(result.following.map((u) => u.username));
        for (const u of result.nonFollowbacks) {
            expect(followingNames.has(u.username)).toBe(true);
        }
    });
});
