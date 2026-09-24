import React from 'react';
import type { CharmDefinition } from '../types';

interface CharmCardProps {
  charm: CharmDefinition;
  isSelected: boolean;
  onSelect: (charm: CharmDefinition) => void;
}

export const CharmCard: React.FC<CharmCardProps> = ({
  charm,
  isSelected,
  onSelect,
}) => {
  const ArtworkComponent = charm.artwork;

  return (
    <button
      type="button"
      onClick={() => onSelect(charm)}
      className={`group relative flex flex-col items-center p-3 rounded-xl border text-left transition-all duration-150 cursor-pointer overflow-hidden ${
        isSelected
          ? 'bg-amber-400/[0.08] border-amber-400/60 shadow-sm'
          : 'bg-[#111A2A]/70 border-white/[0.07] hover:bg-[#172236] hover:border-white/[0.14]'
      }`}
    >
      {/* Large Centered Artwork */}
      <div className="relative w-full h-[88px] flex items-center justify-center my-0.5 pointer-events-none transition-transform duration-150 group-hover:scale-105">
        <ArtworkComponent
          scale={0.68}
          angle={0}
          isHovered={isSelected}
          isRitual={false}
          pawWavePhase={1.0}
          bellJingle={0.5}
        />
      </div>

      {/* Name and Minimal Tagline */}
      <div className="w-full text-left mt-1.5 pt-1.5 border-t border-white/[0.05] shrink-0">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-xs text-slate-100 tracking-tight group-hover:text-amber-300 transition-colors">
            {charm.name}
          </span>
          {isSelected && (
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-sm shadow-amber-400/50" />
          )}
        </div>
        <div className="text-[10px] text-slate-400 mt-0.5 truncate capitalize">
          {charm.category} · {charm.region}
        </div>
      </div>
    </button>
  );
};
