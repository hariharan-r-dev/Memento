import type { CharmDefinition } from '../types';
import { ChocolateMilkshakeArtwork } from '../artworks/ChocolateMilkshakeArtwork';

export const chocolateMilkshakeDefinition: CharmDefinition = {
  id: 'chocolate-milkshake',
  name: 'Chocolate Milkshake',
  shortDescription: 'A tall frozen chocolate milkshake charm piled with layered whipped cream, chocolate shavings, a chocolate straw, and polished gold hardware.',
  category: 'food',
  region: 'Food',
  culturalContext: 'Inspired by nostalgic dessert parlors—celebrating rich creamy layers, chocolate swirls, indulgent joy, and artisanal sweetness.',
  tags: ['Food', 'Dessert', 'Milkshake', 'Chocolate', 'Sweet', 'Indulgence', 'Whipped Cream', 'Collectible'],
  artwork: ChocolateMilkshakeArtwork,
  attachmentPoint: {
    x: 0.5,
    y: 4,
  },
  size: {
    width: 112,
    height: 225,
  },
  ropeStyle: 'gold',
  defaultScale: 1.0,
  defaultRopeLength: 135,
  colorTheme: {
    primary: '#451A03',
    accent: '#D97706',
    cordPrimary: '#78350F',
    cordSecondary: '#FDE68A',
    glow: 'rgba(217, 119, 6, 0.45)',
  },
  physics: {
    swingIntensity: 1.05,
    damping: 0.95,
    bounciness: 0.5,
    idleMovement: 1.0,
  },
  physicsConfig: {
    mass: 1.15,
    gravity: 710,
    airDamping: 0.98,
    springStiffness: 130,
    angularDamping: 0.95,
    restLength: 135,
    elasticity: 0.5,
  },
  ritual: {
    impulse: 2.1,
    duration: 2200,
    particles: 'sparkle',
    sound: 'chime',
  },
  fortunes: [
    'Top your day with rich sweetness, lighthearted joy, and bright smiles 🍫',
    'Layer your moments with gratitude and savor the sweetest sips of life 🥤',
    'Life is meant to be enjoyed to the very last drop ✧',
    'Rich abundance flows effortlessly into your endeavors today 🌟',
    'Stay cool, take a sweet pause, and celebrate your progress ✦',
    'A delightful treat for your spirit brings fresh energy and inspiration 🥤',
  ],
  status: 'available',
};
