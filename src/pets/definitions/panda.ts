import type { PetDefinition } from '../types';
import { PandaArtwork } from '../artworks/PandaArtwork';

export const pandaDefinition: PetDefinition = {
  id: 'panda',
  name: 'Chubby Panda',
  subtitle: 'Relaxed • Sleepy',
  personality: 'Relaxed & Slow',
  description: 'A gentle, slow-moving panda that munches bamboo, enjoys peaceful naps, and brings calming energy.',
  tags: ['Relaxed', 'Sleepy', 'Gentle', 'Zen'],
  defaultSize: 1.0,
  defaultOpacity: 1.0,
  movementSpeed: 32,
  behaviorIntensity: 0.8,
  cursorReactionDistance: 90,
  behaviors: {
    wanderChance: 0.15,
    sitChance: 0.5,
    sleepChance: 0.3,
    hungerChance: 0.18,
    interactChance: 0.1,
    idleDurationMin: 3500,
    idleDurationMax: 7000,
    moveDurationMin: 1500,
    moveDurationMax: 3000,
  },
  food: {
    primary: 'Bamboo',
    primaryEmoji: '🎋',
    secondary: 'Bamboo Shoot',
    secondaryEmoji: '🎍',
  },
  artwork: PandaArtwork,
  availableStates: ['IDLE', 'WANDER', 'NOTICE_CURSOR', 'MOVE', 'INTERACT', 'SIT', 'SLEEP', 'HUNGRY'],
  status: 'available',
};
