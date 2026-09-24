import type { PetDefinition } from '../types';
import { ShibaArtwork } from '../artworks/ShibaArtwork';

export const shibaDefinition: PetDefinition = {
  id: 'shiba',
  name: 'Shiba Inu',
  subtitle: 'Independent • Curious',
  personality: 'Independent & Curious',
  description: 'A dignified Shiba Inu that explores the screen on its own terms and occasionally gives a curious, playful reaction.',
  tags: ['Independent', 'Curious', 'Loyal', 'Noble'],
  defaultSize: 1.0,
  defaultOpacity: 1.0,
  movementSpeed: 65,
  behaviorIntensity: 1.0,
  cursorReactionDistance: 130,
  behaviors: {
    wanderChance: 0.4,
    sitChance: 0.3,
    sleepChance: 0.15,
    hungerChance: 0.12,
    interactChance: 0.25,
    idleDurationMin: 2000,
    idleDurationMax: 4500,
    moveDurationMin: 2000,
    moveDurationMax: 4500,
  },
  food: {
    primary: 'Dog Treat',
    primaryEmoji: '🍖',
    secondary: 'Bone',
    secondaryEmoji: '🦴',
  },
  artwork: ShibaArtwork,
  availableStates: ['IDLE', 'WANDER', 'NOTICE_CURSOR', 'MOVE', 'INTERACT', 'SIT', 'SLEEP', 'HUNGRY'],
  status: 'available',
};
