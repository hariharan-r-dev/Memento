import React from 'react';
import type { PetFood } from '../types';

interface PetHungerBubbleProps {
  food?: PetFood;
  scale?: number;
}

export const PetHungerBubble: React.FC<PetHungerBubbleProps> = ({
  food = { primary: 'Seeds', primaryEmoji: '🌱' },
  scale = 1.0,
}) => {
  return (
    <div
      className="pet-hunger-indicator absolute pointer-events-none select-none flex flex-col items-center justify-center text-center"
      style={{
        bottom: '88%',
        left: '50%',
        transform: `translateX(-50%) scale(${scale})`,
        zIndex: 25,
        animation: 'petHungerFloat 2.6s ease-in-out infinite',
      }}
      aria-hidden="true"
    >
      {/* Line 1: Thought text */}
      <div
        className="flex items-center justify-center gap-1 font-semibold text-white/95 text-xs whitespace-nowrap drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]"
        style={{
          fontFamily: 'system-ui, -apple-system, sans-serif',
          letterSpacing: '0.02em',
        }}
      >
        <span className="text-[13px] leading-none">💭</span>
        <span>Thinking about food</span>
      </div>

      {/* Line 2: Pet-specific food */}
      <div
        className="flex items-center justify-center gap-1 font-bold text-amber-300 text-xs mt-0.5 whitespace-nowrap drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]"
        style={{
          fontFamily: 'system-ui, -apple-system, sans-serif',
          letterSpacing: '0.03em',
        }}
      >
        <span className="text-sm leading-none">{food.primaryEmoji || '🌱'}</span>
        <span>{food.primary || 'Seeds'}</span>
      </div>

      <style>{`
        @keyframes petHungerFloat {
          0%, 100% {
            transform: translateX(-50%) translateY(0px);
          }
          50% {
            transform: translateX(-50%) translateY(-5px);
          }
        }
      `}</style>
    </div>
  );
};
