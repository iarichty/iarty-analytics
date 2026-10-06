import type { AnalysisPlatform } from '@/lib/analysis/analysis.worker';

/**
 * Central platform registry.
 *
 * Every platform-specific surface (routes, guide links, brand gradients, the
 * worker's parser key) is declared here once, so adding a new platform is a
 * matter of appending an entry — no scattered `if (platform === ...)` edits.
 * Platforms that are planned but not yet implemented are marked `comingSoon`
 * and rendered as disabled cards on the home page.
 */
export interface PlatformDefinition {
    /** Stable id shared with the analysis worker's `AnalysisPlatform`. */
    id: AnalysisPlatform | string;
    name: string;
    /** Translation key for the marketing blurb. */
    descriptionKey: string;
    icon: string;
    /** Route of the analyzer page (undefined while coming soon). */
    link?: string;
    /** Route of the "how it works" guide. */
    howItWorks?: string;
    gradient: string;
    buttonColor: string;
    /** When true, the home page shows a "coming soon" badge and no link. */
    comingSoon?: boolean;
}

export const PLATFORMS: PlatformDefinition[] = [
    {
        id: 'instagram',
        name: 'Instagram',
        descriptionKey: 'home.ig.desc',
        icon: '/img/instagram.svg',
        link: '/instagram',
        howItWorks: '/instagram/how-analyze-works',
        gradient: 'from-[#833ab4] via-[#fd1d1d] to-[#fcb045]',
        buttonColor: 'bg-linear-to-r from-pink-600 to-orange-500',
    },
    {
        id: 'tiktok',
        name: 'TikTok',
        descriptionKey: 'home.tt.desc',
        icon: '/img/tiktok.svg',
        link: '/tiktok',
        howItWorks: '/tiktok/how-analyze-works',
        gradient: 'from-[#00f2ea] to-[#ff0050]',
        buttonColor: 'bg-linear-to-r from-cyan-500 to-pink-600',
    },
    // Planned platforms — the analyzer shell (AnalyzePage + worker) already
    // supports them; they just need a parser + a config file, then flip
    // `comingSoon` to false and add the route under src/pages/<id>/.
    {
        id: 'threads',
        name: 'Threads',
        descriptionKey: 'home.threads.desc',
        icon: '/img/threads.svg',
        link: '/threads',
        howItWorks: '/threads/how-analyze-works',
        gradient: 'from-black to-gray-600',
        buttonColor: 'bg-linear-to-r from-gray-800 to-black',
    },
    {
        id: 'x',
        name: 'X (Twitter)',
        descriptionKey: 'home.x.desc',
        icon: '/img/x.svg',
        link: '/x',
        howItWorks: '/x/how-analyze-works',
        gradient: 'from-gray-700 to-black',
        buttonColor: 'bg-linear-to-r from-gray-700 to-black',
    },
];
