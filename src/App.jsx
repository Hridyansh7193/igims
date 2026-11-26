import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { Capacitor } from '@capacitor/core';
import GlobalStyle from './styles/GlobalStyle';
import DynamicBackground from './components/common/DynamicBackground';
import IntroAnimation from './components/common/IntroAnimation';
import NavBar from './components/layout/NavBar';
import Footer from './components/layout/Footer';
import { AuthProvider } from './context/AuthContext';

const HomePage = lazy(() => import('./pages/HomePage'));
const EventsPage = lazy(() => import('./pages/EventsPage'));
const PronitesPage = lazy(() => import('./pages/PronitesPage'));
const AccommodationPage = lazy(() => import('./pages/AccommodationPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const PolicyPage = lazy(() => import('./pages/PolicyPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const BookingPortalPage = lazy(() => import('./pages/BookingPortalPage'));
const TitleSponsorModal = lazy(() => import('./components/common/TitleSponsorModal'));

// Lazy-loaded ONLY inside native Android APK so website bundle never loads or exposes scanner UI
const GateScannerPage = lazy(() => import('./pages/GateScannerPage'));

const POLICY_ROUTES = ['terms', 'privacy', 'refunds', 'pricing', 'policies'];
const ALL_ROUTES = [...POLICY_ROUTES, 'home', 'events', 'pronites', 'accommodation', 'about', 'contact', 'dashboard', 'admin', 'booking-portal', 'booking'];

export default function App() {
  const isNativeApp = typeof window !== 'undefined' && Capacitor.isNativePlatform();

  const getInitialPage = () => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const queryPage = urlParams.get('page');
      if (queryPage && ALL_ROUTES.includes(queryPage.toLowerCase())) {
        return queryPage.toLowerCase();
      }
      if (window.location.hash) {
        const h = window.location.hash.replace('#', '').toLowerCase();
        if (ALL_ROUTES.includes(h)) {
          return h;
        }
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
          <Suspense fallback={<div style={{ minHeight: '100vh', background: '#070204' }} />}>
            <GateScannerPage />
          </Suspense>
        </div>
      </AuthProvider>
    );
  }

  const isPolicyPage = POLICY_ROUTES.includes(page);
  const isBypassIntro = isPolicyPage || page === 'admin' || page === 'booking-portal' || page === 'booking';

  return (
    <AuthProvider>
      <div className="crx-root">
        <GlobalStyle />

        {/* Cinematic Intro Animation Overlay (Bypassed if directly viewing legal policy documentation, admin, or booking portal) */}
        {!introComplete && !isBypassIntro && (
          <IntroAnimation
            onComplete={handleIntroComplete}
            onWipeStart={handleWipeStart}
            onOpenPolicy={navigateTo}
          />
        )}

        {/* Title Sponsor Pop-up (Pops up right after starting animation ends and website loads) */}
        {showTitleSponsor && !isBypassIntro && (
          <Suspense fallback={null}>
            <TitleSponsorModal onClose={() => setShowTitleSponsor(false)} />
          </Suspense>
        )}

        {(revealHeroTitle || introComplete || isBypassIntro) && <DynamicBackground />}
        <div className="crx-dots" />
        <div className="crx-vignette" />
        <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '100vw', overflowX: 'hidden' }}>
          <NavBar page={page} setPage={navigateTo} />
          <Suspense fallback={<div style={{ minHeight: '70vh' }} />}>
            {page === 'home' && <HomePage setPage={navigateTo} revealHeroTitle={revealHeroTitle} canLoadMedia={introComplete} />}
            {page === 'events' && <EventsPage setPage={navigateTo} />}
            {page === 'pronites' && <PronitesPage />}
            {page === 'accommodation' && <AccommodationPage />}
            {page === 'about' && <AboutPage />}
            {page === 'contact' && <ContactPage />}
            {page === 'dashboard' && <DashboardPage setPage={navigateTo} />}
            {page === 'admin' && <AdminPage setPage={navigateTo} />}
            {(page === 'booking-portal' || page === 'booking') && <BookingPortalPage setPage={navigateTo} />}
            {isPolicyPage && (
              <PolicyPage initialTab={page === 'policies' ? 'terms' : page} setPage={navigateTo} />
            )}
          </Suspense>
          <Footer setPage={navigateTo} />
        </div>
      </div>
    </AuthProvider>
  );
}
