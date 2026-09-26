import React from 'react';
import type { CharmArtworkProps } from '../types';
import croissantImg from '../../assets/charms/croissant.png';

export const CroissantArtwork: React.FC<CharmArtworkProps> = ({
  scale = 1.0,
  angle = 0,
  isHovered: _isHovered = false,
  isRitual: _isRitual = false,
  opacity = 1.0,
}) => {
  return (
    <div
      className="charm-artwork croissant-artwork relative transition-transform flex flex-col items-center select-none pointer-events-auto"
      style={{
        transform: `rotate(${angle}rad) scale(${scale})`,
        transformOrigin: '50% 4px',
        opacity,
        width: 142,
        height: 151,
      }}
    >
      <img
        src={croissantImg}
        alt="Golden Artisan Croissant Food Charm"
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
