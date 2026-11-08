import React from 'react';
import Hero from '../components/home/Hero';
import LoreSection from '../components/home/LoreSection';
import MascotSection from '../components/home/MascotSection';
import StatsSection from '../components/home/StatsSection';
import SplitPanelSection from '../components/home/SplitPanelSection';
import GallerySection from '../components/home/GallerySection';
import RegistrationOptionsSection from '../components/home/RegistrationOptionsSection';
import FAQ from '../components/home/FAQ';
import ClosingHero from '../components/home/ClosingHero';

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
      <GallerySection />

      {/* Registration Options: Placed right before QnA / FAQ */}
      <RegistrationOptionsSection setPage={setPage} />

      {/* QnA / FAQ */}
      <FAQ />

      {/* Original Closing */}
      <ClosingHero setPage={setPage} />
    </>
  );
}
