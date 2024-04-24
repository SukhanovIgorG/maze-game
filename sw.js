const staticCacheName = 's-cache-10';
const dynamicCacheName = 'd-cache-10';

const staticFiles = [
  "/index.html",
  "/404.html",
  "/offline.html",
  "/styles/offline.css",
  "/manifest.json",
  "/favicon.ico",
  "/styles/default.css",
  "/styles/index.css",
  
  "/pages/maze/maze.html",
  "/pages/maze/js/animation.js",
  "/pages/maze/js/drawMaze.js",
  "/pages/maze/js/generateMaze.js",
  "/pages/maze/js/listeners.js",
  "/pages/maze/js/settings.js",
  "/pages/maze/js/utils.js",
  "/pages/maze/maze.css",
  "/pages/maze/show.css",
  
  "/pages/life/life.html",
  "/pages/life/life.css",
  "/pages/life/life.js",
  
  "/assets/images/bg_index.jpg",
  "/assets/images/bg_maze.jpg",
  "/assets/images/music.svg",
  "/assets/images/mute.svg",
  "/assets/sounds/step.mp3",
  "/assets/sounds/win.mp3",
  "/assets/sounds/chocolate.mp3",
  "assets/fonts/fonts.css",
  "assets/fonts/8-bit/8bitOperatorPlus-Bold.ttf",
  "assets/fonts/8-bit/8bitOperatorPlus-Regular.ttf",
  "/assets/screenshots/prime_screen.png",
  "/assets/icons/PRIME.png",
  "/assets/icons/16.png",
  "/assets/icons/32.png",
  "/assets/icons/96.png",
  "/assets/icons/144.png",
  "/assets/icons/256.png",
  "/assets/icons/512.png",

  "/sw.js",
];

self.addEventListener('install', async (e) => {
  const cache = await caches.open(staticCacheName);
  await cache.addAll(staticFiles);
});

self.addEventListener('activate', async (e) => {
  const cacheNames = await caches.keys();
  await Promise.all(
    cacheNames
      .filter(name => name !== staticCacheName && name !== dynamicCacheName)
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
};

async function networkFist(request) {
  const cache = await caches.open(dynamicCacheName)
  try {
    const response = await fetch(request);
    await cache.put(request, response.clone());
    return response;
  } catch (error) {
    const cashed = await caches.match(request);
    return cashed ?? await cashed.match('/offline.html');
  }
};