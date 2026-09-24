import React from 'react';
import type { PetDefinition } from '../types';
import { ALL_PETS } from '../registry';
import { PetCard } from './PetCard';

interface PetLibraryProps {
  selectedPetId: string;
  onSelectPet: (pet: PetDefinition) => void;
}

export const PetLibrary: React.FC<PetLibraryProps> = ({
  selectedPetId,
  onSelectPet,
}) => {
  return (
    <div className="pet-library-container space-y-2.5">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
        Companion Library
      </div>

      {/* Grid of 6 Pet Cards */}
      <div className="grid grid-cols-2 gap-2.5 max-h-[220px] overflow-y-auto pr-1">
        {ALL_PETS.map((pet) => (
          <PetCard
            key={pet.id}
            pet={pet}
            isSelected={selectedPetId === pet.id}
            onSelect={onSelectPet}
          />
        ))}
      </div>
    </div>
  );
};
