self.importScripts("data/games.js");

// Files to cache
const cacheName = "v2";
const appShellFiles = [
  "/pwa-playground/",
  "/pwa-playground/index.html",
  "/pwa-playground/app.js",
  "/pwa-playground/style.css",
  "/pwa-playground/fonts/graduate.eot",
  "/pwa-playground/fonts/graduate.ttf",
  "/pwa-playground/fonts/graduate.woff",
  "/pwa-playground/favicon.ico",
  "/pwa-playground/img/js13kgames.png",
  "/pwa-playground/img/bg.png",
  "/pwa-playground/icons/icon-32.png",
  "/pwa-playground/icons/icon-64.png",
  "/pwa-playground/icons/icon-96.png",
  "/pwa-playground/icons/icon-128.png",
  "/pwa-playground/icons/icon-168.png",
  "/pwa-playground/icons/icon-192.png",
  "/pwa-playground/icons/icon-256.png",
  "/pwa-playground/icons/icon-512.png",
];
const gamesImages = [];
for (let i = 0; i < games.length; i++) {
  gamesImages.push(`data/img/${games[i].slug}.jpg`);
}
const contentToCache = appShellFiles.concat(gamesImages);

// Installing Service Worker
self.addEventListener("install", (e) => {
  console.log("[Service Worker] Install");
  e.waitUntil(
    (async () => {
      const cache = await caches.open(cacheName);
      console.log("[Service Worker] Caching all: app shell and content");
      await cache.addAll(contentToCache);
    })()
  );
});

// Fetching content using Service Worker
self.addEventListener("fetch", (e) => {
  e.respondWith(
    (async () => {
      const r = await caches.match(e.request);
      console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
      if (r) return r;
      const response = await fetch(e.request);
      const cache = await caches.open(cacheName);
      console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
      cache.put(e.request, response.clone());
      return response;
    })()
  );
});

// 清楚不再需要的旧缓存
self.addEventListener("activate", (e) => {
  e.waitUntil(
    (async (e) => {
      caches.keys().then((keyList) => {
        Promise.all(
          keyList.map((key) => {
            if (key === cacheName) return;
            caches.delete(key);
          })
        );
      });
    })()
  );
});
