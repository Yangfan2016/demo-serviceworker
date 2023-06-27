let reqs = [];

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
      reqs.push(event.request);
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

self.addEventListener("message", (event) => {
  // 接收来自主线程的消息
  const message = event.data;
  console.log("Service Worker received message:", message);

  console.log(1111, reqs);

  // 向主线程发送消息
  event.source.postMessage("Hello from Service Worker!");
});
