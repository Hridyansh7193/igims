import React, { useState, useEffect, useCallback } from 'react';
import GlobalStyle from './styles/GlobalStyle';
import DynamicBackground from './components/common/DynamicBackground';
import IntroAnimation from './components/common/IntroAnimation';
import NavBar from './components/layout/NavBar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import TeamPage from './pages/TeamPage';
import ContactPage from './pages/ContactPage';
import DashboardPage from './pages/DashboardPage';

export default function App() {
  const [page, setPage] = useState('home');
  const [introComplete, setIntroComplete] = useState(false);
  const [revealHeroTitle, setRevealHeroTitle] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  const handleIntroComplete = useCallback(() => {
    setIntroComplete(true);
  }, []);

  const handleWipeStart = useCallback(() => {
    setRevealHeroTitle(true);
  }, []);

  return (
    <div className="crx-root">
      <GlobalStyle />

      {/* Cinematic Intro Animation Overlay */}
      {!introComplete && (
        <IntroAnimation onComplete={handleIntroComplete} onWipeStart={handleWipeStart} />
      )}

      {/* Main site content (renders underneath the intro overlay) */}
      <DynamicBackground />
      <div className="crx-dots" />
      <div className="crx-vignette" />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <NavBar page={page} setPage={setPage} />
        {page === 'home' && <HomePage setPage={setPage} revealHeroTitle={revealHeroTitle} />}
        {page === 'events' && <EventsPage />}
        {page === 'team' && <TeamPage />}
        {page === 'contact' && <ContactPage />}
        {page === 'dashboard' && <DashboardPage />}
        <Footer setPage={setPage} />
      </div>
    </div>
  );
}
