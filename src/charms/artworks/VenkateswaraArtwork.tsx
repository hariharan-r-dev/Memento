import React from 'react';
import type { CharmArtworkProps } from '../types';
import venkateswaraImg from '../../assets/charms/venkateswara.png';

export const VenkateswaraArtwork: React.FC<CharmArtworkProps> = ({
  scale = 1.0,
  angle = 0,
  isHovered: _isHovered = false,
  isRitual: _isRitual = false,
  opacity = 1.0,
}) => {
  return (
    <div
      className="charm-artwork venkateswara-artwork relative transition-transform flex flex-col items-center select-none pointer-events-auto"
      style={{
        transform: `rotate(${angle}rad) scale(${scale})`,
        transformOrigin: '50% 6px',
        opacity,
        width: 126,
        height: 212,
      }}
    >
      <img
        src={venkateswaraImg}
        alt="Sri Venkateswara Devotional Charm"
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
