import type { CharmDefinition } from '../types';
import { DiscoBallStarsArtwork } from '../artworks/DiscoBallStarsArtwork';

export const discoBallStarsDefinition: CharmDefinition = {
  id: 'disco-ball-stars',
  name: 'Disco Ball Stars',
  shortDescription: 'A sparkling mirrored disco ball charm covered in miniature square glass tiles, accented with three dimensional metallic blue stars and a large polished gold sphere.',
  category: 'food',
  region: 'Food',
  culturalContext: 'Inspired by dazzling celebration culture and retro dance party glamour—celebrating radiant joy, shimmering confidence, stellar brilliance, and joyful vibes.',
  tags: ['Food', 'Party', 'Disco Ball', 'Stars', 'Celebration', 'Shine', 'Retro', 'Collectible'],
  artwork: DiscoBallStarsArtwork,
  attachmentPoint: {
    x: 0.5,
    y: 3,
  },
  size: {
    width: 142,
    height: 156,
  },
  ropeStyle: 'natural',
  defaultScale: 1.0,
  defaultRopeLength: 135,
  colorTheme: {
    primary: '#1D4ED8',
    accent: '#60A5FA',
    cordPrimary: '#1E40AF',
    cordSecondary: '#F8FAFC',
    glow: 'rgba(96, 165, 250, 0.45)',
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
    'Let your brilliance sparkle and illuminate every room you enter 🪩',
    'Shine brightly like a star — joy, celebration, and good vibes follow you ✦',
    'Reflect positivity, energy, and radiant confidence today 🌟',
    'Every small facet of your talent catches the light in stunning ways ✧',
    'Dance through challenges with high spirits, style, and sparkle 🪩',
    'Brilliant opportunities and glittering success are aligning for you ✦',
  ],
  status: 'available',
};
