import type { CharmDefinition } from '../types';
import { PistachioChocolateDonutArtwork } from '../artworks/PistachioChocolateDonutArtwork';

export const pistachioChocolateDonutDefinition: CharmDefinition = {
  id: 'pistachio-chocolate-donut',
  name: 'Pistachio Chocolate Donut',
  shortDescription: 'A gourmet baked donut charm with rich dark chocolate glaze, flowing chocolate drips, toasted pistachio chunks, and creamy pistachio filling.',
  category: 'food',
  region: 'Food',
  culturalContext: 'Inspired by artisanal bakery delights—celebrating rich chocolate sweetness, toasted pistachio crumbles, lush cream fillings, and joyful everyday indulgence.',
  tags: ['Food', 'Dessert', 'Donut', 'Pastry', 'Pistachio', 'Chocolate', 'Sweet', 'Gourmet', 'Collectible'],
  artwork: PistachioChocolateDonutArtwork,
  attachmentPoint: {
    x: 0.5,
    y: 3,
  },
  size: {
    width: 144,
    height: 156,
  },
  ropeStyle: 'gold',
  defaultScale: 1.0,
  defaultRopeLength: 135,
  colorTheme: {
    primary: '#38220F',
    accent: '#84CC16',
    cordPrimary: '#78350F',
    cordSecondary: '#FDE68A',
    glow: 'rgba(132, 204, 22, 0.45)',
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
    'Sweet layers of happiness and abundant joy are baked into your journey 🍩',
    'Rich sweetness, pistachio delights, and great fortune are coming your way ✦',
    'Savor the golden moments — life is full of delicious surprises 🌟',
    'A luscious swirl of creativity and passion makes every day brighter 🍫',
    'Indulge in sweet success and share the warmth of joy with others ✧',
    'Every small effort adds a layer of richness to your life 🍩',
  ],
  status: 'available',
};
