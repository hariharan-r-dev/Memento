import React from 'react';
import type { PetArtworkProps } from '../types';

export const PuppyArtwork: React.FC<PetArtworkProps> = ({
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
      className={`pet-artwork puppy-artwork relative transition-all duration-200 ${
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
          <linearGradient id="puppyCoat" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F4A261" />
            <stop offset="60%" stopColor="#E76F51" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
        </defs>

        {/* Wagging Puppy Tail */}
        {!isSleeping && (
          <path
            d="M 12 32 C 6 22, 14 16, 12 10"
            stroke="#E76F51"
            strokeWidth="4.5"
            strokeLinecap="round"
            fill="none"
          />
        )}

        {/* Body */}
        {isSleeping ? (
          <ellipse cx="36" cy="38" rx="22" ry="14" fill="url(#puppyCoat)" stroke="#3D2619" strokeWidth="1.8" />
        ) : isSitting ? (
          <ellipse cx="36" cy="36" rx="18" ry="16" fill="url(#puppyCoat)" stroke="#3D2619" strokeWidth="1.8" />
        ) : (
          <ellipse cx="34" cy="34" rx="20" ry="14" fill="url(#puppyCoat)" stroke="#3D2619" strokeWidth="1.8" />
        )}

        {/* White Chest Patch */}
        <ellipse cx="40" cy="36" rx="8" ry="7" fill="#FFF8E7" />

        {/* Head */}
        <ellipse
          cx={isSleeping ? 46 : 44}
          cy={isSleeping ? 36 : 22}
          rx="16"
          ry="14"
          fill="url(#puppyCoat)"
          stroke="#3D2619"
          strokeWidth="1.8"
        />

        {/* Floppy Ears */}
        <path
          d={
            isAlert
              ? 'M 32 16 C 26 14, 24 24, 30 28 Z'
              : 'M 32 16 C 26 18, 24 30, 30 34 Z'
          }
          fill="#BC6C25"
          stroke="#3D2619"
          strokeWidth="1.5"
        />
        <path
          d={
            isAlert
              ? 'M 54 16 C 60 14, 62 24, 56 28 Z'
              : 'M 54 16 C 60 18, 62 30, 56 34 Z'
          }
          fill="#BC6C25"
          stroke="#3D2619"
          strokeWidth="1.5"
        />

        {/* Eyes */}
        {isSleeping ? (
          <path d="M 40 36 Q 44 39 48 36" stroke="#3D2619" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        ) : (
          <>
            <circle cx="39" cy="21" r="3.5" fill="#1C100B" />
            <circle cx="49" cy="21" r="3.5" fill="#1C100B" />
            <circle cx="38" cy="20" r="1.2" fill="#FFFFFF" />
            <circle cx="48" cy="20" r="1.2" fill="#FFFFFF" />
          </>
        )}

        {/* Puppy Snout & Nose */}
        {!isSleeping && (
          <g transform="translate(44, 25)">
            <ellipse cx="0" cy="2" rx="6" ry="4.5" fill="#FFF8E7" />
            <ellipse cx="0" cy="0" rx="3" ry="2" fill="#1C100B" />
            {/* Playful Tongue */}
            {(isAlert || isMoving) && (
              <path d="M -1 5 C -1 9, 3 9, 3 5 Z" fill="#FF5D8F" />
            )}
          </g>
        )}

        {/* Paws */}
        {!isSleeping && (
          <>
            <ellipse cx="32" cy="46" rx="5" ry="3.5" fill="#FFF8E7" stroke="#3D2619" strokeWidth="1.4" />
            <ellipse cx="44" cy="46" rx="5" ry="3.5" fill="#FFF8E7" stroke="#3D2619" strokeWidth="1.4" />
          </>
        )}
      </svg>
    </div>
  );
};
