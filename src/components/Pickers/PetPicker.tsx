import React from 'react';
import { X, Sparkles, Ban } from 'lucide-react';
import { ALL_PETS } from '../../pets/registry';
import type { PetId } from '../../pets/types';
import { soundEffects } from '../../audio/soundEffects';

interface PetPickerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPetId: PetId;
  showPet: boolean;
  onSelectPet: (petId: PetId, enabled: boolean) => void;
}

export const PetPicker: React.FC<PetPickerProps> = ({
  isOpen,
  onClose,
  selectedPetId,
  showPet,
  onSelectPet,
}) => {
  if (!isOpen) return null;

  const handleSelect = (petId: PetId) => {
    onSelectPet(petId, true);
    soundEffects.playBellJingle(0.5);
  };

  const handleSelectNone = () => {
    onSelectPet(selectedPetId, false);
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
            <span className="text-amber-400 font-bold text-xs">🐾</span>
            <span className="font-semibold text-slate-100 text-xs tracking-tight">Choose Desktop Companion</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Pet Cards Grid */}
        <div className="p-4 grid grid-cols-4 gap-2.5 max-h-[340px] overflow-y-auto">
          {/* None Card */}
          <button
            type="button"
            onClick={handleSelectNone}
            className={`group relative flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all duration-150 cursor-pointer overflow-hidden ${
              !showPet
                ? 'bg-amber-400/[0.12] border-amber-400/70 shadow-md shadow-amber-400/10 ring-1 ring-amber-400/40'
                : 'bg-[#111A2A]/70 border-white/[0.07] hover:bg-[#172236] hover:border-white/[0.16]'
            }`}
          >
            <div className="relative w-full h-[76px] flex items-center justify-center my-0.5 text-slate-400 group-hover:text-slate-200 transition-colors">
              <Ban className="w-9 h-9 stroke-[1.5]" />
            </div>
            <div className="w-full text-center mt-1 pt-1.5 border-t border-white/[0.05] shrink-0">
              <div className="flex items-center justify-center gap-1">
                <span className="font-semibold text-[11px] text-slate-100 tracking-tight">
                  No Pet
                </span>
                {!showPet && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-sm shadow-amber-400/50 shrink-0" />
                )}
              </div>
              <div className="text-[9.5px] text-slate-400 mt-0.5 truncate">
                Hide Companion
              </div>
            </div>
          </button>

          {/* 6 Pets */}
          {ALL_PETS.map((pet) => {
            const isSelected = showPet && selectedPetId === pet.id;
            const ArtworkComponent = pet.artwork;

            return (
              <button
                key={pet.id}
                type="button"
                onClick={() => handleSelect(pet.id)}
                className={`group relative flex flex-col items-center p-2.5 rounded-xl border text-left transition-all duration-150 cursor-pointer overflow-hidden ${
                  isSelected
                    ? 'bg-amber-400/[0.12] border-amber-400/70 shadow-md shadow-amber-400/10 ring-1 ring-amber-400/40'
                    : 'bg-[#111A2A]/70 border-white/[0.07] hover:bg-[#172236] hover:border-white/[0.16]'
                }`}
              >
                {/* Centered Dimensional Pet Preview */}
                <div className="relative w-full h-[76px] flex items-center justify-center my-0.5 pointer-events-none transition-transform duration-150 group-hover:scale-105">
                  <ArtworkComponent
                    state="IDLE"
                    direction="right"
                    isHovered={isSelected}
                    scale={0.78}
                  />
                </div>

                {/* Name & Subtitle */}
                <div className="w-full text-center mt-1 pt-1.5 border-t border-white/[0.05] shrink-0">
                  <div className="flex items-center justify-center gap-1">
                    <span className="font-semibold text-[11px] text-slate-100 tracking-tight group-hover:text-amber-300 transition-colors truncate">
                      {pet.name}
                    </span>
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-sm shadow-amber-400/50 shrink-0" />
                    )}
                  </div>
                  <div className="text-[9.5px] text-slate-400 mt-0.5 truncate flex items-center justify-center gap-1">
                    <span>{pet.food?.primaryEmoji}</span>
                    <span>{pet.subtitle}</span>
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
            <span>Click any companion to activate on desktop</span>
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
