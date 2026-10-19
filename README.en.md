# 🏢 Work Simulator (打工模拟器)

> A **text-based career life simulator** inspired by "Life Restart Simulator" — from college graduation at 22 to retirement (or early elimination): random events every year, fluctuating stats, and absurdist office humor. Plays on phone and PC.

**[🎮 Play Online](https://studyguy.github.io/work-simulator/)** · **[📦 Source Code](https://github.com/studyguy/work-simulator)**

---

## 🕹️ What Is This

You start your career at 22, fresh out of college, and play through until retirement — or until you're eliminated along the way. Every year triggers random events that shift your stats, salary, and savings. Allocate your starting stats wisely and pick the right talents to chase the best ending.

The writing draws on real office life: interviews, overtime, job-hopping, renting, buying a house, industry winters, AI disruption — equal parts relatable comedy and sharp reality. With 130+ events, 30+ talents, 10+ endings, and a programmer-flavored "hairline" stat that gets stronger as it recedes, every run is a brand-new working life.

A pure-frontend static page — **double-click `index.html` to play**. Progress auto-saves to localStorage.

## ✨ Core Gameplay

1. **Choose your education background** — shapes starting stats
2. **Draw talents (pick 3 of 10)** — talents define your special abilities
3. **Allocate stat points** — coding, communication, stamina, family background
4. **Work your career** — hit "Next Year" to advance time and trigger events
5. **Reach an ending** — normal retirement, financial freedom, midlife crisis, and 10+ more

### Core Stats

| Stat | Description |
|------|-------------|
| 💻 Coding (COD) | Code quality; drives tech events |
| 🗣️ Communication (COM) | Expression; affects interviews and promotions |
| 💪 Stamina (STA) | Stress tolerance; affects overtime and health |
| 🏠 Family (FAM) | Economic background and connections |
| 😊 Happiness (HAP) | Mental health; low values trigger negative events |
| 💇 Hairline (HRL) | The programmer stat — the baler you are, the stronger you get |

### Endings

| Ending | Trigger |
|------|---------|
| 🏆 Financial freedom | Savings > 5M |
| 🎂 Normal retirement | Age ≥ 65 |
| 😢 Midlife crisis | Age 30 + low savings + low happiness |
| 🏠 Lying flat | Happiness stays at 0 |
| 🧠 Monastic life | Hairline reaches zero |
| 🎭 Office god | Reach Level 10 |
| 🚀 Startup success / 💼 Laid off / 💀 Secret ending | Special events and hidden easter eggs |

## 🚀 Quick Start

| Method | How |
|---|---|
| 🌐 Play online | [studyguy.github.io/work-simulator](https://studyguy.github.io/work-simulator/) |
| 💻 Play locally | Clone the repo and double-click `index.html` (modern browser recommended) |
| 🖥️ Local server | `python3 -m http.server 8000` or `npx serve .`, then open `http://localhost:8000` |

## 🛠️ Technical Notes

- **Pure frontend**: Vanilla JS with raw DOM manipulation — no framework, no build step
- **Dark pixel-art CSS**, mobile-first responsive design
- **localStorage saves** persist across sessions
- A **condition-parsing engine** (`utils/condition.js`) drives the trigger conditions of 130+ events
- **Event categories**: career 20+ / absurdist comedy 20+ / life 10+ / era-background 10+

## 📁 Project Structure

```
work-simulator/
├── index.html                # Entry page
├── css/style.css             # Global styles
└── js/
    ├── app.js                # Main app controller
    ├── core/                 # Core engine
    │   ├── life.js           #   Lifecycle control
    │   ├── property.js       #   Stat system
    │   ├── event.js          #   Event system
    │   ├── talent.js         #   Talent system
    │   └── economy.js        #   Economy system
    ├── data/                 # Game data
    │   ├── events.js         #   Event database (130+)
    │   ├── talents.js        #   Talent database (30+)
    │   └── levels.js         #   Career level data
    ├── ui/                   # UI screens
    │   ├── title.js / education.js / talentPick.js
    │   ├── attributeAssign.js / simulate.js / summary.js
    └── utils/                # Utilities
        ├── util.js           #   Helpers
        └── condition.js      #   Condition-parsing engine
```

## 📜 Disclaimer

For entertainment only. All events are fictional; any resemblance to real life is purely coincidental.
