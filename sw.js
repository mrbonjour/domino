// sw.js
const cacheName = "PWAv1";
const filesToCache = ['index.html', '0.png', '0v.png', '1.png', '1v.png', '2.png', '2v.png', '3.png', '3v.png', '4.png', '4v.png', '5.png', '5v.png', '6.png', '6v.png', 'favicon.png', 'favicon40.png', 'favicon192.png', 'favicon512.png', 'creativecommons_public-domain_80x15.png', 'manifest.manifest'];

self.addEventListener("install", function(event) {
  // Perform install steps
  console.log("[Servicework] Install");
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log("[ServiceWorker] Caching app shell");
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener("activate", function(event) {
  console.log("[Servicework] Activate");
  event.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName) {
          console.log("[ServiceWorker] Removing old cache shell", key);
          return caches.delete(key);
        }
      }));
    })
  );
});

self.addEventListener('fetch', function(event) {
  console.log("[ServiceWorker] Fetch");
  event.respondWith(
    caches.match(event.request).then(function(resp) {
      return resp || fetch(event.request).then(function(response) {
        let responseClone = response.clone();
        caches.open(cacheName).then(function(cache) {
          cache.put(event.request, responseClone);
        });
        return response;
      });
    }).catch(function() {
      return caches.match(filesToCache);
    })
  );
});


