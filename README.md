# Cerebrexia '26 - IGIMS Annual Fest Frontend

A modular, high-performance React + Vite frontend for **Cerebrexia '26**, the annual fest of **Indira Gandhi Institute of Medical Sciences (IGIMS)**.

## Project Structure

```
igims/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx                     # React entry point
    ├── App.jsx                      # Main App wrapper & view router
    │
    ├── constants/                   # Fixed data & configuration
    │   ├── logo.js                  # Logo image (Base64)
    │   ├── eventsData.js            # 70+ events classified into 6 categories
    │   ├── navigation.js            # Nav links & countdown target date
    │   ├── statsData.js             # Statistics & counters data
    │   └── teamData.js              # Crew & committee members
    │
    ├── hooks/                       # Reusable React hooks
    │   ├── useCountdown.js          # Live countdown timer hook
    │   └── useIsNarrow.js           # Responsive viewport hook
    │
    ├── styles/                      # Global theme & typography
    │   └── GlobalStyle.jsx          # Theme variables, fonts, and animations
    │
    ├── components/
    │   ├── common/                  # Shared UI widgets
    │   │   ├── Reveal.jsx           # IntersectionObserver scroll reveal
    │   │   ├── CountUp.jsx          # Animated numerical counters
    │   │   ├── Sticker.jsx          # Angled tag/sticker badges
    │   │   ├── Marquee.jsx          # Infinite scrolling ticker band
    │   │   ├── GhostText.jsx        # Large decorative background typography
    │   │   └── SocialIcons.jsx      # SVG brand icons (Instagram, Facebook, LinkedIn, YouTube)
    │   │
    │   ├── layout/                  # Page shell
    │   │   ├── NavBar.jsx           # Pill navbar with mobile drawer & quick actions
    │   │   └── Footer.jsx           # Multi-column footer with links & social handles
    │   │
    │   └── home/                    # Modular sections for the Home page
    │       ├── Hero.jsx             # "See You in November" banner with live countdown
    │       ├── LoreSection.jsx      # Story & theme lore ("The Crowned Diagnosis")
    │       ├── MascotSection.jsx    # Fest mascot & presiding figure
    │       ├── InfoRow.jsx          # Scrolling categories ticker
    │       ├── StatsSection.jsx     # Animated event & attendee statistics
    │       ├── SplitPanelSection.jsx# Two-world choice cards (Events vs Team)
    │       └── ClosingHero.jsx      # Call-to-action banner
    │
    └── pages/                       # Full page views
        ├── HomePage.jsx             # Main landing experience
        ├── EventsPage.jsx           # Filterable category cards (Academic, Cultural, Sports, etc.)
        ├── TeamPage.jsx             # ID-badge style team cards
        ├── ContactPage.jsx          # Referral desk & contact form
        └── DashboardPage.jsx        # Participant dashboard & QR pass
```

## Running Locally

1. Install dependencies (already completed):
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```
hi