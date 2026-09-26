import type { CharmDefinition } from '../types';
import { IronManArtwork } from '../artworks/IronManArtwork';

export const ironManDefinition: CharmDefinition = {
  id: 'iron-man',
  name: 'Iron Avenger',
  shortDescription: 'A high-tech armored superhero talisman embodying genius, courage, and unwavering protection.',
  category: 'marvel',
  region: 'Marvel Universe',
  culturalContext: 'Forged with high-tech red-and-gold armor and an arc reactor core, symbolizing ingenuity, resilience, and boundless heroic spirit.',
  tags: ['Marvel', 'Superhero', 'Avenger', 'Armor', 'Tech', 'Courage', 'Protection', 'Hero'],
  artwork: IronManArtwork,
  attachmentPoint: {
    x: 0.5,
    y: 12,
  },
  size: {
    width: 116,
    height: 228,
  },
  ropeStyle: 'red-white',
  defaultScale: 1.0,
  defaultRopeLength: 135,
  colorTheme: {
    primary: '#DC2626',
    accent: '#EAB308',
    cordPrimary: '#B91C1C',
    cordSecondary: '#FACC15',
    glow: 'rgba(234, 179, 8, 0.45)',
  },
  physics: {
    swingIntensity: 1.05,
    damping: 0.95,
    bounciness: 0.5,
    idleMovement: 1.0,
  },
  physicsConfig: {
    mass: 1.15,
    gravity: 700,
    airDamping: 0.98,
    springStiffness: 130,
    angularDamping: 0.95,
    restLength: 135,
    elasticity: 0.5,
  },
  ritual: {
    impulse: 2.2,
    duration: 2200,
    particles: 'sparkle',
    sound: 'chime',
  },
  fortunes: [
    'I am Iron Man — power your ambitions with unstoppable energy ⚡',
    'Ingenuity and resolve turn impossible odds into victory ✦',
    'Forge your own destiny with bold vision and resilience 🛡️',
    'Armor up your focus and let your inner spark shine ✧',
    'Every obstacle is just an engineering challenge waiting to be solved ⚙️',
    'Lead with heart, courage, and groundbreaking innovation 🌟',
  ],
  status: 'available',
};
