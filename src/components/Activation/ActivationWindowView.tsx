import React, { useState, useEffect } from 'react';
import { Sparkles, KeyRound, Loader2, AlertCircle, CheckCircle2, ExternalLink, Copy, Check } from 'lucide-react';
import { useLicense } from '../../stores/licenseStore';
import './activation.css';

const invokeTauri = async (cmd: string, args?: Record<string, unknown>) => {
  try {
    if (typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window) {
      const { invoke } = await import('@tauri-apps/api/core');
      return await invoke(cmd, args);
    }
  } catch (e) {
    console.error(`[invokeTauri] Error calling ${cmd}:`, e);
  }
};

export const ActivationWindowView: React.FC = () => {
  const { isActivating, activationError, activateLicense, deviceId } = useLicense();
  const [licenseKeyInput, setLicenseKeyInput] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [copiedDeviceId, setCopiedDeviceId] = useState(false);
  const [justActivated, setJustActivated] = useState(false);

  // Ensure native pointer events and clean white background for activation window
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.add('activation-window');
      document.body.classList.add('activation-window');
      document.documentElement.style.backgroundColor = '#FFFFFF';
      document.body.style.backgroundColor = '#FFFFFF';
      document.documentElement.style.pointerEvents = 'auto';
      document.body.style.pointerEvents = 'auto';
      const root = document.getElementById('root');
      if (root) {
        root.classList.add('activation-window');
        root.style.pointerEvents = 'auto';
        root.style.backgroundColor = '#FFFFFF';
      }
    }
  }, []);

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
      setJustActivated(true);
      setTimeout(async () => {
        await invokeTauri('complete_activation', {
          license: {
            is_activated: true,
            license_key: trimmed,
            plan: 'memento_single',
            plan_name: 'Memento',
            activated_at: new Date().toISOString(),
          },
        });
      }, 500);
    }
  };

  const handleCopyDeviceId = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(deviceId);
      setCopiedDeviceId(true);
      setTimeout(() => setCopiedDeviceId(false), 2000);
    }
  };

  const errorMessage = localError || activationError;

  return (
    <div className="activation-window-container">
      {/* 1. Header Section */}
      <div className="activation-header">
        <div className="activation-badge-icon">
          <KeyRound style={{ width: 22, height: 22 }} />
        </div>

        <h1 className="activation-title">
          Activate Memento
        </h1>

        <p className="activation-desc">
          Enter the license key received after your purchase to unlock your selected Mementos.
        </p>
      </div>

      {/* 2. Form & Error Section */}
      <div className="activation-form-wrap">
        {justActivated ? (
          <div className="activation-success-card">
            <CheckCircle2 style={{ width: 20, height: 20 }} />
            <span>Memento Activated! Launching...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="activation-form">
            <div className="activation-input-group">
              <label
                htmlFor="activation-license-key"
                className="activation-label"
              >
                License Key
              </label>

              <input
                id="activation-license-key"
                type="text"
                autoFocus
                disabled={isActivating || justActivated}
                placeholder="MEMENTO-XXXX-XXXX-XXXX"
                value={licenseKeyInput}
                onChange={(e) => {
                  setLicenseKeyInput(e.target.value.toUpperCase());
                  if (localError) setLocalError(null);
                }}
                className="activation-input"
              />
            </div>

            {/* Compact Inline Error Container */}
            {errorMessage && (
              <div className="activation-error-card">
                <AlertCircle className="activation-error-icon" />
                <div style={{ flex: 1 }}>{errorMessage}</div>
              </div>
            )}

            {/* Submit Action Button */}
            <button
              type="submit"
              disabled={isActivating || justActivated || !licenseKeyInput.trim()}
              className="activation-button"
            >
              {isActivating ? (
                <>
                  <Loader2 style={{ width: 16, height: 16 }} className="animate-spin" />
                  <span>Activating License...</span>
                </>
              ) : (
                <>
                  <Sparkles style={{ width: 16, height: 16 }} />
                  <span>Activate License</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>

      {/* 3. Footer Section */}
      <div className="activation-footer">
        <a
          href="https://buymemento.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="activation-link"
        >
          <span>Don't have a license? Get Memento</span>
          <ExternalLink style={{ width: 12, height: 12 }} />
        </a>

        <div className="activation-device-row">
          <span>Device ID: {(deviceId || '').substring(0, 16)}...</span>
          <button
            type="button"
            onClick={handleCopyDeviceId}
            title="Copy Device ID"
            className="activation-copy-btn"
          >
            {copiedDeviceId ? (
              <Check style={{ width: 12, height: 12, color: '#10B981' }} />
            ) : (
              <Copy style={{ width: 12, height: 12 }} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivationWindowView;
