<div align="center">

# 🦄 Aunicorn (`aunicorn-app`)
### *Your magic companion — gentle, neuro-affirming daily rhythm.*
<img width="256" height="186" alt="Aunicorn logo app" src="https://github.com/user-attachments/assets/bffa0744-3d24-4c8a-9acb-a74b4c11951f" 
  />


[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)
[![Accessibility: AAA](https://img.shields.io/badge/Accessibility-WCAG%20AAA-success?style=flat-square)](https://www.w3.org/WAI/standards-guidelines/wcag/)
[![Privacy: Local--First](https://img.shields.io/badge/Privacy-100%25%20On--Device-blueviolet?style=flat-square)](#-sovereign-local-first-privacy)
[![Platform](https://img.shields.io/badge/Platform-iOS%20%7C%20Android%20%7C%20Web-5E6AD2?style=flat-square)](#-tech-stack--architecture)
[![Design System](https://img.shields.io/badge/Design%20System-Aunicorn%20Safe%20Foundation-00C2FF?style=flat-square)](#-design-system--sensory-ux)

<p align="center">
  <b>Purpose-built for Autistic, ADHD, LGBTQ+, women, and non-binary adults navigating fluctuating spoon levels, sensory overload, and chronic conditions like POTS & dysautonomia.</b>
</p>

[Key Features](#-key-features) • [Design Philosophy](#-core-pillars--low-demand-philosophy) • [Architecture](#-tech-stack--architecture) • [Getting Started](#-quick-start) • [Contributing](#-contributing)

---

</div>

## 🌌 Why Aunicorn?

Mainstream productivity and habit trackers are engineered around **neurotypical urgency**:
- 🚨 Blinking red overdue badges and guilt-inducing alarms.
- 📉 "Streak broken!" shame mechanics that trigger avoidance and burnout.
- 🤯 Dense, cluttered, infinite-scrolling vertical lists.
- 🕵️ Intrusive health telemetry and third-party data tracking.

**Aunicorn strips away artificial friction, executive paralysis, and sensory hyper-stimulation.** It provides a quiet, tactile, and non-judgmental digital sanctuary that adapts to your brain—never against it.

---

## ✨ Key Features

### 🧩 Tactile Mosaic (Bento Grid) Architecture
Rather than endless, anxiety-inducing vertical feeds, all activities are partitioned into discrete, tactile mosaic cards. Each card acts as an intentional, one-tap portal into a focused, single-track workspace with persistent top back navigation (`← Back`).

### 🪄 AI Task Deconstruction ("Split with AI")
- Paralyzed by a vague, daunting task like *"Clean the kitchen"* or *"File taxes"*?
- The built-in gentle AI deconstructs monolithic chores into **3 to 5 bite-sized micro-steps** (2–5 minutes each).
- Low cognitive overhead: pick one tiny step, rest, or pause whenever you need.

### 🥄 Dynamic Spoon Engine
- Filter and surface tasks according to your real-time daily spoon capacity:
  - 🟢 **Low Energy (1 Spoon):** Hydrate, take meds, passive rest.
  - 🟡 **Moderate Energy (2–3 Spoons):** Quick 10-minute chores, admin emails.
  - 🟣 **High Energy (4–5 Spoons):** Deep focus, multi-step creative projects.
- Switch energy tiers instantly without overdue flags or negative scoring.

### 🫀 POTS & Orthostatic Health Deck
- Dedicated tracking for dysautonomia, POTS (Postural Orthostatic Tachycardia Syndrome), and chronic illness.
- Quick logging for **Resting Heart Rate**, **Standing HR Shift (+bpm)**, sodium/electrolyte targets, and fluid intake.
- One-click exportable clinical visit summaries for healthcare providers.

### 🌙 Hormonal & Sensory Shift Forecast
- Tracks cycle phases (e.g. Luteal phase) and correlates them with **sensory sensitivity thresholds**.
- Delivers proactive, gentle environmental accommodations before overwhelm sets in (soft lighting cues, noise buffer recommendations, low-demand calendar buffers).

### 🥣 Sensory-Safe Food Library & Safe-Meal AI
- Catalog texture-approved comfort staples tagged by sensory profile (*"No Crunch"*, *"Warm & Soft"*, *"Smooth"*).
- **Pantry Safe-Meal Builder:** When energy is at 10%, enter what's in your cupboard to get simple, sensory-safe 3-step meal suggestions.

### 🎧 Sensory Sanctuary & Focus Audio
- Integrated calming audio generators: calibrated **Brown Noise**, **Pink Noise**, and gentle somatic breathing pacers for unmasking and sensory resets.

---

## 🛡️ Core Pillars & Low-Demand Philosophy

| Pillar | How Aunicorn Implements It |
| :--- | :--- |
| **Zero Guilt** | No broken streak counters, no overdue red badges, no penalty for resting. Pausing or deferring tasks is treated as a healthy boundary. |
| **Cognitive Accessibility** | Strict WCAG 2.1 AAA contrast ratios (>7:1). Atkinson Hyperlegible Next typeface disambiguates `I`, `1`, `l`, `0`, and `O` to reduce reading fatigue. |
| **Sensory Ergonomics** | Deep OLED-absorptive dark mode (`#101014`), low-glare card surfaces (`#1B1B25`), no strobing or sudden layout shifts, and full `prefers-reduced-motion` compliance. |
| **Tactile Simplicity** | Generous 48px+ touch targets and 2px high-visibility focus halos for low motor strain and accessible navigation. |
| **Sovereign Privacy** | 100% on-device local storage by default. Zero third-party ad brokers, zero telemetry on cycle or medical metrics. |

---

## 🎨 Design System & Sensory UX

The app is built upon the **Aunicorn Safe Foundation** design system tokens:

```
Canvas Base:        #101014 (Deep Glare-Absorptive Charcoal)
Container Low:      #1B1B25 (Restful Card Layer)
Surface Elevated:   #1F1F2E (Tactile Interactive Field)
Primary Accent:     #5E6AD2 (Linear Soft Violet)
Secondary Flow:     #00C2FF (Cosmic Cyan)
Success Accent:     #3DD68C (Gentle Emerald)
Attention Accent:   #F0C000 (Soft Amber)
Boundary Alert:     #EB5757 (Soft Coral)
Typography:         Atkinson Hyperlegible Next (Dyslexia & Astigmatism friendly)
Touch Target Base:  ≥ 48px × 48px
```

---

## 🔒 Sovereign Local-First Privacy

Your mental health, menstrual cycle, medications, and physical vitals belong to you alone.
- **Local-First Database:** Encrypted local sandbox storage (SQLite / IndexedDB via SQLCipher/OPFS).
- **Zero Cloud Leakage:** All AI task deconstruction prompts can run locally on-device or through private sovereign endpoints without logging.
- **Zero Commercial Trackers:** No Google Analytics, no Facebook SDKs, no behavioral monetization.

---

## 🛠️ Tech Stack & Architecture

- **UI / Frontend:** Modern React / React Native / Progressive Web App (PWA)
- **Styling:** Tailwind CSS with custom `Aunicorn Safe Foundation` tokens & CSS variables
- **Typography:** Atkinson Hyperlegible Next (Google Fonts / Self-hosted WOFF2)
- **Icons & Visuals:** Pure vector SVG iconography & cosmic infinity-unicorn motifs
- **State Management & Storage:** Zustand / TanStack Store + local SQLite / IndexedDB
- **Sensory Audio:** Web Audio API synth oscillators (Brown/Pink noise generators)

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- `npm` or `pnpm`

### Installation

```bash
# Clone repository
git clone https://github.com/your-org/aunicorn.git
cd aunicorn

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to experience the sensory workspace.

### Environment Configuration (Optional)

Create a `.env.local` file if integrating on-device or sovereign AI task slicing:

```env
VITE_ENABLE_SENSORY_SAFE_MODE=true
VITE_STORAGE_ENGINE=local_sqlite
VITE_AI_PROVIDER=local_webllm # or sovereign_private_endpoint
```

---

## 📂 Project Structure

```text
aunicorn/
├── public/
│   └── brand/               # SVG infinity unicorn logos & splash assets
├── src/
│   ├── components/
│   │   ├── bento/           # Tactile mosaic grid tiles & expansion drawers
│   │   ├── audio/           # Brown noise, pink noise & sound sanctuary
│   │   ├── vitals/          # POTS orthostatic deck & shift counters
│   │   └── shell/           # Top navigation app bar & fixed bottom tab bar
│   ├── design-system/
│   │   ├── tokens.json      # Color palettes, typography & radiuses
│   │   └── AtkinsonNext/    # Accessibility-engineered font files
│   ├── store/
│   │   ├── useSpoons.ts     # Spoon baseline & energy state
│   │   ├── useRoutine.ts    # Tasks, gentle routines & timers
│   │   └── useHealth.ts     # POTS vitals, hydration & meds state
│   └── pages/
│       ├── Dashboard.tsx    # Main mosaic hub & daily intention
│       ├── HealthArea.tsx   # Sensory health, cycle & vitals deck
│       └── Activities.tsx   # AI task breakdown & hyperfocus sanctuary
├── docs/
│   ├── PRD.md               # Complete Product Requirements Document
│   └── DESIGN.md            # Aunicorn Safe Foundation specifications
├── README.md
└── package.json
```

---

## 🤝 Contributing

We warmly welcome contributions from neurodivergent developers, designers, and accessibility specialists!

Please review our [Accessibility & Contribution Guide](CONTRIBUTING.md) before submitting a PR:
1. All UI contributions must adhere strictly to the **Zero-Guilt** and **AAA Contrast** standards.
2. No flashing animations, timer countdown panic colors, or unskippable auto-play elements.
3. Every interactive button must provide an accessible label and minimum `48px` hit boundary.

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<div align="center">
  <sub>Engineered with care and gentle pacing for neurodivergent minds everywhere. 🦄💜</sub>
</div>
