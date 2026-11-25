/* KalRaf28 – service worker
   Serve per installare l'app (APK/PWA) e per aprirla anche senza rete.
   Regola: prima la rete, così ogni aggiornamento caricato su GitHub arriva subito;
   la copia salvata si usa solo se la rete non c'è.
   Le chiamate a Gemini, Google e Drive non passano mai di qui (altri domini). */
const CACHE = 'kalraf28-v40';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icone/icona-kcal-192.png', './icone/icona-kcal-512.png', './icone/icona-kcal.svg'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;            // Gemini, Google, Drive, font: non toccati
  if (!url.pathname.startsWith(new URL(self.registration.scope).pathname)) return;
  e.respondWith(
    fetch(req).then(res => {
      if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
      return res;
    }).catch(() => caches.match(req).then(r => r || (req.mode === 'navigate' ? caches.match('./index.html') : Response.error())))
  );
});
