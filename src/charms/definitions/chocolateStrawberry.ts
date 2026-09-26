import type { CharmDefinition } from '../types';
import { ChocolateStrawberryArtwork } from '../artworks/ChocolateStrawberryArtwork';

export const chocolateStrawberryDefinition: CharmDefinition = {
  id: 'chocolate-strawberry',
  name: 'Chocolate Strawberry',
  shortDescription: 'A luscious hand-dipped chocolate strawberry dessert charm with a large polished gold sphere, rich dark chocolate drips, and ripe red berries.',
  category: 'food',
  region: 'Gourmet Patisserie',
  culturalContext: 'Inspired by artisanal confectionery—celebrating romance, everyday indulgence, rich sweetness, and handcrafted elegance.',
  tags: ['Food', 'Dessert', 'Chocolate', 'Strawberry', 'Gourmet', 'Sweet', 'Indulgence', 'Collectible'],
  artwork: ChocolateStrawberryArtwork,
  attachmentPoint: {
    x: 0.5,
    y: 4,
  },
  size: {
    width: 120,
    height: 198,
  },
  ropeStyle: 'gold',
  defaultScale: 1.0,
  defaultRopeLength: 135,
  colorTheme: {
    primary: '#451A03',
    accent: '#DC2626',
    cordPrimary: '#78350F',
    cordSecondary: '#FDE68A',
    glow: 'rgba(220, 38, 38, 0.45)',
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
    'Indulge in the sweet rewards of your hard work and dedication 🍓',
    'Life is rich and full of sweet surprises — savor every moment 🍫',
    'A touch of elegance and joy makes every effort worthwhile ✧',
    'The finest creations take care, passion, and perfect timing 🌟',
    'Treat yourself with kindness, love, and sweet delight today ✦',
    'Delightful moments and prosperous opportunities are on the way 🍓',
  ],
  status: 'available',
};
