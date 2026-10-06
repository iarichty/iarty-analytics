import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiArrowLeft, FiImage } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useAnalysis } from '@/hooks/useAnalysis';
import type { AnalysisPlatform } from '@/lib/analysis/analysis.worker';
import { diffAgainstSnapshot } from '@/lib/analysis/parsers';
import { buildSnapshot, loadSnapshot, saveSnapshot } from '@/lib/analysis/snapshot';
import { generateDemoResult } from '@/lib/analysis/demo';
import { exportSummaryImage } from '@/lib/export';
import { useI18n } from '@/context/useI18n';
import HelmetContainer from '@/components/HelmetContainer';
import UploadDropzone from '@/components/analysis/UploadDropzone';
import StatCard from '@/components/analysis/StatCard';
import ResultsPanel, { type ResultsPanelTheme } from '@/components/analysis/ResultsPanel';
import InsightsPanel from '@/components/analysis/InsightsPanel';
import UnfollowerDiff from '@/components/analysis/UnfollowerDiff';
import { formatNumber } from '@/lib/format';

/** A single statistic card shown above the results panel. */
export interface AnalyzeStat {
    label: string;
    /** Either a fixed value (e.g. a ratio string) or "count" resolved from the result. */
    value: number | string;
    icon: ReactNode;
    accent: string;
    /** When true, the value is rendered as-is (used for the TikTok ratio). */
    isRatio?: boolean;
}

/**
 * Everything that differs between the Instagram and TikTok analysis pages.
 * Extracting this keeps the two pages from drifting apart; the shared shell
 * (header, upload, stats, results, error) lives in one place.
 */
export interface AnalyzePageConfig {
    platform: AnalysisPlatform;
    /** Page <title> for SEO. */
    seoTitle: string;
    /** Route path used for the canonical URL (e.g. "/instagram"). */
    path: string;
    /** Outer wrapper classes (background + text colour). */
    wrapperClassName: string;
    /** Ambient background decorations. */
    background: ReactNode;
    /** "Back to dashboard" link colour. */
    backLinkClassName: string;
    /** Heading node (already styled, per brand). */
    heading: ReactNode;
    /** Sub-heading copy under the title. */
    subheading: string;
    /** Link to the "how it works" guide. */
    guide: { to: string; label: string; icon: ReactNode };
    /** Upload dropzone copy + accents. */
    upload: {
        title: string;
        description: string;
        buttonLabel: string;
        accentClassName: string;
        dragClassName: string;
    };
    /** Stat cards. Values are resolved from the result by key. */
    stats: Array<{
        label: string;
        key: 'followers' | 'following' | 'nonFollowbacks' | 'notFollowingBack';
        icon: ReactNode;
        accent: string;
    }>;
    /** Optional extra stat (e.g. TikTok follower ratio). */
    extraStat?: AnalyzeStat;
    resultsTheme: ResultsPanelTheme;
    /** Cards shared layout (insights / diff / results). */
    panelCardClassName: string;
    /** Classes for the results grid wrapper spacing. */
    resultsSpacingClassName: string;
    /** Classes for the error alert box. */
    errorClassName: string;
    /** Classes for the footer "analyzed N accounts" line. */
    footerClassName: string;
    /** Heading style class for the header row layout. */
    headerRowClassName: string;
    /** Classes for the guide button. */
    guideButtonClassName: string;
    /** Primary accent colour used by insights / summary image. */
    accent: string;
}

