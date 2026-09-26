import { useState, useEffect, useCallback } from 'react';
import {
  getStoredLicense,
  saveLicenseToStorage,
  clearStoredLicense,
  callActivateLicenseApi,
  getOrCreateDeviceId,
  type StoredLicenseData,
  type LicenseEntitlements,
} from '../services/licenseService';
import { ALL_CHARMS } from '../charms/registry';

export interface LicenseState {
  isActivated: boolean;
  isActivating: boolean;
  licenseKey: string | null;
  plan: string | null;
  planName: string | null;
  entitlements: LicenseEntitlements | null;
  ownedMementos: string[];
  deviceId: string;
  activatedAt: string | null;
  activationError: string | null;
}

const getInitialState = (): LicenseState => {
  const deviceId = getOrCreateDeviceId();
  const stored = getStoredLicense();

  if (stored && stored.isActivated) {
    return {
      isActivated: true,
      isActivating: false,
      licenseKey: stored.licenseKey,
      plan: stored.plan,
      planName: stored.planName,
      entitlements: stored.entitlements,
      ownedMementos: stored.ownedMementos || [],
      deviceId,
      activatedAt: stored.activatedAt,
      activationError: null,
    };
  }

  return {
    isActivated: false,
    isActivating: false,
    licenseKey: null,
    plan: null,
    planName: null,
    entitlements: null,
    ownedMementos: [],
    deviceId,
    activatedAt: null,
    activationError: null,
  };
};

export const useLicense = () => {
  const [licenseState, setLicenseState] = useState<LicenseState>(() => getInitialState());

  // Listen for storage and Tauri events across windows (e.g., if activated in Activation window)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'memento_license_v1') {
        setLicenseState(getInitialState());
      }
    };
    window.addEventListener('storage', handleStorageChange);

    let unsub: (() => void) | undefined;
    if (typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window) {
      import('@tauri-apps/api/event').then(({ listen }) => {
        listen('activation-completed', () => {
          setLicenseState(getInitialState());
        }).then((u) => {
          unsub = u;
        });
      }).catch(() => {});
    }

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      if (unsub) unsub();
    };
  }, []);

  const activateLicense = useCallback(async (rawKey: string): Promise<{ success: boolean; error?: string }> => {
    const trimmed = rawKey.trim();
    if (!trimmed) {
      setLicenseState((prev) => ({ ...prev, activationError: 'Please enter a license key.' }));
      return { success: false, error: 'Please enter a license key.' };
    }

    setLicenseState((prev) => ({ ...prev, isActivating: true, activationError: null }));

    try {
      const response = await callActivateLicenseApi(trimmed);

      if (!response.valid) {
        const errorMsg = response.error || 'Activation failed. Please verify your license key.';
        setLicenseState((prev) => ({
          ...prev,
          isActivating: false,
          activationError: errorMsg,
        }));
        return { success: false, error: errorMsg };
      }

      const storedData: StoredLicenseData = {
        isActivated: true,
        licenseKey: response.licenseKey || trimmed,
        plan: response.plan || 'memento_single',
        planName: response.planName || 'Memento',
        entitlements: response.entitlements || { maxMementos: 2, customization: false },
        ownedMementos: response.ownedMementos || [],
        deviceId: getOrCreateDeviceId(),
        activatedAt: response.activatedAt || new Date().toISOString(),
      };

      saveLicenseToStorage(storedData);

      setLicenseState({
        isActivated: true,
        isActivating: false,
        licenseKey: storedData.licenseKey,
        plan: storedData.plan,
        planName: storedData.planName,
        entitlements: storedData.entitlements,
        ownedMementos: storedData.ownedMementos,
        deviceId: storedData.deviceId,
        activatedAt: storedData.activatedAt,
        activationError: null,
      });

      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred during activation.';
      setLicenseState((prev) => ({
        ...prev,
        isActivating: false,
        activationError: msg,
      }));
      return { success: false, error: msg };
    }
  }, []);

  const deactivateLicense = useCallback(async () => {
    clearStoredLicense();
    if (typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window) {
      try {
        const { invoke } = await import('@tauri-apps/api/core');
        await invoke('deactivate_license');
      } catch (_e) {}
    }
    setLicenseState({
      isActivated: false,
      isActivating: false,
      licenseKey: null,
      plan: null,
      planName: null,
      entitlements: null,
      ownedMementos: [],
      deviceId: getOrCreateDeviceId(),
      activatedAt: null,
      activationError: null,
    });
  }, []);

  const isCharmOwned = useCallback((charmId: string): boolean => {
    if (!licenseState.isActivated) return false;
    if (licenseState.plan === 'memento_complete' || (licenseState.entitlements && licenseState.entitlements.maxMementos >= 10)) {
      return true;
    }
    const normalized = charmId === 'lucky-cat' ? 'maneki-neko' : charmId;
    if (licenseState.ownedMementos.includes(normalized)) return true;
    if (normalized === 'murugan' && licenseState.ownedMementos.includes('kandhan')) return true;
    if (normalized === 'kandhan' && licenseState.ownedMementos.includes('murugan')) return true;
    if (normalized === 'red-car' && licenseState.ownedMementos.includes('ferrari')) return true;
    if (normalized === 'ferrari' && licenseState.ownedMementos.includes('red-car')) return true;
    return false;
  }, [licenseState]);

  const getFirstOwnedCharmId = useCallback((): string => {
    if (licenseState.ownedMementos.length > 0) {
      const rawFirst = licenseState.ownedMementos[0];
      if (rawFirst === 'ferrari') return 'red-car';
      if (rawFirst === 'kandhan') return 'murugan';
      if (rawFirst === 'lucky-cat') return 'maneki-neko';
      return rawFirst;
    }
    return ALL_CHARMS[0].id;
  }, [licenseState.ownedMementos]);

  return {
    ...licenseState,
    activateLicense,
    deactivateLicense,
    isCharmOwned,
    getFirstOwnedCharmId,
  };
};
