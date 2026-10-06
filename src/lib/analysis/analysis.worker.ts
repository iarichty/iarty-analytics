/**
 * Web Worker that unzips + parses the platform export off the main thread.
 *
 * Parsing a multi-megabyte JSON file is CPU-bound and would otherwise freeze
 * the UI. The worker owns all ZIP/JSON work and only posts the small,
 * normalized `AnalysisResult` back to the main thread.
 *
 * It also streams coarse progress events so the dropzone can show a real
 * progress bar instead of an indefinite spinner.
 */
import {
    analyzeInstagram,
    analyzeThreads,
    analyzeTikTok,
    analyzeX,
    buildXAccountMap,
    mergeInstagramResults,
    parseXArchive,
    AnalysisError,
} from './parsers';
import type {
    AnalysisResult,
    InstagramRawUser,
    ThreadsRawUser,
    TikTokRawData,
    XRawAccount,
    XRawEntry,
} from './types';

/** Loaded lazily so the (large) ZIP library is code-split out of the main bundle. */
async function loadJSZip() {
    const mod = await import('jszip');
    return mod.default;
}

export type AnalysisPlatform = 'instagram' | 'tiktok' | 'threads' | 'x';

export interface WorkerRequest {
    platform: AnalysisPlatform;
    buffer: ArrayBuffer;
}

/** Coarse stage markers emitted while the worker runs. */
export type WorkerStage = 'unzipping' | 'parsing';

export type WorkerResponse =
    | { ok: true; result: AnalysisResult }
    | { ok: false; error: string }
    | { ok: 'progress'; stage: WorkerStage; percent: number };

/** Instagram may split followers across `followers_1.json`, `followers_2.json`, ... */
const FOLLOWING_FILE = /(^|\/)following\.json$/i;
const FOLLOWERS_FILE = /followers_\d+\.json$/i;

async function parseInstagramZip(
    buffer: ArrayBuffer,
    onProgress: (stage: WorkerStage, percent: number) => void,
): Promise<AnalysisResult> {
    const JSZip = await loadJSZip();
    onProgress('unzipping', 10);
    const zip = await JSZip.loadAsync(buffer);
    onProgress('unzipping', 50);

    const followingFile = zip.file(FOLLOWING_FILE)[0];
    if (!followingFile) {
        throw new AnalysisError(
            'Invalid file structure. Make sure you uploaded the ZIP exported by Instagram.',
        );
    }

    const followersFiles = zip.file(FOLLOWERS_FILE);
    if (followersFiles.length === 0) {
        throw new AnalysisError(
            'No followers data found in the ZIP. Export "Followers and following" as JSON.',
        );
    }

    onProgress('parsing', 55);
    const followingRaw = JSON.parse(await followingFile.async('text'));
    const following: InstagramRawUser[] = followingRaw.relationships_following ?? [];

    const followerChunks = await Promise.all(
        followersFiles.map(async (file) => {
            const parsed = JSON.parse(await file.async('text'));
            return (Array.isArray(parsed) ? parsed : []) as InstagramRawUser[];
        }),
    );
    onProgress('parsing', 80);

    // Analyze each followers chunk against the same following list, then merge.
    const merged = mergeInstagramResults(
        followerChunks.map((chunk) => analyzeInstagram(chunk, following)),
    );
    onProgress('parsing', 100);
    return merged;
}

async function parseTikTokZip(
    buffer: ArrayBuffer,
    onProgress: (stage: WorkerStage, percent: number) => void,
): Promise<AnalysisResult> {
    const JSZip = await loadJSZip();
    onProgress('unzipping', 10);
    const zip = await JSZip.loadAsync(buffer);
    onProgress('unzipping', 50);
    const jsonFile = zip.file(/user_data_tiktok\.json$/i)[0];
    if (!jsonFile) {
        throw new AnalysisError(
            "File 'user_data_tiktok.json' was not found inside the ZIP.",
        );
    }
    onProgress('parsing', 70);
    const data = JSON.parse(await jsonFile.async('text')) as TikTokRawData;
    const result = analyzeTikTok(data);
    onProgress('parsing', 100);
    return result;
}

/**
 * Parse a Threads export.
 *
 * Threads connections arrive through Meta's Accounts Center export, which uses
 * the *same* file layout as Instagram (`followers_1.json` + `following.json`).
 * We reuse the Instagram file discovery but map to Threads profile links.
 */