export default function AnalyzePage({ config }: { config: AnalyzePageConfig }) {
    const { t } = useI18n();
    const { isLoading, error, result, progress, analyze, setResult } = useAnalysis(
        config.platform,
    );
    const [isDemo, setIsDemo] = useState(false);
    // Captured *before* an analysis starts, so the diff always compares the
    // new result against the state on disk from the previous session.
    const [previousSnapshot, setPreviousSnapshot] = useState<ReturnType<typeof loadSnapshot>>(
        null,
    );

    // Wrapper around the hook's `analyze`: grab the prior snapshot, reset demo
    // mode, then kick off the worker.
    const handleAnalyze = (file: File) => {
        setIsDemo(false);
        setPreviousSnapshot(loadSnapshot(config.platform));
        analyze(file);
    };

    const diff = useMemo(() => {
        if (!result || isDemo || !previousSnapshot) return null;
        return diffAgainstSnapshot(result, {
            followerNames: previousSnapshot.followerNames,
            followingNames: previousSnapshot.followingNames,
            capturedAt: previousSnapshot.capturedAt,
        });
    }, [result, isDemo, previousSnapshot]);

    // Persist the latest snapshot for next time (demo runs are not stored).
    useEffect(() => {
        if (result && !isDemo) {
            saveSnapshot(buildSnapshot(config.platform, result));
        }
    }, [result, config.platform, isDemo]);

    const runDemo = () => {
        setIsDemo(true);
        setPreviousSnapshot(null);
        setResult(generateDemoResult(config.platform));
    };

    const ratioValue = useMemo(() => {
        if (!config.extraStat || !result || result.following.length === 0) return '0.0';
        return (result.followers.length / result.following.length).toFixed(1);
    }, [config.extraStat, result]);

    // The memo returns null when there is no stored snapshot from a prior run,
    // so a bare truthiness check is enough to decide whether to render it.
    const showDiff = Boolean(diff);

    return (
        <div className={config.wrapperClassName}>
            <HelmetContainer title={config.seoTitle} path={config.path} />

            {config.background}

            <main className="relative z-10 mx-auto max-w-5xl px-6 py-32">
                <div className={config.headerRowClassName}>
                    <div>
                        <Link to="/" className={config.backLinkClassName}>
                            <FiArrowLeft className="transition-transform group-hover:-translate-x-1" />
                            {t('common.back')}
                        </Link>
                        {config.heading}
                        <p className="mt-2 font-medium text-slate-500 dark:text-slate-400">
                            {config.subheading}
                        </p>
                    </div>

                    <Link to={config.guide.to} className={config.guideButtonClassName}>
                        {config.guide.icon}
                        {config.guide.label}
                    </Link>
                </div>

                {!result && (
                    <UploadDropzone
                        title={config.upload.title}
                        description={config.upload.description}
                        buttonLabel={config.upload.buttonLabel}
                        isLoading={isLoading}
                        progress={progress}
                        onFile={handleAnalyze}
                        onDemo={runDemo}
                        accentClassName={config.upload.accentClassName}
                        dragClassName={config.upload.dragClassName}
                    />
                )}

                <AnimatePresence>
                    {result && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className={config.resultsSpacingClassName}
                        >
                            {isDemo && (
                                <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-center text-sm font-bold text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300">
                                    {t('demo.banner')}
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                                {config.stats.map((stat) => (
                                    <StatCard
                                        key={stat.key}
                                        label={stat.label}
                                        value={result[stat.key].length}
                                        icon={stat.icon}
                                        accent={stat.accent}
                                    />
                                ))}
                                {config.extraStat && (
                                    <StatCard
                                        label={config.extraStat.label}
                                        value={ratioValue}
                                        icon={config.extraStat.icon}
                                        accent={config.extraStat.accent}
                                        isRatio
                                    />
                                )}
                            </div>

                            {showDiff && diff && (
                                <UnfollowerDiff
                                    diff={diff}
                                    accent={config.accent}
                                    cardClassName={config.panelCardClassName}
                                />
                            )}

                            <InsightsPanel
                                insights={result.insights}
                                accent={config.accent}
                                cardClassName={config.panelCardClassName}
                            />

                            <ResultsPanel result={result} theme={config.resultsTheme} />

                            <div className="flex justify-center">
                                <button
                                    type="button"
                                    onClick={() =>
                                        exportSummaryImage(config.platform, result)
                                    }
                                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-600 shadow-sm transition-all hover:shadow-md active:scale-95 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
                                >
                                    <FiImage />
                                    {t('results.exportPng')}
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {error && (
                    <motion.div
                        role="alert"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={config.errorClassName}
                    >
                        {error}
                    </motion.div>
                )}

                {result && (
                    <p className={config.footerClassName}>
                        {t('footer.analyzed', {
                            count: formatNumber(
                                result.followers.length + result.following.length,
                            ),
                        })}
                    </p>
                )}
            </main>
        </div>
    );
}
