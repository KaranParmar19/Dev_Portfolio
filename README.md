<div align="center">

# `KARAN PARMAR`
### Software Engineer · Full-Stack Systems · Applied AI

<p align="center">
  <a href="https://karanporfolio.vercel.app/" target="_blank">
    <img src="https://img.shields.io/badge/LIVE_SITE-karanporfolio.vercel.app-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Preview" />
  </a>
  <img src="https://img.shields.io/badge/NEXT.JS_16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/REACT_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/TYPESCRIPT_5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/TAILWIND_v4-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/THREE.JS-000000?style=for-the-badge&logo=threedotjs&logoColor=white" alt="Three.js" />
</p>

> **Tactile, kinetic, and engineering-driven.** A personal portfolio engineered at the intersection of neo-brutalist scrapbook aesthetics, custom WebGL GLSL shaders, 60fps physics-driven interactions, and strict type safety.

[Explore Live Portfolio](https://karanporfolio.vercel.app/) · [GitHub Profile](https://github.com/KaranParmar19) · [LeetCode Profile](https://leetcode.com/u/Karan_Parmar) · [LinkedIn](https://www.linkedin.com/in/karan-parmar-280991274/)

</div>

---

## ✦ System Architecture & Tech Stack

```
   ┌────────────────────────────────────────────────────────────────────────┐
   │                       NEXT.JS 16 APP ROUTER                            │
   │      React 19 Server Components  ·  Edge Handlers  ·  Dynamic SSR      │
   └───────────────────────────────────┬────────────────────────────────────┘
                                       │
        ┌──────────────────────────────┼──────────────────────────────┐
        ▼                              ▼                              ▼
  MOTION & SHADERS               FLUID ENGINE                    TELEMETRY
  Three.js GLSL Ribbon        Framer NextSmoothScroll       Edge Geo Telemetry
  GSAP ScrollTrigger          Lenis Easing Curves           Discord Webhook Ping
  Framer Motion Springs       MutationObserver Lock         Bot & Crawler Filter
```

| Layer | Technologies & Implementations | Purpose |
| :--- | :--- | :--- |
| **Framework** | Next.js 16 (Turbopack, App Router), React 19, TypeScript 5 (Strict) | Zero-overhead hydration, type-safe API boundaries, sub-second HMR |
| **Styling** | Tailwind CSS v4, CSS Custom Properties, Canvas Layouts | Modern utility tokens, arbitrary variants, and typography variables |
| **WebGL & 3D** | Three.js, Custom GLSL Vertex/Fragment Shaders | Real-time curved 3D project ribbon with chromatic aberration and speed flare |
| **Motion Physics** | GSAP 3, ScrollTrigger, Framer Motion, Lenis Scroll | Scroll-velocity spring deformation, synchronized ticker raf, and kinetic reveals |
| **Typography** | Neulis Neue, Futura Bold, Syne, Space Grotesk, Caveat, Excalifont | Custom hand-paired font hierarchy balancing editorial craft and brutalist weight |
| **Telemetry** | Next.js Edge Routes, Vercel/Cloudflare Headers, Discord Webhooks | Cookieless visitor analytics reporting device, country, and referrer in real-time |

---

## ✦ Featured Engineering Projects

### 01. DevLens AI
**Intelligent Codebase Graph & Retrieval Copilot**
*FastAPI · LangChain · RAG · Celery · Redis · PostgreSQL · WebSockets · Python · TypeScript*
- Parses repositories into Abstract Syntax Tree (AST) dependency graphs across multiple languages.
- Executes vector search grounded in line-level code citations and dynamic AST symbol resolution.
- Features an alternating white-and-black panoramic preview showcasing dependency graphs, interactive code lenses, and onboarding roadmaps.

### 02. Lantern APM
**Application Performance Monitoring & Distributed Tracing Engine**
*Node.js · InfluxDB · Socket.IO · BullMQ · Redis · Express.js · TypeScript*
- High-throughput telemetry pipeline tracking latency percentiles (p50, p95, p99), error rates, and memory saturation.
- Real-time event streaming and alert dispatching powered by Redis pub/sub and BullMQ job queues.
- Time-series metric visualizations and distributed trace span waterfall graphs.

### 03. Voxa Workspace
**Collaborative Visual Canvas & Low-Latency Communication**
*Next.js · WebSockets · WebRTC · HTML5 Canvas · Tailwind CSS · TypeScript*
- Multi-user infinite whiteboard with sub-50ms peer-to-peer cursor synchronization and shape broadcasting.
- Integrated mesh WebRTC audio channels with client-side audio level detection.

---

## ✦ Interactive Systems & Craft Highlights

- **CurveFlow 3D Carousel**: Custom WebGL ribbon driven by GLSL shaders that projects project galleries along an interactive 3D curve with inertia dragging and chromatic edge fringing.
- **NextSmoothScroll Engine**: Implementation of the Framer `NextSmoothScroll` architecture powered by Lenis. Features four custom easing curves, automatic DOM mutation scroll-lock observers (pausing smoothing during overlays and dialogs), and delegated `#hash` link gliding.
- **Elastic Boundary Morphing**: SVG cubic bézier curves positioned between page sections that physically stretch and oscillate based on live scroll velocity using spring dynamics.
- **Kinetic Page Transitions**: Dual-stage paper-tear and curtain loading transitions during section navigation with automatic fallbacks for users preferring reduced motion.
- **Smart Footer Blur Auto-Hide**: Progressive backdrop-filtered scroll blur that automatically fades to zero opacity as soon as the editorial footer enters the viewport, keeping copyright and status metadata crisp.
- **Live LeetCode Sync**: Dedicated dynamic API endpoint (`/api/leetcode`) querying contribution graphs, problem-solving counts, and historical submission heatmaps.
- **Invisible Visitor Telemetry**: Edge-computed visitor tracker logging referrer source, device type, screen dimensions, and approximate geolocation directly to a private Discord channel with zero user-facing cookies or popups.

---

## ✦ Directory Structure

```
├── app/
│   ├── api/
│   │   ├── leetcode/          # Dynamic LeetCode stats fetcher and cache layer
│   │   └── visit/             # Edge visitor tracker and Discord webhook dispatcher
│   ├── components/
│   │   ├── CurveFlowCarousel  # WebGL 3D ribbon carousel with custom GLSL shaders
│   │   ├── NextSmoothScroll   # Framer smooth-scroll engine with easing curves
│   │   ├── SectionMorph       # Velocity-responsive SVG section boundary morphing
│   │   ├── ProjectCard        # Stacked desktop and mobile project presentations
│   │   ├── BottomScrollBlur   # Smart progressive blur with footer detection
│   │   └── VisitorTracker     # Cookieless client telemetry emitter
│   ├── fonts/                 # Custom local fonts (Neulis, Futura, Excalifont)
│   ├── globals.css            # Tailwind v4 theme tokens and core canvas styles
│   └── layout.tsx             # Root layout with fonts, LenisProvider, and metadata
├── lenis/
│   └── LenisScroll.tsx        # Context provider connecting Lenis to GSAP ScrollTrigger
├── public/
│   ├── data/                  # Strongly-typed project and navigation datasets
│   └── projectImg/            # High-resolution screenshots and optimized graphics
└── sections/                  # Discrete portfolio sections (Hero, Projects, About, Skills, Journey)
```

---

## ✦ Local Development

### 1. Clone the repository
```bash
git clone https://github.com/KaranParmar19/Dev_Portfolio.git
cd Dev_Portfolio
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables (optional)
Create a `.env.local` file in the root directory:
```env
# Optional: Discord webhook URL for invisible visitor notifications
DISCORD_WEBHOOK_URL="https://discord.com/api/webhooks/your_webhook_id/your_webhook_token"
```

### 4. Run development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production build
```bash
npm run build
npm run start
```

---

## ✦ Connect

- **Live Portfolio**: [karanporfolio.vercel.app](https://karanporfolio.vercel.app/)
- **LeetCode**: [@Karan_Parmar](https://leetcode.com/u/Karan_Parmar)
- **LinkedIn**: [Karan Parmar](https://www.linkedin.com/in/karan-parmar-280991274/)
- **GitHub**: [@KaranParmar19](https://github.com/KaranParmar19)

---

<div align="center">
  <sub>Engineered and crafted by <strong>Karan Parmar</strong> · © 2026</sub>
</div>
