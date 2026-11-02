import React, { useState, useEffect, useCallback } from 'react';
import GlobalStyle from './styles/GlobalStyle';
import DynamicBackground from './components/common/DynamicBackground';
import IntroAnimation from './components/common/IntroAnimation';
import NavBar from './components/layout/NavBar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import PronitesPage from './pages/PronitesPage';
import AccommodationPage from './pages/AccommodationPage';
import ContactPage from './pages/ContactPage';
import DashboardPage from './pages/DashboardPage';
import PolicyPage from './pages/PolicyPage';
import { AuthProvider } from './context/AuthContext';

const POLICY_ROUTES = ['terms', 'privacy', 'refunds', 'pricing', 'policies'];
const ALL_ROUTES = [...POLICY_ROUTES, 'home', 'events', 'pronites', 'accommodation', 'contact', 'dashboard'];

export default function App() {
  const getInitialPage = () => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const h = window.location.hash.replace('#', '').toLowerCase();
      if (ALL_ROUTES.includes(h)) {
        return h;
      }
    }
    return 'home';
  };

  const [page, setPage] = useState(getInitialPage);
  const [introComplete, setIntroComplete] = useState(false);
  const [revealHeroTitle, setRevealHeroTitle] = useState(false);

  const navigateTo = useCallback((nextPage) => {
    setPage(nextPage);
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', '#' + nextPage);
    }
  }, []);

  useEffect(() => {
    const handleHash = () => {
      const h = window.location.hash.replace('#', '').toLowerCase();
      if (ALL_ROUTES.includes(h)) {
        setPage(h);
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  useEffect(() => {
    // Scroll on page change
    window.scrollTo(0, 0);
  }, [page]);

  useEffect(() => {
    // Force scroll to top on initial load, bypassing browser's attempt to restore scroll
    window.scrollTo(0, 0);
    const timer = setTimeout(() => window.scrollTo(0, 0), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleIntroComplete = useCallback(() => {
    setIntroComplete(true);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('crx_intro_seen', '1');
    }
  }, []);

  const handleWipeStart = useCallback(() => {
    setRevealHeroTitle(true);
  }, []);

  const isPolicyPage = POLICY_ROUTES.includes(page);

  return (
    <AuthProvider>
      <div className="crx-root">
        <GlobalStyle />

        {/* Cinematic Intro Animation Overlay (Bypassed if directly viewing legal policy documentation) */}
        {!introComplete && !isPolicyPage && (
          <IntroAnimation
            onComplete={handleIntroComplete}
            onWipeStart={handleWipeStart}
            onOpenPolicy={navigateTo}
          />
        )}

        {/* Main site content */}
        <DynamicBackground />
        <div className="crx-dots" />
        <div className="crx-vignette" />
        <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '100vw', overflowX: 'hidden' }}>
          <NavBar page={page} setPage={navigateTo} />
          {page === 'home' && <HomePage setPage={navigateTo} revealHeroTitle={revealHeroTitle} />}
          {page === 'events' && <EventsPage setPage={navigateTo} />}
          {page === 'pronites' && <PronitesPage />}
          {page === 'accommodation' && <AccommodationPage />}
          {page === 'contact' && <ContactPage />}
          {page === 'dashboard' && <DashboardPage setPage={navigateTo} />}
          {isPolicyPage && (
            <PolicyPage initialTab={page === 'policies' ? 'terms' : page} setPage={navigateTo} />
          )}
          <Footer setPage={navigateTo} />
        </div>
      </div>
    </AuthProvider>
  );
}
