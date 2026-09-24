import type { CharmDefinition } from '../types';
import { ManekiNekoArtwork } from '../artworks/ManekiNekoArtwork';

export const manekiNekoDefinition: CharmDefinition = {
  id: 'maneki-neko',
  name: 'Maneki Neko',
  shortDescription: 'Traditional Japanese porcelain cat welcoming good fortune and abundance.',
  category: 'prosperity',
  region: 'Japan',
  culturalContext: 'Traditionally associated with welcoming good fortune, prosperity, and joyful connections in Japanese culture.',
  tags: ['Japan', 'Prosperity', 'Porcelain', 'Fortune', 'Classic'],
  artwork: ManekiNekoArtwork,
  attachmentPoint: {
    x: 0.5,
    y: 12,
  },
  size: {
    width: 112,
    height: 124,
  },
  ropeStyle: 'red-white',
  defaultScale: 1.0,
  defaultRopeLength: 135,
  colorTheme: {
    primary: '#FAF7F2',
    accent: '#D90429',
    cordPrimary: '#D90429',
    cordSecondary: '#FFFFFF',
    glow: 'rgba(255, 215, 0, 0.45)',
  },
  physics: {
    swingIntensity: 1.0,
    damping: 1.0,
    bounciness: 0.45,
    idleMovement: 1.0,
  },
  physicsConfig: {
    mass: 1.0,
    gravity: 680,
    airDamping: 0.985,
    springStiffness: 120,
    angularDamping: 0.94,
    restLength: 135,
    elasticity: 0.45,
  },
  ritual: {
    impulse: 1.8,
    duration: 2200,
    particles: 'gold',
    sound: 'bell',
  },
  fortunes: [
    'Good things ahead ✦',
    'Small efforts today bring meaningful momentum ❀',
    'Fortune favors a patient spirit ✧',
    'Luck and clarity are on your side 🌟',
    'Auspicious connections open doors for you ✦',
    'Abundance and joy surround your path ❀',
    'Quiet perseverance creates bright outcomes ✧',
    'A wave of good luck is arriving ✦',
  ],
  status: 'available',
};
