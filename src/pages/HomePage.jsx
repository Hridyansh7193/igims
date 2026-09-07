import React from 'react';
import Hero from '../components/home/Hero';
import LoreSection from '../components/home/LoreSection';
import MascotSection from '../components/home/MascotSection';
import StatsSection from '../components/home/StatsSection';
import SplitPanelSection from '../components/home/SplitPanelSection';
import SponsorsSection from '../components/home/SponsorsSection';
import GallerySection from '../components/home/GallerySection';
import HostCampusSection from '../components/home/HostCampusSection';
import ClosingHero from '../components/home/ClosingHero';

// Missing components from the competitor site
import DirectorMessage from '../components/home/DirectorMessage';
import FAQ from '../components/home/FAQ';

export default function HomePage({ setPage, revealHeroTitle }) {
  return (
    <>
      {/* Original Sections */}
      <Hero setPage={setPage} revealTitle={revealHeroTitle} />
      <LoreSection />
      <MascotSection />
      <StatsSection />
      
      {/* Continuing original sections */}
      <SplitPanelSection setPage={setPage} />
      <SponsorsSection />
      <GallerySection />
      <HostCampusSection />

      {/* Competitor additions integrated */}
      <DirectorMessage />
      
      {/* Final competitor additions */}
      <FAQ />

      {/* Original Closing */}
      <ClosingHero setPage={setPage} />
    </>
  );
}
