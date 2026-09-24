import React from 'react';
import type { CharmArtworkProps } from '../types';
import redCarImg from '../../assets/charms/redCar.png';

export const RedCarArtwork: React.FC<CharmArtworkProps> = ({
  scale = 1.0,
  angle = 0,
  isHovered: _isHovered = false,
  isRitual: _isRitual = false,
  opacity = 1.0,
}) => {
  return (
    <div
      className="charm-artwork red-car-artwork relative transition-transform flex flex-col items-center select-none pointer-events-auto"
      style={{
        transform: `rotate(${angle}rad) scale(${scale})`,
        transformOrigin: '50% 8px',
        opacity,
        width: 142,
        height: 170,
      }}
    >
      <img
        src={redCarImg}
        alt="Red Exotic Sports Car Charm"
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
