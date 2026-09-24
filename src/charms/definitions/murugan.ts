import type { CharmDefinition } from '../types';
import { MuruganArtwork } from '../artworks/MuruganArtwork';

export const muruganDefinition: CharmDefinition = {
  id: 'kandhan-karunai',
  name: 'Kandhan Karunai',
  shortDescription: 'An adorable, auspicious devotional representation of Bala Murugan bringing joy, courage, and divine grace.',
  category: 'devotional',
  region: 'South India',
  culturalContext: 'Inspired by traditional Tamil devotional iconography of young Murugan (Kandhan), adorned with peacock feather, golden Vel, and divine grace (Karunai).',
  tags: ['South India', 'Devotional', 'Tamil', 'Murugan', 'Vel', 'Auspicious', 'Courage'],
  artwork: MuruganArtwork,
  attachmentPoint: {
    x: 0.5,
    y: 8,
  },
  size: {
    width: 126,
    height: 146,
  },
  ropeStyle: 'gold',
  defaultScale: 1.0,
  defaultRopeLength: 135,
  colorTheme: {
    primary: '#F59E0B',
    accent: '#059669',
    cordPrimary: '#B91C1C',
    cordSecondary: '#FCD34D',
    glow: 'rgba(245, 158, 11, 0.45)',
  },
  physics: {
    swingIntensity: 1.0,
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
    impulse: 1.9,
    duration: 2200,
    particles: 'gold',
    sound: 'temple',
  },
  fortunes: [
    'கந்தன் கருணை எப்போதும் உங்களை வழிநடத்தும் ✦',
    'Courage and clarity illuminate every obstacle ✧',
    'May auspicious grace fill your endeavors with joy ❀',
    'With faith and focused effort, victory is assured 🌟',
    'Joyful spirit brings strength and creative energy ✦',
    'Stand bold and steadfast on your chosen path ✧',
    'Pure devotion transforms challenges into blessings ❀',
    'Walk with courage, wisdom, and boundless kindness ✦',
  ],
  status: 'available',
};
