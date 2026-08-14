const CACHE_NAME = 'gg-static-v1';
const STATIC_ASSETS = [
	'/icons/icon-192.png',
	'/icons/icon-512.png',
	'/icons/icon-maskable-512.png',
	'/icons/apple-touch-icon.png',
	'/manifest.webmanifest',
];

self.addEventListener('install', (event) => {
	event.waitUntil(
		caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)),
	);
	self.skipWaiting();
});

self.addEventListener('activate', (event) => {
	event.waitUntil(
		caches
			.keys()
			.then((keys) =>
				Promise.all(
					keys
						.filter((key) => key !== CACHE_NAME)
						.map((key) => caches.delete(key)),
				),
			),
	);
	self.clients.claim();
});

// Cache-first only for our own static icons/manifest. Everything else
// (pages, API routes, RSC data) always goes straight to the network -
// this app's content is per-user and must never be served stale/cached.
self.addEventListener('fetch', (event) => {
	const url = new URL(event.request.url);
	const isStaticAsset =
		url.origin === self.location.origin &&
		(url.pathname.startsWith('/icons/') ||
			url.pathname === '/manifest.webmanifest');

	if (!isStaticAsset) return;

	event.respondWith(
		caches
			.match(event.request)
			.then((cached) => cached || fetch(event.request)),
	);
});
