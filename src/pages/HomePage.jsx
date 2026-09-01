import React from 'react';
import Hero from '../components/home/Hero';
import LoreSection from '../components/home/LoreSection';
import MascotSection from '../components/home/MascotSection';
import InfoRow from '../components/home/InfoRow';
import StatsSection from '../components/home/StatsSection';
import SplitPanelSection from '../components/home/SplitPanelSection';
import ClosingHero from '../components/home/ClosingHero';

export default function HomePage({ setPage }) {
  return (
    <>
      <Hero setPage={setPage} />
      <LoreSection />
      <MascotSection />
      <InfoRow />
      <StatsSection />
      <SplitPanelSection setPage={setPage} />
      <ClosingHero setPage={setPage} />
    </>
  );
}
