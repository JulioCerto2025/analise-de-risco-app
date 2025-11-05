
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

// Auto-reload: se ao retornar o foco/visibilidade o app não estiver montado, recarrega.
const AUTO_RELOAD_CHECK_DELAY = 350; // pequeno atraso para evitar checagem antes do paint
let lastReloadTs = 0;

const checkAppMounted = () => {
  const hasChildren = !!rootElement && rootElement.childElementCount > 0;
  if (!hasChildren) {
    const now = Date.now();
    if (now - lastReloadTs > 5000) { // evita loops de recarga
      lastReloadTs = now;
      if (import.meta.env.DEV) {
        console.warn('[AutoReload] App não montado após retorno. Recarregando...');
      }
      window.location.reload();
    }
  }
};

const scheduleMountCheck = () => {
  window.setTimeout(checkAppMounted, AUTO_RELOAD_CHECK_DELAY);
};

// Quando a aba volta a ficar visível, ou a janela ganha foco, ou volta do bfcache
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') scheduleMountCheck();
});
window.addEventListener('focus', scheduleMountCheck);
window.addEventListener('pageshow', scheduleMountCheck);
