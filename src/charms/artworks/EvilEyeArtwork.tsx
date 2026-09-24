import React from 'react';
import type { CharmArtworkProps } from '../types';

export const EvilEyeArtwork: React.FC<CharmArtworkProps> = ({
  scale = 1.0,
  angle = 0,
  isHovered: _isHovered = false,
  isRitual: _isRitual = false,
  opacity = 1.0,
}) => {
  return (
    <div
      className="charm-artwork evil-eye-artwork relative transition-transform"
      style={{
        transform: `rotate(${angle}rad) scale(${scale})`,
        transformOrigin: '50% 12px',
        opacity,
      }}
    >
      <svg
        width="112"
        height="136"
        viewBox="0 0 112 136"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
      >
        <defs>
          <linearGradient id="nazarGold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFF3B0" />
            <stop offset="35%" stopColor="#E09F3E" />
            <stop offset="80%" stopColor="#995D0F" />
            <stop offset="100%" stopColor="#FFF3B0" />
          </linearGradient>
          <radialGradient id="nazarCobalt" cx="40%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#1E3A8A" />
            <stop offset="65%" stopColor="#0B1354" />
            <stop offset="100%" stopColor="#03071E" />
          </radialGradient>
          <radialGradient id="nazarWhite" cx="45%" cy="45%" r="55%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="85%" stopColor="#F0F4F8" />
            <stop offset="100%" stopColor="#D9E2EC" />
          </radialGradient>
          <radialGradient id="nazarTurquoise" cx="42%" cy="42%" r="58%">
            <stop offset="0%" stopColor="#00F5D4" />
            <stop offset="45%" stopColor="#00BBF9" />
            <stop offset="85%" stopColor="#0077B6" />
            <stop offset="100%" stopColor="#023E8A" />
          </radialGradient>
          <radialGradient id="nazarPupil" cx="40%" cy="40%" r="55%">
            <stop offset="0%" stopColor="#212529" />
            <stop offset="80%" stopColor="#0D0D0D" />
            <stop offset="100%" stopColor="#000000" />
          </radialGradient>
        </defs>

        {/* Top Gold Filigree Suspension Ring */}
        <path
          d="M 50 14 C 50 6, 62 6, 62 14 C 62 20, 50 20, 50 14 Z"
          stroke="url(#nazarGold)"
          strokeWidth="3.5"
          fill="none"
        />
        <circle cx="56" cy="14" r="3.5" fill="#FFEAA7" />

        {/* Ornate Gold Cap & Floral Prongs */}
        <path
          d="M 44 26 C 44 20, 68 20, 68 26 C 68 30, 64 34, 56 34 C 48 34, 44 30, 44 26 Z"
          fill="url(#nazarGold)"
          stroke="#7F4F06"
          strokeWidth="1.2"
        />
        <circle cx="56" cy="27" r="2.5" fill="#00BBF9" />

        {/* Outer Bezel Rim */}
        <circle cx="56" cy="74" r="42" fill="url(#nazarGold)" stroke="#6C3E00" strokeWidth="1.5" />

        {/* Layer 1: Hand-blown Deep Cobalt Glass Disc */}
        <circle cx="56" cy="74" r="38" fill="url(#nazarCobalt)" />

        {/* Outer Glass Rim Bevel Highlight */}
        <ellipse cx="56" cy="40" rx="26" ry="6" fill="#FFFFFF" opacity="0.18" />

        {/* Layer 2: White Enamel Ring */}
        <circle cx="56" cy="74" r="27" fill="url(#nazarWhite)" stroke="#CBD5E1" strokeWidth="0.8" />

        {/* Layer 3: Vibrant Mediterranean Sky Blue / Turquoise Iris */}
        <circle cx="56" cy="74" r="18" fill="url(#nazarTurquoise)" />

        {/* Layer 4: Deep Obsidian Pupil */}
        <circle cx="56" cy="74" r="9" fill="url(#nazarPupil)" />

        {/* Realistic Curved Glass Specular Highlight (The signature Nazar sheen) */}
        <path
          d="M 40 54 Q 56 46 72 54 Q 56 50 40 54 Z"
          fill="#FFFFFF"
          opacity="0.75"
        />
        <circle cx="48" cy="66" r="3.5" fill="#FFFFFF" opacity="0.85" />
        <circle cx="66" cy="84" r="1.8" fill="#FFFFFF" opacity="0.5" />

        {/* Bottom Small Glass Bead & Gold Droplet */}
        <g transform="translate(56, 120)">
          <path d="M 0 -4 L 0 6" stroke="url(#nazarGold)" strokeWidth="2" />
          <circle cx="0" cy="8" r="4.5" fill="url(#nazarTurquoise)" stroke="url(#nazarGold)" strokeWidth="1.2" />
          <circle cx="-1" cy="7" r="1.2" fill="#FFFFFF" opacity="0.7" />
        </g>
      </svg>
    </div>
  );
};
