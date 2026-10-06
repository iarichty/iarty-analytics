import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { FiArrowDown, FiArrowUp } from 'react-icons/fi';
import type { SortOrder } from '@/lib/analysis/types';
import { useI18n } from '@/context/useI18n';

interface Props {
    value: SortOrder;
    onChange: (order: SortOrder) => void;
    /** Unique per-page id so the sliding pill animates within its own group. */
    layoutId: string;
    /** Highlight colour for the active pill. */
    accentClassName: string;
    /** Text colour applied to the active button. */
    activeTextClassName: string;
}

/** Segmented control to switch the results ordering. */
export default function SortToggle({
    value,
    onChange,
    layoutId,
    accentClassName,
    activeTextClassName,
}: Props) {
    const { t } = useI18n();

    const options: Array<{ value: SortOrder; label: string; icon: ReactNode }> = [
        { value: 'newest', label: t('sort.newest'), icon: <FiArrowDown className="h-3.5 w-3.5" /> },
        { value: 'oldest', label: t('sort.oldest'), icon: <FiArrowUp className="h-3.5 w-3.5" /> },
    ];

    return (
        <div
            role="group"
            aria-label={t('sort.label')}
            className="flex w-fit rounded-xl bg-slate-100 p-1 dark:bg-white/5"
        >
            {options.map((option) => {
                const active = value === option.value;
                return (
                    <button
                        key={option.value}
                        type="button"
                        aria-pressed={active}
                        onClick={() => onChange(option.value)}
                        className={`relative flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-xs font-bold transition-colors ${
                            active
                                ? activeTextClassName
                                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                        }`}
                    >
                        {active && (
                            <motion.span
                                layoutId={layoutId}
                                className={`absolute inset-0 -z-10 rounded-lg shadow-sm ${accentClassName}`}
                                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                            />
                        )}
                        {option.icon}
                        {option.label}
                    </button>
                );
            })}
        </div>
    );
}
