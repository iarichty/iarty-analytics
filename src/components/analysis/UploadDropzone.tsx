import { useId, useRef, useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { FiUploadCloud, FiZap } from 'react-icons/fi';
import type { AnalysisProgress } from '@/hooks/useAnalysis';
import { useI18n } from '@/context/useI18n';

interface Props {
    title: string;
    description: string;
    buttonLabel: string;
    isLoading: boolean;
    onFile: (file: File) => void;
    /** Visual accent classes for the icon tile (gradient). */
    accentClassName: string;
    /** Border colour when dragging a file over the dropzone. */
    dragClassName: string;
    /** Optional progress snapshot emitted by the worker. */
    progress?: AnalysisProgress | null;
    /** Called when the user wants to explore the app with sample data. */
    onDemo?: () => void;
    icon?: ReactNode;
}

/**
 * Accessible upload dropzone with real drag-and-drop support.
 *
 * The visible element is a `<label>` tied to a visually-hidden file input, so
 * it is reachable and activatable from the keyboard. While the worker runs, a
 * real progress bar reflects each parsing stage.
 */
export default function UploadDropzone({
    title,
    description,
    buttonLabel,
    isLoading,
    onFile,
    accentClassName,
    dragClassName,
    progress,
    onDemo,
    icon,
}: Props) {
    const { t } = useI18n();
    const inputId = useId();
    const inputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleFiles = (files: FileList | null) => {
        const file = files?.[0];
        if (file) onFile(file);
    };

    const stageLabel = (() => {
        if (!progress) return t('common.processing');
        if (progress.stage === 'unzipping') return t('upload.progress.unzipping');
        return t('upload.progress.parsing');
    })();

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <label
                htmlFor={inputId}
                onDragOver={(e) => {
                    e.preventDefault();
                    if (!isLoading) setIsDragging(true);
                }}
                onDragLeave={(e) => {
                    e.preventDefault();
                    // Ignore leaves that are actually moves between children.
                    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                        setIsDragging(false);
                    }
                }}
                onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    if (!isLoading) handleFiles(e.dataTransfer.files);
                }}
                className={`relative flex cursor-pointer flex-col items-center border-2 border-dashed p-12 text-center transition-all ${
                    isDragging ? dragClassName : ''
                } ${isLoading ? 'cursor-wait opacity-90' : ''}`}
            >
                <div
                    className={`mb-6 flex h-20 w-20 rotate-3 items-center justify-center rounded-3xl shadow-lg ${accentClassName}`}
                >
                    {icon ?? <FiUploadCloud className="h-10 w-10 text-white" />}
                </div>
                <h3 className="mb-2 text-2xl font-bold">{title}</h3>
                <p className="mx-auto mb-8 max-w-sm text-slate-500 dark:text-slate-400">
                    {description}
                </p>

                <input
                    id={inputId}
                    ref={inputRef}
                    type="file"
                    accept=".zip"
                    className="sr-only"
                    disabled={isLoading}
                    onChange={(e) => {
                        handleFiles(e.target.files);
                        // Allow re-selecting the same file.
                        e.target.value = '';
                    }}
                />

                <span className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-8 py-4 font-bold text-white transition-transform active:scale-95 dark:bg-white dark:text-black">
                    {isLoading ? t('upload.progress.reading') : buttonLabel}
                </span>

                {isLoading && (
                    <div className="mt-6 w-full max-w-sm" aria-live="polite">
                        <div className="mb-2 flex items-center justify-between text-xs font-bold text-slate-500">
                            <span>{stageLabel}</span>
                            <span className="tabular-nums">
                                {Math.round(progress?.percent ?? 0)}%
                            </span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                            <div
                                className="h-full rounded-full bg-slate-900 transition-[width] duration-200 dark:bg-white"
                                style={{ width: `${Math.max(3, progress?.percent ?? 0)}%` }}
                            />
                        </div>
                    </div>
                )}
            </label>

            {onDemo && !isLoading && (
                <div className="mt-4 text-center">
                    <button
                        type="button"
                        onClick={onDemo}
                        className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 underline-offset-4 transition-colors hover:text-purple-600 hover:underline dark:text-slate-400"
                    >
                        <FiZap />
                        {t('home.demo')}
                    </button>
                </div>
            )}
        </motion.div>
    );
}
