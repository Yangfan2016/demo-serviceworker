// 注册Service Worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/sw.js")
    .then(function (registration) {
      console.log("Service Worker 注册成功:", registration);
    })
    .catch(function (error) {
      console.log("Service Worker 注册失败:", error);
    });
}

// service-worker.js

// 安装Service Worker
self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open("my-cache").then(function (cache) {
      return cache.addAll(["/public/index.css", "/public/index.js"]);
    })
  );
});

// 拦截请求并从缓存中返回响应
self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});

// 更新Service Worker
self.addEventListener("activate", function (event) {
  var cacheWhitelist = ["my-cache"];
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
