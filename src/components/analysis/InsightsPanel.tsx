import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { FiActivity, FiHeart, FiUserCheck, FiStar } from 'react-icons/fi';
import type { AnalysisInsights } from '@/lib/analysis/types';
import { formatDate } from '@/lib/format';
import { useI18n } from '@/context/useI18n';
import GrowthChart from './GrowthChart';

interface Props {
    insights: AnalysisInsights;
    accent: string;
    cardClassName: string;
}

/** Summary tile for one insight metric. */
function MetricTile({
    label,
    value,
    icon,
    color,
}: {
    label: string;
    value: string | number;
    icon: ReactNode;
    color: string;
}) {
    return (
        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-white/5 dark:bg-white/2">
            <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400">
                <span style={{ color }} aria-hidden>
                    {icon}
                </span>
                {label}
            </div>
            <p className="truncate text-2xl font-black tabular-nums" style={{ color }}>
                {value}
            </p>
        </div>
    );
}

/** The "Insights" section: growth chart + mutuals/fans/age tiles. */
export default function InsightsPanel({ insights, accent, cardClassName }: Props) {
    const { t } = useI18n();
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cardClassName}
        >
            <h2 className="mb-6 text-xl font-black tracking-tight text-slate-900 dark:text-white">
                {t('insights.title')}
            </h2>

            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <MetricTile
                    label={t('stat.mutuals')}
                    value={insights.mutuals.length}
                    icon={<FiHeart />}
                    color="#ec4899"
                />
                <MetricTile
                    label={t('stat.fans')}
                    value={insights.fans.length}
                    icon={<FiUserCheck />}
                    color={accent}
                />
                <MetricTile
                    label={t('stat.avgFollowAge')}
                    value={`${insights.averageFollowAgeDays} ${t('stat.days')}`}
                    icon={<FiActivity />}
                    color="#0ea5e9"
                />
            </div>

            <GrowthChart insights={insights} accent={accent} />

            {insights.oldestFollowing && (
                <p className="mt-4 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <FiStar className="text-amber-500" aria-hidden />
                    {t('insights.oldest')}:{' '}
                    <a
                        href={insights.oldestFollowing.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-slate-700 hover:text-purple-500 dark:text-slate-200"
                    >
                        {insights.oldestFollowing.username}
                    </a>{' '}
                    ({formatDate(insights.oldestFollowing.timestamp)})
                </p>
            )}
        </motion.div>
    );
}
