import React from 'react';
import type { CharmArtworkProps } from '../types';
import matchaDrinkImg from '../../assets/charms/matchaDrink.png';

export const MatchaArtwork: React.FC<CharmArtworkProps> = ({
  scale = 1.0,
  angle = 0,
  isHovered: _isHovered = false,
  isRitual: _isRitual = false,
  opacity = 1.0,
}) => {
  return (
    <div
      className="charm-artwork matcha-artwork relative transition-transform flex flex-col items-center select-none pointer-events-auto"
      style={{
        transform: `rotate(${angle}rad) scale(${scale})`,
        transformOrigin: '50% 4px',
        opacity,
        width: 112,
        height: 225,
      }}
    >
      <img
        src={matchaDrinkImg}
        alt="Matcha Artisanal Drink Food Charm"
        className="w-full h-full object-contain pointer-events-auto select-none"
        style={{
          filter: 'none',
          userSelect: 'none',
        }}
        draggable={false}
      />
    </div>
  );
};
