import React from 'react';
import type { CharmArtworkProps } from '../types';

export const ManekiNekoArtwork: React.FC<CharmArtworkProps> = ({
  scale = 1.0,
  angle = 0,
  isHovered: _isHovered = false,
  isRitual: _isRitual = false,
  pawWavePhase = 0,
  bellJingle = 0,
  opacity = 1.0,
}) => {
  const pawOffset = Math.sin(pawWavePhase) * 9;
  const bellWobble = Math.sin(bellJingle * 18) * 6;

  return (
    <div
      className="charm-artwork maneki-neko-artwork relative transition-transform"
      style={{
        transform: `rotate(${angle}rad) scale(${scale})`,
        transformOrigin: '50% 12px',
        opacity,
      }}
    >
      <svg
        width="112"
        height="124"
        viewBox="0 0 112 124"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
      >
        <defs>
          <linearGradient id="nekoBodyGrad" x1="20" y1="18" x2="92" y2="110" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="60%" stopColor="#FAF7F2" />
            <stop offset="100%" stopColor="#E8E3DA" />
          </linearGradient>
          <linearGradient id="nekoEarPink" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FF8FA3" />
            <stop offset="100%" stopColor="#FF4D6D" />
          </linearGradient>
          <linearGradient id="nekoCollarGrad" x1="25" y1="65" x2="87" y2="75" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#E63946" />
            <stop offset="50%" stopColor="#D90429" />
            <stop offset="100%" stopColor="#9B2226" />
          </linearGradient>
          <linearGradient id="nekoGoldBell" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFF275" />
            <stop offset="40%" stopColor="#FFD166" />
            <stop offset="80%" stopColor="#E09F3E" />
            <stop offset="100%" stopColor="#995D0F" />
          </linearGradient>
          <radialGradient id="nekoCheek" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FF8FA3" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#FF8FA3" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Top Gold Hanging Loop */}
        <path d="M 50 12 C 50 6, 62 6, 62 12 C 62 16, 50 16, 50 12 Z" stroke="url(#nekoGoldBell)" strokeWidth="3" fill="none" />
        <circle cx="56" cy="12" r="3" fill="#FFEAA7" />

        {/* Ears */}
        {/* Left Ear */}
        <path d="M 26 38 C 22 18, 40 18, 44 32 Z" fill="url(#nekoBodyGrad)" stroke="#3D3A45" strokeWidth="2.5" />
        <path d="M 29 35 C 27 24, 38 23, 41 32 Z" fill="url(#nekoEarPink)" />

        {/* Right Ear */}
        <path d="M 86 38 C 90 18, 72 18, 68 32 Z" fill="url(#nekoBodyGrad)" stroke="#3D3A45" strokeWidth="2.5" />
        <path d="M 83 35 C 85 24, 74 23, 71 32 Z" fill="url(#nekoEarPink)" />

        {/* Calico Patch Left */}
        <path d="M 27 34 C 34 26, 44 30, 42 42 C 32 46, 25 40, 27 34 Z" fill="#E76F51" />

        {/* Cat Main Body Porcelain Silhouette */}
        <ellipse cx="56" cy="74" rx="38" ry="40" fill="url(#nekoBodyGrad)" stroke="#3D3A45" strokeWidth="2.5" />

        {/* Head Shape */}
        <ellipse cx="56" cy="46" rx="33" ry="26" fill="url(#nekoBodyGrad)" stroke="#3D3A45" strokeWidth="2.5" />

        {/* Eyes (Happy auspicious arcs) */}
        <path d="M 38 43 Q 44 38 50 43" stroke="#2B2D42" strokeWidth="3.2" strokeLinecap="round" fill="none" />
        <path d="M 62 43 Q 68 38 74 43" stroke="#2B2D42" strokeWidth="3.2" strokeLinecap="round" fill="none" />

        {/* Eyelashes */}
        <path d="M 36 43 L 34 40" stroke="#2B2D42" strokeWidth="2" strokeLinecap="round" />
        <path d="M 76 43 L 78 40" stroke="#2B2D42" strokeWidth="2" strokeLinecap="round" />

        {/* Rosy Cheeks */}
        <circle cx="36" cy="51" r="7" fill="url(#nekoCheek)" />
        <circle cx="76" cy="51" r="7" fill="url(#nekoCheek)" />

        {/* Nose & Mouth */}
        <polygon points="56,48 53,45 59,45" fill="#FF4D6D" />
        <path d="M 56 48 L 56 52 M 56 52 Q 51 56 46 53 M 56 52 Q 61 56 66 53" stroke="#2B2D42" strokeWidth="2.2" strokeLinecap="round" fill="none" />

        {/* Whiskers */}
        <path d="M 22 47 L 34 49 M 20 54 L 33 53" stroke="#8D99AE" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M 90 47 L 78 49 M 92 54 L 79 53" stroke="#8D99AE" strokeWidth="1.8" strokeLinecap="round" />

        {/* Red Silk Collar with Gold Trim */}
        <path d="M 28 66 Q 56 78 84 66" stroke="url(#nekoCollarGrad)" strokeWidth="9" strokeLinecap="round" fill="none" />
        <path d="M 28 66 Q 56 78 84 66" stroke="#FFEAA7" strokeWidth="1.6" strokeLinecap="round" fill="none" />

        {/* Brass Bell with Wobble */}
        <g transform={`translate(${56 + bellWobble * 0.4}, 75)`}>
          <circle cx="0" cy="0" r="8" fill="url(#nekoGoldBell)" stroke="#8A5A00" strokeWidth="1.2" />
          <line x1="-6" y1="-1" x2="6" y2="-1" stroke="#8A5A00" strokeWidth="1.2" />
          <circle cx="0" cy="3" r="2" fill="#593700" />
          <line x1="0" y1="3" x2="0" y2="7" stroke="#593700" strokeWidth="1.2" />
          {/* Bell highlight */}
          <circle cx="-2.5" cy="-2.5" r="2" fill="#FFFFFF" opacity="0.6" />
        </g>

        {/* Koban Gold Oval Coin held on belly */}
        <g transform="translate(56, 96)">
          <rect x="-16" y="-12" width="32" height="24" rx="9" fill="url(#nekoGoldBell)" stroke="#8A5A00" strokeWidth="1.5" />
          <text x="0" y="3" textAnchor="middle" fill="#5A3E00" fontSize="10" fontWeight="bold" fontFamily="serif">千万両</text>
        </g>

        {/* Left Resting Paw */}
        <ellipse cx="34" cy="85" rx="8" ry="11" fill="url(#nekoBodyGrad)" stroke="#3D3A45" strokeWidth="2" />
        <path d="M 31 92 L 31 96 M 36 92 L 36 96" stroke="#3D3A45" strokeWidth="1.5" />

        {/* Right Raised Lucky Waving Paw */}
        <g transform={`translate(78, ${54 + pawOffset})`}>
          <path d="M 0 0 C 10 -12, 18 4, 8 14 C 2 20, -6 12, 0 0 Z" fill="url(#nekoBodyGrad)" stroke="#3D3A45" strokeWidth="2" />
          <ellipse cx="6" cy="4" rx="4" ry="5" fill="url(#nekoEarPink)" />
          {/* Toe divisions */}
          <path d="M 3 0 L 2 -3 M 7 0 L 8 -3" stroke="#3D3A45" strokeWidth="1.5" strokeLinecap="round" />
        </g>

        {/* Ceramic High Gloss Specular Reflection */}
        <ellipse cx="44" cy="38" rx="8" ry="4" fill="#FFFFFF" opacity="0.6" transform="rotate(-20 44 38)" />
      </svg>
    </div>
  );
};
