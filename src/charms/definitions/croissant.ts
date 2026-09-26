import type { CharmDefinition } from '../types';
import { CroissantArtwork } from '../artworks/CroissantArtwork';

export const croissantDefinition: CharmDefinition = {
  id: 'croissant',
  name: 'Golden Croissant',
  shortDescription: 'A warm Parisian croissant charm with a large polished gold ball, braided knot, and flaky golden pastry layers.',
  category: 'food',
  region: 'Paris, France',
  culturalContext: 'Inspired by the artisanal tradition of French viennoiserie—celebrating golden abundance, warmth, slow mornings, and the simple joys of life.',
  tags: ['Food', 'Pastry', 'Croissant', 'Paris', 'Bakery', 'Abundance', 'Joy', 'Warmth', 'Collectible'],
  artwork: CroissantArtwork,
  attachmentPoint: {
    x: 0.5,
    y: 4,
  },
  size: {
    width: 142,
    height: 151,
  },
  ropeStyle: 'gold',
  defaultScale: 1.0,
  defaultRopeLength: 135,
  colorTheme: {
    primary: '#D97706',
    accent: '#F59E0B',
    cordPrimary: '#92400E',
    cordSecondary: '#FDE68A',
    glow: 'rgba(217, 119, 6, 0.45)',
  },
  physics: {
    swingIntensity: 1.0,
    damping: 0.95,
    bounciness: 0.5,
    idleMovement: 1.0,
  },
  physicsConfig: {
    mass: 1.1,
    gravity: 710,
    airDamping: 0.98,
    springStiffness: 130,
    angularDamping: 0.95,
    restLength: 135,
    elasticity: 0.5,
  },
  ritual: {
    impulse: 2.0,
    duration: 2200,
    particles: 'sparkle',
    sound: 'chime',
  },
  fortunes: [
    'Savor the warmth and golden abundance in every small moment 🥐',
    'Layer by layer, your patience creates something truly extraordinary ✧',
    'Life is best enjoyed fresh, sweet, and with a grateful heart ☕',
    'Good things take time to rise — trust your natural rhythm 🌟',
    'A dash of warmth and delight brightens your entire day ✦',
    'Golden opportunities are fresh out of the oven for you today 🥐',
  ],
  status: 'available',
};
