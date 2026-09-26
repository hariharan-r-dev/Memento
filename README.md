# Memento — Interactive Desktop Companions & Talismans

<div align="center">

![Memento Hero Banner](src/assets/hero.png)

**A lightweight, physics-driven talisman and companion overlay for your desktop.**  
*Hang traditional lucky charms, experience realistic Verlet rope dynamics, and keep playful pets by your side—all with zero disruption to your daily workflow.*

[![Tauri v2](https://img.shields.io/badge/Tauri-v2.0-blue.svg?logo=tauri)](https://tauri.app/)
[![React 19](https://img.shields.io/badge/React-19.0-61dafb.svg?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6.svg?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38bdf8.svg?logo=tailwindcss)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

[Features](#-key-features) • [Charm Collection](#-talisman-collection) • [Architecture](#-architecture--tech-stack) • [Installation](#-getting-started) • [Building](#-building-for-production)

</div>

---

## ✨ Key Features

### 🪢 Realistic Verlet Rope & Pendulum Physics
- **10-Segment Verlet Integrator**: Simulates authentic cord flexibility, mass distribution, damping, and tension.
- **Natural Pendulum Dynamics**: Responds organically to user drags, flicks, cursor interactions, and release velocities.
- **Micro-Vibrations & Settling**: Subtle physics-based settling animations with natural decay.

### 🪟 Seamless Desktop Click-Through
- **Native Non-Intrusive Overlay**: Transparent full-screen overlay engineered with high-performance Win32 native hit-testing.
- **Zero Input Interference**: Click, type, select text, and manage windows underneath the overlay without interruption.
- **Dynamic Rotated AABB Hitboxes**: The charm, rope, bracket, and companion dynamically activate mouse interaction only when hovered or grabbed.

### 🐾 Roaming Desktop Pet Companions
- **Autonomous Desktop Pals**: Select from Shiba Inu, Cat, Panda, Puppy, Bunny, and Bird companions.
- **Interactive States**: Pets explore your screen, nap, display mood and hunger bubbles, and react to your mouse.

### 🔮 Auspicious Rituals & Fortunes
- **Interactive Daily Rituals**: Double-click your talisman to trigger lucky celebrations with sparkling particle bursts.
- **Fortune Messages**: Receive positive daily affirmations and inspiring quotes tailored to your selected talisman.
- **Atmospheric Sound Design**: Soothing, toggleable audio chimes, bells, and ritual sound effects.

---

## 🏮 Talisman Collection

Memento includes a curated collection of culturally rich talismans and modern lucky charms:

| Charm | Significance & Attributes |
|---|---|
| **Red Exotic Sports Car** | Modern talisman of speed, drive, focus, and relentless ambition. |
| **Lord Murugan** | Sacred Tamil deity representing courage, supreme wisdom, and protection. |
| **Lord Venkateswara** | Auspicious symbol of eternal prosperity, wealth, and spiritual grace. |
| **Maneki-Neko** | Japanese lucky cat featuring an animated waving paw and golden jingle bell. |
| **Daruma Doll** | Traditional symbol of perseverance, goal setting, and good fortune. |
| **Evil Eye (Nazar)** | Ancient Mediterranean talisman warding off negative energies and envy. |
| **Hamsa Hand** | Symbol of strength, luck, and defense across diverse ancient cultures. |
| **Nimbu Mirchi** | Traditional Indian talisman featuring chili and lemon to deter ill intent. |
| **Drishti Bommai** | Auspicious mask crafted to neutralize the evil eye and protect the home. |
| **Sacred Singing Bell** | Resonant bell and auspicious gold coins for clarity, focus, and prosperity. |

---

## 🏗️ Architecture & Tech Stack

```
┌───────────────────────────────────────────────────────────┐
│                    React 19 UI Layer                      │
│   • CharmRenderer (Canvas / SVG / High-Res PNGs)          │
│   • PetRenderer & Companion State Machine                 │
│   • SettingsModal, CharmPicker, PetPicker Popovers        │
└─────────────────────────────┬─────────────────────────────┘
                              │  IPC State Synchronization
┌─────────────────────────────▼─────────────────────────────┐
│                    Tauri v2 (Rust Core)                   │
│   • Background 60Hz Hit-Test Engine                       │
│   • Win32 / macOS Dynamic Window Style Manager            │
│   • Single-Instance Guard & System Tray Manager           │
└─────────────────────────────┬─────────────────────────────┘
                              │  Win32 API
┌─────────────────────────────▼─────────────────────────────┐
│                   OS Compositor Layer                     │
│   • WS_EX_TRANSPARENT Top-Level Window Filtering          │
│   • DirectComposition DirectX 11 Swapchain Presentation   │
└───────────────────────────────────────────────────────────┘
```

### Core Technologies
- **Frontend**: React 19, TypeScript 5.7, Vite 8, Tailwind CSS v4, Lucide React
- **Desktop Runtime**: Tauri v2, Rust 2021 Edition
- **Physics Engine**: Custom Verlet Particle Integrator & Angular Momentum Solver
- **Platform APIs**: Win32 HiDPI (`GetDpiForWindow`), `SetWindowLongPtrW`, `OpenInputDesktop`

---

## 🚀 Getting Started

### Prerequisites
1. **Node.js**: `v20.x` or higher
2. **Package Manager**: `pnpm` (recommended) or `npm`
3. **Rust Toolchain**: `stable-x86_64-pc-windows-msvc` (or `stable-x86_64-pc-windows-gnu`)
4. **C/C++ Build Tools**: Visual Studio C++ Build Tools or MSYS2/MinGW64

### Local Setup

```bash
# 1. Clone the repository
git clone https://github.com/hariharan-r-dev/Memento.git
cd Memento

# 2. Install dependencies
pnpm install
# or
npm install

# 3. Launch in development mode
npm run tauri -- dev
```

---

## 📦 Building for Production

To create an optimized, standalone Windows executable and installer:

```powershell
# Run the automated production build script
powershell -ExecutionPolicy Bypass -File "scripts/build_prod.ps1"
```

The output binaries will be packaged into:
- **Standalone EXE**: `release-bin/Memento.exe`
- **NSIS Installer**: `release-bin/Memento-Setup.exe`

---

## 🎮 Interaction & Controls

- **Left-Click & Drag**: Grab the hanging charm or rope to swing it across your screen.
- **Double-Click Charm**: Activate the golden lucky fortune ritual and particle burst.
- **Right-Click**: Open the quick context menu to change charms, adjust settings, or manage desktop pets.
- **Top Bracket Clamp**: Drag horizontally across the top edge of your monitor to reposition the charm's anchor point.

---

## ⚙️ Configuration

Memento provides extensive customization options directly via the in-app Settings panel:
- **Talisman Size & Opacity**: Scale between 0.5× to 2.0× and adjust transparency.
- **Rope Customization**: Modify rope length, cord stiffness, and color palette.
- **Audio & Visual Effects**: Toggle ritual particles, fortune popups, and sound effects.
- **Startup on Boot**: Enable or disable automatic launch with Windows.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) — feel free to use, modify, and distribute.

---

<div align="center">
  <sub>Crafted with passion for desktop customization and mindful digital workspaces.</sub>
</div>
