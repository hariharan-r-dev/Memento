import React from 'react';
import type { CharmArtworkProps } from '../types';

export const DarumaArtwork: React.FC<CharmArtworkProps> = ({
  scale = 1.0,
  angle = 0,
  isHovered: _isHovered = false,
  isRitual: _isRitual = false,
  opacity = 1.0,
}) => {
  return (
    <div
      className="charm-artwork daruma-artwork relative transition-transform"
      style={{
        transform: `rotate(${angle}rad) scale(${scale})`,
        transformOrigin: '50% 12px',
        opacity,
      }}
    >
      <svg
        width="114"
        height="128"
        viewBox="0 0 114 128"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
      >
        <defs>
          <radialGradient id="darumaRed" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FF4D6D" />
            <stop offset="30%" stopColor="#E63946" />
            <stop offset="70%" stopColor="#BA181B" />
            <stop offset="100%" stopColor="#660708" />
          </radialGradient>
          <linearGradient id="darumaGold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFF275" />
            <stop offset="40%" stopColor="#FFD166" />
            <stop offset="85%" stopColor="#E09F3E" />
            <stop offset="100%" stopColor="#995D0F" />
          </linearGradient>
          <radialGradient id="darumaFace" cx="50%" cy="45%" r="55%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="85%" stopColor="#FAF0CA" />
            <stop offset="100%" stopColor="#E9D8A6" />
          </radialGradient>
        </defs>

        {/* Top Gold Loop */}
        <path
          d="M 51 14 C 51 6, 63 6, 63 14 C 63 20, 51 20, 51 14 Z"
          stroke="url(#darumaGold)"
          strokeWidth="3.5"
          fill="none"
        />
        <circle cx="57" cy="14" r="3.5" fill="#FFEAA7" />

        {/* Tumbler Roly-Poly Silhouette (Slightly tapered top, wide stable bottom) */}
        <path
          d="
            M 57 26
            C 78 26, 92 40, 96 66
            C 100 92, 88 116, 57 116
            C 26 116, 14 92, 18 66
            C 22 40, 36 26, 57 26 Z
          "
          fill="url(#darumaRed)"
          stroke="#400406"
          strokeWidth="2.5"
        />

        {/* Gold Trim Filigree on Red Body */}
        <path d="M 28 60 Q 57 74 86 60" stroke="url(#darumaGold)" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        <path d="M 26 94 Q 57 110 88 94" stroke="url(#darumaGold)" strokeWidth="2.2" strokeLinecap="round" fill="none" />

        {/* Pale Face Region */}
        <ellipse cx="57" cy="54" rx="28" ry="22" fill="url(#darumaFace)" stroke="#161A1D" strokeWidth="2" />

        {/* Crane Shaped Eyebrows (Tsuru) */}
        <path
          d="M 35 44 C 40 38, 48 38, 51 46 C 45 44, 40 46, 35 44 Z"
          fill="#161A1D"
        />
        <path
          d="M 79 44 C 74 38, 66 38, 63 46 C 69 44, 74 46, 79 44 Z"
          fill="#161A1D"
        />

        {/* Intense Focused Eyes */}
        <circle cx="43" cy="52" r="7" fill="#FFFFFF" stroke="#161A1D" strokeWidth="1.8" />
        <circle cx="71" cy="52" r="7" fill="#FFFFFF" stroke="#161A1D" strokeWidth="1.8" />
        {/* Pupils */}
        <circle cx="43" cy="52" r="4.2" fill="#0B090A" />
        <circle cx="71" cy="52" r="4.2" fill="#0B090A" />
        <circle cx="41.5" cy="50.5" r="1.5" fill="#FFFFFF" />
        <circle cx="69.5" cy="50.5" r="1.5" fill="#FFFFFF" />

        {/* Turtle Shaped Whiskers & Beard (Kame) */}
        <path
          d="M 36 62 Q 43 68 50 62 M 78 62 Q 71 68 64 62"
          stroke="#161A1D"
          strokeWidth="3.2"
          strokeLinecap="round"
          fill="none"
        />
        <path d="M 57 58 L 57 63" stroke="#161A1D" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M 51 67 Q 57 71 63 67" stroke="#BA181B" strokeWidth="2.8" strokeLinecap="round" fill="none" />

        {/* Gold Kanji on Belly: "福" (Fortune) or "勝" (Victory) */}
        <g transform="translate(57, 94)">
          <circle cx="0" cy="0" r="15" fill="#58080A" stroke="url(#darumaGold)" strokeWidth="1.2" />
          <text x="0" y="4" textAnchor="middle" fill="url(#darumaGold)" fontSize="13" fontWeight="bold" fontFamily="serif">福</text>
        </g>

        {/* Ceramic High-Gloss Curvature Highlight */}
        <path
          d="M 30 36 C 24 50, 24 74, 30 90"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.35"
        />
      </svg>
    </div>
  );
};
