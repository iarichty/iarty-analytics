import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { FiUserMinus, FiUserPlus, FiUserX, FiUserCheck } from 'react-icons/fi';
import type { ConnectionUser, SnapshotDiff } from '@/lib/analysis/types';
import { formatDate } from '@/lib/format';
import { useI18n } from '@/context/useI18n';

interface Props {
    diff: SnapshotDiff;
    /** Accent colour for the header icon. */
    accent: string;
    cardClassName: string;
}

/** One column of the diff: a titled, scrollable list of usernames. */
function DiffColumn({
    title,
    icon,
    users,
    emptyLabel,
    color,
}: {
    title: string;
    icon: ReactNode;
    users: ConnectionUser[];
    emptyLabel: string;
    color: string;
}) {
    return (
        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-white/5 dark:bg-white/2">
            <div className="mb-3 flex items-center justify-between">
                <p className="flex items-center gap-2 text-xs font-black uppercase tracking-widest" style={{ color }}>
                    {icon}
                    {title}
                </p>
                <span className="rounded-full bg-white px-2 py-0.5 text-xs font-black tabular-nums text-slate-600 shadow-sm dark:bg-white/10 dark:text-slate-200">
                    {users.length}
                </span>
            </div>
            <div className="max-h-40 space-y-1 overflow-y-auto pr-1">
                {users.length === 0 && (
                    <p className="text-xs text-slate-400">{emptyLabel}</p>
                )}
                {users.map((u) => (
                    <div
                        key={`${u.username}::${u.href}`}
                        className="truncate rounded-lg bg-white/70 px-2 py-1 text-xs font-semibold text-slate-700 dark:bg-white/5 dark:text-slate-300"
                        title={u.username}
                    >
                        {u.href ? (
                            <a
                                href={u.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-purple-500"
                            >
                                {u.username}
                            </a>
                        ) : (
                            u.username
                        )}
                        {u.timestamp > 0 && (
                            <span className="ml-1 text-[10px] font-normal text-slate-400">
                                {formatDate(u.timestamp)}
                            </span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

/**
 * "Since your last analysis" panel. Shown only when a previous snapshot
 * exists, so the very first run (which has nothing to compare against) stays
 * uncluttered.
 */
export default function UnfollowerDiff({ diff, accent, cardClassName }: Props) {
    const { t } = useI18n();
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cardClassName}
        >
            <div className="mb-6 flex items-start gap-3">
                <span
                    className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-white"
                    style={{ background: accent }}
                >
                    <FiUserMinus />
                </span>
                <div>
                    <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                        {t('unfollower.title')}
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        {t('unfollower.subtitle', {
                            date: formatDate(diff.previousCapturedAt),
                        })}
                    </p>
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <DiffColumn
                    title={t('unfollower.unfollowedYou')}
                    icon={<FiUserMinus />}
                    users={diff.unfollowedYou}
                    emptyLabel={t('unfollower.none')}
                    color="#dc2626"
                />
                <DiffColumn
                    title={t('unfollower.newFollowers')}
                    icon={<FiUserPlus />}
                    users={diff.newFollowers}
                    emptyLabel={t('unfollower.none')}
                    color="#16a34a"
                />
                <DiffColumn
                    title={t('unfollower.youUnfollowed')}
                    icon={<FiUserX />}
                    users={diff.youUnfollowed}
                    emptyLabel={t('unfollower.none')}
                    color="#ea580c"
                />
                <DiffColumn
                    title={t('unfollower.youNowFollow')}
                    icon={<FiUserCheck />}
                    users={diff.youNowFollow}
                    emptyLabel={t('unfollower.none')}
                    color="#9333ea"
                />
            </div>
        </motion.div>
    );
}
