import type { ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';
import MetadataConfig from '@/config/Metadata';

interface HelmetContainerProps {
    children?: ReactNode;
    /** Page-specific title. Falls back to the site-wide default. */
    title?: string;
    /** Route-relative path (e.g. "/instagram"). Used for the canonical URL. */
    path?: string;
}

/**
 * Centralises SEO tags. Rendered per page so the title, canonical URL and
 * Open Graph data reflect the current route.
 */
export default function HelmetContainer({ children, title, path }: HelmetContainerProps) {
    const { openGraph, twitter, robots, icons, authors, metadataBase } = MetadataConfig;
    const seoTitle = title ?? MetadataConfig.title;
    const ogImage = openGraph.images[0];
    const canonical = path ? `${metadataBase}${path}` : metadataBase;

    return (
        <Helmet>
            <title>{seoTitle}</title>
            {children}

            <meta name="description" content={MetadataConfig.description} />
            <meta name="keywords" content={MetadataConfig.keywords.join(', ')} />
            <meta name="author" content={authors.name} />
            <link rel="canonical" href={canonical} />
            <meta name="theme-color" content="#0a0a0c" />
            <meta
                name="robots"
                content={`${robots.index ? 'index' : 'noindex'}, ${
                    robots.follow ? 'follow' : 'nofollow'
                }`}
            />

            {/* Open Graph */}
            <meta property="og:type" content={openGraph.type} />
            <meta property="og:title" content={seoTitle} />
            <meta property="og:description" content={openGraph.description} />
            <meta property="og:url" content={canonical} />
            <meta property="og:site_name" content={openGraph.siteName} />
            <meta property="og:locale" content={openGraph.locale} />
            {ogImage && (
                <>
                    <meta property="og:image" content={ogImage.url} />
                    <meta property="og:image:width" content={String(ogImage.width)} />
                    <meta property="og:image:height" content={String(ogImage.height)} />
                    <meta property="og:image:alt" content={ogImage.alt} />
                </>
            )}

            {/* Twitter / X */}
            <meta name="twitter:card" content={twitter.card} />
            <meta name="twitter:title" content={seoTitle} />
            <meta name="twitter:description" content={twitter.description} />
            {twitter.images[0] && <meta name="twitter:image" content={twitter.images[0]} />}

            {/* Icons */}
            <link rel="icon" type="image/x-icon" href={icons.icon[0]?.url ?? '/favicon.ico'} />
            <link rel="apple-touch-icon" href={icons.apple[0]?.url} />
        </Helmet>
    );
}
