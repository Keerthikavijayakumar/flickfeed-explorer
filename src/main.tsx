// Build/version stamp to help confirm HMR reloads
console.log('bundle-version: 2025-09-29-01');

import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import App from './App.tsx';
import './index.css';

const root = document.getElementById('root');
console.log('🌲 Root element found:', !!root);

if (root) {
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
  console.log('🎬 App rendered successfully');
} else {
  console.error('❌ Root element not found!');
}
