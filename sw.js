// Service worker: guarda o "casco" do app para abrir rápido e funcionar como app no celular.
// Os dados (Supabase) sempre vêm da rede. Ao publicar nova versão, aumente o número abaixo.
const CACHE = 'telarolli-v3';
const SHELL = ['./', './index.html', './manifest.json', './exercicios.js', './icons/icon-192.png', './icons/icon-512.png', './icons/logo.png', './icons/apple-touch-icon.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return; // Supabase/CDN: direto na rede
  // rede primeiro (pega versão nova), cache como reserva offline
  e.respondWith(fetch(e.request).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return r; }).catch(() => caches.match(e.request)));
});
