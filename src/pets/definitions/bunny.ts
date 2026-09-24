import type { PetDefinition } from '../types';
import { BunnyArtwork } from '../artworks/BunnyArtwork';

export const bunnyDefinition: PetDefinition = {
  id: 'bunny',
  name: 'Cotton Bunny',
  subtitle: 'Alert • Playful',
  personality: 'Alert & Energetic',
  description: 'A swift, curious bunny that hops in energetic bursts, pauses with alert twitches, and reacts quickly to your cursor.',
  tags: ['Alert', 'Playful', 'Quick', 'Fluffy'],
  defaultSize: 1.0,
  defaultOpacity: 1.0,
  movementSpeed: 95,
  behaviorIntensity: 1.3,
  cursorReactionDistance: 150,
  behaviors: {
    wanderChance: 0.6,
    sitChance: 0.25,
    sleepChance: 0.05,
    hungerChance: 0.15,
    interactChance: 0.35,
    idleDurationMin: 1200,
    idleDurationMax: 2500,
    moveDurationMin: 1500,
    moveDurationMax: 3500,
  },
  food: {
    primary: 'Carrot',
    primaryEmoji: '🥕',
    secondary: 'Leafy Greens',
    secondaryEmoji: '🥬',
  },
  artwork: BunnyArtwork,
  availableStates: ['IDLE', 'WANDER', 'NOTICE_CURSOR', 'MOVE', 'INTERACT', 'SIT', 'SLEEP', 'HUNGRY'],
  status: 'available',
};
