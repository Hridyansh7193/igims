import React from 'react';
import DirectorMessage from '../components/home/DirectorMessage';
import HostCampusSection from '../components/home/HostCampusSection';

export default function AboutPage() {
  return (
    <div style={{ paddingTop: 100 }}>
      <DirectorMessage />
      <HostCampusSection />
    </div>
  );
}
