// 注册 Service Worker
if ('serviceWorker' in navigator) {
    // 安装 Service Worker
    self.addEventListener('install', function (event) {
        event.waitUntil(
            caches.open('demo-cache').then(function (cache) {
                return cache.addAll([
                    '/public/index.css'
                ]);
            })
        );
    });

    // 拦截网络请求并返回缓存数据
    self.addEventListener('fetch', function (event) {
        event.respondWith(
            caches.match(event.request).then(function (response) {
                self.clients.matchAll().then(clients => {
                    clients.forEach(client => {
                        client.postMessage({
                            request: event.request,
                            response
                        })
                    })
                })
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
        );
    });

    // 更新 Service Worker
    self.addEventListener('activate', function (event) {
        event.waitUntil(
            caches.keys().then(function (cacheNames) {
                return Promise.all(
                    cacheNames.filter(function (cacheName) {
                        return cacheName.startsWith('demo-') && cacheName !== 'demo-cache';
                    }).map(function (cacheName) {
                        return caches.delete(cacheName);
                    })
                );
            })
        );
    });
}

