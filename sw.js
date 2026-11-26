/* KalRaf28 – service worker
   Serve per installare l'app (APK/PWA) e per aprirla anche senza rete.
   Regola: prima la rete (senza la cache HTTP del browser), così ogni aggiornamento caricato su GitHub arriva subito.
   Se però GitHub non risponde entro 0,8 secondi e c'è una copia salvata, si apre subito quella (niente schermo bianco):
   la rete intanto finisce di scaricare e aggiorna la copia, così alla prossima apertura c'è la versione nuova.
   Senza rete si usa sempre la copia salvata.
   Le chiamate a Gemini, Google e Drive non passano mai di qui (altri domini). */
const CACHE = 'kalraf28-v45';
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
  const net = fetch(req.url, { cache: 'no-cache', credentials: 'same-origin' }).then(res => {
    if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
    return res;
  });
  const saved = () => caches.match(req).then(r => r || (req.mode === 'navigate' ? caches.match('./index.html') : undefined));
  e.waitUntil(net.catch(() => {}));                           // lascia finire il download per aggiornare la copia
  e.respondWith(new Promise(resolve => {
    let done = false;
    const give = r => { if (!done && r) { done = true; resolve(r); } };
    const timer = setTimeout(() => saved().then(give), 800); // rete lenta: apri con la copia salvata
    net.then(r => { clearTimeout(timer); give(r); })
       .catch(() => { clearTimeout(timer); saved().then(r => { give(r); if (!done) { done = true; resolve(Response.error()); } }); });
  }));
});
