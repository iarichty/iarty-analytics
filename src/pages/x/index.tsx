import {
    FiTarget,
    FiUserX,
    FiUserPlus,
    FiAtSign,
} from 'react-icons/fi';
import AnalyzePage, {
    type AnalyzePageConfig,
} from '@/components/analysis/AnalyzePage';
import { useI18n } from '@/context/useI18n';

/** Build the X (Twitter) page config with the current translations. */
function buildConfig(t: (key: string) => string): AnalyzePageConfig {
    return {
        platform: 'x',
        seoTitle: 'X (Twitter) Insights | IARTY Tools',
        path: '/x',
        wrapperClassName:
            'min-h-screen bg-[#fafafa] text-slate-900 transition-colors duration-300 dark:bg-[#000000] dark:text-slate-100',
        background: (
            <div className="pointer-events-none fixed inset-0 overflow-hidden opacity-40 dark:opacity-30">
                <div className="absolute right-[-10%] top-[-10%] h-96 w-96 rounded-full bg-slate-500 blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] h-96 w-96 rounded-full bg-blue-500/60 blur-[120px]" />
            </div>
        ),
        backLinkClassName:
            'group mb-4 flex w-fit items-center gap-2 text-sm font-bold text-slate-500 transition-colors hover:text-black dark:hover:text-white',
        heading: (
            <h1 className="text-4xl font-black tracking-tight md:text-5xl">
                X{' '}
                <span className="bg-linear-to-r from-slate-700 to-blue-500 bg-clip-text text-transparent dark:from-white dark:to-blue-400">
                    Insights
                </span>
            </h1>
        ),
        subheading: t('home.x.desc'),
        guide: {
            to: '/x/how-analyze-works',
            label: 'How to get your data',
            icon: <FiTarget className="text-blue-500" aria-hidden />,
        },
        headerRowClassName:
            'mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end',
        guideButtonClassName:
            'flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold shadow-sm transition-all hover:shadow-md active:scale-95 dark:border-white/10 dark:bg-white/5',
        upload: {
            title: t('upload.x.title'),
            description: t('upload.x.desc'),
            buttonLabel: t('upload.x.button'),
            accentClassName: 'bg-linear-to-tr from-slate-900 to-blue-600',
            dragClassName: 'border-blue-500 bg-blue-50/60 dark:bg-blue-500/5',
        },
        stats: [
            { label: t('stat.followers'), key: 'followers', icon: <FiUserPlus />, accent: '#2563eb' },
            { label: t('stat.following'), key: 'following', icon: <FiAtSign />, accent: '#64748b' },
            {
                label: t('stat.notFollowingBack'),
                key: 'nonFollowbacks',
                icon: <FiUserX />,
                accent: '#dc2626',
            },
            {
                label: t('stat.youDontFollowBack'),
                key: 'notFollowingBack',
                icon: <FiUserPlus />,
                accent: '#0ea5e9',
            },
        ],
        resultsTheme: {
            cardClassName:
                'overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-xl shadow-black/5 dark:border-white/10 dark:bg-[#0a0a0a]',
            headerClassName: 'border-b border-slate-100 p-8 dark:border-white/5',
            tabListClassName: 'flex w-fit rounded-2xl bg-slate-100 p-1 dark:bg-white/5',
            tabActiveClassName:
                'bg-black text-white shadow-md dark:bg-white dark:text-black',
            tabInactiveClassName:
                'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200',
            searchClassName:
                'rounded-xl border border-slate-200 bg-slate-50 py-2.5 focus:ring-2 focus:ring-blue-500 dark:border-white/10 dark:bg-white/5 md:w-64',
            sortAccentClassName: 'bg-black text-white dark:bg-white/10',
            sortActiveTextClassName: 'text-white dark:text-white',
            gridClassName:
                'grid max-h-[600px] grid-cols-1 gap-4 overflow-y-auto pr-2 sm:grid-cols-2 lg:grid-cols-3',
            avatarClassName:
                'bg-linear-to-tr from-slate-100 to-blue-100 text-slate-700 dark:from-white/5 dark:to-blue-500/10 dark:text-slate-300',
            linkClassName:
                'border border-slate-200 bg-white text-slate-700 hover:bg-black hover:text-white dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white dark:hover:text-black',
            sortLayoutId: 'x-sort-pill',
            dateLabel: 'Since',
            platform: 'x',
        },
        panelCardClassName:
            'rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-xl shadow-black/5 dark:border-white/10 dark:bg-[#0a0a0a]',
        resultsSpacingClassName: 'space-y-8',
        errorClassName:
            'mt-6 rounded-2xl border border-red-100 bg-red-50 p-4 text-center font-bold text-red-600 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-400',
        footerClassName: 'mt-6 text-center text-sm text-slate-500 dark:text-slate-400',
        accent: '#2563eb',
    };
}

export default function XAnalyze() {
    const { t } = useI18n();
    return <AnalyzePage config={buildConfig(t)} />;
}
