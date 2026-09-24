import type { CharmDefinition } from '../types';
import { BellArtwork } from '../artworks/BellArtwork';

export const bellDefinition: CharmDefinition = {
  id: 'bell',
  name: 'Hanging Temple Bell',
  shortDescription: 'Cast bronze temple chime with fluttering tanzaku paper slip for serene calm.',
  category: 'calm',
  region: 'East Asia',
  culturalContext: 'Traditionally hung from eaves and temples across East Asia, where gentle breeze chimes inspire mindful reflection, calm clarity, and peace.',
  tags: ['East Asia', 'Calm', 'Serenity', 'Zen', 'Wind Chime'],
  artwork: BellArtwork,
  attachmentPoint: {
    x: 0.5,
    y: 10,
  },
  size: {
    width: 110,
    height: 145,
  },
  ropeStyle: 'natural',
  defaultScale: 1.0,
  defaultRopeLength: 135,
  colorTheme: {
    primary: '#588157',
    accent: '#F4A261',
    cordPrimary: '#588157',
    cordSecondary: '#CCD5AE',
    glow: 'rgba(72, 202, 228, 0.45)',
  },
  physics: {
    swingIntensity: 0.9,
    damping: 1.1,
    bounciness: 0.35,
    idleMovement: 1.2,
  },
  physicsConfig: {
    mass: 0.9,
    gravity: 650,
    airDamping: 0.988,
    springStiffness: 110,
    angularDamping: 0.92,
    restLength: 135,
    elasticity: 0.35,
  },
  ritual: {
    impulse: 1.5,
    duration: 2400,
    particles: 'sparkle',
    sound: 'temple',
  },
  fortunes: [
    'Take a deep breath; gentle stillness restores clarity ✦',
    'Like a soft wind chime, let tension drift away ✧',
    'Serenity in the mind creates effortless mastery ❀',
    'Peace is found in this exact moment 🌟',
    'A tranquil heart hears wisdom in the silence ✦',
    'Harmonious thoughts bring peaceful productivity ✧',
    'Allow your mind to rest like still mountain water ❀',
    'Calm presence is your greatest superpower ✦',
  ],
  status: 'available',
};
