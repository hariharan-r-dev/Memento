import type { CharmDefinition } from '../types';
import { HamsaArtwork } from '../artworks/HamsaArtwork';

export const hamsaDefinition: CharmDefinition = {
  id: 'hamsa',
  name: 'Hamsa Hand',
  shortDescription: 'Golden filigree palm talisman with centered protective eye and gemstone.',
  category: 'protection',
  region: 'Middle East / North Africa',
  culturalContext: 'Historically regarded in Middle Eastern and North African traditions as a universal emblem of protection, peace, and auspicious blessings.',
  tags: ['Middle East', 'Protection', 'Blessings', 'Gold', 'Filigree'],
  artwork: HamsaArtwork,
  attachmentPoint: {
    x: 0.5,
    y: 10,
  },
  size: {
    width: 110,
    height: 145,
  },
  ropeStyle: 'gold',
  defaultScale: 1.0,
  defaultRopeLength: 135,
  colorTheme: {
    primary: '#D4A373',
    accent: '#0096C7',
    cordPrimary: '#E09F3E',
    cordSecondary: '#FFF3B0',
    glow: 'rgba(245, 208, 97, 0.45)',
  },
  physics: {
    swingIntensity: 1.0,
    damping: 1.0,
    bounciness: 0.45,
    idleMovement: 1.0,
  },
  physicsConfig: {
    mass: 1.05,
    gravity: 680,
    airDamping: 0.985,
    springStiffness: 120,
    angularDamping: 0.94,
    restLength: 135,
    elasticity: 0.45,
  },
  ritual: {
    impulse: 1.7,
    duration: 2200,
    particles: 'sparkle',
    sound: 'harp',
  },
  fortunes: [
    'Blessings of harmony guide your day ✦',
    'Open hands receive wonderful gifts ❀',
    'Gentle strength and peace dwell with you ✧',
    'May health, joy, and courage surround you 🌟',
    'A shield of grace keeps your spirit light ✦',
    'Kindness offered returns multiplied ❀',
    'Your creativity and focus flow effortlessly ✧',
    'Auspicious outcomes follow honest effort ✦',
  ],
  status: 'available',
};
