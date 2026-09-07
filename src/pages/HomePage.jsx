import React from 'react';
import Hero from '../components/home/Hero';
import WorldsSection from '../components/home/WorldsSection';
import FeaturedEvents from '../components/home/FeaturedEvents';
import CommunityStats from '../components/home/CommunityStats';
import AboutSection from '../components/home/AboutSection';
import DirectorMessage from '../components/home/DirectorMessage';
import PronitesSection from '../components/home/PronitesSection';
import GalleryMasonry from '../components/home/GalleryMasonry';
import FAQ from '../components/home/FAQ';

export default function HomePage({ setPage }) {
  return (
    <>
      <Hero setPage={setPage} />
      <WorldsSection />
      <FeaturedEvents setPage={setPage} />
      <CommunityStats />
      <AboutSection />
      <DirectorMessage />
      <PronitesSection />
      <GalleryMasonry />
      <FAQ />
    </>
  );
}
