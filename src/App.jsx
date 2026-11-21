import React, { useState, useEffect, useCallback } from 'react';
import { Capacitor } from '@capacitor/core';
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
import AboutPage from './pages/AboutPage';
import DashboardPage from './pages/DashboardPage';
import PolicyPage from './pages/PolicyPage';
import GateScannerPage from './pages/GateScannerPage';
import TitleSponsorModal from './components/common/TitleSponsorModal';
import { AuthProvider } from './context/AuthContext';

const POLICY_ROUTES = ['terms', 'privacy', 'refunds', 'pricing', 'policies'];
const ALL_ROUTES = [...POLICY_ROUTES, 'home', 'events', 'pronites', 'accommodation', 'about', 'contact', 'dashboard'];

export default function App() {
  const isNativeApp = typeof window !== 'undefined' && Capacitor.isNativePlatform();

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
  const [showTitleSponsor, setShowTitleSponsor] = useState(false);

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

  const handleIntroComplete = useCallback(() => {
    setIntroComplete(true);
    setShowTitleSponsor(true);
  }, []);

  const handleWipeStart = useCallback(() => {
    setRevealHeroTitle(true);
  }, []);

  // When running inside the dedicated Android Volunteer APK, directly launch the Gate Scanner
  if (isNativeApp) {
    return (
      <AuthProvider>
        <div className="crx-root">
          <GlobalStyle />
          <GateScannerPage />
        </div>
      </AuthProvider>
    );
  }

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

        {/* Title Sponsor Pop-up (Pops up right after starting animation ends and website loads) */}
        {showTitleSponsor && (
          <TitleSponsorModal onClose={() => setShowTitleSponsor(false)} />
        )}

        <DynamicBackground />
        <div className="crx-dots" />
        <div className="crx-vignette" />
        <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '100vw', overflowX: 'hidden' }}>
          <NavBar page={page} setPage={navigateTo} />
          {page === 'home' && <HomePage setPage={navigateTo} revealHeroTitle={revealHeroTitle} />}
          {page === 'events' && <EventsPage setPage={navigateTo} />}
          {page === 'pronites' && <PronitesPage />}
          {page === 'accommodation' && <AccommodationPage />}
          {page === 'about' && <AboutPage />}
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
