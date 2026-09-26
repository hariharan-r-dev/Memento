import { getCharmById } from '../charms/registry';
import { getRandomFortune } from './fortuneMessages';
import { playRitualAudio } from './ritualEffects';
import { sendDesktopNotification } from '../utils/notifications';

export interface ExecuteRitualParams {
  charmId: string;
  onApplyImpulse?: (impulse: number) => void;
  onShowFortune?: (message: string) => void;
  onStartRitualState?: () => void;
  onEndRitualState?: () => void;
  soundEnabled?: boolean;
  notificationsEnabled?: boolean;
  fortuneMessagesEnabled?: boolean;
}

class RitualEngine {
  private activeTimeoutId: number | null = null;

  public triggerRitual({
    charmId,
    onApplyImpulse,
    onShowFortune,
    onStartRitualState,
    onEndRitualState,
    soundEnabled = true,
    notificationsEnabled = false,
    fortuneMessagesEnabled = true,
  }: ExecuteRitualParams) {
    // 1. Clear any ongoing ritual timer
    if (this.activeTimeoutId !== null) {
      clearTimeout(this.activeTimeoutId);
      this.activeTimeoutId = null;
    }

    const charm = getCharmById(charmId);
    const ritualConfig = charm.ritual;

    // 2. Start Ritual State & Particles
    if (onStartRitualState) {
      onStartRitualState();
    }

    // 3. Apply physics impulse
    if (onApplyImpulse) {
      onApplyImpulse(ritualConfig.impulse || 1.8);
    }

    // 4. Play charm-specific sound
    playRitualAudio(ritualConfig.sound, soundEnabled);

    // 5. Pick and display fortune message
    const fortune = getRandomFortune(charmId);
    if (fortuneMessagesEnabled && onShowFortune) {
      onShowFortune(fortune);
    }

    // 6. Send optional desktop notification
    if (notificationsEnabled) {
      sendDesktopNotification(`Memento ✦ ${charm.name}`, fortune);
    }

    // 7. Deterministic cleanup after ritual duration
    const duration = ritualConfig.duration || 2200;
    this.activeTimeoutId = window.setTimeout(() => {
      if (onEndRitualState) {
        onEndRitualState();
      }
      this.activeTimeoutId = null;
    }, duration);
  }

  public cleanup() {
    if (this.activeTimeoutId !== null) {
      clearTimeout(this.activeTimeoutId);
      this.activeTimeoutId = null;
    }
  }
}

export const ritualEngine = new RitualEngine();
