import React from 'react';
import type { CharmArtworkProps } from '../types';
import discoBallStarsImg from '../../assets/charms/discoBallStars.png';

export const DiscoBallStarsArtwork: React.FC<CharmArtworkProps> = ({
  scale = 1.0,
  angle = 0,
  isHovered: _isHovered = false,
  isRitual: _isRitual = false,
  opacity = 1.0,
}) => {
  return (
    <div
      className="charm-artwork disco-ball-stars-artwork relative transition-transform flex flex-col items-center select-none pointer-events-auto"
      style={{
        transform: `rotate(${angle}rad) scale(${scale})`,
        transformOrigin: '50% 3px',
        opacity,
        width: 142,
        height: 156,
      }}
    >
      <img
        src={discoBallStarsImg}
        alt="Mirrored Disco Ball with Blue Stars Food Charm"
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
