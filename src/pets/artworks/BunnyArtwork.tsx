import React from 'react';
import type { PetArtworkProps } from '../types';

export const BunnyArtwork: React.FC<PetArtworkProps> = ({
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
      className={`pet-artwork bunny-artwork relative transition-all duration-200 ${
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
          <linearGradient id="bunnyEarPink" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFC8DD" />
            <stop offset="100%" stopColor="#FFAFCC" />
          </linearGradient>
        </defs>

        {/* Fluffy Round Cotton Tail */}
        <circle cx="12" cy="38" r="5.5" fill="#FFFFFF" stroke="#4A3E3D" strokeWidth="1.4" />

        {/* Body */}
        <ellipse
          cx="34"
          cy={isSitting ? 36 : 38}
          rx={isSitting ? 17 : 19}
          ry={isSitting ? 15 : 13}
          fill="#FAF9F6"
          stroke="#4A3E3D"
          strokeWidth="1.8"
        />

        {/* Head */}
        <ellipse
          cx={isSleeping ? 46 : 42}
          cy={isSleeping ? 38 : 28}
          rx="14"
          ry="12"
          fill="#FAF9F6"
          stroke="#4A3E3D"
          strokeWidth="1.8"
        />

        {/* Long Upright Ears with Pink Centers */}
        {/* Left Ear */}
        <g transform={`translate(${isSleeping ? 42 : 36}, ${isSleeping ? 28 : 16}) rotate(${isAlert ? -10 : -20})`}>
          <ellipse cx="0" cy="-10" rx="4.5" ry="12" fill="#FAF9F6" stroke="#4A3E3D" strokeWidth="1.4" />
          <ellipse cx="0" cy="-10" rx="2.5" ry="9" fill="url(#bunnyEarPink)" />
        </g>
        {/* Right Ear */}
        <g transform={`translate(${isSleeping ? 50 : 46}, ${isSleeping ? 28 : 16}) rotate(${isAlert ? 10 : 15})`}>
          <ellipse cx="0" cy="-10" rx="4.5" ry="12" fill="#FAF9F6" stroke="#4A3E3D" strokeWidth="1.4" />
          <ellipse cx="0" cy="-10" rx="2.5" ry="9" fill="url(#bunnyEarPink)" />
        </g>

        {/* Eyes */}
        {isSleeping ? (
          <path d="M 38 38 Q 41 41 44 38" stroke="#4A3E3D" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        ) : (
          <>
            <circle cx="38" cy="27" r="2.8" fill="#D90429" />
            <circle cx="48" cy="27" r="2.8" fill="#D90429" />
            <circle cx="37" cy="26" r="1" fill="#FFFFFF" />
            <circle cx="47" cy="26" r="1" fill="#FFFFFF" />
          </>
        )}

        {/* Pink Nose & Whiskers */}
        {!isSleeping && (
          <>
            <polygon points="43,31 41,29 45,29" fill="#FF758F" />
            <line x1="33" y1="30" x2="38" y2="31" stroke="#9A8C98" strokeWidth="1" />
            <line x1="33" y1="33" x2="38" y2="33" stroke="#9A8C98" strokeWidth="1" />
            <line x1="48" y1="31" x2="53" y2="30" stroke="#9A8C98" strokeWidth="1" />
            <line x1="48" y1="33" x2="53" y2="33" stroke="#9A8C98" strokeWidth="1" />
          </>
        )}

        {/* Front Paws */}
        {!isSleeping && (
          <>
            <ellipse cx="32" cy="48" rx="4.5" ry="3" fill="#FFFFFF" stroke="#4A3E3D" strokeWidth="1.4" />
            <ellipse cx="42" cy="48" rx="4.5" ry="3" fill="#FFFFFF" stroke="#4A3E3D" strokeWidth="1.4" />
          </>
        )}
      </svg>
    </div>
  );
};
