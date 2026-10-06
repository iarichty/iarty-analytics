import { useId, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FiCheckSquare, FiCopy, FiDownload, FiSquare } from 'react-icons/fi';
import type { AnalysisResult, ResultTab } from '@/lib/analysis/types';
import { filterAndSort } from '@/lib/analysis/parsers';
import { exportAllAsZip, exportCsv } from '@/lib/export';
import { useI18n } from '@/context/useI18n';
import SearchInput from './SearchInput';
import SortToggle from './SortToggle';
import UserCard from './UserCard';

export interface ResultsPanelTheme {
    /** Classes for the wrapping card. */
    cardClassName: string;
    /** Classes for the header bar. */
    headerClassName: string;
    /** Classes for the segmented tab container. */
    tabListClassName: string;
    /** Classes for an active tab button. */
    tabActiveClassName: string;
    /** Classes for an inactive tab button. */
    tabInactiveClassName: string;
    /** Classes for the search input. */
    searchClassName: string;
    /** Active sort pill background. */
    sortAccentClassName: string;
    /** Active sort label colour. */
    sortActiveTextClassName: string;
    /** Classes for the scrollable grid container. */
    gridClassName: string;
    /** Avatar tile classes. */
    avatarClassName: string;
    /** Profile link classes. */
    linkClassName: string;
    /** Unique layout id for the sort pill animation. */
    sortLayoutId: string;
    /** Label shown before the date on each card. */
    dateLabel: string;
    /** Platform id, used for export filenames. */
    platform: string;
}

interface Props {
    result: AnalysisResult;
    theme: ResultsPanelTheme;
}

