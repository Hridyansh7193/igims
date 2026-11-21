import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// Always start at the top on page load / refresh
if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[App Crash caught by ErrorBoundary]:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          background: '#0B0409',
          color: '#FBF7F0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
          textAlign: 'center',
          fontFamily: 'system-ui, sans-serif'
        }}>
          <h1 style={{ color: '#E63950', fontSize: 28, marginBottom: 12 }}>Cerebrexia '26</h1>
          <p style={{ color: '#D4AF37', fontSize: 16, marginBottom: 20 }}>Something went wrong loading this view.</p>
          <button
            onClick={() => { window.location.href = '/'; }}
            style={{
              background: '#D4AF37',
              color: '#0B0409',
              border: 'none',
              borderRadius: 8,
              padding: '10px 24px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Reload Website
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
