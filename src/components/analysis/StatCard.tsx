import type { ReactNode } from 'react';
import AnimatedNumber from './AnimatedNumber';

interface Props {
    label: string;
    value: number | string;
    accent: string;
    icon: ReactNode;
    /** When true, render the value verbatim (e.g. a ratio) instead of counting up. */
    isRatio?: boolean;
}

/** A single summary metric tile. */
export default function StatCard({ label, value, accent, icon, isRatio }: Props) {
    return (
        <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-gray-900">
            <div className="mb-4 flex items-center justify-between">
                <p className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                    {label}
                </p>
                <span className="text-lg" style={{ color: accent }} aria-hidden>
                    {icon}
                </span>
            </div>
            <h3 className="text-3xl font-black tabular-nums" style={{ color: accent }}>
                {isRatio ? value : <AnimatedNumber value={Number(value)} />}
            </h3>
        </div>
    );
}
