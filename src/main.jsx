import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// Route visitors on Vercel deployments to the official custom domain
if (
  typeof window !== 'undefined' &&
  window.location.hostname.endsWith('vercel.app')
) {
  window.location.replace(`https://www.cerebrexiaigims.com${window.location.pathname}${window.location.search}${window.location.hash}`);
}

// Always start at the top on page load / refresh
if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
