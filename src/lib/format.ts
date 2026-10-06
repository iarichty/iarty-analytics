/**
 * Small formatting helpers shared across the app.
 * All user-facing copy is English (see project decision), so the default
 * locale is en-US.
 */

/** Format an epoch-millisecond timestamp as a short, readable date. */
export function formatDate(timestamp: number, locale = 'en-US'): string {
    if (!timestamp) return '—';
    return new Date(timestamp).toLocaleDateString(locale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

/** Group digits with thousands separators. */
export function formatNumber(value: number, locale = 'en-US'): string {
    return value.toLocaleString(locale);
}
