import React, { useState } from 'react';
import type { PetDefinition, PetState } from '../types';
import { getPetById } from '../registry';
import { PetSleepIndicator } from './PetSleepIndicator';
import { PetHungerBubble } from './PetHungerBubble';

interface PetRendererProps {
  pet?: PetDefinition;
  petId?: string;
  x: number;
  y: number;
  scale?: number;
  opacity?: number;
  currentState?: PetState;
  direction?: 'left' | 'right';
  isPetting?: boolean;
  onInteract?: () => void;
  onContextMenu?: (e: React.MouseEvent) => void;
}

export const PetRenderer: React.FC<PetRendererProps> = ({
  pet,
  petId,
  x,
  y,
  scale = 1.0,
  opacity = 1.0,
  currentState = 'IDLE',
  direction = 'right',
  isPetting = false,
  onInteract,
  onContextMenu,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const activePet = pet || getPetById(petId);
  const ArtworkComponent = activePet.artwork;

  return (
    <div
      className="pet-hitbox absolute select-none cursor-pointer z-20 pointer-events-auto transition-transform"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transform: 'translate(-50%, -50%)',
        touchAction: 'none',
      }}
      onClick={onInteract}
      onContextMenu={onContextMenu}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Floating State Overlays */}
      {currentState === 'SLEEP' && <PetSleepIndicator scale={scale} />}
      {currentState === 'HUNGRY' && (
        <PetHungerBubble food={activePet.food} scale={scale} />
      )}

      <ArtworkComponent
        state={currentState}
        direction={direction}
        isHovered={isHovered}
        scale={scale}
        opacity={opacity}
        isPetting={isPetting}
      />
    </div>
  );
};
