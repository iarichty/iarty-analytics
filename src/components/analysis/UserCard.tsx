import { motion } from 'framer-motion';
import { FiExternalLink, FiSquare, FiCheckSquare } from 'react-icons/fi';
import type { ConnectionUser } from '@/lib/analysis/types';
import { formatDate } from '@/lib/format';
import { useI18n } from '@/context/useI18n';

interface Props {
    user: ConnectionUser;
    /** e.g. "Since" (Instagram) or "Active" (TikTok). */
    dateLabel: string;
    /** Classes for the gradient avatar tile. */
    avatarClassName: string;
    /** Classes for the profile link button. */
    linkClassName: string;
    /** When true, render a selection checkbox in the corner. */
    selectable?: boolean;
    selected?: boolean;
    onToggleSelect?: () => void;
}

/**
 * A single account row. `content-visibility: auto` lets the browser skip
 * layout/paint for off-screen rows, which keeps very long lists smooth.
 */
export default function UserCard({
    user,
    dateLabel,
    avatarClassName,
    linkClassName,
    selectable,
    selected,
    onToggleSelect,
}: Props) {
    const { t } = useI18n();
    const initial = user.username.charAt(0).toUpperCase() || '?';

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`group relative rounded-3xl border p-5 transition-colors [contain-intrinsic-size:96px] [content-visibility:auto] ${
                selected
                    ? 'border-purple-500/60 bg-purple-50/40 dark:border-purple-500/40 dark:bg-purple-500/5'
                    : 'border-slate-100 bg-slate-50 hover:border-purple-500/50 dark:border-white/5 dark:bg-white/2'
            }`}
        >
            {selectable && (
                <button
                    type="button"
                    onClick={onToggleSelect}
                    aria-pressed={selected}
                    aria-label={t('a11y.selectUser', { name: user.username })}
                    className="absolute right-4 top-4 text-lg text-slate-400 transition-colors hover:text-purple-500"
                >
                    {selected ? <FiCheckSquare /> : <FiSquare />}
                </button>
            )}
            <div className="flex items-center gap-4">
                <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-xl font-bold ${avatarClassName}`}
                >
                    {initial}
                </div>
                <div className="min-w-0 flex-1 pr-6">
                    <p className="truncate font-bold text-slate-800 dark:text-white">
                        {user.username}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                        {dateLabel} {formatDate(user.timestamp)}
                    </p>
                </div>
            </div>
            {user.href && (
                <a
                    href={user.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-2 text-center text-xs font-bold transition-all ${linkClassName}`}
                >
                    {t('common.viewProfile')}
                    <FiExternalLink aria-hidden />
                </a>
            )}
        </motion.div>
    );
}
