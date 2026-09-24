import type { PetDefinition } from '../types';
import { BirdArtwork } from '../artworks/BirdArtwork';

export const birdDefinition: PetDefinition = {
  id: 'bird',
  name: 'Azure Songbird',
  subtitle: 'Curious • Light',
  personality: 'Light & Curious',
  description: 'A cheerful bluebird that perches lightly, hops across your screen, and flutters its wings in curious discovery.',
  tags: ['Curious', 'Light', 'Cheery', 'Flutter'],
  defaultSize: 1.0,
  defaultOpacity: 1.0,
  movementSpeed: 110,
  behaviorIntensity: 1.2,
  cursorReactionDistance: 140,
  behaviors: {
    wanderChance: 0.55,
    sitChance: 0.3,
    sleepChance: 0.1,
    hungerChance: 0.14,
    interactChance: 0.3,
    idleDurationMin: 1500,
    idleDurationMax: 3000,
    moveDurationMin: 1200,
    moveDurationMax: 3000,
  },
  food: {
    primary: 'Seeds',
    primaryEmoji: '🌱',
    secondary: 'Worm',
    secondaryEmoji: '🐛',
  },
  artwork: BirdArtwork,
  availableStates: ['IDLE', 'WANDER', 'NOTICE_CURSOR', 'MOVE', 'INTERACT', 'SIT', 'SLEEP', 'HUNGRY'],
  status: 'available',
};
