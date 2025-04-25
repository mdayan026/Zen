const CACHE_NAME = 'Zen-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/manifest.json',
    '/App.css',
    '/tailwind.css',
    '/app.jsx', 
    '/playlist192.png',
  '/playlist512.png',
    '/playlist.png', 
    '/assets/1.png', 
    '/assets/2.png', 
    '/assets/3.png', 
    '/assets/4.png',
    '/assets/5.png', 
    '/assets/6.png',
    '/assets/7.png', 
    '/assets/8.png',
    '/assets/9.png', 
    '/assets/10.png',
    '/assets/11.png', 
    '/assets/12.png',
    '/assets/13.png', 
    '/assets/14.png',
    '/assets/15.png', 
    '/assets/16.png',
    '/assets/17.png', 
    '/assets/18.png',
    '/assets/19.png', 
    '/assets/20.png',
    '/bg-grid.png',
];

// Install the service worker and cache resources
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(urlsToCache);
        })
    );
});

// Intercept fetch requests and serve cached resources
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request).catch(() => {
                // Fallback to index.html for offline navigation
                if (event.request.mode === 'navigate') {
                    return caches.match('/index.html');
                }
            });
        })
    );
});

// Activate the service worker and clean up old caches
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});