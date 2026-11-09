import React from 'react';

export default function GlobalStyle() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Anton&family=Space+Grotesk:wght@400;500;600&display=swap');
      
      /* ==========================================================================
         CEREBREXIA '26 - REFINED DESIGN SYSTEM (UNSLOP)
         Warm Neutral Ramp · Festival Crimson Accent · Warm Amber Meta
         ========================================================================== */
      :root {
        /* Deep Neutral Ramp (Warm Charcoal / Maroon tint) */
        --crx-bg-deep: #080506;
        --crx-bg: #0C080A;
        --crx-surface: #140E11;
        --crx-card: #1A1216;
        --crx-raised: #241A20;

        /* Hairlines (8% - 12% text opacity) */
        --crx-hairline: rgba(239, 233, 222, 0.08);
        --crx-hairline-accent: rgba(212, 175, 106, 0.22);
        --crx-hairline-crimson: rgba(192, 57, 43, 0.28);

        /* Accents */
        --crx-accent: #C0392B;
        --crx-accent-hover: #D44434;
        --crx-gold: #D4AF6A;
        --crx-gold-muted: #9E824C;

        /* Text Roles (Warm Ramp) */
        --crx-text-primary: #F7EDE2;
        --crx-text-secondary: #AAA398;
        --crx-text-muted: #8A847A;

        /* Legacy alias mappings for backward compatibility */
        --navy-void: var(--crx-bg-deep);
        --navy-deep: var(--crx-bg);
        --navy-surface: var(--crx-surface);
        --navy-card: var(--crx-card);
        --indigo-nebula: var(--crx-raised);
        --cyan: var(--crx-accent);
        --cyan-glow: var(--crx-accent);
        --cyan-dark: #7B1A14;
        --azure-deep: var(--crx-surface);
        --crx-red: var(--crx-accent);
        --crx-red-bright: #D44434;
        --gold: var(--crx-gold);
        --gold-glow: var(--crx-gold);
        --cream: var(--crx-text-primary);
        --paper: var(--crx-text-secondary);
        --ink: var(--crx-bg-deep);
        --muted: var(--crx-text-muted);
        --hair: var(--crx-hairline);
        --hair-gold: var(--crx-hairline-accent);
        --crx-border: var(--crx-hairline);
        --crx-text-main: var(--crx-text-primary);
        --font-sans: 'Space Grotesk', sans-serif;
      }

      *, *::before, *::after {
        box-sizing: border-box;
      }

      html {
        scroll-behavior: smooth;
        background-color: var(--navy-void);
        width: 100%;
        max-width: 100vw;
        overflow-x: hidden;
        overflow-x: clip;
      }

      body {
        margin: 0;
        padding: 0;
        width: 100%;
        max-width: 100vw;
        background-color: var(--navy-void);
        color: var(--paper);
        overflow-x: hidden;
        overflow-x: clip;
        position: relative;
      }

      #root {
        width: 100%;
        max-width: 100vw;
        overflow-x: hidden;
        overflow-x: clip;
        position: relative;
      }

      .crx-root {
        font-family: 'Space Grotesk', sans-serif;
        background: radial-gradient(ellipse at 50% -10%, #1C0810 0%, #080406 45%, #080406 100%);
        color: var(--paper);
        min-height: 100vh;
        width: 100%;
        max-width: 100vw;
        position: relative;
        overflow-x: hidden;
        overflow-x: clip;
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

      /* Ambient background dust & vignetting — vermillion + magenta atmospheric glow */
      .crx-dots {
        position: fixed;
        inset: 0;
        z-index: 0;
        pointer-events: none;
        background-image: radial-gradient(rgba(192, 57, 43, 0.13) 1px, transparent 1.5px);
        background-size: 34px 34px;
        opacity: 0.5;
      }

      .crx-vignette {
        position: fixed;
        inset: 0;
        z-index: 0;
        pointer-events: none;
        background: radial-gradient(ellipse at 50% 0%, rgba(192, 24, 90, 0.09), transparent 60%);
      }

      /* Quiet Festival Accreditation Tags */
      .crx-sticker {
        display: inline-block;
        font-family: 'Space Grotesk', sans-serif;
        font-weight: 500;
        font-size: 11px;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        padding: 5px 12px;
        border-radius: 6px;
        white-space: nowrap;
        background: rgba(212, 175, 106, 0.08);
        border: 1px solid rgba(212, 175, 106, 0.24);
        color: #E5C07B;
        box-shadow: none;
        max-width: 100%;
      }

      /* Unified tag variants */
      .crx-sticker.gold,
      .crx-sticker.orange,
      .crx-sticker.cyan {
        background: rgba(212, 175, 106, 0.08);
        border: 1px solid rgba(212, 175, 106, 0.24);
        color: #E5C07B;
        box-shadow: none;
      }

      /* Dedicated subtle badge for stat labels (Edition Live, Total Events, etc.) */
      .crx-stat-badge {
        display: inline-block;
        font-family: 'Space Grotesk', sans-serif;
        font-weight: 500;
        font-size: 11px;
        letter-spacing: 0.03em;
        text-transform: uppercase;
        padding: 4px 10px;
        border-radius: 6px;
        white-space: nowrap;
        background: rgba(239, 233, 222, 0.04);
        border: 1px solid rgba(239, 233, 222, 0.08);
        color: var(--crx-text-secondary);
      }

      /* Refined Action Buttons (Nested 8-10px radius, solid depth, no neon glows) */
      .crx-btn {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        font-family: 'Space Grotesk', sans-serif;
        font-weight: 600;
        font-size: 13px;
        letter-spacing: 0.03em;
        text-transform: uppercase;
        padding: 12px 24px;
        border-radius: 8px;
        border: none;
        cursor: pointer;
        transition: background-color 160ms cubic-bezier(0.22, 1, 0.36, 1),
                    border-color 160ms cubic-bezier(0.22, 1, 0.36, 1),
                    transform 160ms cubic-bezier(0.22, 1, 0.36, 1),
                    box-shadow 160ms cubic-bezier(0.22, 1, 0.36, 1);
      }

      .crx-btn:hover {
        transform: translateY(-1px);
      }

      .crx-btn:active {
        transform: translateY(0) scale(0.98);
      }

      /* Primary Button: Solid festival crimson with subtle top highlight */
      .crx-btn.gold {
        background: var(--crx-accent);
        color: #FFFFFF;
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.18), 0 2px 6px rgba(0, 0, 0, 0.35);
      }

      .crx-btn.gold:hover {
        background: var(--crx-accent-hover);
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.22), 0 4px 12px rgba(0, 0, 0, 0.45);
      }

      /* Secondary Button: Raised surface with hairline border */
      .crx-btn.orange,
      .crx-btn.cyan {
        background: var(--crx-surface);
        border: 1px solid var(--crx-hairline-accent);
        color: var(--crx-text-primary);
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05), 0 2px 6px rgba(0, 0, 0, 0.25);
      }

      .crx-btn.orange:hover,
      .crx-btn.cyan:hover {
        background: var(--crx-raised);
        border-color: rgba(212, 175, 106, 0.4);
        color: #FFFFFF;
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

      /* Quiet Card Surface & Hover (Standard Unslop Tokens) */
      .crx-card {
        transition: transform 160ms cubic-bezier(0.22, 1, 0.36, 1),
                    border-color 160ms cubic-bezier(0.22, 1, 0.36, 1),
                    box-shadow 160ms cubic-bezier(0.22, 1, 0.36, 1);
      }

      .crx-card:hover {
        transform: translateY(-2px);
        border-color: rgba(212, 175, 106, 0.28) !important;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
      }

      .crx-idcard {
        transition: transform 160ms cubic-bezier(0.22, 1, 0.36, 1),
                    box-shadow 160ms cubic-bezier(0.22, 1, 0.36, 1);
      }

      .crx-idcard:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 28px rgba(0, 0, 0, 0.5);
      }

      .crx-social {
        transition: color 160ms cubic-bezier(0.22, 1, 0.36, 1);
      }

      .crx-social:hover {
        color: var(--crx-accent) !important;
      }

      .crx-burger span {
        display: block;
        width: 20px;
        height: 2px;
        background: var(--paper);
        margin: 4px 0;
        transition: transform 160ms ease, opacity 160ms ease;
      }

      /* Clean Neutral Scrollbar */
      .crx-scrollbar::-webkit-scrollbar {
        height: 6px;
        width: 6px;
      }
      .crx-scrollbar::-webkit-scrollbar-thumb {
        background: #241A20;
        border-radius: 3px;
      }
      .crx-scrollbar::-webkit-scrollbar-thumb:hover {
        background: #34262E;
      }

      input, textarea {
        font-family: 'Space Grotesk', sans-serif;
      }
      input:focus, textarea:focus {
        border-color: var(--crx-gold) !important;
        outline: none;
        box-shadow: 0 0 0 2px rgba(212, 175, 106, 0.25) !important;
      }

      /* Single purposeful fade-in entrance */
      @keyframes crx-fade-up {
        from {
          opacity: 0;
          transform: translateY(8px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      @keyframes spin {
        from { transform: rotate(0deg); }
        to   { transform: rotate(360deg); }
      }

      /* ====================================================================
         NAVBAR GLASSMORPHISM & SCROLL BEHAVIOR
         ==================================================================== */
      header.crx-nav-header {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 50;
        padding: 20px 32px;
        transition: background 0.3s ease, backdrop-filter 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease, padding 0.3s ease;
      }

      header.crx-nav-header.scrolled {
        background: rgba(10, 5, 5, 0.92);
        backdrop-filter: blur(18px);
        -webkit-backdrop-filter: blur(18px);
        border-bottom: 1px solid rgba(179, 18, 58, 0.22);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.7);
        padding: 14px 32px;
      }

      .crx-mobile-break {
        display: none;
      }

      /* ====================================================================
         MOBILE RESPONSIVENESS
         ==================================================================== */

      /* Prevent horizontal scroll everywhere */
      html, body, #root, .crx-root {
        overflow-x: hidden !important;
        overflow-x: clip !important;
        width: 100% !important;
        max-width: 100vw !important;
      }

      /* Ensure touch targets and mobile spacing */
      @media (max-width: 768px) {
        .crx-mobile-break {
          display: inline;
        }

        header.crx-nav-header {
          padding: 10px 16px !important;
          background: rgba(10, 5, 5, 0.88);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border-bottom: 1px solid rgba(179, 18, 58, 0.2);
        }

        header.crx-nav-header.scrolled {
          padding: 10px 16px !important;
          background: rgba(10, 5, 5, 0.97);
          border-bottom: 1px solid rgba(179, 18, 58, 0.35);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.85);
        }

        .crx-logo-badge {
          width: 42px !important;
          height: 42px !important;
          border-radius: 12px !important;
        }

        .crx-hamburger-btn {
          width: 42px !important;
          height: 42px !important;
          border-radius: 12px !important;
        }

        .crx-director-grid {
          grid-template-columns: 1fr !important;
          gap: 28px !important;
          text-align: center;
        }

        .crx-btn {
          padding: 14px 20px;
          font-size: 12px;
          min-height: 44px;
        }

        .crx-sticker {
          font-size: 10px !important;
          padding: 6px 12px !important;
          white-space: normal !important;
          text-align: center !important;
          word-break: normal !important;
          max-width: 90vw !important;
          line-height: 1.35 !important;
        }

        .crx-stat-badge {
          font-size: 0.65rem;
          padding: 5px 10px;
        }
      }

      /* Small phones (under 400px) */
      @media (max-width: 400px) {
        .crx-btn {
          padding: 12px 16px;
          font-size: 11px;
          letter-spacing: 0.4px;
        }

        .crx-sticker {
          font-size: 9px !important;
          letter-spacing: 0.6px !important;
          padding: 5px 10px !important;
        }
      }
    `}</style>
  );
}
