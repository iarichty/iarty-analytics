/*
 * IARTY Tools service worker.
 *
 * Strategy:
 *  - App shell (navigation requests): network-first, falling back to the cached
 *    shell so the installed app still opens offline.
 *  - Static assets (JS/CSS/fonts/images): stale-while-revalidate for speed.
 *
 * All analysis happens client-side, so caching is purely about app delivery —
 * no user data ever passes through here.
 */
const CACHE = 'iarty-tools-v1';
const SHELL = ['/', '/index.html', '/manifest.webmanifest'];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting()),
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches
            .keys()
            .then((keys) =>
                Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))),
            )
            .then(() => self.clients.claim()),
    );
});

self.addEventListener('fetch', (event) => {
    const { request } = event;
    if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) {
        return;
    }

    // Navigations: network-first with an offline shell fallback.
    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    const copy = response.clone();
                    caches.open(CACHE).then((cache) => cache.put('/index.html', copy));
                    return response;
                })
                .catch(() => caches.match('/index.html').then((r) => r || caches.match('/'))),
        );
        return;
    }

    // Other assets: stale-while-revalidate.
    event.respondWith(
        caches.match(request).then((cached) => {
            const network = fetch(request)
                .then((response) => {
                    const copy = response.clone();
                    caches.open(CACHE).then((cache) => cache.put(request, copy));
                    return response;
                })
                .catch(() => cached);
            return cached || network;
        }),
    );
});
