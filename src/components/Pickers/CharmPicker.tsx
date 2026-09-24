import React, { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { ALL_CHARMS } from '../../charms/registry';
import type { CharmDefinition } from '../../charms/types';
import { soundEffects } from '../../audio/soundEffects';

interface CharmPickerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCharmId: string;
  onSelectCharm: (charmId: string) => void;
}

export const CharmPicker: React.FC<CharmPickerProps> = ({
  isOpen,
  onClose,
  selectedCharmId,
  onSelectCharm,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  if (!isOpen) return null;

  const categories: { id: string; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'devotional', label: 'Devotional' },
    { id: 'cultural', label: 'Cultural' },
    { id: 'cars', label: 'Cars' },
    { id: 'protection', label: 'Protection' },
    { id: 'prosperity', label: 'Prosperity' },
    { id: 'calm', label: 'Calm' },
    { id: 'goals', label: 'Goals' },
  ];

  const filteredCharms = ALL_CHARMS.filter((c) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'cultural') {
      return c.category === 'cultural' || c.region !== 'Global';
    }
    return c.category === selectedCategory;
  });

  const handleSelect = (charm: CharmDefinition) => {
    onSelectCharm(charm.id);
    soundEffects.playBellJingle(0.5);
  };

  return (
    <div
      className="fixed inset-0 select-none z-50 flex items-center justify-center p-4 bg-[#040810]/75 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[620px] bg-[#0B1220] border border-white/[0.09] rounded-2xl shadow-2xl shadow-black/90 overflow-hidden text-slate-200 text-xs flex flex-col animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06] bg-[#0A101C]">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-bold text-xs">✦</span>
            <span className="font-semibold text-slate-100 text-xs tracking-tight">Choose Your Charm</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1 px-4 py-2 border-b border-white/[0.05] bg-[#0C1424] overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-amber-400/15 text-amber-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Charm Cards Grid */}
        <div className="p-4 grid grid-cols-4 gap-2.5 max-h-[340px] overflow-y-auto">
          {filteredCharms.map((charm) => {
            const isSelected = selectedCharmId === charm.id || (selectedCharmId === 'lucky-cat' && charm.id === 'maneki-neko');
            const ArtworkComponent = charm.artwork;

            return (
              <button
                key={charm.id}
                type="button"
                onClick={() => handleSelect(charm)}
                className={`group relative flex flex-col items-center p-2.5 rounded-xl border text-left transition-all duration-150 cursor-pointer overflow-hidden ${
                  isSelected
                    ? 'bg-amber-400/[0.12] border-amber-400/70 shadow-md shadow-amber-400/10 ring-1 ring-amber-400/40'
                    : 'bg-[#111A2A]/70 border-white/[0.07] hover:bg-[#172236] hover:border-white/[0.16]'
                }`}
              >
                {/* Centered Dimensional Artwork Preview */}
                <div className="relative w-full h-[76px] flex items-center justify-center my-0.5 pointer-events-none transition-transform duration-150 group-hover:scale-105">
                  <ArtworkComponent
                    scale={0.62}
                    angle={0}
                    isHovered={isSelected}
                    isRitual={false}
                    pawWavePhase={1.0}
                    bellJingle={0.4}
                  />
                </div>

                {/* Name & Region */}
                <div className="w-full text-center mt-1 pt-1.5 border-t border-white/[0.05] shrink-0">
                  <div className="flex items-center justify-center gap-1">
                    <span className="font-semibold text-[11px] text-slate-100 tracking-tight group-hover:text-amber-300 transition-colors truncate">
                      {charm.name}
                    </span>
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-sm shadow-amber-400/50 shrink-0" />
                    )}
                  </div>
                  <div className="text-[9.5px] text-slate-400 mt-0.5 truncate capitalize">
                    {charm.region}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer Hint */}
        <div className="px-4 py-2 border-t border-white/[0.05] bg-[#0A101C] flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Click any charm to hang it immediately</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md font-medium text-[11px] cursor-pointer transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
