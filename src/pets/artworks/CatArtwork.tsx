import React from 'react';
import type { PetArtworkProps } from '../types';

export const CatArtwork: React.FC<PetArtworkProps> = ({
  state,
  direction,
  isHovered = false,
  scale = 1.0,
  opacity = 1.0,
}) => {
  const isSleeping = state === 'SLEEP';
  const isSitting = state === 'SIT';
  const isMoving = state === 'MOVE' || state === 'WANDER';
  const isAlert = state === 'NOTICE_CURSOR' || state === 'INTERACT' || state === 'HUNGRY' || isHovered;

  return (
    <div
      className={`pet-artwork cat-artwork relative transition-all duration-200 ${
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
          <linearGradient id="catCoat" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFA62B" />
            <stop offset="60%" stopColor="#EDE0D4" />
            <stop offset="100%" stopColor="#DDBEA9" />
          </linearGradient>
          <linearGradient id="catEarPink" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFB5A7" />
            <stop offset="100%" stopColor="#F07167" />
          </linearGradient>
        </defs>

        {/* Tail */}
        {!isSleeping ? (
          <path
            d="M 12 36 C 4 30, 2 18, 8 14 C 12 12, 14 18, 14 26"
            stroke="#FFA62B"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
            className="transition-transform origin-bottom duration-300"
          />
        ) : (
          <path d="M 14 42 C 8 40, 10 46, 18 46" stroke="#FFA62B" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        )}

        {/* Main Body */}
        {isSleeping ? (
          <ellipse cx="36" cy="38" rx="22" ry="14" fill="url(#catCoat)" stroke="#4A3E3D" strokeWidth="1.8" />
        ) : isSitting ? (
          <ellipse cx="36" cy="36" rx="18" ry="16" fill="url(#catCoat)" stroke="#4A3E3D" strokeWidth="1.8" />
        ) : (
          <ellipse cx="34" cy="34" rx="20" ry="13" fill="url(#catCoat)" stroke="#4A3E3D" strokeWidth="1.8" />
        )}

        {/* Calico Stripes */}
        <path d="M 30 26 Q 34 22 38 26 M 24 32 Q 28 28 32 32" stroke="#D9480F" strokeWidth="2" strokeLinecap="round" />

        {/* Head */}
        <ellipse
          cx={isSleeping ? 46 : isSitting ? 42 : 44}
          cy={isSleeping ? 38 : isSitting ? 22 : 24}
          rx="15"
          ry="13"
          fill="url(#catCoat)"
          stroke="#4A3E3D"
          strokeWidth="1.8"
        />

        {/* Ears */}
        {/* Left Ear */}
        <path
          d={
            isAlert
              ? 'M 35 16 L 31 4 L 41 12 Z'
              : 'M 35 16 L 33 6 L 41 13 Z'
          }
          fill="url(#catCoat)"
          stroke="#4A3E3D"
          strokeWidth="1.5"
        />
        <polygon points="36,15 34,8 40,13" fill="url(#catEarPink)" />

        {/* Right Ear */}
        <path
          d={
            isAlert
              ? 'M 47 14 L 54 4 L 55 16 Z'
              : 'M 47 14 L 52 6 L 54 16 Z'
          }
          fill="url(#catCoat)"
          stroke="#4A3E3D"
          strokeWidth="1.5"
        />
        <polygon points="48,14 51,8 53,15" fill="url(#catEarPink)" />

        {/* Eyes */}
        {isSleeping ? (
          <path d="M 40 38 Q 44 41 48 38" stroke="#4A3E3D" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        ) : isAlert ? (
          <>
            <circle cx="40" cy="23" r="3.2" fill="#0B090A" />
            <circle cx="48" cy="23" r="3.2" fill="#0B090A" />
            <circle cx="39" cy="22" r="1" fill="#FFFFFF" />
            <circle cx="47" cy="22" r="1" fill="#FFFFFF" />
          </>
        ) : (
          <>
            <path d="M 38 23 Q 41 20 44 23" stroke="#4A3E3D" strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d="M 46 23 Q 49 20 52 23" stroke="#4A3E3D" strokeWidth="2" strokeLinecap="round" fill="none" />
          </>
        )}

        {/* Nose & Whiskers */}
        {!isSleeping && (
          <>
            <polygon points="45,26 43,24 47,24" fill="#FF758F" />
            <path d="M 45 26 L 45 28 M 45 28 Q 43 30 41 28 M 45 28 Q 47 30 49 28" stroke="#4A3E3D" strokeWidth="1.2" strokeLinecap="round" fill="none" />
            <line x1="33" y1="25" x2="39" y2="26" stroke="#9A8C98" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="33" y1="28" x2="39" y2="28" stroke="#9A8C98" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="51" y1="26" x2="57" y2="25" stroke="#9A8C98" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="51" y1="28" x2="57" y2="28" stroke="#9A8C98" strokeWidth="1.2" strokeLinecap="round" />
          </>
        )}

        {/* Paws */}
        {!isSleeping && (
          <>
            <ellipse cx="32" cy="46" rx="5" ry="3" fill="#FFFFFF" stroke="#4A3E3D" strokeWidth="1.4" />
            <ellipse cx="44" cy="46" rx="5" ry="3" fill="#FFFFFF" stroke="#4A3E3D" strokeWidth="1.4" />
          </>
        )}
      </svg>
    </div>
  );
};
