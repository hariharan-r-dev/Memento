/**
 * License Service & Device Identifier Utility
 * Communicates with Memento backend API for license activation.
 */

const DEVICE_ID_KEY = 'memento_device_id_v1';
const LICENSE_STORAGE_KEY = 'memento_license_v1';

// Default API URL fallback; points to production Memento backend
const API_BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL)
  ? import.meta.env.VITE_API_BASE_URL
  : 'https://buymemento.vercel.app';

export interface LicenseEntitlements {
  maxMementos: number;
  customization: boolean;
}

export interface ActivationResponse {
  valid: boolean;
  plan?: 'memento_single' | 'memento_custom' | 'memento_complete' | string;
  planName?: string;
  entitlements?: LicenseEntitlements;
  ownedMementos?: string[];
  licenseKey?: string;
  activatedAt?: string;
  error?: string;
  message?: string;
}

export interface StoredLicenseData {
  isActivated: boolean;
  licenseKey: string;
  plan: string;
  planName: string;
  entitlements: LicenseEntitlements;
  ownedMementos: string[];
  deviceId: string;
  activatedAt: string;
}

/**
 * Get or generate a persistent device identifier.
 */
export function getOrCreateDeviceId(): string {
  if (typeof window === 'undefined') return 'server-env';
  
  try {
    const existing = localStorage.getItem(DEVICE_ID_KEY);
    if (existing && existing.trim().length > 0) {
      return existing.trim();
    }

    const newId = (typeof crypto !== 'undefined' && crypto.randomUUID)
      ? crypto.randomUUID()
      : 'dev-' + Math.random().toString(36).substring(2, 15) + '-' + Date.now().toString(36);

    localStorage.setItem(DEVICE_ID_KEY, newId);
    return newId;
  } catch (_e) {
    return 'fallback-device-id';
  }
}

/**
 * Detect client platform
 */
export function getClientPlatform(): string {
  if (typeof navigator === 'undefined') return 'windows';
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes('mac') || ua.includes('darwin')) return 'macos';
  if (ua.includes('linux')) return 'linux';
  return 'windows';
}

/**
 * Read locally stored license activation data
 */
export function getStoredLicense(): StoredLicenseData | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(LICENSE_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredLicenseData;
    if (parsed && parsed.isActivated && parsed.licenseKey) {
      return parsed;
    }
  } catch (e) {
    console.error('Failed to parse stored license:', e);
  }
  return null;
}

/**
 * Persist activation data to local storage
 */
export function saveLicenseToStorage(data: StoredLicenseData): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LICENSE_STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save license to storage:', e);
  }
}

/**
 * Clear local activation data
 */
export function clearStoredLicense(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(LICENSE_STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear stored license:', e);
  }
}

/**
 * Call the license activation backend endpoint
 */
export async function callActivateLicenseApi(licenseKey: string): Promise<ActivationResponse> {
  const deviceId = getOrCreateDeviceId();
  const platform = getClientPlatform();
  const trimmedKey = licenseKey.trim().toUpperCase();

  const payload = {
    licenseKey: trimmedKey,
    deviceId,
    platform,
  };

  const endpoint = `${API_BASE_URL.replace(/\/$/, '')}/api/license/activate`;

  // Safe request logging (masked key to protect customer privacy)
  const maskedKey = trimmedKey.length > 8
    ? `${trimmedKey.substring(0, 8)}...${trimmedKey.slice(-4)}`
    : '***';
  console.log(`[Memento License] Calling activation endpoint: ${endpoint} for key: ${maskedKey}`);

  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  } catch (networkErr: unknown) {
    console.error('[Memento License] Network request failed:', networkErr);
    return {
      valid: false,
      error: "Couldn't connect to Memento. Check your internet connection and try again.",
    };
  }

  console.log(`[Memento License] Server responded with HTTP status ${response.status}`);

  let data: any = null;
  try {
    const text = await response.text();
    if (text) {
      data = JSON.parse(text);
    }
  } catch (parseErr) {
    console.warn('[Memento License] Could not parse server response as JSON:', parseErr);
  }

  // Handle server-side errors
  if (!response.ok || !data || data.valid === false || data.success === false) {
    if (response.status >= 500) {
      console.error('[Memento License] Server 5xx error:', response.status, data);
      return {
        valid: false,
        error: "Memento couldn't verify your license right now. Please try again.",
      };
    }

    // 400 / 401 / 403 / 404: Invalid license
    const rawError = data?.error || data?.message;
    console.warn('[Memento License] Activation rejected:', response.status, rawError);

    let userFriendlyError = 'This license key is invalid or has not been activated.';
    if (rawError && typeof rawError === 'string') {
      if (rawError.toLowerCase().includes('device limit')) {
        userFriendlyError = 'Device limit reached for this license key.';
      } else if (rawError.toLowerCase().includes('expired')) {
        userFriendlyError = 'This license key has expired.';
      } else if (rawError.toLowerCase().includes('invalid')) {
        userFriendlyError = 'This license key is invalid or has not been activated.';
      } else {
        userFriendlyError = rawError;
      }
    }

    return {
      valid: false,
      error: userFriendlyError,
    };
  }

  // Determine entitlements and plan details from successful response
  const plan = data.plan || 'memento_single';
  const planName = data.planName || (plan === 'memento_complete' ? 'Memento Complete' : plan === 'memento_custom' ? 'Memento Custom' : 'Memento Standard');
  
  // If complete plan, all registered charms are unlocked dynamically
  let ownedMementos: string[] = Array.isArray(data.ownedMementos) ? data.ownedMementos : [];
  if (plan === 'memento_complete' || data.entitlements?.maxMementos >= 10) {
    ownedMementos = [
      'maneki-neko',
      'evil-eye',
      'hamsa',
      'drishti-bommai',
      'nimbu-mirchi',
      'daruma',
      'lucky-coin',
      'bell',
      'venkateswara',
      'murugan',
      'red-car',
    ];
  }

  const entitlements: LicenseEntitlements = {
    maxMementos: data.entitlements?.maxMementos ?? (plan === 'memento_complete' ? 11 : 2),
    customization: data.entitlements?.customization ?? (plan !== 'memento_single'),
  };

  console.log(`[Memento License] Activation successful. Plan: ${planName}, Owned: ${ownedMementos.length} items`);

  return {
    valid: true,
    plan,
    planName,
    entitlements,
    ownedMementos,
    licenseKey: trimmedKey,
    activatedAt: data.activatedAt || new Date().toISOString(),
  };
}
