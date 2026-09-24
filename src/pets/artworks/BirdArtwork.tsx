import React from 'react';
import type { PetArtworkProps } from '../types';

export const BirdArtwork: React.FC<PetArtworkProps> = ({
  state,
  direction,
  isHovered = false,
  scale = 1.0,
  opacity = 1.0,
}) => {
  const isSleeping = state === 'SLEEP';
  const isMoving = state === 'MOVE' || state === 'WANDER';
  const isAlert = state === 'NOTICE_CURSOR' || state === 'INTERACT' || state === 'HUNGRY' || isHovered;

  return (
    <div
      className={`pet-artwork bird-artwork relative transition-all duration-200 ${
        isMoving ? 'animate-bounce' : ''
      }`}
      style={{
        transform: `scale(${scale}) scaleX(${direction === 'left' ? -1 : 1})`,
        opacity,
      }}
    >
      <svg
        width="68"
        height="56"
        viewBox="0 0 68 56"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
      >
        <defs>
          <linearGradient id="birdBlue" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#48CAE4" />
            <stop offset="60%" stopColor="#0096C7" />
            <stop offset="100%" stopColor="#03045E" />
          </linearGradient>
          <radialGradient id="birdYellow" cx="40%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#FFF3B0" />
            <stop offset="60%" stopColor="#FFD166" />
            <stop offset="100%" stopColor="#F4A261" />
          </radialGradient>
        </defs>

        {/* Tail Feathers */}
        <polygon points="12,38 4,32 6,44" fill="#0077B6" stroke="#03045E" strokeWidth="1.2" />

        {/* Bird Body */}
        <ellipse cx="32" cy="34" rx="18" ry="14" fill="url(#birdBlue)" stroke="#03045E" strokeWidth="1.6" />

        {/* Cheerful Golden Breast */}
        <ellipse cx="38" cy="36" rx="11" ry="10" fill="url(#birdYellow)" />

        {/* Wing (Flutters when moving) */}
        {isMoving ? (
          <g transform="translate(24, 26) rotate(-25)">
            <ellipse cx="0" cy="0" rx="12" ry="7" fill="#0077B6" stroke="#03045E" strokeWidth="1.4" />
            <line x1="-6" y1="0" x2="6" y2="0" stroke="#0096C7" strokeWidth="1.2" />
          </g>
        ) : (
          <g transform="translate(26, 32)">
            <ellipse cx="0" cy="0" rx="12" ry="7" fill="#0077B6" stroke="#03045E" strokeWidth="1.4" />
            <line x1="-6" y1="0" x2="6" y2="0" stroke="#0096C7" strokeWidth="1.2" />
          </g>
        )}

        {/* Head */}
        <ellipse
          cx={isSleeping ? 46 : 44}
          cy={isSleeping ? 32 : 22}
          rx="12"
          ry="11"
          fill="url(#birdBlue)"
          stroke="#03045E"
          strokeWidth="1.6"
          transform={isAlert ? 'rotate(-6 44 22)' : undefined}
        />

        {/* Eye */}
        {isSleeping ? (
          <path d="M 42 22 Q 45 25 48 22" stroke="#03045E" strokeWidth="1.6" strokeLinecap="round" fill="none" />
        ) : (
          <>
            <circle cx="44" cy="20" r="3" fill="#0B090A" />
            <circle cx="43" cy="19" r="1.1" fill="#FFFFFF" />
          </>
        )}

        {/* Little Golden Beak */}
        <polygon points="52,22 62,25 52,28" fill="#FB8500" stroke="#9E2A2B" strokeWidth="1" />

        {/* Tiny Perching Feet */}
        {!isMoving && (
          <g stroke="#FB8500" strokeWidth="1.6" strokeLinecap="round">
            <line x1="28" y1="46" x2="26" y2="52" />
            <line x1="36" y1="46" x2="34" y2="52" />
          </g>
        )}
      </svg>
    </div>
  );
};
