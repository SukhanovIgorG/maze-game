'use strict';

importScripts('sw-toolbox.js');
toolbox.precache(["index.html", "/style.css", "/show.css", "manifest.json"]);
toolbox.router.get('/assets/fonts/*', toolbox.cacheFirst);
toolbox.router.get('/assets/images/*', toolbox.cacheFirst);
toolbox.router.get('/assets/sound/*', toolbox.cacheFirst);
toolbox.router.get('/scripts/*', toolbox.cacheFirst);
toolbox.router.get('/*', toolbox.networkFirst, { networkTimeoutSeconds: 5 });
