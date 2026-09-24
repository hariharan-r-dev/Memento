import type { CharmDefinition } from '../types';
import { NimbuMirchiArtwork } from '../artworks/NimbuMirchiArtwork';

export const nimbuMirchiDefinition: CharmDefinition = {
  id: 'nimbu-mirchi',
  name: 'Nimbu-Mirchi',
  shortDescription: 'Fresh yellow lemon strung with seven green chillies for auspicious protection.',
  category: 'protection',
  region: 'India',
  culturalContext: 'Traditionally strung across doorways and vehicles in India as a customary protective ritual and symbol of vibrant auspicious beginnings.',
  tags: ['India', 'Protection', 'Good Luck', 'Organic', 'Tradition'],
  artwork: NimbuMirchiArtwork,
  attachmentPoint: {
    x: 0.5,
    y: 10,
  },
  size: {
    width: 110,
    height: 160,
  },
  ropeStyle: 'black',
  defaultScale: 1.0,
  defaultRopeLength: 135,
  colorTheme: {
    primary: '#FFEE32',
    accent: '#38B000',
    cordPrimary: '#1F2421',
    cordSecondary: '#52B788',
    glow: 'rgba(112, 224, 0, 0.45)',
  },
  physics: {
    swingIntensity: 1.05,
    damping: 1.0,
    bounciness: 0.45,
    idleMovement: 1.0,
  },
  physicsConfig: {
    mass: 0.95,
    gravity: 670,
    airDamping: 0.986,
    springStiffness: 115,
    angularDamping: 0.93,
    restLength: 135,
    elasticity: 0.45,
  },
  ritual: {
    impulse: 1.7,
    duration: 2200,
    particles: 'sparkle',
    sound: 'chime',
  },
  fortunes: [
    'Zesty energy and fresh perspective recharge you ✦',
    'Sour thoughts turn into sweet success ❀',
    'Unwanted distractions vanish from your path ✧',
    'Spicy enthusiasm powers your breakthrough 🌟',
    'A fresh start brings immediate auspicious momentum ✦',
    'Protection and positive vitality fill your room ❀',
    'Simple daily rituals keep your focus grounded ✧',
    'Good fortune is freshly harvested today ✦',
  ],
  status: 'available',
};
