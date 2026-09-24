import React from 'react';
import type { CharmArtworkProps } from '../types';
import muruganImg from '../../assets/charms/murugan.png';

export const MuruganArtwork: React.FC<CharmArtworkProps> = ({
  scale = 1.0,
  angle = 0,
  isHovered: _isHovered = false,
  isRitual: _isRitual = false,
  opacity = 1.0,
}) => {
  return (
    <div
      className="charm-artwork murugan-artwork relative transition-transform flex flex-col items-center select-none pointer-events-auto"
      style={{
        transform: `rotate(${angle}rad) scale(${scale})`,
        transformOrigin: '50% 8px',
        opacity,
        width: 126,
        height: 146,
      }}
    >
      <img
        src={muruganImg}
        alt="Kandhan Karunai Devotional Charm"
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
