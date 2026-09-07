import React from 'react';
import Hero from '../components/home/Hero';
import LoreSection from '../components/home/LoreSection';
import MascotSection from '../components/home/MascotSection';
import StatsSection from '../components/home/StatsSection';
import SplitPanelSection from '../components/home/SplitPanelSection';
import ClosingHero from '../components/home/ClosingHero';

// Missing components from the competitor site
import WorldsSection from '../components/home/WorldsSection';
import FeaturedEvents from '../components/home/FeaturedEvents';
import DirectorMessage from '../components/home/DirectorMessage';
import PronitesSection from '../components/home/PronitesSection';
import GalleryMasonry from '../components/home/GalleryMasonry';
import FAQ from '../components/home/FAQ';

export default function HomePage({ setPage, revealHeroTitle }) {
  return (
    <>
      {/* Original Sections */}
      <Hero setPage={setPage} revealTitle={revealHeroTitle} />
      <LoreSection />
      <MascotSection />
      <StatsSection />
      
      {/* Competitor additions integrated */}
      <WorldsSection />
      <FeaturedEvents setPage={setPage} />
      <DirectorMessage />
      
      {/* Continuing original sections */}
      <SplitPanelSection setPage={setPage} />
      
      {/* Final competitor additions */}
      <PronitesSection />
      <GalleryMasonry />
      <FAQ />

      {/* Original Closing */}
      <ClosingHero setPage={setPage} />
    </>
  );
}
