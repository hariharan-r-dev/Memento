import React from 'react';
import type { PetArtworkProps } from '../types';

export const ShibaArtwork: React.FC<PetArtworkProps> = ({
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
      className={`pet-artwork shiba-artwork relative transition-all duration-200 ${
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
          <linearGradient id="shibaCoat" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F77F00" />
            <stop offset="60%" stopColor="#D62828" />
            <stop offset="100%" stopColor="#9D0208" />
          </linearGradient>
        </defs>

        {/* Curled Cinnamon Roll Tail */}
        {!isSleeping && (
          <path
            d="M 14 30 C 8 22, 10 12, 18 14 C 22 16, 18 24, 14 22"
            stroke="#F77F00"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
        )}

        {/* Body */}
        {isSleeping ? (
          <ellipse cx="36" cy="38" rx="22" ry="14" fill="url(#shibaCoat)" stroke="#3D1E06" strokeWidth="1.8" />
        ) : isSitting ? (
          <ellipse cx="36" cy="36" rx="18" ry="16" fill="url(#shibaCoat)" stroke="#3D1E06" strokeWidth="1.8" />
        ) : (
          <ellipse cx="34" cy="34" rx="20" ry="14" fill="url(#shibaCoat)" stroke="#3D1E06" strokeWidth="1.8" />
        )}

        {/* White Belly / Urajiro */}
        <ellipse cx="38" cy="38" rx="12" ry="8" fill="#FFFDF0" />

        {/* Head */}
        <ellipse
          cx={isSleeping ? 46 : 44}
          cy={isSleeping ? 36 : 22}
          rx="15"
          ry="14"
          fill="url(#shibaCoat)"
          stroke="#3D1E06"
          strokeWidth="1.8"
        />

        {/* Shiba White Cheek Patches (Urajiro) */}
        <ellipse cx="37" cy="25" rx="6" ry="6" fill="#FFFDF0" />
        <ellipse cx="51" cy="25" rx="6" ry="6" fill="#FFFDF0" />

        {/* Pricked Triangular Ears */}
        <polygon points="34,14 30,3 40,11" fill="url(#shibaCoat)" stroke="#3D1E06" strokeWidth="1.5" />
        <polygon points="34,13 32,6 38,11" fill="#FFC971" />

        <polygon points="48,11 58,3 54,14" fill="url(#shibaCoat)" stroke="#3D1E06" strokeWidth="1.5" />
        <polygon points="50,11 56,6 54,13" fill="#FFC971" />

        {/* White Eyebrow Dots (Maro) */}
        <circle cx="39" cy="16" r="1.8" fill="#FFFDF0" />
        <circle cx="49" cy="16" r="1.8" fill="#FFFDF0" />

        {/* Eyes */}
        {isSleeping ? (
          <path d="M 40 36 Q 44 39 48 36" stroke="#3D1E06" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        ) : (
          <>
            <ellipse cx="39" cy="21" rx="3.2" ry="2.5" fill="#1C100B" />
            <ellipse cx="49" cy="21" rx="3.2" ry="2.5" fill="#1C100B" />
            <circle cx="38" cy="20" r="1" fill="#FFFFFF" />
            <circle cx="48" cy="20" r="1" fill="#FFFFFF" />
          </>
        )}

        {/* Muzzle & Nose */}
        {!isSleeping && (
          <g transform="translate(44, 25)">
            <ellipse cx="0" cy="1" rx="4.5" ry="3.5" fill="#FFFDF0" />
            <polygon points="0,0 -2,-2 2,-2" fill="#1C100B" />
            {isAlert && <path d="M -1 3 C -1 6, 2 6, 2 3 Z" fill="#FF758F" />}
          </g>
        )}

        {/* White Paws */}
        {!isSleeping && (
          <>
            <ellipse cx="32" cy="46" rx="5" ry="3.5" fill="#FFFDF0" stroke="#3D1E06" strokeWidth="1.4" />
            <ellipse cx="44" cy="46" rx="5" ry="3.5" fill="#FFFDF0" stroke="#3D1E06" strokeWidth="1.4" />
          </>
        )}
      </svg>
    </div>
  );
};
