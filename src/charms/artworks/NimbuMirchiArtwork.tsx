import React from 'react';
import type { CharmArtworkProps } from '../types';

export const NimbuMirchiArtwork: React.FC<CharmArtworkProps> = ({
  scale = 1.0,
  angle = 0,
  isHovered: _isHovered = false,
  isRitual: _isRitual = false,
  opacity = 1.0,
}) => {
  return (
    <div
      className="charm-artwork nimbu-mirchi-artwork relative transition-transform"
      style={{
        transform: `rotate(${angle}rad) scale(${scale})`,
        transformOrigin: '50% 12px',
        opacity,
      }}
    >
      <svg
        width="116"
        height="148"
        viewBox="0 0 116 148"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
      >
        <defs>
          <radialGradient id="lemonGrad" cx="38%" cy="38%" r="62%">
            <stop offset="0%" stopColor="#FFF9A6" />
            <stop offset="45%" stopColor="#FFEE32" />
            <stop offset="85%" stopColor="#FFD100" />
            <stop offset="100%" stopColor="#D4A017" />
          </radialGradient>
          <linearGradient id="chilliGreen1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#70E000" />
            <stop offset="45%" stopColor="#38B000" />
            <stop offset="100%" stopColor="#004B23" />
          </linearGradient>
          <linearGradient id="chilliGreen2" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#9EF01A" />
            <stop offset="50%" stopColor="#007200" />
            <stop offset="100%" stopColor="#003517" />
          </linearGradient>
          <radialGradient id="charcoalGrad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#4A4E69" />
            <stop offset="60%" stopColor="#22223B" />
            <stop offset="100%" stopColor="#0B090A" />
          </radialGradient>
        </defs>

        {/* Top Black Twine Loop */}
        <path
          d="M 52 14 C 52 6, 64 6, 64 14 C 64 20, 52 20, 52 14 Z"
          stroke="#1F2421"
          strokeWidth="3.2"
          fill="none"
        />

        {/* Small Traditional Protective Charcoal Piece */}
        <rect x="52" y="18" width="12" height="9" rx="3" fill="url(#charcoalGrad)" stroke="#0B090A" strokeWidth="1" />
        <ellipse cx="55" cy="21" rx="2" ry="1" fill="#9A8C98" opacity="0.6" />

        {/* Vertical Black Cord Line */}
        <line x1="58" y1="27" x2="58" y2="40" stroke="#1F2421" strokeWidth="2.5" strokeDasharray="3 1" />

        {/* The 7 Auspicious Green Chillies radiating downward */}
        {/* Chilli 1 (Far Left) */}
        <path
          d="M 54 36 C 42 42, 28 52, 22 72 C 20 78, 22 84, 24 82 C 28 66, 46 54, 55 42 Z"
          fill="url(#chilliGreen1)"
          stroke="#004B23"
          strokeWidth="1.2"
        />
        <path d="M 28 58 Q 36 48 48 42" stroke="#CCFF33" strokeWidth="0.8" opacity="0.6" fill="none" />

        {/* Chilli 2 (Mid Left) */}
        <path
          d="M 55 37 C 46 46, 36 60, 32 82 C 31 88, 35 88, 36 84 C 42 68, 52 56, 56 42 Z"
          fill="url(#chilliGreen2)"
          stroke="#004B23"
          strokeWidth="1.2"
        />

        {/* Chilli 3 (Inner Left) */}
        <path
          d="M 56 38 C 50 48, 44 64, 42 86 C 42 92, 45 92, 47 88 C 50 72, 56 58, 57 44 Z"
          fill="url(#chilliGreen1)"
          stroke="#004B23"
          strokeWidth="1.2"
        />

        {/* Chilli 4 (Center Front) */}
        <path
          d="M 58 38 C 56 52, 54 68, 56 94 C 57 98, 60 98, 60 92 C 62 72, 61 54, 59 44 Z"
          fill="url(#chilliGreen2)"
          stroke="#004B23"
          strokeWidth="1.4"
        />
        <path d="M 57 48 L 57 84" stroke="#CCFF33" strokeWidth="0.8" opacity="0.7" />

        {/* Chilli 5 (Inner Right) */}
        <path
          d="M 60 38 C 66 48, 72 64, 74 86 C 74 92, 71 92, 69 88 C 66 72, 60 58, 59 44 Z"
          fill="url(#chilliGreen1)"
          stroke="#004B23"
          strokeWidth="1.2"
        />

        {/* Chilli 6 (Mid Right) */}
        <path
          d="M 61 37 C 70 46, 80 60, 84 82 C 85 88, 81 88, 80 84 C 74 68, 64 56, 60 42 Z"
          fill="url(#chilliGreen2)"
          stroke="#004B23"
          strokeWidth="1.2"
        />

        {/* Chilli 7 (Far Right) */}
        <path
          d="M 62 36 C 74 42, 88 52, 94 72 C 96 78, 94 84, 92 82 C 88 66, 70 54, 61 42 Z"
          fill="url(#chilliGreen1)"
          stroke="#004B23"
          strokeWidth="1.2"
        />

        {/* Stems Knot Joint / Calyx bundle */}
        <ellipse cx="58" cy="38" rx="7" ry="4" fill="#004B23" stroke="#002910" strokeWidth="1.2" />

        {/* Hanging Black Cord between Chillies and Lemon */}
        <line x1="58" y1="40" x2="58" y2="82" stroke="#1F2421" strokeWidth="2.5" strokeDasharray="3 1" />

        {/* The Plump Fresh Yellow Lemon (Main Talisman Centerpiece) */}
        <g transform="translate(58, 114)">
          {/* Main Lemon Body with Organic Asymmetric Contours */}
          <path
            d="
              M -26 0
              C -26 -20, -18 -26, 0 -26
              C 18 -26, 26 -20, 26 0
              C 26 20, 18 26, 0 26
              C -18 26, -26 20, -26 0 Z
            "
            fill="url(#lemonGrad)"
            stroke="#B58900"
            strokeWidth="1.8"
          />

          {/* Lemon Tip Nipple Top and Bottom */}
          <path d="M 0 -26 C -3 -30, 3 -30, 0 -26 Z" fill="#70E000" stroke="#38B000" strokeWidth="1" />
          <path d="M 0 26 C -3 30, 3 30, 0 26 Z" fill="#B58900" />

          {/* Citrus Skin Pores & Subtle Highlights */}
          <ellipse cx="-8" cy="-8" rx="8" ry="5" fill="#FFFFFF" opacity="0.6" transform="rotate(-25 -8 -8)" />
          <circle cx="-12" cy="6" r="1" fill="#FFFFFF" opacity="0.4" />
          <circle cx="10" cy="-6" r="1.2" fill="#D4A017" opacity="0.5" />
          <circle cx="8" cy="10" r="1.2" fill="#D4A017" opacity="0.5" />

          {/* Black Thread Knot Bottom Tassel */}
          <line x1="0" y1="26" x2="0" y2="34" stroke="#1F2421" strokeWidth="2.2" />
          <circle cx="0" cy="34" r="2" fill="#1F2421" />
        </g>
      </svg>
    </div>
  );
};
