/**
 * Shared types for the connection-analysis flow (Instagram + TikTok).
 * These describe the *normalized* shape the UI consumes, independent of the
 * raw export format of each platform.
 */

/** A single account row shown in the results grid. */
export interface ConnectionUser {
    /** Username without leading "@". */
    username: string;
    /** Public profile URL. */
    href: string;
    /** Timestamp in milliseconds (0 when unknown). */
    timestamp: number;
}

/**
 * Extra insights derived from an export beyond the raw follower/following
 * lists. All values are computed purely in the worker from the same data.
 */
export interface AnalysisInsights {
    /** Accounts that follow you AND you follow back. */
    mutuals: ConnectionUser[];
    /** Accounts that follow you but you do not follow (your "fans"). */
    fans: ConnectionUser[];
    /** Accounts you follow but that do not follow you back (subset of nonFollowbacks). */
    followingOnly: ConnectionUser[];
    /** Number of accounts joining followers per "YYYY-MM" bucket. */
    growth: Array<{ month: string; count: number }>;
    /** Average number of days since a follower started following you (0 when unknown). */
    averageFollowAgeDays: number;
    /** Oldest account you follow (longest-standing connection). */
    oldestFollowing: ConnectionUser | null;
}

/** Normalized result of parsing a platform export ZIP. */
export interface AnalysisResult {
    followers: ConnectionUser[];
    following: ConnectionUser[];
    nonFollowbacks: ConnectionUser[];
    notFollowingBack: ConnectionUser[];
    /** Derived extra insights (always present in normalized results). */
    insights: AnalysisInsights;
}

/** Raw Instagram JSON row. */
export interface InstagramRawUser {
    string_list_data: Array<{
        href: string;
        timestamp: number;
        value: string;
    }>;
}

/** Raw TikTok JSON shapes. */
export interface TikTokRawUser {
    Date: string;
    UserName: string;
}

export interface TikTokRawData {
    'Profile And Settings'?: {
        Follower?: { FansList?: TikTokRawUser[] };
        Following?: { Following?: TikTokRawUser[] };
    };
}

/** Tabs available in the results panel. */
export type ResultTab =
    | 'nonFollowbacks'
    | 'notFollowingBack'
    | 'followers'
    | 'following'
    | 'mutuals'
    | 'fans';

/** Sort direction for the results list. */
export type SortOrder = 'newest' | 'oldest';

/** Result of diffing the current analysis against a stored snapshot. */
export interface SnapshotDiff {
    /** Accounts that were in the previous follower list but are gone now. */
    unfollowedYou: ConnectionUser[];
    /** Accounts that are new in the current follower list. */
    newFollowers: ConnectionUser[];
    /** Accounts you stopped following since the last snapshot. */
    youUnfollowed: ConnectionUser[];
    /** Accounts you started following since the last snapshot. */
    youNowFollow: ConnectionUser[];
    /** When the comparison snapshot was captured (epoch ms). */
    previousCapturedAt: number;
}

/**
 * A lightweight fingerprint of a past analysis, persisted in localStorage.
 * We only ever store usernames + timestamps (never the raw ZIP), which keeps
 * the "100% client-side, nothing leaves the tab" promise intact.
 */
export interface AnalysisSnapshot {
    platform: string;
    capturedAt: number;
    followerNames: string[];
    followingNames: string[];
    followers: ConnectionUser[];
    following: ConnectionUser[];
}
