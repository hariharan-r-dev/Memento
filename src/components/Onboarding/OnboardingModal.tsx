import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { LuckyCat } from '../Charm/LuckyCat';

interface OnboardingModalProps {
  isOpen: boolean;
  onHangItUp: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onHangItUp,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 select-none z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-[320px] bg-slate-900/95 backdrop-blur-2xl border border-amber-400/40 rounded-3xl p-6 shadow-2xl shadow-amber-950/30 text-center text-slate-200 space-y-4 animate-in zoom-in-95 duration-200">
        {/* Cute Mascot Icon */}
        <div className="flex justify-center -mt-2">
          <div className="relative">
            <LuckyCat scale={0.8} pawWavePhase={1.2} isHovered={true} />
            <div className="absolute -top-1 -right-1 p-1 bg-amber-400/20 rounded-full border border-amber-400/60 animate-bounce">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            </div>
          </div>
        </div>

        {/* Title */}
        <div>
          <h2 className="text-base font-bold text-slate-100 tracking-tight">
            Meet your little companion.
          </h2>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed px-2">
            It lives quietly on your screen.
            <br />
            Grab it whenever you need a little luck.
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={onHangItUp}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 group transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <span>Hang it up</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>

        <p className="text-[10px] text-slate-500 font-medium">
          Double-click anytime for an auspicious ritual ✦
        </p>
      </div>
    </div>
  );
};
