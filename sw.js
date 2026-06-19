const CACHE = 'animedle-v1';
const ASSETS = ['/index.html', '/manifest.json'];

// Install — cache หน้าหลัก
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activate — ลบ cache เก่า
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch — ถ้ามี cache ใช้ cache, ถ้าไม่มีใช้เน็ต
self.addEventListener('fetch', e => {
  // Firebase และ external requests ผ่านเน็ตเสมอ
  if(e.request.url.includes('firebasejs') ||
     e.request.url.includes('firestore') ||
     e.request.url.includes('imgur') ||
     e.request.url.includes('myanimelist') ||
     e.request.url.includes('googleapis')){
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
