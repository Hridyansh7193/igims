import React from 'react';

export default function GlobalStyle() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Anton&family=Archivo+Black&family=Space+Grotesk:wght@400;500;600;700&display=swap');
      
      /* ==========================================================================
         CEREBREXIA '26 - CELESTIAL CROWN COLOR PALETTE (Extracted from Brand Logo)
         ========================================================================== */
      :root {
        /* Deep Cosmic Void & Abyss */
        --navy-void: #050814;
        --navy-deep: #070C20;
        --navy-surface: #0B132E;
        --navy-card: #0F1A3E;
        --indigo-nebula: #172554;
        
        /* Electric Azure & Celestial Cyan (Goddess Hair & Starlight Halo) */
        --cyan: #38BDF8;
        --cyan-glow: #00A3FF;
        --cyan-dark: #0284C7;
        --azure-deep: #1D4ED8;
        
        /* Royal Topaz & Starlight Gold (Crowned Diadem & Luminous Eyes) */
        --gold: #FBBF24;
        --gold-glow: #FDE047;
        --gold-amber: #F59E0B;
        --gold-dark: #D97706;
        
        /* Ethereal Starlight, Frost & Highlights */
        --cream: #F0F8FF;
        --paper: #E0F2FE;
        --ink: #050814;
        --muted: #94A3B8;
        --muted-blue: #64748B;
        
        /* Glowing Hairline Borders & Shadows */
        --hair: rgba(56, 189, 248, 0.22);
        --hair-gold: rgba(251, 191, 36, 0.28);
        --glow-cyan: 0 0 25px rgba(56, 189, 248, 0.35);
        --glow-gold: 0 0 25px rgba(245, 158, 11, 0.35);
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
        background: radial-gradient(ellipse at 50% -10%, #172554 0%, #070C20 45%, #050814 100%);
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

      /* Cosmic background dust & ambient vignetting */
      .crx-dots {
        position: fixed;
        inset: 0;
        z-index: 0;
        pointer-events: none;
        background-image: radial-gradient(rgba(56, 189, 248, 0.18) 1px, transparent 1.5px);
        background-size: 34px 34px;
        opacity: 0.55;
      }

      .crx-vignette {
        position: fixed;
        inset: 0;
        z-index: 0;
        pointer-events: none;
        background: radial-gradient(ellipse at 50% 0%, rgba(56, 189, 248, 0.12), transparent 60%),
                    radial-gradient(ellipse at 100% 100%, rgba(251, 191, 36, 0.09), transparent 60%);
      }

      /* Angled Festival Sticker Badges */
      .crx-sticker {
        display: inline-block;
        font-family: 'Space Grotesk', sans-serif;
        font-weight: 700;
        font-size: 11px;
        letter-spacing: 1.5px;
        text-transform: uppercase;
        padding: 7px 14px;
        border-radius: 6px;
        color: var(--ink);
        box-shadow: 0 4px 14px rgba(0,0,0,0.45);
        white-space: nowrap;
        border: 1px solid rgba(255,255,255,0.25);
      }

      .crx-sticker.gold {
        background: linear-gradient(135deg, var(--gold-glow) 0%, var(--gold) 50%, var(--gold-dark) 100%);
        color: #050814;
        box-shadow: 0 0 15px rgba(245, 158, 11, 0.3), 3px 3px 0 rgba(0,0,0,0.5);
      }

      .crx-sticker.orange,
      .crx-sticker.cyan {
        background: linear-gradient(135deg, var(--cyan) 0%, var(--cyan-dark) 100%);
        color: #FFFFFF;
        box-shadow: 0 0 15px rgba(56, 189, 248, 0.3), 3px 3px 0 rgba(0,0,0,0.5);
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
        background: linear-gradient(135deg, #FDE047 0%, #F59E0B 50%, #D97706 100%);
        color: #050814;
        box-shadow: 0 0 20px rgba(245, 158, 11, 0.4), 0 4px 10px rgba(0,0,0,0.4);
      }

      .crx-btn.orange,
      .crx-btn.cyan {
        background: linear-gradient(135deg, #38BDF8 0%, #0284C7 50%, #1D4ED8 100%);
        color: #FFFFFF;
        box-shadow: 0 0 20px rgba(56, 189, 248, 0.4), 0 4px 10px rgba(0,0,0,0.4);
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
        transform: translateY(-6px) rotate(-0.5deg);
        box-shadow: 0 20px 40px -15px rgba(0, 163, 255, 0.35), 0 0 25px rgba(245, 158, 11, 0.2);
        border-color: rgba(56, 189, 248, 0.5) !important;
      }

      .crx-idcard {
        transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease;
      }

      .crx-idcard:hover {
        transform: translateY(-5px) rotate(0.6deg);
        box-shadow: 0 20px 35px -10px rgba(56, 189, 248, 0.25);
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
        box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.25) !important;
      }

      /* Floating Ambient Keyframe Animations */
      @keyframes crx-float {
        0% { transform: translateY(0px) scale(1); }
        50% { transform: translateY(-20px) scale(1.05); }
        100% { transform: translateY(10px) scale(0.98); }
      }

      @keyframes crx-pulse-glow {
        0% { filter: drop-shadow(0 0 10px rgba(56, 189, 248, 0.4)); }
        50% { filter: drop-shadow(0 0 25px rgba(251, 191, 36, 0.6)); }
        100% { filter: drop-shadow(0 0 10px rgba(56, 189, 248, 0.4)); }
      }
    `}</style>
  );
}
