import React, { useState } from 'react';
import { KeyRound, Sparkles, Loader2, AlertCircle, CheckCircle2, ExternalLink } from 'lucide-react';
import { useLicense } from '../../stores/licenseStore';

interface ActivationModalProps {
  isOpen: boolean;
  onActivated?: () => void;
}

export const ActivationModal: React.FC<ActivationModalProps> = ({
  isOpen,
  onActivated,
}) => {
  const { isActivated, isActivating, activationError, activateLicense, deviceId } = useLicense();
  const [licenseKeyInput, setLicenseKeyInput] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  if (!isOpen || isActivated) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    const trimmed = licenseKeyInput.trim();
    if (!trimmed) {
      setLocalError('Please enter your license key.');
      return;
    }

    const res = await activateLicense(trimmed);
    if (res.success) {
      onActivated?.();
    }
  };

  const errorMessage = localError || activationError;

  return (
    <div className="fixed inset-0 select-none z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 pointer-events-auto">
      <div
        className="w-full max-w-[420px] bg-[#0B1220] border border-amber-400/30 rounded-3xl p-6 shadow-2xl shadow-amber-950/40 text-slate-200 space-y-5 animate-in zoom-in-95 duration-200 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle Ambient Gold Glow Header */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Mascot & Icon Header */}
        <div className="flex flex-col items-center text-center space-y-2 relative">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400/20 to-amber-600/10 border border-amber-400/40 flex items-center justify-center shadow-lg shadow-amber-500/10">
            <KeyRound className="w-6 h-6 text-amber-400" />
          </div>
          <div className="flex items-center gap-1.5 justify-center">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <h2 className="text-lg font-bold text-slate-100 tracking-tight">
              Activate Memento
            </h2>
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <p className="text-xs text-slate-400 leading-relaxed px-2">
            Enter the license key received after your purchase to unlock your selected Mementos.
          </p>
        </div>

        {/* Error Alert Message */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-start gap-2.5 animate-in fade-in duration-150">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div className="leading-snug">{errorMessage}</div>
          </div>
        )}

        {/* License Key Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="license-key-input" className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block px-1">
              License Key
            </label>
            <div className="relative">
              <input
                id="license-key-input"
                type="text"
                autoFocus
                disabled={isActivating}
                placeholder="MEM-XXXX-XXXX-XXXX"
                value={licenseKeyInput}
                onChange={(e) => {
                  setLicenseKeyInput(e.target.value.toUpperCase());
                  if (localError) setLocalError(null);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#131C2E] border border-white/[0.12] focus:border-amber-400/80 focus:ring-2 focus:ring-amber-400/20 text-slate-100 font-mono text-sm tracking-wider outline-none transition-all placeholder:text-slate-600 placeholder:font-sans placeholder:tracking-normal disabled:opacity-50"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isActivating || !licenseKeyInput.trim()}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 disabled:from-slate-700 disabled:to-slate-800 disabled:text-slate-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:cursor-not-allowed disabled:shadow-none"
          >
            {isActivating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Activating Memento...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Activate License</span>
              </>
            )}
          </button>
        </form>

        {/* Purchase Link & Device ID Footer */}
        <div className="pt-2 border-t border-white/[0.06] flex flex-col items-center gap-2 text-center text-[10px] text-slate-500">
          <a
            href="https://buymemento.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
          >
            <span>Don't have a license? Get Memento</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
          <div className="font-mono text-[9px] text-slate-600 select-all">
            Device ID: {deviceId.substring(0, 18)}...
          </div>
        </div>
      </div>
    </div>
  );
};
