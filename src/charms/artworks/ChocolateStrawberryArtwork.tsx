import React from 'react';
import type { CharmArtworkProps } from '../types';
import chocolateStrawberryImg from '../../assets/charms/chocolateStrawberry.png';

export const ChocolateStrawberryArtwork: React.FC<CharmArtworkProps> = ({
  scale = 1.0,
  angle = 0,
  isHovered: _isHovered = false,
  isRitual: _isRitual = false,
  opacity = 1.0,
}) => {
  return (
    <div
      className="charm-artwork chocolate-strawberry-artwork relative transition-transform flex flex-col items-center select-none pointer-events-auto"
      style={{
        transform: `rotate(${angle}rad) scale(${scale})`,
        transformOrigin: '50% 4px',
        opacity,
        width: 120,
        height: 198,
      }}
    >
      <img
        src={chocolateStrawberryImg}
        alt="Gourmet Chocolate Strawberry Dessert Charm"
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
