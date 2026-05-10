
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
const AUTO_RELOAD_CHECK_DELAY = 1500; // Aumentado para dar tempo ao hardware mais lento
let lastReloadTs = 0;

const checkAppMounted = () => {
  const rootElement = document.getElementById('root');
  const hasChildren = !!rootElement && rootElement.childElementCount > 0;
  
  if (!hasChildren) {
    const now = Date.now();
    // Verifica se já passou tempo suficiente desde o carregamento inicial (ex: 5 segundos)
    const timeSincePageLoad = now - (window as any).performance?.timing?.navigationStart || 0;
    
    if (timeSincePageLoad > 5000 && now - lastReloadTs > 10000) { 
      lastReloadTs = now;
      console.warn('[AutoReload] App não montado detectado. Forçando recarregamento...');
      window.location.reload();
    }
  }
};

// Iniciar checagem periódica nos primeiros segundos
setTimeout(checkAppMounted, 3000);
setTimeout(checkAppMounted, 6000);

// Quando a aba volta a ficar visível
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') setTimeout(checkAppMounted, 500);
});
window.addEventListener('focus', () => setTimeout(checkAppMounted, 500));
