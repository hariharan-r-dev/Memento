import type { CharmDefinition } from '../types';
import { MatchaArtwork } from '../artworks/MatchaArtwork';

export const matchaDefinition: CharmDefinition = {
  id: 'matcha-drink',
  name: 'Matcha',
  shortDescription: 'A tall artisanal iced matcha drink charm with rich whipped cream swirls, vibrant green matcha powder, a diagonal green straw, and polished gold hardware.',
  category: 'food',
  region: 'Food',
  culturalContext: 'Inspired by traditional Japanese matcha culture and modern artisan cafes—celebrating mindful focus, wholesome energy, refreshing clarity, and sweet creamy indulgence.',
  tags: ['Food', 'Drink', 'Matcha', 'Tea', 'Green Tea', 'Cafe', 'Whipped Cream', 'Collectible'],
  artwork: MatchaArtwork,
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
    primary: '#4D7C0F',
    accent: '#65A30D',
    cordPrimary: '#3F6212',
    cordSecondary: '#F7FEE7',
    glow: 'rgba(101, 163, 13, 0.45)',
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
    'Find calm focus, soothing serenity, and revitalizing energy in every moment 🍵',
    'A fresh wave of clarity and inspiration flows smoothly into your day ✦',
    'Mindful presence brings vibrant harmony and effortless success 🌟',
    'Life is rich, flavorful, and filled with refreshing surprises ✧',
    'Embrace the soothing harmony of patience, peace, and progress 🍵',
    'Every sip of dedicated effort blossoms into vibrant achievement ✦',
  ],
  status: 'available',
};
