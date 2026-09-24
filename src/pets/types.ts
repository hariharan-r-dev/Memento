import React from 'react';

export type PetId = 'cat' | 'puppy' | 'shiba' | 'panda' | 'bunny' | 'bird';

export type PetState =
  | 'IDLE'
  | 'WANDER'
  | 'NOTICE_CURSOR'
  | 'MOVE'
  | 'INTERACT'
  | 'SIT'
  | 'SLEEP'
  | 'HUNGRY';

export interface PetFood {
  primary: string;
  secondary?: string;
  primaryEmoji: string;
  secondaryEmoji?: string;
}

export interface PetArtworkProps {
  state: PetState;
  direction: 'left' | 'right';
  isHovered?: boolean;
  scale?: number;
  opacity?: number;
  isPetting?: boolean;
}

export interface PetBehaviors {
  wanderChance: number;
  sitChance: number;
  sleepChance: number;
  hungerChance: number;
  interactChance: number;
  idleDurationMin: number;
  idleDurationMax: number;
  moveDurationMin: number;
  moveDurationMax: number;
}

export interface PetDefinition {
  id: PetId;
  name: string;
  subtitle: string;
  personality: string;
  description: string;
  tags: string[];
  defaultSize: number;
  defaultOpacity: number;
  movementSpeed: number;
  behaviorIntensity: number;
  cursorReactionDistance: number;
  behaviors: PetBehaviors;
  food: PetFood;
  artwork: React.ComponentType<PetArtworkProps>;
  availableStates: PetState[];
  status: 'available' | 'coming-soon';
}
