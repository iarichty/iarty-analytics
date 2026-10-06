import {
    FiBarChart2,
    FiHelpCircle,
    FiUserMinus,
    FiUsers,
} from 'react-icons/fi';
import AnalyzePage, {
    type AnalyzePageConfig,
} from '@/components/analysis/AnalyzePage';
import { useI18n } from '@/context/useI18n';

/** Build the TikTok page config with the current translations. */
function buildConfig(t: (key: string) => string): AnalyzePageConfig {
    return {
        platform: 'tiktok',
        seoTitle: 'TikTok Insights | IARTY Tools',
        path: '/tiktok',
        wrapperClassName:
            'min-h-screen bg-[#fafafa] text-gray-900 transition-colors duration-300 selection:bg-[#fe2c55]/20 dark:bg-[#0f0f13] dark:text-white',
        background: (
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute left-[-10%] top-[-10%] h-[50%] w-[50%] rounded-full bg-[#fe2c55] opacity-5 blur-[150px] dark:opacity-10" />
                <div className="absolute bottom-[-10%] right-[-10%] h-[50%] w-[50%] rounded-full bg-[#25f4ee] opacity-5 blur-[150px] dark:opacity-10" />
            </div>
        ),
        backLinkClassName:
            'group mb-4 flex w-fit items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-500 transition-colors hover:text-[#fe2c55]',
        heading: (
            <h1 className="text-5xl font-black italic tracking-tighter">
                TIKTOK{' '}
                <span className="bg-linear-to-r from-[#fe2c55] via-purple-500 to-[#25f4ee] bg-clip-text text-transparent">
                    INSIGHTS
                </span>
            </h1>
        ),
        subheading: t('home.tt.desc'),
        guide: {
            to: '/tiktok/how-analyze-works',
            label: 'Data guide',
            icon: <FiHelpCircle className="text-[#fe2c55]" aria-hidden />,
        },
        headerRowClassName:
            'mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end',
        guideButtonClassName:
            'flex items-center gap-2 rounded-full border border-gray-200 bg-white px-6 py-3 text-sm font-bold shadow-sm transition-all hover:bg-gray-50 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10',
        upload: {
            title: t('upload.tt.title'),
            description: t('upload.tt.desc'),
            buttonLabel: t('upload.tt.button'),
            accentClassName: 'bg-linear-to-br from-[#fe2c55] to-[#25f4ee]',
            dragClassName: 'border-[#fe2c55] bg-[#fe2c55]/5',
        },
        stats: [
            { label: t('stat.followers'), key: 'followers', icon: <FiUsers />, accent: '#6366f1' },
            { label: t('stat.following'), key: 'following', icon: <FiUsers />, accent: '#25f4ee' },
            {
                label: t('stat.notFollowingBack'),
                key: 'nonFollowbacks',
                icon: <FiUserMinus />,
                accent: '#fe2c55',
            },
        ],
        extraStat: {
            label: t('stat.ratio'),
            value: '0.0',
            icon: <FiBarChart2 />,
            accent: '#a855f7',
            isRatio: true,
        },
        resultsTheme: {
            cardClassName:
                'overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-xl dark:border-white/5 dark:bg-[#1a1a20]',
            headerClassName:
                'border-b border-slate-100 bg-slate-50/50 p-8 dark:border-white/5 dark:bg-white/2',
            tabListClassName:
                'flex w-fit rounded-2xl border border-slate-200 bg-slate-100 p-1.5 dark:border-white/5 dark:bg-black/40',
            tabActiveClassName: 'bg-[#fe2c55] text-white shadow-lg',
            tabInactiveClassName: 'text-slate-500 hover:text-slate-800 dark:hover:text-white',
            searchClassName:
                'rounded-2xl border border-slate-200 bg-slate-100 py-3 focus:border-[#fe2c55] focus:ring-2 focus:ring-[#fe2c55]/20 dark:border-white/10 dark:bg-black/40 md:w-72',
            sortAccentClassName: 'bg-[#25f4ee]',
            sortActiveTextClassName: 'text-black',
            gridClassName:
                'grid max-h-[500px] grid-cols-1 gap-5 overflow-y-auto pr-4 sm:grid-cols-2 lg:grid-cols-3',
            avatarClassName:
                'rounded-2xl border border-slate-200 bg-linear-to-tr from-[#fe2c55]/10 to-[#25f4ee]/10 text-[#fe2c55] dark:border-white/10',
            linkClassName:
                'border border-slate-200 bg-white text-slate-700 hover:bg-[#fe2c55] hover:text-white dark:border-white/10 dark:bg-white/5 dark:text-slate-300',
            sortLayoutId: 'tt-sort-pill',
            dateLabel: 'Active',
            platform: 'tiktok',
        },
        panelCardClassName:
            'rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-xl dark:border-white/5 dark:bg-[#1a1a20]',
        resultsSpacingClassName: 'space-y-10',
        errorClassName:
            'mt-8 rounded-3xl border border-red-200 bg-red-50 p-6 text-center font-black text-red-600 dark:border-[#fe2c55]/20 dark:bg-[#fe2c55]/10 dark:text-[#fe2c55]',
        footerClassName: 'mt-8 text-center text-sm text-gray-500 dark:text-gray-400',
        accent: '#fe2c55',
    };
}

export default function TikTokAnalyze() {
    const { t } = useI18n();
    return <AnalyzePage config={buildConfig(t)} />;
}
