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
    analyzeTikTok,
    mergeInstagramResults,
    AnalysisError,
} from './parsers';
import type { AnalysisResult, InstagramRawUser, TikTokRawData } from './types';

/** Loaded lazily so the (large) ZIP library is code-split out of the main bundle. */
async function loadJSZip() {
    const mod = await import('jszip');
    return mod.default;
}

export type AnalysisPlatform = 'instagram' | 'tiktok';

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
        const result =
            platform === 'instagram'
                ? await parseInstagramZip(buffer, onProgress)
                : await parseTikTokZip(buffer, onProgress);
        worker.postMessage({ ok: true, result });
    } catch (err) {
        const message =
            err instanceof Error
                ? err.message
                : 'Something went wrong while processing the file.';
        worker.postMessage({ ok: false, error: message });
    }
};
