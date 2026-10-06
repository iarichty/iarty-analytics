import { useId } from 'react';
import type { AnalysisInsights } from '@/lib/analysis/types';
import { useI18n } from '@/context/useI18n';

interface Props {
    insights: AnalysisInsights;
    /** Accent colour for the bars (hex). */
    accent: string;
}

/**
 * Dependency-free follower-growth bar chart rendered as inline SVG.
 *
 * Keeps the bundle tiny (no charting library) while still giving a clear,
 * responsive visual. Values are scaled to the tallest month.
 */
export default function GrowthChart({ insights, accent }: Props) {
    const { t } = useI18n();
    const titleId = useId();
    const data = insights.growth;

    if (data.length < 2) {
        return (
            <div className="flex h-48 items-center justify-center rounded-2xl border border-dashed border-slate-200 text-sm text-slate-500 dark:border-white/10">
                {t('insights.growthEmpty')}
            </div>
        );
    }

    const width = 720;
    const height = 200;
    const paddingX = 8;
    const paddingTop = 16;
    const baseline = height - 24;
    const max = Math.max(...data.map((d) => d.count), 1);
    const slot = (width - paddingX * 2) / data.length;
    const barWidth = Math.max(3, slot * 0.62);

    return (
        <figure className="w-full">
            <figcaption
                id={titleId}
                className="mb-3 text-xs font-black uppercase tracking-widest text-slate-400"
            >
                {t('insights.growth')}
            </figcaption>
            <svg
                viewBox={`0 0 ${width} ${height}`}
                role="img"
                aria-labelledby={titleId}
                className="h-40 w-full"
                preserveAspectRatio="none"
            >
                {/* Baseline */}
                <line
                    x1={paddingX}
                    x2={width - paddingX}
                    y1={baseline}
                    y2={baseline}
                    className="stroke-slate-200 dark:stroke-white/10"
                    strokeWidth={1}
                />
                {data.map((d, i) => {
                    const barHeight = (d.count / max) * (baseline - paddingTop);
                    const x = paddingX + i * slot + (slot - barWidth) / 2;
                    const y = baseline - barHeight;
                    return (
                        <g key={d.month}>
                            <rect
                                x={x}
                                y={y}
                                width={barWidth}
                                height={Math.max(barHeight, 1)}
                                rx={Math.min(4, barWidth / 2)}
                                fill={accent}
                                opacity={0.85}
                            >
                                <title>{`${d.month}: ${d.count}`}</title>
                            </rect>
                        </g>
                    );
                })}
            </svg>
            <div className="mt-1 flex justify-between text-[10px] font-medium text-slate-400">
                <span>{data[0].month}</span>
                <span>{data[data.length - 1].month}</span>
            </div>
        </figure>
    );
}
