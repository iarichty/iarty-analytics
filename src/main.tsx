import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './context/ThemeContext.tsx'
import { I18nProvider } from './context/I18nContext.tsx'
import { HelmetProvider } from 'react-helmet-async';
import { registerServiceWorker } from './lib/registerServiceWorker.ts';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <I18nProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </I18nProvider>
    </HelmetProvider>
  </StrictMode >,
)

registerServiceWorker();
