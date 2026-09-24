import type { CharmDefinition } from '../types';
import { DarumaArtwork } from '../artworks/DarumaArtwork';

export const darumaDefinition: CharmDefinition = {
  id: 'daruma',
  name: 'Daruma Doll',
  shortDescription: 'Japanese tumbler doll embodying unyielding resilience, focus, and victory.',
  category: 'goals',
  region: 'Japan',
  culturalContext: 'Traditionally used in Japan as a visual reminder and talisman for setting ambitious aspirations, perseverance, and unwavering determination.',
  tags: ['Japan', 'Goals', 'Perseverance', 'Resilience', 'Victory'],
  artwork: DarumaArtwork,
  attachmentPoint: {
    x: 0.5,
    y: 10,
  },
  size: {
    width: 110,
    height: 135,
  },
  ropeStyle: 'red-white',
  defaultScale: 1.0,
  defaultRopeLength: 135,
  colorTheme: {
    primary: '#E63946',
    accent: '#FFD166',
    cordPrimary: '#BA181B',
    cordSecondary: '#FFFFFF',
    glow: 'rgba(230, 57, 70, 0.45)',
  },
  physics: {
    swingIntensity: 1.15,
    damping: 0.92,
    bounciness: 0.5,
    idleMovement: 1.0,
  },
  physicsConfig: {
    mass: 1.25,
    gravity: 720,
    airDamping: 0.98,
    springStiffness: 135,
    angularDamping: 0.95,
    restLength: 135,
    elasticity: 0.5,
  },
  ritual: {
    impulse: 2.1,
    duration: 2200,
    particles: 'sparkle',
    sound: 'temple',
  },
  fortunes: [
    'Fall seven times, stand up eight ✦',
    'Unwavering dedication conquers any steep climb ✧',
    'A single clear goal is worth a thousand scattered wishes ❀',
    'Victory belongs to those who keep showing up 🌟',
    'Steady steps today accomplish monumental feats ✦',
    'Channel fierce determination into your current craft ✧',
    'Your patience and resilience are bearing fruit ❀',
    'Keep your eyes fixed on the summit ✦',
  ],
  status: 'available',
};
