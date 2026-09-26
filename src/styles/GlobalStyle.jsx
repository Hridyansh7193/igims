import React from 'react';

export default function GlobalStyle() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Anton&family=Archivo+Black&family=Space+Grotesk:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&family=Inter:wght@400;500;600&display=swap');
      
      /* ==========================================================================
         CEREBREXIA '26 - CELESTIAL CROWN COLOR PALETTE (Extracted from Brand Logo)
         ========================================================================== */
      :root {
        /* Deep Matte Charcoal Void & Abyss */
        --navy-void: #0A0A0A;
        --navy-deep: #0D0D0D;
        --navy-surface: #141212;
        --navy-card: #181515;
        --indigo-nebula: #241616;
        
        /* Blood Crimson & Ruby Glow (Eyes & Ritual Circle) */
        --cyan: #B3123A;
        --cyan-glow: #E63950;
        --cyan-dark: #6E0A22;
        --azure-deep: #4A0515;
        
        /* Royal Topaz & Starlight Gold (Crowned Diadem & Luminous Eyes) */
        --gold: #B08D57;
        --gold-glow: #D4AF6A;
        --gold-amber: #8C6B3D;
        --gold-dark: #5C4526;
        
        /* Ethereal Starlight, Frost & Highlights */
        --cream: #F7F1E3;
        --paper: #A1A1AA;
        --ink: #0A0A0A;
        --muted: #A1A1AA;
        --muted-blue: #8B8B94;
        
        /* Glowing Hairline Borders & Shadows */
        --hair: rgba(179, 18, 58, 0.22);
        --hair-gold: rgba(176, 141, 87, 0.35);
        --glow-cyan: 0 0 25px rgba(179, 18, 58, 0.4);
        --glow-gold: 0 0 25px rgba(176, 141, 87, 0.45);

        /* Competitor Sub-Theme Variables for New Sections */
        --crx-gold: #fbbf24;
        --crx-red: #dc2626;
        --crx-bg: #0a0a0a;
        --crx-border: rgba(255, 255, 255, 0.1);
        --crx-text-main: #f8fafc;
        --crx-text-muted: #94a3b8;
        --font-serif: 'Playfair Display', serif;
        --font-sans: 'Inter', sans-serif;
      }

      html {
        scroll-behavior: smooth;
        background-color: var(--navy-void);
      }

      body {
        margin: 0;
        padding: 0;
        background-color: var(--navy-void);
        color: var(--paper);
        overflow-x: hidden;
      }

      .crx-root {
        font-family: 'Space Grotesk', sans-serif;
        background: radial-gradient(ellipse at 50% -10%, #141010 0%, #0A0A0A 45%, #0A0A0A 100%);
        color: var(--paper);
        min-height: 100vh;
        position: relative;
        overflow-x: hidden;
      }

      .crx-display {
        font-family: 'Anton', sans-serif;
        letter-spacing: 0.5px;
      }

      .crx-black {
        font-family: 'Archivo Black', sans-serif;
      }

      *:focus-visible {
        outline: 2px solid var(--gold);
        outline-offset: 3px;
      }

      /* Ambient background dust & vignetting — deep wine glow only, no muddy gold mix */
      .crx-dots {
        position: fixed;
        inset: 0;
        z-index: 0;
        pointer-events: none;
        background-image: radial-gradient(rgba(179, 18, 58, 0.14) 1px, transparent 1.5px);
        background-size: 34px 34px;
        opacity: 0.45;
      }

      .crx-vignette {
        position: fixed;
        inset: 0;
        z-index: 0;
        pointer-events: none;
        background: radial-gradient(ellipse at 50% 0%, rgba(185, 28, 28, 0.10), transparent 60%);
      }

      /* Angled Festival Sticker Badges */
      .crx-sticker {
        display: inline-block;
        font-family: 'Space Grotesk', sans-serif;
        font-weight: 600;
        font-size: 11px;
        letter-spacing: 1.5px;
        text-transform: uppercase;
        padding: 7px 14px;
        border-radius: 6px;
        white-space: nowrap;
        background: rgba(212, 175, 85, 0.06);
        border: 1px solid rgba(212, 175, 85, 0.3);
        color: #E5C07B;
        box-shadow: none;
      }

      /* All tones render identically now — one unified design system, no solid fills */
      .crx-sticker.gold,
      .crx-sticker.orange,
      .crx-sticker.cyan {
        background: rgba(212, 175, 85, 0.06);
        border: 1px solid rgba(212, 175, 85, 0.3);
        color: #E5C07B;
        box-shadow: none;
      }

      /* Dedicated subtle badge for stat labels (Edition Live, Total Events, etc.) */
      .crx-stat-badge {
        display: inline-block;
        font-family: 'Space Grotesk', sans-serif;
        font-weight: 600;
        font-size: 0.75rem;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        padding: 6px 12px;
        border-radius: 6px;
        white-space: nowrap;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.12);
        color: #A1A1AA;
      }

      /* Buttons with Cosmic Glows */
      .crx-btn {
        position: relative;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        font-weight: 700;
        font-size: 13px;
        letter-spacing: 0.75px;
        text-transform: uppercase;
        padding: 13px 26px;
        border-radius: 10px;
        border: none;
        cursor: pointer;
        transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;
      }

      .crx-btn:hover {
        transform: translateY(-2px);
        filter: brightness(1.1);
      }

      .crx-btn:active {
        transform: translateY(0);
      }

      .crx-btn.gold {
        background: #DC2626;
        color: #FFFFFF;
        box-shadow: 0 4px 20px rgba(220, 38, 38, 0.35);
      }

      .crx-btn.orange,
      .crx-btn.cyan {
        background: rgba(212, 175, 106, 0.08);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border: 1px solid rgba(212, 175, 106, 0.4);
        color: #F5EDE0;
        box-shadow: 0 4px 16px rgba(0,0,0,0.35);
      }

      .crx-btn.orange:hover,
      .crx-btn.cyan:hover {
        background: rgba(212, 175, 106, 0.16);
        border-color: rgba(212, 175, 106, 0.7);
      }

      /* Continuous Marquee Tickers */
      .crx-marquee {
        overflow: hidden;
        white-space: nowrap;
        position: relative;
        width: 100%;
      }

      .crx-marquee-track {
        display: inline-flex;
        align-items: center;
        animation: crx-scroll 24s linear infinite;
      }

      @keyframes crx-scroll {
        from { transform: translateX(0); }
        to { transform: translateX(-50%); }
      }

      @media (prefers-reduced-motion: reduce) {
        .crx-marquee-track { animation: none; }
      }

      /* Navigation Tabs */
      .crx-navtab {
        transition: background 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
      }

      .crx-navtab:hover {
        color: var(--cyan);
      }

      /* Cosmic Card Hover Effects */
      .crx-card {
        transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease, border-color 0.3s ease;
      }

      .crx-card:hover {
        transform: translateY(-4px);
        border-color: rgba(220, 38, 38, 0.5) !important;
        box-shadow: 0 12px 30px -10px rgba(0, 0, 0, 0.5);
      }

      .crx-idcard {
        transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease;
      }

      .crx-idcard:hover {
        transform: translateY(-5px) rotate(0.6deg);
        box-shadow: 0 20px 35px -10px rgba(179, 18, 58, 0.25);
      }

      .crx-social {
        transition: transform 0.2s ease, color 0.2s ease;
      }

      .crx-social:hover {
        transform: translateY(-3px);
        color: var(--cyan) !important;
      }

      .crx-burger span {
        display: block;
        width: 22px;
        height: 2px;
        background: var(--paper);
        margin: 5px 0;
        transition: transform 0.3s ease, opacity 0.3s ease;
      }

      /* Custom Cyan/Gold Scrollbar */
      .crx-scrollbar::-webkit-scrollbar {
        height: 6px;
      }
      .crx-scrollbar::-webkit-scrollbar-thumb {
        background: linear-gradient(90deg, var(--cyan), var(--gold));
        border-radius: 3px;
      }

      input, textarea {
        font-family: 'Space Grotesk', sans-serif;
      }
      input:focus, textarea:focus {
        border-color: var(--cyan) !important;
        box-shadow: 0 0 0 3px rgba(179, 18, 58, 0.25) !important;
      }

      /* Floating Ambient Keyframe Animations */
      @keyframes crx-float {
        0% { transform: translateY(0px) scale(1); }
        50% { transform: translateY(-20px) scale(1.05); }
        100% { transform: translateY(10px) scale(0.98); }
      }

      @keyframes crx-pulse-glow {
        0% { filter: drop-shadow(0 0 10px rgba(179, 18, 58, 0.4)); }
        50% { filter: drop-shadow(0 0 25px rgba(176, 141, 87, 0.6)); }
        100% { filter: drop-shadow(0 0 10px rgba(179, 18, 58, 0.4)); }
      }

      /* Glitch title reveal — tiny jitter while resolving */
      @keyframes crx-glitch-jitter {
        0%   { transform: translate(0, 0); }
        25%  { transform: translate(-1.5px, 1px); }
        50%  { transform: translate(1.5px, -1px); }
        75%  { transform: translate(-1px, -1px); }
        100% { transform: translate(0, 0); }
      }

      @media (prefers-reduced-motion: reduce) {
        [style*="crx-glitch-jitter"] { animation: none !important; }
      }

      /* ==========================================================================
         MASCOT HALO FX — rotating rays, spinning ring, pulsing light beam
         ========================================================================== */
      @keyframes crx-rays-spin {
        from { transform: translate(-50%, -50%) rotate(0deg); }
        to   { transform: translate(-50%, -50%) rotate(360deg); }
      }

      @keyframes crx-ring-spin {
        from { transform: translate(-50%, -50%) rotate(0deg); }
        to   { transform: translate(-50%, -50%) rotate(-360deg); }
      }

      @keyframes crx-beam-pulse {
        0%, 100% { opacity: 0.35; transform: translateX(-50%) scaleY(0.92); }
        50%      { opacity: 0.9;  transform: translateX(-50%) scaleY(1.05); }
      }

      @keyframes crx-halo-breathe {
        0%, 100% { opacity: 0.55; transform: translate(-50%, -50%) scale(1); }
        50%      { opacity: 1;    transform: translate(-50%, -50%) scale(1.08); }
      }

      .crx-mascot-rays {
        animation: crx-rays-spin 18s linear infinite;
      }

      .crx-mascot-ring {
        animation: crx-ring-spin 26s linear infinite;
      }

      .crx-mascot-beam {
        animation: crx-beam-pulse 3.2s ease-in-out infinite;
      }

      .crx-mascot-halo {
        animation: crx-halo-breathe 3.2s ease-in-out infinite;
      }

      @media (prefers-reduced-motion: reduce) {
        .crx-mascot-rays,
        .crx-mascot-ring,
        .crx-mascot-beam,
        .crx-mascot-halo {
          animation: none !important;
        }
      }
      @keyframes spin {
        from { transform: rotate(0deg); }
        to   { transform: rotate(360deg); }
      }
    `}</style>
  );
}
