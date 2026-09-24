import type { PetDefinition } from '../types';
import { PuppyArtwork } from '../artworks/PuppyArtwork';

export const puppyDefinition: PetDefinition = {
  id: 'puppy',
  name: 'Golden Puppy',
  subtitle: 'Playful • Energetic',
  personality: 'Playful & Energetic',
  description: 'An enthusiastic golden puppy that trots cheerfully around the desktop and eagerly notices your cursor.',
  tags: ['Playful', 'Energetic', 'Loyal', 'Cheerful'],
  defaultSize: 1.0,
  defaultOpacity: 1.0,
  movementSpeed: 85,
  behaviorIntensity: 1.2,
  cursorReactionDistance: 160,
  behaviors: {
    wanderChance: 0.5,
    sitChance: 0.2,
    sleepChance: 0.1,
    hungerChance: 0.15,
    interactChance: 0.4,
    idleDurationMin: 1500,
    idleDurationMax: 3000,
    moveDurationMin: 2500,
    moveDurationMax: 5000,
  },
  food: {
    primary: 'Bone',
    primaryEmoji: '🦴',
    secondary: 'Dog Treat',
    secondaryEmoji: '🥩',
  },
  artwork: PuppyArtwork,
  availableStates: ['IDLE', 'WANDER', 'NOTICE_CURSOR', 'MOVE', 'INTERACT', 'SIT', 'SLEEP', 'HUNGRY'],
  status: 'available',
};