async function parseThreadsZip(
    buffer: ArrayBuffer,
    onProgress: (stage: WorkerStage, percent: number) => void,
): Promise<AnalysisResult> {
    const JSZip = await loadJSZip();
    onProgress('unzipping', 10);
    const zip = await JSZip.loadAsync(buffer);
    onProgress('unzipping', 50);

    const followingFile = zip.file(FOLLOWING_FILE)[0];
    const followersFiles = zip.file(FOLLOWERS_FILE);
    if (!followingFile || followersFiles.length === 0) {
        throw new AnalysisError(
            'Invalid file structure. Upload the ZIP you exported from your Threads (Accounts Center) data download.',
        );
    }

    onProgress('parsing', 55);
    const followingRaw = JSON.parse(await followingFile.async('text'));
    const following: ThreadsRawUser[] = followingRaw.relationships_following ?? [];

    const followerChunks = await Promise.all(
        followersFiles.map(async (file) => {
            const parsed = JSON.parse(await file.async('text'));
            return (Array.isArray(parsed) ? parsed : []) as ThreadsRawUser[];
        }),
    );
    onProgress('parsing', 90);

    const followers = followerChunks.flat();
    const result = analyzeThreads(followers, following);
    onProgress('parsing', 100);
    return result;
}

/** X archive member files (paths vary between archive versions). */
const X_FOLLOWER_FILE = /(^|\/)follower\.js$/i;
const X_FOLLOWING_FILE = /(^|\/)following\.js$/i;
const X_ACCOUNT_FILE = /(^|\/)account\.js$/i;

/**
 * Parse an X (Twitter) archive ZIP.
 *
 * The archive stores connections as `window.YTD.follower.part0 = [...]` and
 * only records numeric account ids, so we resolve usernames from `account.js`.
 */
async function parseXZip(
    buffer: ArrayBuffer,
    onProgress: (stage: WorkerStage, percent: number) => void,
): Promise<AnalysisResult> {
    const JSZip = await loadJSZip();
    onProgress('unzipping', 10);
    const zip = await JSZip.loadAsync(buffer);
    onProgress('unzipping', 50);

    const followerFile = zip.file(X_FOLLOWER_FILE)[0];
    const followingFile = zip.file(X_FOLLOWING_FILE)[0];
    if (!followerFile || !followingFile) {
        throw new AnalysisError(
            "Could not find 'follower.js' / 'following.js'. Upload the ZIP downloaded from X (Settings → Your account → Download an archive).",
        );
    }

    onProgress('parsing', 60);
    const followerRaw = parseXArchive<XRawEntry>(await followerFile.async('text'));
    const followingRaw = parseXArchive<XRawEntry>(await followingFile.async('text'));

    // account.js is optional; without it we fall back to raw account ids.
    let accountMap = new Map<string, string>();
    const accountFile = zip.file(X_ACCOUNT_FILE)[0];
    if (accountFile) {
        try {
            accountMap = buildXAccountMap(
                parseXArchive<XRawAccount>(await accountFile.async('text')),
            );
        } catch {
            // A malformed account.js shouldn't fail the whole analysis.
            accountMap = new Map();
        }
    }
    onProgress('parsing', 85);

    const result = analyzeX(followerRaw, followingRaw, accountMap);
    onProgress('parsing', 100);
    return result;
}

// `self` is typed as Window under the DOM lib; cast once to the worker API.
const worker = self as unknown as {
    onmessage: ((event: MessageEvent<WorkerRequest>) => void) | null;
    postMessage: (message: WorkerResponse) => void;
};

worker.onmessage = async (event: MessageEvent<WorkerRequest>) => {
    const { platform, buffer } = event.data;
    const onProgress = (stage: WorkerStage, percent: number) =>
        worker.postMessage({ ok: 'progress', stage, percent });
    try {
        let result: AnalysisResult;
        switch (platform) {
            case 'instagram':
                result = await parseInstagramZip(buffer, onProgress);
                break;
            case 'tiktok':
                result = await parseTikTokZip(buffer, onProgress);
                break;
            case 'threads':
                result = await parseThreadsZip(buffer, onProgress);
                break;
            case 'x':
                result = await parseXZip(buffer, onProgress);
                break;
        }
        worker.postMessage({ ok: true, result });
    } catch (err) {
        const message =
            err instanceof Error
                ? err.message
                : 'Something went wrong while processing the file.';
        worker.postMessage({ ok: false, error: message });
    }
};
