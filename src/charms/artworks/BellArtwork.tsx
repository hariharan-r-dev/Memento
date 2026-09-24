import React from 'react';
import type { CharmArtworkProps } from '../types';

export const BellArtwork: React.FC<CharmArtworkProps> = ({
  scale = 1.0,
  angle = 0,
  isHovered: _isHovered = false,
  isRitual: _isRitual = false,
  bellJingle = 0,
  opacity = 1.0,
}) => {
  const paperSway = Math.sin(bellJingle * 12) * 14;

  return (
    <div
      className="charm-artwork bell-artwork relative transition-transform"
      style={{
        transform: `rotate(${angle}rad) scale(${scale})`,
        transformOrigin: '50% 12px',
        opacity,
      }}
    >
      <svg
        width="114"
        height="156"
        viewBox="0 0 114 156"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
      >
        <defs>
          <linearGradient id="bronzeBell" x1="20" y1="20" x2="94" y2="85" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#D4A373" />
            <stop offset="35%" stopColor="#CCD5AE" />
            <stop offset="70%" stopColor="#588157" />
            <stop offset="90%" stopColor="#3A5A40" />
            <stop offset="100%" stopColor="#344E41" />
          </linearGradient>
          <linearGradient id="tanzakuPaper" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FAF0CA" />
            <stop offset="50%" stopColor="#F4A261" />
            <stop offset="100%" stopColor="#E76F51" />
          </linearGradient>
        </defs>

        {/* Top Bronze Suspension Ring */}
        <path
          d="M 51 14 C 51 6, 63 6, 63 14 C 63 20, 51 20, 51 14 Z"
          stroke="#D4A373"
          strokeWidth="3.5"
          fill="none"
        />
        <circle cx="57" cy="14" r="3.5" fill="#FFEAA7" />

        {/* Bell Crown / Top Finial */}
        <ellipse cx="57" cy="26" rx="8" ry="4" fill="#CCD5AE" stroke="#344E41" strokeWidth="1.5" />

        {/* Cast Bronze Temple Bell Flared Body */}
        <path
          d="
            M 49 26
            C 44 38, 30 54, 26 74
            C 24 82, 34 84, 57 84
            C 80 84, 90 82, 88 74
            C 84 54, 70 38, 65 26 Z
          "
          fill="url(#bronzeBell)"
          stroke="#283618"
          strokeWidth="2.2"
        />

        {/* Embossed Horizontal Rims */}
        <path d="M 36 50 Q 57 58 78 50" stroke="#FFEAA7" strokeWidth="1.5" fill="none" opacity="0.8" />
        <path d="M 28 72 Q 57 80 86 72" stroke="#FFEAA7" strokeWidth="1.8" fill="none" opacity="0.9" />

        {/* Lotus Petal Relief Motifs on Bell Skirt */}
        <path d="M 40 68 Q 45 60 50 68" stroke="#FFEAA7" strokeWidth="1.2" fill="none" opacity="0.7" />
        <path d="M 52 68 Q 57 60 62 68" stroke="#FFEAA7" strokeWidth="1.2" fill="none" opacity="0.7" />
        <path d="M 64 68 Q 69 60 74 68" stroke="#FFEAA7" strokeWidth="1.2" fill="none" opacity="0.7" />

        {/* Metallic Bronze Patina Highlight */}
        <path d="M 42 34 C 36 46, 32 60, 32 72" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" opacity="0.35" />

        {/* Clapper / Striker inside bell */}
        <line x1="57" y1="78" x2="57" y2="92" stroke="#D4A373" strokeWidth="2" />
        <circle cx="57" cy="92" r="4.5" fill="#FFEAA7" stroke="#344E41" strokeWidth="1" />

        {/* Swaying Tanzaku Wind-Catcher Paper Strip */}
        <g transform={`translate(57, 96) rotate(${paperSway})`}>
          <line x1="0" y1="0" x2="0" y2="8" stroke="#D4A373" strokeWidth="1.5" />
          {/* Tanzaku Paper Bookmark */}
          <rect
            x="-8"
            y="8"
            width="16"
            height="46"
            rx="3"
            fill="url(#tanzakuPaper)"
            stroke="#D4A373"
            strokeWidth="1.2"
          />
          {/* Poetic Calligraphy Characters: "清風" (Gentle Pure Breeze) */}
          <text x="0" y="24" textAnchor="middle" fill="#58080A" fontSize="9" fontWeight="bold" fontFamily="serif">清</text>
          <text x="0" y="38" textAnchor="middle" fill="#58080A" fontSize="9" fontWeight="bold" fontFamily="serif">風</text>
          <circle cx="0" cy="48" r="1.5" fill="#FFD166" />
        </g>
      </svg>
    </div>
  );
};
