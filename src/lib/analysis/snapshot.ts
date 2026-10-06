/**
 * Snapshot persistence for the unfollower-tracking feature.
 *
 * We store only a lightweight fingerprint of each analysis (usernames +
 * timestamps) in `localStorage` — never the raw ZIP — so the app's "nothing
 * leaves this tab" promise holds. A snapshot per platform is kept and replaced
 * on every successful analysis, letting the next run diff against the last one.
 */
import type { AnalysisResult, AnalysisSnapshot } from '@/lib/analysis/types';

const KEY_PREFIX = 'iarty.snapshot.';

/** Build a serializable snapshot from a finished analysis. */
export function buildSnapshot(platform: string, result: AnalysisResult): AnalysisSnapshot {
    return {
        platform,
        capturedAt: Date.now(),
        followerNames: result.followers.map((u) => u.username),
        followingNames: result.following.map((u) => u.username),
        followers: result.followers,
        following: result.following,
    };
}

/** Read the stored snapshot for a platform, or null when none/invalid/corrupt. */
export function loadSnapshot(platform: string): AnalysisSnapshot | null {
    if (typeof localStorage === 'undefined') return null;
    try {
        const raw = localStorage.getItem(KEY_PREFIX + platform);
        if (!raw) return null;
        const parsed = JSON.parse(raw) as AnalysisSnapshot;
        if (
            !parsed ||
            !Array.isArray(parsed.followerNames) ||
            !Array.isArray(parsed.followingNames) ||
            typeof parsed.capturedAt !== 'number'
        ) {
            return null;
        }
        return parsed;
    } catch {
        return null;
    }
}

/** Persist a snapshot, replacing any previous one for the platform. */
export function saveSnapshot(snapshot: AnalysisSnapshot): void {
    if (typeof localStorage === 'undefined') return;
    try {
        localStorage.setItem(KEY_PREFIX + snapshot.platform, JSON.stringify(snapshot));
    } catch {
        // Quota exceeded or storage disabled — tracking is best-effort.
    }
}

/** Remove the stored snapshot for a platform (used by "reset"). */
export function clearSnapshot(platform: string): void {
    if (typeof localStorage === 'undefined') return;
    try {
        localStorage.removeItem(KEY_PREFIX + platform);
    } catch {
        // ignore
    }
}
