import {
    FiInfo,
    FiInstagram,
    FiUserPlus,
    FiUserX,
    FiUsers,
} from 'react-icons/fi';
import AnalyzePage, {
    type AnalyzePageConfig,
} from '@/components/analysis/AnalyzePage';
import { useI18n } from '@/context/useI18n';

/** Build the Instagram page config with the current translations. */
function buildConfig(t: (key: string) => string): AnalyzePageConfig {
    return {
        platform: 'instagram',
        seoTitle: 'Instagram Insights | IARTY Analytics',
        path: '/instagram',
        wrapperClassName:
            'min-h-screen bg-[#fafafa] text-slate-900 transition-colors duration-300 dark:bg-[#0a0a0c] dark:text-slate-100',
        background: (
            <div className="pointer-events-none fixed inset-0 overflow-hidden opacity-40 dark:opacity-20">
                <div className="absolute right-[-10%] top-[-10%] h-96 w-96 rounded-full bg-purple-400 blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] h-96 w-96 rounded-full bg-orange-400 blur-[120px]" />
            </div>
        ),
        backLinkClassName:
            'group mb-4 flex w-fit items-center gap-2 text-sm font-bold text-slate-500 transition-colors hover:text-purple-600',
        heading: (
            <h1 className="text-4xl font-black tracking-tight md:text-5xl">
                Instagram{' '}
                <span className="bg-linear-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] bg-clip-text text-transparent">
                    Insights
                </span>
            </h1>
        ),
        subheading: t('home.ig.desc'),
        guide: {
            to: '/instagram/how-analyze-works',
            label: 'How to get your data',
            icon: <FiInfo className="text-purple-500" aria-hidden />,
        },
        headerRowClassName:
            'mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end',
        guideButtonClassName:
            'flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold shadow-sm transition-all hover:shadow-md active:scale-95 dark:border-white/10 dark:bg-white/5',
        upload: {
            title: t('upload.ig.title'),
            description: t('upload.ig.desc'),
            buttonLabel: t('upload.ig.button'),
            accentClassName: 'bg-linear-to-tr from-purple-500 to-orange-400',
            dragClassName: 'border-purple-500 bg-purple-50/60 dark:bg-purple-500/5',
        },
        stats: [
            { label: t('stat.followers'), key: 'followers', icon: <FiUsers />, accent: '#2563eb' },
            { label: t('stat.following'), key: 'following', icon: <FiUserPlus />, accent: '#9333ea' },
            {
                label: t('stat.notFollowingBack'),
                key: 'nonFollowbacks',
                icon: <FiUserX />,
                accent: '#dc2626',
            },
            {
                label: t('stat.youDontFollowBack'),
                key: 'notFollowingBack',
                icon: <FiInstagram />,
                accent: '#ea580c',
            },
        ],
        resultsTheme: {
            cardClassName:
                'overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-xl shadow-black/5 dark:border-white/10 dark:bg-gray-900',
            headerClassName: 'border-b border-slate-100 p-8 dark:border-white/5',
            tabListClassName: 'flex w-fit rounded-2xl bg-slate-100 p-1 dark:bg-white/5',
            tabActiveClassName:
                'bg-white text-purple-600 shadow-md dark:bg-white/10 dark:text-white',
            tabInactiveClassName:
                'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200',
            searchClassName:
                'rounded-xl border border-slate-200 bg-slate-50 py-2.5 focus:ring-2 focus:ring-purple-500 dark:border-white/10 dark:bg-white/5 md:w-64',
            sortAccentClassName: 'bg-white dark:bg-white/10',
            sortActiveTextClassName: 'text-purple-600 dark:text-white',
            gridClassName:
                'grid max-h-[600px] grid-cols-1 gap-4 overflow-y-auto pr-2 sm:grid-cols-2 lg:grid-cols-3',
            avatarClassName:
                'bg-linear-to-tr from-purple-100 to-orange-100 text-purple-600 dark:from-purple-900/20 dark:to-orange-900/20 dark:text-purple-400',
            linkClassName:
                'border border-slate-200 bg-white text-slate-700 hover:bg-purple-600 hover:text-white dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-purple-600',
            sortLayoutId: 'ig-sort-pill',
            dateLabel: 'Since',
            platform: 'instagram',
        },
        panelCardClassName:
            'rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-xl shadow-black/5 dark:border-white/10 dark:bg-gray-900',
        resultsSpacingClassName: 'space-y-8',
        errorClassName:
            'mt-6 rounded-2xl border border-red-100 bg-red-50 p-4 text-center font-bold text-red-600 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-400',
        footerClassName: 'mt-6 text-center text-sm text-slate-500 dark:text-slate-400',
        accent: '#9333ea',
    };
}

export default function InstagramAnalyze() {
    const { t } = useI18n();
    return <AnalyzePage config={buildConfig(t)} />;
}
