import React from 'react';

interface TopBracketProps {
  x: number;
  isDragging?: boolean;
  onMouseDown?: (e: React.MouseEvent) => void;
}

export const TopBracket: React.FC<TopBracketProps> = ({
  x,
  isDragging: _isDragging = false,
  onMouseDown,
}) => {
  return (
    <div
      className="top-mount-bracket absolute top-0 -translate-x-1/2 select-none z-30 opacity-100"
      style={{ left: `${x}px` }}
      onMouseDown={onMouseDown}
      title="Slide anchor along screen top"
    >
      <svg width="44" height="14" viewBox="0 0 44 14" fill="none" className="overflow-visible cursor-ew-resize">
        <defs>
          <linearGradient id="bracketMetal" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="60%" stopColor="#0F172A" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>
          <linearGradient id="rivetGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF275" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
        </defs>

        {/* Outer Bracket Body clipped at top screen edge */}
        <path
          d="M 6 0 L 38 0 C 38 0, 36 8, 32 10 C 28 11.5, 16 11.5, 12 10 C 8 8, 6 0, 6 0 Z"
          fill="url(#bracketMetal)"
          stroke="#334155"
          strokeWidth="0.8"
        />

        {/* Horizontal Slide Grip Dots */}
        <circle cx="17" cy="4" r="1.1" fill="#64748B" />
        <circle cx="22" cy="4" r="1.1" fill="#64748B" />
        <circle cx="27" cy="4" r="1.1" fill="#64748B" />

        {/* Brass Rivet Screws */}
        <circle cx="10" cy="3.5" r="1.2" fill="url(#rivetGold)" />
        <circle cx="34" cy="3.5" r="1.2" fill="url(#rivetGold)" />

        {/* Bottom Cord Exit Eyelet */}
        <ellipse cx="22" cy="10" rx="3.5" ry="2" fill="#020617" stroke="url(#rivetGold)" strokeWidth="1" />
      </svg>
    </div>
  );
};
