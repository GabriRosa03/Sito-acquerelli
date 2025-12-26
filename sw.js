const CACHE_NAME = 'venetian-portfolio-cache-v2';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './gallery.html',
    './biografia.html',
    './materiali.html',
    './contatti.html',
    './styles.css',
    './script.js',
    './paintings.js',
    './contact.js',
    // Fonts might need specific paths if they are local
    './fonts/AMORIA.OTF',
    './fonts/Quilge%20DEMO%20VERSION.otf'
];

// Install Event - Cache Core Assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                return cache.addAll(ASSETS_TO_CACHE);
            })
    );
});

// Fetch Event - Serve from Cache, then Network (Stale-while-revalidate strategy for images recommended?)
// For simplicity and performance on images: Cache First for images.
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // Cache Strategy for Images: Cache First, Fallback to Network
    if (event.request.destination === 'image') {
        event.respondWith(
            caches.match(event.request)
                .then((response) => {
                    // Return cached response if found
                    if (response) {
                        return response;
                    }
                    // Otherwise fetch from network and cache it
                    return fetch(event.request)
                        .then((networkResponse) => {
                            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                                return networkResponse;
                            }
                            const responseToCache = networkResponse.clone();
                            caches.open(CACHE_NAME)
                                .then((cache) => {
                                    cache.put(event.request, responseToCache);
                                });
                            return networkResponse;
                        });
                })
        );
    } else {
        // Cache Strategy for others (CSS, JS, HTML): Network First (to ensure updates are seen), Fallback to Cache
        // Or Stale-While-Revalidate. Let's go with Network First for safety during development.
        event.respondWith(
            fetch(event.request)
                .catch(() => {
                    return caches.match(event.request);
                })
        );
    }
});

// Activate Event - Cleanup Old Caches
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
