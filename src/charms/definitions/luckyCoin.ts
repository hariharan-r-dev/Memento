import type { CharmDefinition } from '../types';
import { LuckyCoinArtwork } from '../artworks/LuckyCoinArtwork';

export const luckyCoinDefinition: CharmDefinition = {
  id: 'lucky-coin',
  name: 'Lucky Coin',
  shortDescription: 'Ancient Chinese bronze coin tied with an endless mystic knot and silk tassel.',
  category: 'prosperity',
  region: 'East Asia',
  culturalContext: 'Traditionally tied with red silk endless knots in Feng Shui and East Asian traditions to symbolize continuous abundance and prosperous flow.',
  tags: ['East Asia', 'Prosperity', 'Feng Shui', 'Bronze', 'Mystic Knot'],
  artwork: LuckyCoinArtwork,
  attachmentPoint: {
    x: 0.5,
    y: 10,
  },
  size: {
    width: 110,
    height: 140,
  },
  ropeStyle: 'red-white',
  defaultScale: 1.0,
  defaultRopeLength: 135,
  colorTheme: {
    primary: '#D4A373',
    accent: '#D90429',
    cordPrimary: '#D90429',
    cordSecondary: '#FFD166',
    glow: 'rgba(255, 215, 0, 0.45)',
  },
  physics: {
    swingIntensity: 0.95,
    damping: 1.05,
    bounciness: 0.4,
    idleMovement: 0.9,
  },
  physicsConfig: {
    mass: 1.0,
    gravity: 680,
    airDamping: 0.985,
    springStiffness: 120,
    angularDamping: 0.94,
    restLength: 135,
    elasticity: 0.4,
  },
  ritual: {
    impulse: 1.8,
    duration: 2200,
    particles: 'coins',
    sound: 'bell',
  },
  fortunes: [
    'A stream of prosperous opportunities flows your way ✦',
    'Wise investments of your time yield rich rewards ✧',
    'Abundance multiplies through generous actions ❀',
    'May your endeavors attract continuous fortune 🌟',
    'Wealth of mind and spirit enriches every day ✦',
    'New auspicious partnerships are taking root ✧',
    'Golden opportunities align with your preparedness ❀',
    'Smooth financial flow and stability greet you ✦',
  ],
  status: 'available',
};
