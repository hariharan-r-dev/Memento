import type { CharmDefinition } from '../types';
import { EvilEyeArtwork } from '../artworks/EvilEyeArtwork';

export const evilEyeDefinition: CharmDefinition = {
  id: 'evil-eye',
  name: 'Evil Eye (Nazar)',
  shortDescription: 'Concentric cobalt and turquoise glass talisman shielding against negativity.',
  category: 'protection',
  region: 'Mediterranean / West Asia',
  culturalContext: 'Traditionally regarded across Mediterranean and West Asian cultures as a protective emblem reflecting away negative gaze and envy.',
  tags: ['Mediterranean', 'Protection', 'Glass', 'Cobalt', 'Ancient'],
  artwork: EvilEyeArtwork,
  attachmentPoint: {
    x: 0.5,
    y: 10,
  },
  size: {
    width: 110,
    height: 140,
  },
  ropeStyle: 'indigo',
  defaultScale: 1.0,
  defaultRopeLength: 135,
  colorTheme: {
    primary: '#0B1354',
    accent: '#00BBF9',
    cordPrimary: '#0077B6',
    cordSecondary: '#FFFFFF',
    glow: 'rgba(0, 187, 249, 0.45)',
  },
  physics: {
    swingIntensity: 0.95,
    damping: 1.05,
    bounciness: 0.4,
    idleMovement: 0.9,
  },
  physicsConfig: {
    mass: 1.1,
    gravity: 690,
    airDamping: 0.982,
    springStiffness: 125,
    angularDamping: 0.95,
    restLength: 135,
    elasticity: 0.4,
  },
  ritual: {
    impulse: 1.6,
    duration: 2200,
    particles: 'sparkle',
    sound: 'chime',
  },
  fortunes: [
    'Negative energy dissolves around you ✦',
    'Your workspace is protected and clear ✧',
    'Focus on your own radiant path ❀',
    'Peace and unbothered calm follow you 🌟',
    'Unshakable serenity shields your day ✦',
    'Only genuine well-wishes reach your heart ✧',
    'Calm vigilance turns obstacles into stepping stones ❀',
    'Clear skies and clear thoughts are yours ✦',
  ],
  status: 'available',
};
