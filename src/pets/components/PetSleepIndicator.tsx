import React from 'react';

interface PetSleepIndicatorProps {
  scale?: number;
}

export const PetSleepIndicator: React.FC<PetSleepIndicatorProps> = ({ scale = 1.0 }) => {
  return (
    <div
      className="pet-sleep-indicator absolute pointer-events-none select-none flex items-center justify-center"
      style={{
        bottom: '88%',
        left: '52%',
        transform: `scale(${scale})`,
        zIndex: 25,
      }}
      aria-hidden="true"
    >
      <div className="relative flex items-center justify-center w-8 h-8">
        {/* Animated Z's */}
        <span
          className="pet-zzz zzz-1 absolute font-bold text-sky-200/90 text-xs drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]"
          style={{
            fontFamily: 'system-ui, -apple-system, sans-serif',
            animation: 'petZzzFloat1 2.4s ease-in-out infinite',
            letterSpacing: '0.05em',
          }}
        >
          z
        </span>
        <span
          className="pet-zzz zzz-2 absolute font-bold text-sky-100/95 text-sm drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)]"
          style={{
            fontFamily: 'system-ui, -apple-system, sans-serif',
            animation: 'petZzzFloat2 2.4s ease-in-out 0.8s infinite',
            letterSpacing: '0.05em',
          }}
        >
          Z
        </span>
        <span
          className="pet-zzz zzz-3 absolute font-extrabold text-white text-base drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
          style={{
            fontFamily: 'system-ui, -apple-system, sans-serif',
            animation: 'petZzzFloat3 2.4s ease-in-out 1.6s infinite',
            letterSpacing: '0.05em',
          }}
        >
          Zzz
        </span>
      </div>
      <style>{`
        @keyframes petZzzFloat1 {
          0% {
            opacity: 0;
            transform: translate(0px, 4px) scale(0.6);
          }
          30% {
            opacity: 0.9;
            transform: translate(4px, -6px) scale(0.85);
          }
          70% {
            opacity: 0.7;
            transform: translate(8px, -16px) scale(1.0);
          }
          100% {
            opacity: 0;
            transform: translate(12px, -26px) scale(1.1);
          }
        }
        @keyframes petZzzFloat2 {
          0% {
            opacity: 0;
            transform: translate(0px, 4px) scale(0.6);
          }
          30% {
            opacity: 0.95;
            transform: translate(5px, -8px) scale(0.9);
          }
          70% {
            opacity: 0.75;
            transform: translate(11px, -20px) scale(1.05);
          }
          100% {
            opacity: 0;
            transform: translate(16px, -32px) scale(1.2);
          }
        }
        @keyframes petZzzFloat3 {
          0% {
            opacity: 0;
            transform: translate(0px, 4px) scale(0.6);
          }
          30% {
            opacity: 1;
            transform: translate(6px, -10px) scale(0.95);
          }
          70% {
            opacity: 0.8;
            transform: translate(14px, -24px) scale(1.1);
          }
          100% {
            opacity: 0;
            transform: translate(20px, -38px) scale(1.25);
          }
        }
      `}</style>
    </div>
  );
};
