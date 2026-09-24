import React from 'react';
import type { CharmArtworkProps } from '../types';

export const HamsaArtwork: React.FC<CharmArtworkProps> = ({
  scale = 1.0,
  angle = 0,
  isHovered: _isHovered = false,
  isRitual: _isRitual = false,
  opacity = 1.0,
}) => {
  return (
    <div
      className="charm-artwork hamsa-artwork relative transition-transform"
      style={{
        transform: `rotate(${angle}rad) scale(${scale})`,
        transformOrigin: '50% 12px',
        opacity,
      }}
    >
      <svg
        width="116"
        height="138"
        viewBox="0 0 116 138"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
      >
        <defs>
          <linearGradient id="hamsaGoldGrad" x1="15" y1="15" x2="100" y2="125" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFF9DB" />
            <stop offset="25%" stopColor="#F5D061" />
            <stop offset="65%" stopColor="#D4A373" />
            <stop offset="90%" stopColor="#A66E38" />
            <stop offset="100%" stopColor="#6F4518" />
          </linearGradient>
          <radialGradient id="hamsaGem" cx="40%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#64DFDF" />
            <stop offset="50%" stopColor="#0096C7" />
            <stop offset="100%" stopColor="#03045E" />
          </radialGradient>
        </defs>

        {/* Top Gold Suspension Ring */}
        <path
          d="M 52 14 C 52 6, 64 6, 64 14 C 64 20, 52 20, 52 14 Z"
          stroke="url(#hamsaGoldGrad)"
          strokeWidth="3.5"
          fill="none"
        />
        <circle cx="58" cy="14" r="3.5" fill="#FFF9DB" />

        {/* Hand Silhouette / Base Plate */}
        <path
          d="
            M 58 24
            C 64 24, 68 28, 68 40
            L 68 46
            C 74 38, 80 42, 80 54
            L 80 68
            C 88 64, 98 72, 94 84
            C 92 92, 84 96, 78 98
            C 76 112, 68 122, 58 122
            C 48 122, 40 112, 38 98
            C 32 96, 24 92, 22 84
            C 18 72, 28 64, 36 68
            L 36 54
            C 36 42, 42 38, 48 46
            L 48 40
            C 48 28, 52 24, 58 24 Z
          "
          fill="url(#hamsaGoldGrad)"
          stroke="#583101"
          strokeWidth="2.2"
        />

        {/* Inner Filigree Border Line */}
        <path
          d="
            M 58 29
            C 62 29, 64 32, 64 42
            L 64 48
            C 70 42, 75 46, 75 56
            L 75 70
            C 82 68, 88 74, 86 82
            C 84 88, 78 92, 73 94
            C 71 106, 64 116, 58 116
            C 52 116, 45 106, 43 94
            C 38 92, 32 88, 30 82
            C 28 74, 34 68, 41 70
            L 41 56
            C 41 46, 46 42, 52 48
            L 52 42
            C 52 32, 54 29, 58 29 Z
          "
          fill="none"
          stroke="#FFF3B0"
          strokeWidth="1.2"
          strokeDasharray="2 2"
        />

        {/* Middle Finger Engraved Lotus / Paisley Palm Ornamentation */}
        <path d="M 58 35 L 58 60" stroke="#7F4F24" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M 51 48 Q 58 40 65 48" stroke="#7F4F24" strokeWidth="1.4" fill="none" />
        <path d="M 45 60 Q 58 52 71 60" stroke="#7F4F24" strokeWidth="1.4" fill="none" />

        {/* Central Protective Eye / Talisman in Palm */}
        <g transform="translate(58, 80)">
          {/* Eye Almond Contour */}
          <path
            d="M -22 0 Q 0 -15 22 0 Q 0 15 -22 0 Z"
            fill="#FFF8E7"
            stroke="#583101"
            strokeWidth="2"
          />
          {/* Blue Gem Iris */}
          <circle cx="0" cy="0" r="10" fill="url(#hamsaGem)" stroke="#03045E" strokeWidth="1.2" />
          {/* Pupil */}
          <circle cx="0" cy="0" r="4.5" fill="#0B090A" />
          {/* Specular Highlight */}
          <circle cx="-2.5" cy="-2.5" r="2" fill="#FFFFFF" opacity="0.9" />
          {/* Radiant Sunburst Eyelashes */}
          <path d="M 0 -15 L 0 -20 M -12 -12 L -16 -16 M 12 -12 L 16 -16" stroke="#7F4F24" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M 0 15 L 0 20 M -12 12 L -16 16 M 12 12 L 16 16" stroke="#7F4F24" strokeWidth="1.5" strokeLinecap="round" />
        </g>

        {/* Bottom Filigree Flourishes */}
        <path d="M 48 106 Q 58 114 68 106" stroke="#7F4F24" strokeWidth="1.5" fill="none" />
        <circle cx="58" cy="110" r="2.5" fill="#0096C7" />

        {/* Gold Specular Highlight Curves */}
        <path d="M 58 26 C 60 26 62 28 62 34" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
        <path d="M 88 78 C 88 74 84 70 80 72" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
      </svg>
    </div>
  );
};
