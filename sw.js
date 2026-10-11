const CACHE = 'repairlens-v1';
const ASSETS = ['./', './index.html', './styles.css', './app.js', './manifest.webmanifest', './assets/icon.svg', './PROJECT_BLUEPRINT.md', './js/video-analyzer.js', './js/ml-engine.js', './js/safety-gate.js', './js/ar-viewer.js', './js/db-store.js', './js/api-sync.js'];
const MODEL_CACHE = 'ecodisassemble-models-v1';
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS))));
self.addEventListener('activate', event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))));
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  const isModelAsset = url.pathname.endsWith('.onnx') || url.pathname.endsWith('.glb');
  const targetCache = isModelAsset ? MODEL_CACHE : CACHE;
  
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
    const copy = response.clone();
    caches.open(targetCache).then(cache => cache.put(event.request, copy));
    return response;
  }).catch(() => caches.match('./index.html'))));
});
