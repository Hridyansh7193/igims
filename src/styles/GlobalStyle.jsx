import React from 'react';

export default function GlobalStyle() {
  return (
    <style>{`
      /* ==========================================================================
         CEREBREXIA REDESIGN - GLOBAL SYSTEM
         ========================================================================== */
      :root {
        /* Colors */
        --crx-bg: #0a0a0a;
        --crx-red: #dc2626;
        --crx-red-dark: #991b1b;
        --crx-gold: #fbbf24;
        --crx-gold-dark: #b45309;
        --crx-text-main: #f8fafc;
        --crx-text-muted: #94a3b8;
        --crx-border: rgba(255, 255, 255, 0.1);
        --crx-surface: #171717;
        
        /* Typography */
        --font-serif: 'Playfair Display', serif;
        --font-sans: 'Inter', sans-serif;
      }

      * {
        box-sizing: border-box;
      }

      html {
        scroll-behavior: smooth;
        background-color: var(--crx-bg);
      }

      body {
        margin: 0;
        padding: 0;
        background-color: var(--crx-bg);
        color: var(--crx-text-main);
        font-family: var(--font-sans);
        overflow-x: hidden;
        -webkit-font-smoothing: antialiased;
      }

      h1, h2, h3, h4, h5, h6 {
        font-family: var(--font-serif);
        font-weight: 400;
        margin: 0;
      }

      a {
        text-decoration: none;
        color: inherit;
      }

      .crx-root {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
      }

      /* Buttons */
      .crx-btn-primary {
        background: var(--crx-red);
        color: white;
        font-family: var(--font-sans);
        font-weight: 600;
        font-size: 0.85rem;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        padding: 12px 24px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background 0.3s ease, transform 0.3s ease;
      }

      .crx-btn-primary:hover {
        background: var(--crx-red-dark);
        transform: translateY(-2px);
      }

      .crx-btn-outline {
        background: transparent;
        color: var(--crx-text-main);
        font-family: var(--font-sans);
        font-weight: 600;
        font-size: 0.85rem;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        padding: 12px 24px;
        border: 1px solid var(--crx-border);
        border-radius: 4px;
        cursor: pointer;
        transition: border-color 0.3s ease, transform 0.3s ease;
      }

      .crx-btn-outline:hover {
        border-color: var(--crx-text-main);
        transform: translateY(-2px);
      }

      /* Sections */
      .section-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 80px 20px;
      }

      .section-divider {
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(220, 38, 38, 0.3), transparent);
        margin: 0 auto;
        width: 100%;
        position: relative;
      }
      .section-divider::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) rotate(45deg);
        width: 6px;
        height: 6px;
        background-color: var(--crx-red);
      }

      /* Scrollbar */
      ::-webkit-scrollbar {
        width: 8px;
      }
      ::-webkit-scrollbar-track {
        background: var(--crx-bg);
      }
      ::-webkit-scrollbar-thumb {
        background: var(--crx-surface);
        border-radius: 4px;
      }
      ::-webkit-scrollbar-thumb:hover {
        background: var(--crx-red);
      }
    `}</style>
  );
}
