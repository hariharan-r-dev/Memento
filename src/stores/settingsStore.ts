import { useState, useEffect } from 'react';
import type { PetId } from '../pets/types';
import { soundEffects } from '../audio/soundEffects';

export interface AppSettings {
  // Charm
  selectedCharm: string;
  charmSize: number; // 0.70 .. 1.50 (70% .. 150%)
  charmOpacity: number; // 0.3 .. 1.0
  
  // Rope & Appearance
  ropeLength: number; // 95 .. 220
  ropeStyle: 'red-white' | 'gold' | 'indigo' | 'natural' | 'black';
  
  // Physics
  swingIntensity: number; // 0.6 .. 1.4 (default 1.0)
  damping: number; // 0.6 .. 1.4 (default 1.0)
  bounciness: number; // 0.2 .. 0.8 (default 0.45)
  idleMovement: number; // 0.0 .. 1.5 (default 1.0)
  motionSensitivity: number; // 0.6 .. 1.5 (default 1.0)
  
  // Sound
  soundEnabled: boolean; // default true
  soundVolume: number; // 0.0 .. 1.0 (default 0.6)
  bellSoundEnabled: boolean; // default true
  ritualSoundEnabled: boolean; // default true
  
  // Desktop Pet Companion
  selectedPet: PetId;
  showPet: boolean; // default false
  petSize: number; // 0.7 .. 1.5 (default 1.0)
  petOpacity: number; // 0.3 .. 1.0 (default 1.0)
  petBehaviorIntensity: number; // 0.5 .. 1.5 (default 1.0)
  petSoundsEnabled: boolean; // default true
  
  // Rituals
  enableRitual: boolean; // default true
  ritualSound: boolean; // default true
  ritualParticles: boolean; // default true
  fortuneMessagesEnabled: boolean; // default true
  ritualFrequency: 'double-click' | 'hourly' | 'daily';
  
  // Notifications
  notificationsEnabled: boolean; // default false
  ritualNotificationsEnabled: boolean; // default true
  startupNotificationEnabled: boolean; // default false
  
  // General & System
  launchAtStartup: boolean; // default false
  alwaysOnTop: boolean; // default true
  showCharm: boolean; // default true
  startHidden: boolean; // default false
  
  // Positional & State
  anchorX: number;
  hasCompletedOnboarding: boolean;
}

const STORAGE_KEY = 'lucky_charm_settings_v1';

export const getDefaultAnchorX = () => {
  if (typeof window !== 'undefined' && window.innerWidth > 300) {
    return Math.round(window.innerWidth / 2);
  }
  return 960;
};

export const DEFAULT_SETTINGS: AppSettings = {
  selectedCharm: 'maneki-neko',
  charmSize: 1.0,
  charmOpacity: 1.0,
  ropeLength: 135,
  ropeStyle: 'red-white',
  swingIntensity: 1.0,
  damping: 1.0,
  bounciness: 0.45,
  idleMovement: 1.0,
  motionSensitivity: 1.0,
  soundEnabled: true,
  soundVolume: 0.6,
  bellSoundEnabled: true,
  ritualSoundEnabled: true,
  selectedPet: 'cat',
  showPet: false,
  petSize: 1.0,
  petOpacity: 1.0,
  petBehaviorIntensity: 1.0,
  petSoundsEnabled: true,
  enableRitual: true,
  ritualSound: true,
  ritualParticles: true,
  fortuneMessagesEnabled: true,
  ritualFrequency: 'double-click',
  notificationsEnabled: false,
  ritualNotificationsEnabled: true,
  startupNotificationEnabled: false,
  launchAtStartup: false,
  alwaysOnTop: true,
  showCharm: true,
  startHidden: false,
  anchorX: getDefaultAnchorX(),
  hasCompletedOnboarding: true,
};

export const getSavedSettings = (): AppSettings => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Migrate legacy 'lucky-cat' id to 'maneki-neko'
      if (parsed.selectedCharm === 'lucky-cat') {
        parsed.selectedCharm = 'maneki-neko';
      }
      // Migrate old 130px hardcoded anchor to screen center
      if (parsed.anchorX === 130) {
        parsed.anchorX = getDefaultAnchorX();
      }
      // Migrate string charmSize
      if (typeof parsed.charmSize === 'string') {
        parsed.charmSize = parsed.charmSize === 'small' ? 0.85 : parsed.charmSize === 'large' ? 1.25 : 1.0;
      }
      // Defensive checks to guarantee visible charm
      const screenW = typeof window !== 'undefined' && window.innerWidth > 300 ? window.innerWidth : 1920;
      if (typeof parsed.anchorX !== 'number' || isNaN(parsed.anchorX) || parsed.anchorX < 40 || parsed.anchorX > screenW - 40) {
        parsed.anchorX = Math.round(screenW / 2);
      }
      if (typeof parsed.charmOpacity !== 'number' || isNaN(parsed.charmOpacity) || parsed.charmOpacity <= 0) {
        parsed.charmOpacity = 1.0;
      }
      if (typeof parsed.charmSize !== 'number' || isNaN(parsed.charmSize) || parsed.charmSize <= 0) {
        parsed.charmSize = 1.0;
      }
      if (typeof parsed.ropeLength !== 'number' || isNaN(parsed.ropeLength) || parsed.ropeLength <= 0) {
        parsed.ropeLength = 135;
      }

      return {
        ...DEFAULT_SETTINGS,
        ...parsed,
        showCharm: true,
        hasCompletedOnboarding: true,
      };
    }
  } catch (e) {
    console.error('Failed to load settings:', e);
  }
  return { ...DEFAULT_SETTINGS, anchorX: getDefaultAnchorX(), showCharm: true, hasCompletedOnboarding: true };
};

export const saveSettingsToStorage = (settings: AppSettings) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
};

export const useSettings = () => {
  const [settings, setSettingsState] = useState<AppSettings>(() => getSavedSettings());

  useEffect(() => {
    soundEffects.setEnabled(settings.soundEnabled);
    soundEffects.setVolume(settings.soundVolume);
    soundEffects.setBellEnabled(settings.bellSoundEnabled);
    soundEffects.setRitualSoundEnabled(settings.ritualSoundEnabled && settings.ritualSound);
  }, [
    settings.soundEnabled,
    settings.soundVolume,
    settings.bellSoundEnabled,
    settings.ritualSoundEnabled,
    settings.ritualSound,
  ]);

  const updateSettings = (partial: Partial<AppSettings>) => {
    setSettingsState((prev) => {
      const updated = { ...prev, ...partial };
      saveSettingsToStorage(updated);
      return updated;
    });
  };

  const resetAllSettings = () => {
    const reset: AppSettings = {
      ...DEFAULT_SETTINGS,
      anchorX: getDefaultAnchorX(),
      hasCompletedOnboarding: true,
    };
    setSettingsState(reset);
    saveSettingsToStorage(reset);
  };

  return {
    settings,
    updateSettings,
    resetAllSettings,
  };
};
