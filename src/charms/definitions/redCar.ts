import type { CharmDefinition } from '../types';
import { RedCarArtwork } from '../artworks/RedCarArtwork';

export const redCarDefinition: CharmDefinition = {
  id: 'red-car',
  name: 'Scuderia Wedge',
  shortDescription: 'An iconic red exotic supercar pendant with aggressive wedge styling and polished silver hardware.',
  category: 'cars',
  region: 'Automotive Heritage',
  culturalContext: 'Inspired by legendary Italian twin-turbo wedge supercars—celebrating speed, precision engineering, and timeless aerodynamic design.',
  tags: ['Cars', 'Supercar', 'Exotic', 'Speed', 'Motorsport', 'Collectible'],
  artwork: RedCarArtwork,
  attachmentPoint: {
    x: 0.5,
    y: 8,
  },
  size: {
    width: 142,
    height: 170,
  },
  ropeStyle: 'red-white',
  defaultScale: 1.0,
  defaultRopeLength: 135,
  colorTheme: {
    primary: '#E51A1A',
    accent: '#C0C0C0',
    cordPrimary: '#C8102E',
    cordSecondary: '#E6E6E6',
    glow: 'rgba(229, 26, 26, 0.45)',
  },
  physics: {
    swingIntensity: 1.05,
    damping: 0.95,
    bounciness: 0.5,
    idleMovement: 1.0,
  },
  physicsConfig: {
    mass: 1.15,
    gravity: 700,
    airDamping: 0.98,
    springStiffness: 130,
    angularDamping: 0.95,
    restLength: 135,
    elasticity: 0.5,
  },
  ritual: {
    impulse: 2.2,
    duration: 2200,
    particles: 'sparkle',
    sound: 'chime',
  },
  fortunes: [
    'Accelerate toward your ambitions with unwavering focus 🏎️',
    'Precision and passion pave the fastest lap to victory 🏁',
    'Keep your vision clear and corner with absolute confidence ✦',
    'High performance is born from meticulous craft and tuning ⚙️',
    'Every apex in your journey leads to open straightaways 🌟',
    'Drive with purpose, momentum, and unflinching resolve ✧',
  ],
  status: 'available',
};
