import React from 'react';
import type { CharmArtworkProps } from '../types';
import pistachioChocolateDonutImg from '../../assets/charms/pistachioChocolateDonut.png';

export const PistachioChocolateDonutArtwork: React.FC<CharmArtworkProps> = ({
  scale = 1.0,
  angle = 0,
  isHovered: _isHovered = false,
  isRitual: _isRitual = false,
  opacity = 1.0,
}) => {
  return (
    <div
      className="charm-artwork pistachio-chocolate-donut-artwork relative transition-transform flex flex-col items-center select-none pointer-events-auto"
      style={{
        transform: `rotate(${angle}rad) scale(${scale})`,
        transformOrigin: '50% 3px',
        opacity,
        width: 144,
        height: 156,
      }}
    >
      <img
        src={pistachioChocolateDonutImg}
        alt="Pistachio Chocolate Donut Food Charm"
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
