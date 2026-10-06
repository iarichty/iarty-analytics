/**
 * Register the service worker so the app is installable and works offline.
 *
 * Only runs in production builds — in dev the Vite server + HMR would fight
 * with a caching SW. Registration is best-effort: any failure is non-fatal.
 */
export function registerServiceWorker(): void {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;
    if (!import.meta.env.PROD) return;

    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(() => {
            // Offline support is a progressive enhancement — ignore failures.
        });
    });
}
