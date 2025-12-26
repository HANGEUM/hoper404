const BASE = "/hoper404/";

const FILES = [
  BASE,
  BASE + "index.html",
  BASE + "download.html",
  BASE + "style.css",
  BASE + "manifest.json"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("downloadgame-v1").then(c => c.addAll(FILES))
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
