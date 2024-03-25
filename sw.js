const staticCacheName = 's-cache-1';
const dynamicCacheName = 'd-cache-1';

const staticFiles = [
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/js/*',
  '/styles/*',
  '/assets/fonts/*',
  '/assets/icons/*',
  '/assets/images/*',
  '/assets/sounds/*',
  '/assets/screenshots/*',
];

self.addEventListener('install', async (e) => {
  const cache = await caches.open(staticCacheName);
  // await cache.addAll(staticFiles); // TODO: не работает, а хотелось бы

  await cache.add('/index.html');
  await cache.add('/offline.html');
  await cache.add('/manifest.json');
  await cache.add('/js/animation.js');
  await cache.add('/js/drawMaze.js');
  await cache.add('/js/generateMaze.js');
  await cache.add('/js/listeners.js');
  await cache.add('/js/settings.js');
  await cache.add('/js/utils.js');
  await cache.add('/styles/show.css');
  await cache.add('/styles/style.css');
  await cache.add('/assets/images/background.jpg');
  await cache.add('/assets/sounds/step.mp3');
  await cache.add('/assets/sounds/win.mp3');
});

self.addEventListener('activate', async (e) => {
  const cacheNames = await caches.keys();
  await Promise.all(
    cacheNames
      .filter(name => name !== staticCacheName)
      .map(name => caches.delete(name))
  )
}); // чистим старый кэш

self.addEventListener('fetch', (e) => {
  const { request } = e;
  const url = new URL(request.url)
  if (url.origin === location.origin) {
    e.respondWith(cacheFist(request));
  } else {
    e.respondWith(networkFist(request));
  }
});

async function cacheFist(request) {
  const cashed = await caches.match(request);
  return cashed ?? await fetch(request);
}

async function networkFist(request) {
  const cache = await caches.open(dynamicCacheName)
  try {
    const response = await fetch(request);
    await cache.put(request, response.clone());
    return response;
  } catch (error) {
    const cashed = await caches.match(request);
    console.log('network off line');
    return cashed ?? await cashed.match('/offline.html')
  }
}