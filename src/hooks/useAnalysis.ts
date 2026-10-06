import { useCallback, useEffect, useRef, useState } from 'react';
import type {
    AnalysisPlatform,
    WorkerRequest,
    WorkerResponse,
    WorkerStage,
} from '@/lib/analysis/analysis.worker';
import type { AnalysisResult } from '@/lib/analysis/types';

export interface AnalysisProgress {
    stage: WorkerStage;
    percent: number;
}

interface AnalysisState {
    isLoading: boolean;
    error: string | null;
    result: AnalysisResult | null;
    progress: AnalysisProgress | null;
}

const INITIAL: AnalysisState = {
    isLoading: false,
    error: null,
    result: null,
    progress: null,
};

/**
 * Hard cap on the ZIP size we are willing to buffer in memory.
 *
 * The file is read fully into an ArrayBuffer and copied into the worker, so a
 * pathologically large export could exhaust the tab's memory. Real Instagram /
 * TikTok exports sit well under 500 MB even for very large accounts.
 */
export const MAX_FILE_BYTES = 200 * 1024 * 1024; // 200 MB

/** Validates the chosen file and returns an error message, or null if it's OK. */
export function validateZipFile(file: File): string | null {
    const looksLikeZip =
        file.name.toLowerCase().endsWith('.zip') ||
        file.type === 'application/zip' ||
        file.type === 'application/x-zip-compressed';
    if (!looksLikeZip) {
        return 'Please select the .zip file you exported from the platform.';
    }
    if (file.size > MAX_FILE_BYTES) {
        return `That file is too large (${Math.round(
            file.size / 1024 / 1024,
        )} MB). Please upload an export smaller than 200 MB.`;
    }
    return null;
}

/**
 * Runs the ZIP parsing in a Web Worker so the main thread (and its
 * animations) stay responsive while large exports are processed.
 *
 * The hook also exposes a `setResult` escape hatch used by demo mode to inject
 * synthetic data without going through the worker.
 */
export function useAnalysis(platform: AnalysisPlatform) {
    const workerRef = useRef<Worker | null>(null);
    const [state, setState] = useState<AnalysisState>(INITIAL);

    useEffect(() => {
        const worker = new Worker(
            new URL('../lib/analysis/analysis.worker.ts', import.meta.url),
            { type: 'module' },
        );

        worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
            const data = event.data;
            if (typeof data.ok === 'string' && data.ok === 'progress') {
                setState((prev) => ({
                    ...prev,
                    progress: { stage: data.stage, percent: data.percent },
                }));
            } else if (data.ok === true) {
                setState({
                    isLoading: false,
                    error: null,
                    result: data.result,
                    progress: null,
                });
            } else if (data.ok === false) {
                setState({
                    isLoading: false,
                    error: data.error,
                    result: null,
                    progress: null,
                });
            }
        };

        worker.onerror = (event) => {
            // A worker-level error (e.g. parser crash) carries a message we can
            // surface; fall back to a friendly generic message otherwise.
            const detail = event instanceof ErrorEvent ? event.message : '';
            setState({
                isLoading: false,
                error:
                    detail ||
                    'Could not process this file. Make sure it is the unmodified ZIP exported by the platform.',
                result: null,
                progress: null,
            });
        };

        workerRef.current = worker;
        return () => worker.terminate();
    }, []);

    const analyze = useCallback(
        async (file: File) => {
            if (!file) return;

            const validationError = validateZipFile(file);
            if (validationError) {
                setState({ isLoading: false, error: validationError, result: null, progress: null });
                return;
            }

            setState({
                isLoading: true,
                error: null,
                result: null,
                progress: { stage: 'unzipping', percent: 0 },
            });
            try {
                const buffer = await file.arrayBuffer();
                const message: WorkerRequest = { platform, buffer };
                // Transfer the buffer so it is not copied across threads.
                if (!workerRef.current) {
                    setState({
                        isLoading: false,
                        error: 'The analyzer is not ready yet. Please try again.',
                        result: null,
                        progress: null,
                    });
                    return;
                }
                workerRef.current.postMessage(message, [buffer]);
            } catch {
                setState({
                    isLoading: false,
                    error: 'Could not read the selected file.',
                    result: null,
                    progress: null,
                });
            }
        },
        [platform],
    );

    /** Inject a result directly (demo mode) without touching the worker. */
    const setResult = useCallback((result: AnalysisResult) => {
        setState({ isLoading: false, error: null, result, progress: null });
    }, []);

    const reset = useCallback(() => setState(INITIAL), []);

    return { ...state, analyze, setResult, reset };
}
