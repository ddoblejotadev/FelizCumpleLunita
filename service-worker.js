const CACHE_NAME = 'feliz-cumple-v1';
const urlsToCache = [
  './',
  './index.html',
  './css/style.css',
  './js/app.js',
  './images/heart.png',
  './images/cake.png',
  './images/girasol.png',
  './audio/tu-cancion.mp3',
  './images/foto1.jpg',
  './images/foto2.jpg',
  './images/foto3.jpg',
  './images/foto4.jpg',
  './images/foto5.jpg',
  './images/foto6.jpg',
  './images/foto7.jpg',
  './images/foto8.jpg',
  './images/foto9.jpg',
  './images/foto10.jpg',
  './manifest.json'
].map(url => new URL(url, self.location.href).href);

// Instalar Service Worker con manejo de errores
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(async cache => {
        console.log('Cache abierto');
        
        // Verificar cada recurso individualmente
        for (const url of urlsToCache) {
          try {
            await cache.add(url);
            console.log(`Recurso cacheado: ${url}`);
          } catch (error) {
            console.error(`Error al cachear ${url}:`, error);
          }
        }
      })
      .catch(error => {
        console.error('Error en la instalación:', error);
        return Promise.reject(error);
      })
  );
});

// Activar Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => cacheName !== CACHE_NAME)
          .map(cacheName => caches.delete(cacheName))
      );
    })
  );
});

// Interceptar peticiones
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});