'use strict';
const RELEASE = {"version":"1.1.0","build":"844d30445e","assetTag":"1.1.0-38ffe315e2"};
const PREFIX = 'mosaic-craft:' + new URL(self.registration.scope).pathname + ':';
const CACHE = PREFIX + RELEASE.version + '-' + RELEASE.build;
const versioned = file => './' + file + '?v=' + RELEASE.assetTag;
const CORE = ['./', './index.html', versioned('app.css'), versioned('app.js'),
  versioned('storage.js'), versioned('updates.js'), versioned('version.js'),
  './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png',
  './icons/maskable-512.png'].map(path => new URL(path, self.registration.scope).href);
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE)));
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) if (key.startsWith(PREFIX) && key !== CACHE) await caches.delete(key);
    await self.clients.claim();
  })());
});
self.addEventListener('message', event => {
  if (event.data?.type === 'ACTIVATE') self.skipWaiting();
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin || !url.href.startsWith(self.registration.scope)) return;
  if (event.request.mode === 'navigate') {
    event.respondWith(caches.open(CACHE).then(cache =>
      cache.match(new URL('./index.html', self.registration.scope).href).then(cached => cached || fetch(event.request))));
  } else if (CORE.includes(url.href)) {
    event.respondWith(caches.open(CACHE).then(cache => cache.match(event.request)).then(cached => cached || fetch(event.request)));
  }
});
