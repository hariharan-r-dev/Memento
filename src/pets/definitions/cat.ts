import type { PetDefinition } from '../types';
import { CatArtwork } from '../artworks/CatArtwork';

export const catDefinition: PetDefinition = {
  id: 'cat',
  name: 'Calico Cat',
  subtitle: 'Calm • Observant',
  personality: 'Calm & Observant',
  description: 'A serene calico companion that slowly wanders, sits contemplatively, and rests peacefully near your work.',
  tags: ['Calm', 'Observant', 'Sleepy', 'Classic'],
  defaultSize: 1.0,
  defaultOpacity: 1.0,
  movementSpeed: 45,
  behaviorIntensity: 1.0,
  cursorReactionDistance: 110,
  behaviors: {
    wanderChance: 0.25,
    sitChance: 0.4,
    sleepChance: 0.2,
    hungerChance: 0.12,
    interactChance: 0.15,
    idleDurationMin: 2500,
    idleDurationMax: 5000,
    moveDurationMin: 2000,
    moveDurationMax: 4000,
  },
  food: {
    primary: 'Fish',
    primaryEmoji: '🐟',
    secondary: 'Milk',
    secondaryEmoji: '🥛',
  },
  artwork: CatArtwork,
  availableStates: ['IDLE', 'WANDER', 'NOTICE_CURSOR', 'MOVE', 'INTERACT', 'SIT', 'SLEEP', 'HUNGRY'],
  status: 'available',
};
