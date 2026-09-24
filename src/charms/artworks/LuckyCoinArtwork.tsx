import React from 'react';
import type { CharmArtworkProps } from '../types';

export const LuckyCoinArtwork: React.FC<CharmArtworkProps> = ({
  scale = 1.0,
  angle = 0,
  isHovered: _isHovered = false,
  isRitual: _isRitual = false,
  opacity = 1.0,
}) => {
  return (
    <div
      className="charm-artwork lucky-coin-artwork relative transition-transform"
      style={{
        transform: `rotate(${angle}rad) scale(${scale})`,
        transformOrigin: '50% 12px',
        opacity,
      }}
    >
      <svg
        width="114"
        height="146"
        viewBox="0 0 114 146"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
      >
        <defs>
          <linearGradient id="coinGold" x1="20" y1="40" x2="94" y2="114" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFF275" />
            <stop offset="30%" stopColor="#FFD166" />
            <stop offset="60%" stopColor="#D4A373" />
            <stop offset="85%" stopColor="#A66E38" />
            <stop offset="100%" stopColor="#5E3023" />
          </linearGradient>
          <linearGradient id="redSilkKnot" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FF4D6D" />
            <stop offset="50%" stopColor="#D90429" />
            <stop offset="100%" stopColor="#7F0909" />
          </linearGradient>
          <radialGradient id="jadeBead" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#B7E4C7" />
            <stop offset="45%" stopColor="#52B788" />
            <stop offset="85%" stopColor="#2D6A4F" />
            <stop offset="100%" stopColor="#081C15" />
          </radialGradient>
        </defs>

        {/* Top Red Silk Hanging Loop */}
        <path
          d="M 51 12 C 51 6, 63 6, 63 12 C 63 18, 51 18, 51 12 Z"
          stroke="url(#redSilkKnot)"
          strokeWidth="3.2"
          fill="none"
        />

        {/* Traditional Endless Mystic Knot (Pan Chang) */}
        <g transform="translate(57, 28)">
          <rect x="-14" y="-10" width="28" height="20" rx="6" fill="url(#redSilkKnot)" stroke="#590D22" strokeWidth="1.2" />
          <rect x="-10" y="-14" width="20" height="28" rx="6" fill="url(#redSilkKnot)" stroke="#590D22" strokeWidth="1.2" />
          {/* Inner Knot Weave lines */}
          <rect x="-6" y="-6" width="12" height="12" fill="#590D22" />
          <circle cx="0" cy="0" r="2.5" fill="#FFD166" />
        </g>

        {/* Jade Bead Spacer */}
        <circle cx="57" cy="46" r="4" fill="url(#jadeBead)" stroke="#081C15" strokeWidth="0.8" />
        <circle cx="55.5" cy="44.5" r="1.2" fill="#FFFFFF" opacity="0.8" />

        {/* Ancient Chinese Feng Shui Bronze/Gold Coin */}
        <g transform="translate(57, 82)">
          {/* Outer Coin Rim */}
          <circle cx="0" cy="0" r="32" fill="url(#coinGold)" stroke="#3D2619" strokeWidth="2" />
          {/* Inner Raised Bevel Ring */}
          <circle cx="0" cy="0" r="28" fill="none" stroke="#FFEAA7" strokeWidth="1.2" strokeOpacity="0.8" />

          {/* Square Center Cutout */}
          <rect x="-10" y="-10" width="20" height="20" rx="1.5" fill="#1C100B" stroke="#8A5A00" strokeWidth="1.5" />
          <rect x="-8" y="-8" width="16" height="16" fill="none" stroke="#FFEAA7" strokeWidth="0.8" />

          {/* 4 Embossed Imperial Seal Characters (Top, Bottom, Right, Left) */}
          <text x="0" y="-16" textAnchor="middle" fill="#42240C" fontSize="8" fontWeight="bold" fontFamily="serif">招</text>
          <text x="0" y="22" textAnchor="middle" fill="#42240C" fontSize="8" fontWeight="bold" fontFamily="serif">寶</text>
          <text x="18" y="3" textAnchor="middle" fill="#42240C" fontSize="8" fontWeight="bold" fontFamily="serif">財</text>
          <text x="-18" y="3" textAnchor="middle" fill="#42240C" fontSize="8" fontWeight="bold" fontFamily="serif">進</text>

          {/* Specular Curved Highlight on Metallic Surface */}
          <path d="M -22 -14 Q 0 -28 22 -14" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" fill="none" />
        </g>

        {/* Lower Jade Bead & Red Silk Tassel */}
        <circle cx="57" cy="118" r="3.5" fill="url(#jadeBead)" stroke="#081C15" strokeWidth="0.8" />
        <g transform="translate(57, 122)">
          {/* Tassel Cap */}
          <path d="M -6 0 L 6 0 L 4 4 L -4 4 Z" fill="#FFEAA7" stroke="#8A5A00" strokeWidth="0.8" />
          {/* Flowing Tassel Strands */}
          <line x1="-4" y1="4" x2="-6" y2="22" stroke="url(#redSilkKnot)" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="-1" y1="4" x2="-2" y2="24" stroke="url(#redSilkKnot)" strokeWidth="2" strokeLinecap="round" />
          <line x1="2" y1="4" x2="2" y2="24" stroke="url(#redSilkKnot)" strokeWidth="2" strokeLinecap="round" />
          <line x1="5" y1="4" x2="7" y2="22" stroke="url(#redSilkKnot)" strokeWidth="1.8" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
};
