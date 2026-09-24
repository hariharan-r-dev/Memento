import type { CharmDefinition } from '../types';
import { DrishtiBommaiArtwork } from '../artworks/DrishtiBommaiArtwork';

export const drishtiBommaiDefinition: CharmDefinition = {
  id: 'drishti-bommai',
  name: 'Drishti Bommai',
  shortDescription: 'Traditional South Indian protective mask warding off harmful gazes.',
  category: 'protection',
  region: 'South India',
  culturalContext: 'Traditionally mounted on homes, shops, and workspaces in South India to deflect unwanted glances and preserve positive domestic harmony.',
  tags: ['South India', 'Protection', 'Folk Art', 'Vibrant', 'Heritage'],
  artwork: DrishtiBommaiArtwork,
  attachmentPoint: {
    x: 0.5,
    y: 10,
  },
  size: {
    width: 120,
    height: 150,
  },
  ropeStyle: 'red-white',
  defaultScale: 1.0,
  defaultRopeLength: 135,
  colorTheme: {
    primary: '#1A1C29',
    accent: '#FFB703',
    cordPrimary: '#D90429',
    cordSecondary: '#FFB703',
    glow: 'rgba(255, 183, 3, 0.45)',
  },
  physics: {
    swingIntensity: 1.1,
    damping: 0.95,
    bounciness: 0.5,
    idleMovement: 1.1,
  },
  physicsConfig: {
    mass: 1.2,
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
    sound: 'gong',
  },
  fortunes: [
    'All distracting negativity is deflected away ✦',
    'Fierce focus empowers your current endeavor ✧',
    'Your goals remain safe and protected ❀',
    'Bold steps today lead to confident victories 🌟',
    'May prosperity flourish without impediment ✦',
    'Unshakable courage anchors your focus ✧',
    'A shield of vibrant energy surrounds your craft ❀',
    'Clear obstacles with fearless enthusiasm ✦',
  ],
  status: 'available',
};
