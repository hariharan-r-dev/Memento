import React from 'react';
import type { CharmArtworkProps } from '../types';
import chocolateMilkshakeImg from '../../assets/charms/chocolateMilkshake.png';

export const ChocolateMilkshakeArtwork: React.FC<CharmArtworkProps> = ({
  scale = 1.0,
  angle = 0,
  isHovered: _isHovered = false,
  isRitual: _isRitual = false,
  opacity = 1.0,
}) => {
  return (
    <div
      className="charm-artwork chocolate-milkshake-artwork relative transition-transform flex flex-col items-center select-none pointer-events-auto"
      style={{
        transform: `rotate(${angle}rad) scale(${scale})`,
        transformOrigin: '50% 4px',
        opacity,
        width: 112,
        height: 225,
      }}
    >
      <img
        src={chocolateMilkshakeImg}
        alt="Frozen Chocolate Milkshake Dessert Charm"
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
