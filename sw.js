// Service Worker: meng-cache cangkang PWA saja.
// Data dan tampilan aplikasi tetap diambil langsung dari Google Apps Script.
const CACHE_NAME = 'ruang-meeting-v1';
const SHELL = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((c) => c.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  // Permintaan ke Google Apps Script tidak diambil dari cache
  if (url.hostname.includes('script.google') || url.hostname.includes('googleusercontent')) {
    return; // biarkan browser mengambil langsung dari jaringan
  }
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