/** Tabs + search + sort + results grid, shared by both platforms. */
export default function ResultsPanel({ result, theme }: Props) {
    const { t } = useI18n();
    const [activeTab, setActiveTab] = useState<ResultTab>('nonFollowbacks');
    const [query, setQuery] = useState('');
    const [order, setOrder] = useState<'newest' | 'oldest'>('newest');
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [copied, setCopied] = useState(false);
    const [zipBusy, setZipBusy] = useState(false);
    const [popupBlocked, setPopupBlocked] = useState(false);
    const panelId = useId();
    const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

    const tabs: Array<{ id: ResultTab; label: string }> = [
        { id: 'nonFollowbacks', label: t('tab.notFollowingBack') },
        { id: 'notFollowingBack', label: t('tab.youDontFollowBack') },
        { id: 'followers', label: t('tab.followers') },
        { id: 'following', label: t('tab.following') },
        { id: 'mutuals', label: t('tab.mutuals') },
        { id: 'fans', label: t('tab.fans') },
    ];

    const listFor = (tab: ResultTab) =>
        tab === 'mutuals'
            ? result.insights.mutuals
            : tab === 'fans'
              ? result.insights.fans
              : result[tab];

    const list = listFor(activeTab);
    const visible = useMemo(
        () => filterAndSort(list, query, order),
        [list, query, order],
    );

    const rowKey = (u: { username: string; href: string }) => `${u.username}::${u.href}`;

    const toggleSelect = (key: string) => {
        setSelected((prev) => {
            const next = new Set(prev);
            if (next.has(key)) next.delete(key);
            else next.add(key);
            return next;
        });
    };

    const allVisibleSelected =
        visible.length > 0 && visible.every((u) => selected.has(rowKey(u)));

    const toggleSelectAll = () => {
        setSelected((prev) => {
            const next = new Set(prev);
            if (allVisibleSelected) {
                visible.forEach((u) => next.delete(rowKey(u)));
            } else {
                visible.forEach((u) => next.add(rowKey(u)));
            }
            return next;
        });
    };

    const handleCopy = async () => {
        const usernames = visible.map((u) => u.username).join('\n');
        try {
            await navigator.clipboard.writeText(usernames);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
            // Clipboard may be blocked; ignore silently.
        }
    };

    const handleExportCsv = () => {
        exportCsv(visible, `${theme.platform}-${activeTab}.csv`);
    };

    const handleExportZip = async () => {
        setZipBusy(true);
        try {
            await exportAllAsZip(result, theme.platform);
        } finally {
            setZipBusy(false);
        }
    };

    const handleOpenSelected = () => {
        const targets = visible.filter((u) => selected.has(rowKey(u)) && u.href);
        const blocked = targets.some(
            (u) => !window.open(u.href, '_blank', 'noopener,noreferrer'),
        );
        setPopupBlocked(blocked);
    };

    return (
        <div className={theme.cardClassName}>
            <div className={theme.headerClassName}>
                <div className="flex flex-col justify-between gap-6 md:flex-row">
                    <div
                        className={`${theme.tabListClassName} flex-wrap`}
                        role="tablist"
                        aria-label={t('a11y.resultCategory')}
                    >
                        {tabs.map((tab) => {
                            const active = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    role="tab"
                                    id={`${panelId}-tab-${tab.id}`}
                                    aria-selected={active}
                                    aria-controls={`${panelId}-panel`}
                                    tabIndex={active ? 0 : -1}
                                    onClick={() => setActiveTab(tab.id)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                                            e.preventDefault();
                                            const index = tabs.findIndex(
                                                (item) => item.id === activeTab,
                                            );
                                            const delta = e.key === 'ArrowRight' ? 1 : -1;
                                            const next =
                                                tabs[(index + delta + tabs.length) % tabs.length];
                                            setActiveTab(next.id);
                                            tabRefs.current[next.id]?.focus();
                                        }
                                    }}
                                    ref={(el) => {
                                        tabRefs.current[tab.id] = el;
                                    }}
                                    className={`rounded-xl px-5 py-2.5 text-sm font-bold transition-all ${
                                        active ? theme.tabActiveClassName : theme.tabInactiveClassName
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>

                    <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                        <SearchInput
                            value={query}
                            onChange={setQuery}
                            placeholder={t('search.placeholder')}
                            className={theme.searchClassName}
                        />
                        <SortToggle
                            value={order}
                            onChange={setOrder}
                            layoutId={theme.sortLayoutId}
                            accentClassName={theme.sortAccentClassName}
                            activeTextClassName={theme.sortActiveTextClassName}
                        />
                    </div>
                </div>

                {/* Action toolbar: select-all + copy + export */}
                <div className="mt-4 flex flex-wrap items-center gap-2">
                    <button
                        type="button"
                        onClick={toggleSelectAll}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 transition-colors hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
                    >
                        {allVisibleSelected ? <FiCheckSquare /> : <FiSquare />}
                        {t('results.selectAll')}
                    </button>
                    {selected.size > 0 && (
                        <button
                            type="button"
                            onClick={handleOpenSelected}
                            className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 transition-colors hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
                        >
                            {t('results.openSelected')} ({selected.size})
                        </button>
                    )}
                    {popupBlocked && (
                        <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                            {t('results.popupBlocked')}
                        </span>
                    )}
                    <button
                        type="button"
                        onClick={handleCopy}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 transition-colors hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
                    >
                        <FiCopy />
                        {copied ? t('common.copied') : t('results.copyAll')}
                    </button>
                    <button
                        type="button"
                        onClick={handleExportCsv}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 transition-colors hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
                    >
                        <FiDownload />
                        {t('results.exportCsv')}
                    </button>
                    <button
                        type="button"
                        onClick={handleExportZip}
                        disabled={zipBusy}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
                    >
                        <FiDownload />
                        {zipBusy ? t('common.processing') : t('results.exportAll')}
                    </button>
                </div>
            </div>

            <div
                className="p-8"
                role="tabpanel"
                id={`${panelId}-panel`}
                aria-labelledby={`${panelId}-tab-${activeTab}`}
            >
                <div className={theme.gridClassName}>
                    {visible.map((user) => {
                        const key = rowKey(user);
                        return (
                            <UserCard
                                key={key}
                                user={user}
                                dateLabel={theme.dateLabel}
                                avatarClassName={theme.avatarClassName}
                                linkClassName={theme.linkClassName}
                                selectable
                                selected={selected.has(key)}
                                onToggleSelect={() => toggleSelect(key)}
                            />
                        );
                    })}
                </div>

                {visible.length === 0 && (
                    <div className="py-20 text-center">
                        <p className="font-medium text-slate-500">{t('results.empty')}</p>
                    </div>
                )}
            </div>

            {selected.size > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border-t border-slate-100 px-8 py-3 text-xs font-bold text-slate-500 dark:border-white/5"
                >
                    {t('results.selected', { count: selected.size })}
                </motion.div>
            )}
        </div>
    );
}
