/**
 * Metadata configuration for the website
 * This configuration includes SEO-related metadata, OpenGraph tags, Twitter cards, and other essential meta information
 */

interface OgImage {
    url: string;
    width: number;
    height: number;
    alt: string;
    type: string;
}

interface MetadataConfigType {
    title: string;
    creator: string;
    metadataBase: string;
    description: string;
    keywords: string[];
    authors: { name: string; url?: string };
    openGraph: {
        type: string;
        url?: string;
        siteName: string;
        title: string;
        description: string;
        locale: string;
        images: OgImage[];
        countryName: string;
    };
    twitter: {
        card: string;
        site?: string;
        creator?: string;
        title: string;
        description: string;
        images: string[];
    };
    robots: {
        index: boolean;
        follow: boolean;
        googleBot: {
            index: boolean;
            follow: boolean;
            "max-video-preview": number;
            "max-image-preview": string;
            "max-snippet": number;
        };
    };
    icons: {
        icon: Array<{ url: string; sizes?: string; type?: string }>;
        shortcut: string;
        apple: Array<{ url: string; sizes?: string; type?: string }>;
    };
    alternates: { canonical?: string; languages?: Record<string, string> };
    category: string;
}

const DOMAIN = "https://tools.iarty.biz.id";

const MetadataConfig: MetadataConfigType = {
    // Basic metadata
    title: "IARTY Tools - Social Media Analytics & Utilities",
    creator: "IARTY Tools",
    metadataBase: DOMAIN,
    description:
        "Analyze your Instagram and TikTok data easily. Get insights about your followers, following, and engagement metrics in one place.",

    // Keywords for SEO
    keywords: [
        "iarty tools",
        "iarty",
        "instagram analytics",
        "tiktok analytics",
        "social media analytics",
        "instagram followers analysis",
        "tiktok followers analysis",
        "social media metrics",
        "instagram insights",
        "tiktok insights",
        "social media data analysis",
        "online tools",
    ],

    // Author information
    authors: {
        name: "IARTY Tools",
        url: DOMAIN,
    },

    // OpenGraph metadata for social media sharing
    openGraph: {
        type: "website",
        url: DOMAIN,
        siteName: "IARTY Tools",
        title: "IARTY Tools - Social Media Analytics & Utilities",
        description:
            "Powerful analytics tool for Instagram and TikTok. Analyze your social media data and get valuable insights.",
        locale: "id-ID",
        images: [
            {
                // Open Graph requires an absolute URL.
                url: `${DOMAIN}/og-image.jpg`,
                width: 1200,
                height: 630,
                alt: "IARTY Tools - Social Media Analytics & Utilities",
                type: "image/jpeg",
            },
        ],
        countryName: "Indonesia",
    },

    // Twitter card metadata
    twitter: {
        card: "summary_large_image",
        site: "@iartyid",
        creator: "@iartyid",
        title: "IARTY Tools - Social Media Analytics & Utilities",
        description:
            "Analyze your Instagram and TikTok data with powerful insights and metrics.",
        images: [`${DOMAIN}/og-image.jpg`],
    },

    // Search engine crawler settings
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },

    // Favicon and icon configurations
    icons: {
        icon: [
            { url: "/favicon.ico" },
            { url: "/favicon.ico", sizes: "16x16", type: "image/png" },
            { url: "/favicon.ico", sizes: "32x32", type: "image/png" },
        ],
        shortcut: "/favicon.ico",
        apple: [
            { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
        ],
    },

    // Canonical URL + language alternates
    alternates: {
        canonical: DOMAIN,
        languages: {
            "en": DOMAIN,
            "id": DOMAIN,
            "x-default": DOMAIN,
        },
    },

    // Website category
    category: "technology",
};

export default MetadataConfig;