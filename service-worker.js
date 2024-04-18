addEventListener('install', () => {
  self.skipWaiting();
});
addEventListener('activate', () => {
  self.clients.claim();
});

let resolver;

addEventListener('message', event => {
  resolver(new Response(event.data,{status:200}));
});

addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (u.pathname === '/get_input/') {
    e.respondWith(new Promise(r => resolver = r));
  }
});

