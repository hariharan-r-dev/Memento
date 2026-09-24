import type { PetDefinition, PetId } from './types';
import { catDefinition } from './definitions/cat';
import { puppyDefinition } from './definitions/puppy';
import { shibaDefinition } from './definitions/shiba';
import { pandaDefinition } from './definitions/panda';
import { bunnyDefinition } from './definitions/bunny';
import { birdDefinition } from './definitions/bird';

export const ALL_PETS: PetDefinition[] = [
  catDefinition,
  puppyDefinition,
  shibaDefinition,
  pandaDefinition,
  bunnyDefinition,
  birdDefinition,
];

export const DEFAULT_PET_ID: PetId = 'cat';

export const getPetById = (id?: string | null): PetDefinition => {
  if (!id) return catDefinition;
  const match = ALL_PETS.find((p) => p.id === id);
  return match || catDefinition;
};
