export function registerServiceWorker() {
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('[PWA] Service Worker registered with scope:', registration.scope);
        })
        .catch((error) => {
          console.warn('[PWA] Service Worker registration failed:', error);
        });
    });
  } else if ('serviceWorker' in navigator) {
    // In development mode, register as well to support local offline testing
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('[PWA (Dev)] Service Worker registered with scope:', registration.scope);
        })
        .catch((err) => {
          console.log('[PWA] SW dev registration note:', err);
        });
    });
  }
}
