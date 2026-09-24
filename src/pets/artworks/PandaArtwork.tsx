import React from 'react';
import type { PetArtworkProps } from '../types';

export const PandaArtwork: React.FC<PetArtworkProps> = ({
  state,
  direction,
  isHovered: _isHovered = false,
  scale = 1.0,
  opacity = 1.0,
}) => {
  const isSleeping = state === 'SLEEP';
  const isSitting = state === 'SIT';
  const isMoving = state === 'MOVE' || state === 'WANDER';

  return (
    <div
      className={`pet-artwork panda-artwork relative transition-all duration-200 ${
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
        {/* Body */}
        <ellipse cx="36" cy="36" rx="21" ry="15" fill="#FFFFFF" stroke="#161A1D" strokeWidth="1.8" />

        {/* Black Shoulder Band & Legs */}
        <path d="M 22 30 C 22 24, 50 24, 50 30 C 50 44, 22 44, 22 30 Z" fill="#212529" />

        {/* Head */}
        <ellipse
          cx={isSleeping ? 46 : 44}
          cy={isSleeping ? 34 : 22}
          rx="16"
          ry="14"
          fill="#FFFFFF"
          stroke="#161A1D"
          strokeWidth="1.8"
        />

        {/* Rounded Black Ears */}
        <circle cx={isSleeping ? 37 : 33} cy={isSleeping ? 24 : 11} r="5" fill="#212529" stroke="#161A1D" strokeWidth="1.2" />
        <circle cx={isSleeping ? 55 : 55} cy={isSleeping ? 24 : 11} r="5" fill="#212529" stroke="#161A1D" strokeWidth="1.2" />

        {/* Iconic Black Eye Patches */}
        <ellipse cx="37" cy="22" rx="4.5" ry="5.5" fill="#212529" transform="rotate(-15 37 22)" />
        <ellipse cx="51" cy="22" rx="4.5" ry="5.5" fill="#212529" transform="rotate(15 51 22)" />

        {/* Eyes */}
        {isSleeping ? (
          <>
            <path d="M 35 22 Q 37 24 39 22" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            <path d="M 49 22 Q 51 24 53 22" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          </>
        ) : (
          <>
            <circle cx="37" cy="22" r="1.8" fill="#FFFFFF" />
            <circle cx="51" cy="22" r="1.8" fill="#FFFFFF" />
            <circle cx="37.5" cy="22" r="1" fill="#0B090A" />
            <circle cx="51.5" cy="22" r="1" fill="#0B090A" />
          </>
        )}

        {/* Snout & Nose */}
        <ellipse cx="44" cy="27" rx="3.5" ry="2.5" fill="#212529" />

        {/* Bamboo Stalk when sitting or hungry */}
        {(isSitting || state === 'HUNGRY') && (
          <g transform="translate(52, 28) rotate(-20)">
            <rect x="0" y="0" width="3.5" height="22" rx="1.5" fill="#52B788" stroke="#2D6A4F" strokeWidth="0.8" />
            <ellipse cx="6" cy="4" rx="4" ry="2" fill="#74C69D" transform="rotate(-30 6 4)" />
            <ellipse cx="-2" cy="12" rx="4" ry="2" fill="#74C69D" transform="rotate(30 -2 12)" />
          </g>
        )}

        {/* Paws */}
        {!isSleeping && (
          <>
            <ellipse cx="30" cy="47" rx="5.5" ry="3.5" fill="#212529" stroke="#161A1D" strokeWidth="1.2" />
            <ellipse cx="44" cy="47" rx="5.5" ry="3.5" fill="#212529" stroke="#161A1D" strokeWidth="1.2" />
          </>
        )}
      </svg>
    </div>
  );
};
