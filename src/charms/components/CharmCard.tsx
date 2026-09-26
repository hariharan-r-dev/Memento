import React from 'react';
import { Lock } from 'lucide-react';
import type { CharmDefinition } from '../types';

interface CharmCardProps {
  charm: CharmDefinition;
  isSelected: boolean;
  isLocked?: boolean;
  onSelect: (charm: CharmDefinition) => void;
}

export const CharmCard: React.FC<CharmCardProps> = ({
  charm,
  isSelected,
  isLocked = false,
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
          : isLocked
          ? 'bg-[#0E1524]/60 border-white/[0.04] opacity-75 hover:opacity-100 hover:border-white/[0.1]'
          : 'bg-[#111A2A]/70 border-white/[0.07] hover:bg-[#172236] hover:border-white/[0.14]'
      }`}
    >
      {/* Lock Badge if not owned */}
      {isLocked && (
        <div className="absolute top-2 right-2 z-10 p-1 rounded-md bg-black/60 border border-white/10 text-slate-400">
          <Lock className="w-3 h-3 text-amber-400/80" />
        </div>
      )}

      {/* Large Centered Artwork */}
      <div className={`relative w-full h-[88px] flex items-center justify-center my-0.5 pointer-events-none transition-transform duration-150 group-hover:scale-105 ${isLocked ? 'grayscale-[40%]' : ''}`}>
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
          <span className={`font-semibold text-xs tracking-tight transition-colors ${isLocked ? 'text-slate-400' : 'text-slate-100 group-hover:text-amber-300'}`}>
            {charm.name}
          </span>
          {isSelected && (
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-sm shadow-amber-400/50" />
          )}
        </div>
        <div className="text-[10px] text-slate-400 mt-0.5 truncate capitalize flex items-center justify-between">
          <span>{charm.category} · {charm.region}</span>
          {isLocked && <span className="text-[9px] text-amber-500/80 font-medium">Locked</span>}
        </div>
      </div>
    </button>
  );
};

