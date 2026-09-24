import type { CharmDefinition } from '../types';
import { VenkateswaraArtwork } from '../artworks/VenkateswaraArtwork';

export const venkateswaraDefinition: CharmDefinition = {
  id: 'venkateswara',
  name: 'Venkateswara',
  shortDescription: 'A richly ornamented hanging representation inspired by the traditional Venkateswara form.',
  category: 'devotional',
  region: 'South India',
  culturalContext: 'Inspired by the sacred temple deity iconography of Tirupati Venkateswara, adorned in gold armor, jewels, marigold garlands, and silk.',
  tags: ['South India', 'Devotional', 'Tirupati', 'Heritage', 'Sacred', 'Ornate'],
  artwork: VenkateswaraArtwork,
  attachmentPoint: {
    x: 0.5,
    y: 6,
  },
  size: {
    width: 126,
    height: 212,
  },
  ropeStyle: 'gold',
  defaultScale: 1.0,
  defaultRopeLength: 135,
  colorTheme: {
    primary: '#D4AF37',
    accent: '#059669',
    cordPrimary: '#991B1B',
    cordSecondary: '#E5B94C',
    glow: 'rgba(212, 175, 55, 0.45)',
  },
  physics: {
    swingIntensity: 1.0,
    damping: 0.95,
    bounciness: 0.5,
    idleMovement: 1.0,
  },
  physicsConfig: {
    mass: 1.25,
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
    particles: 'gold',
    sound: 'temple',
  },
  fortunes: [
    'May your path be steady and purposeful ✦',
    'Move forward with patience and devotion ✧',
    'Let clarity guide your next step ❀',
    'May today bring peace, focus, and gratitude 🌟',
    'Inner calm reveals the wisest course of action ✦',
    'Steadfast dedication brings harmony to your craft ✧',
    'Approach every task with sincere reverence and care ❀',
    'Quiet contemplation brings effortless clarity ✦',
  ],
  status: 'available',
};
