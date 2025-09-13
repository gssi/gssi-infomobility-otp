const CACHE_NAME = "mia-app-cache-v1";
const FILES_TO_CACHE = [
    "./style.css",
    "./opendata/style.css",
    "./images/comune-laquila.jpg",
    "./images/gssi-small.png",
    "./images/favicons-bus/favicon.ico",
    "./images/favicons-bus/favicon-192.png"
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(FILES_TO_CACHE);
        })
    );
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keyList) =>
            Promise.all(
                keyList.map((key) => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            )
        )
    );
});

// Intercettazione delle richieste
self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});