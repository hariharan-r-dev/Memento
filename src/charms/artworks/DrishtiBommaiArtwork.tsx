import React from 'react';
import type { CharmArtworkProps } from '../types';

export const DrishtiBommaiArtwork: React.FC<CharmArtworkProps> = ({
  scale = 1.0,
  angle = 0,
  isHovered: _isHovered = false,
  isRitual: _isRitual = false,
  opacity = 1.0,
}) => {
  return (
    <div
      className="charm-artwork drishti-bommai-artwork relative transition-transform"
      style={{
        transform: `rotate(${angle}rad) scale(${scale})`,
        transformOrigin: '50% 12px',
        opacity,
      }}
    >
      <svg
        width="118"
        height="136"
        viewBox="0 0 118 136"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
      >
        <defs>
          <linearGradient id="drishtiFace" x1="20" y1="20" x2="98" y2="115" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2B2D42" />
            <stop offset="50%" stopColor="#1A1C29" />
            <stop offset="100%" stopColor="#0B090A" />
          </linearGradient>
          <linearGradient id="drishtiHorn" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F4A261" />
            <stop offset="50%" stopColor="#E76F51" />
            <stop offset="100%" stopColor="#9B2226" />
          </linearGradient>
          <linearGradient id="drishtiGold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFE49E" />
            <stop offset="50%" stopColor="#FFB703" />
            <stop offset="100%" stopColor="#FB8500" />
          </linearGradient>
          <linearGradient id="drishtiRed" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FF4D6D" />
            <stop offset="100%" stopColor="#D90429" />
          </linearGradient>
        </defs>

        {/* Top Braided Loop */}
        <path
          d="M 53 14 C 53 6, 65 6, 65 14 C 65 20, 53 20, 53 14 Z"
          stroke="#D90429"
          strokeWidth="3.5"
          fill="none"
        />
        <circle cx="59" cy="14" r="3.5" fill="#FFB703" />

        {/* Curved Protective Horns */}
        {/* Left Horn */}
        <path
          d="M 36 44 C 20 30, 15 16, 26 12 C 34 10, 42 24, 46 38 Z"
          fill="url(#drishtiHorn)"
          stroke="#D90429"
          strokeWidth="1.8"
        />
        {/* Right Horn */}
        <path
          d="M 82 44 C 98 30, 103 16, 92 12 C 84 10, 76 24, 72 38 Z"
          fill="url(#drishtiHorn)"
          stroke="#D90429"
          strokeWidth="1.8"
        />

        {/* Main Fierce Mask Silhouette */}
        <path
          d="
            M 59 30
            C 82 30, 96 44, 96 68
            C 96 92, 84 116, 59 116
            C 34 116, 22 92, 22 68
            C 22 44, 36 30, 59 30 Z
          "
          fill="url(#drishtiFace)"
          stroke="#FFB703"
          strokeWidth="2.5"
        />

        {/* Traditional Forehead Vibhuti & Kumkum Tilak */}
        {/* White Tripundra Stripes */}
        <path d="M 40 40 Q 59 44 78 40" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        <path d="M 43 45 Q 59 49 75 45" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        {/* Red Vermilion / Kumkum Dot in Center */}
        <circle cx="59" cy="42" r="4.5" fill="url(#drishtiRed)" stroke="#FFEAA7" strokeWidth="1" />

        {/* Prominent Eye Arches with Vivid Gold/Yellow Rims */}
        <ellipse cx="42" cy="62" rx="14" ry="12" fill="#FFFFFF" stroke="#FFB703" strokeWidth="2" />
        <ellipse cx="76" cy="62" rx="14" ry="12" fill="#FFFFFF" stroke="#FFB703" strokeWidth="2" />

        {/* Fierce Black Pupils */}
        <circle cx="43" cy="62" r="7" fill="#0B090A" />
        <circle cx="75" cy="62" r="7" fill="#0B090A" />
        {/* Specular Glint */}
        <circle cx="41" cy="60" r="2.2" fill="#FFFFFF" />
        <circle cx="73" cy="60" r="2.2" fill="#FFFFFF" />

        {/* Bold Flaming Eyebrows */}
        <path d="M 26 52 Q 40 44 54 52" stroke="#E76F51" strokeWidth="4.5" strokeLinecap="round" fill="none" />
        <path d="M 92 52 Q 78 44 64 52" stroke="#E76F51" strokeWidth="4.5" strokeLinecap="round" fill="none" />

        {/* Broad Nose with Nostrils */}
        <path d="M 59 52 L 59 70 M 52 70 Q 59 74 66 70" stroke="#FFB703" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <circle cx="54" cy="70" r="2.2" fill="#FF4D6D" />
        <circle cx="64" cy="70" r="2.2" fill="#FF4D6D" />

        {/* Auspicious Swept Mustache */}
        <path
          d="M 32 80 Q 59 86 86 80 Q 59 96 32 80 Z"
          fill="#0B090A"
          stroke="#FFB703"
          strokeWidth="1.5"
        />

        {/* Open Mouth with Tongue and Fangs */}
        <path d="M 40 88 Q 59 104 78 88 Z" fill="#9B2226" stroke="#D90429" strokeWidth="1.5" />

        {/* White Curved Protective Fangs */}
        <polygon points="43,87 47,87 45,95" fill="#FFFFFF" />
        <polygon points="71,87 75,87 73,95" fill="#FFFFFF" />

        {/* Protruding Red Tongue */}
        <path
          d="M 52 92 C 52 108, 66 108, 66 92 Z"
          fill="url(#drishtiRed)"
          stroke="#800F2F"
          strokeWidth="1.2"
        />

        {/* Terracotta / Ceramic Glaze Highlight */}
        <path d="M 30 50 C 26 62, 26 80, 32 94" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" opacity="0.3" />
      </svg>
    </div>
  );
};
