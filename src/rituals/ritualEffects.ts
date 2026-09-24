import { soundEffects } from '../audio/soundEffects';

export interface RitualOptions {
  soundProfile?: 'bell' | 'chime' | 'gong' | 'temple' | 'harp';
  particlesType?: 'gold' | 'sparkle' | 'chime' | 'petals' | 'coins';
  soundEnabled?: boolean;
}

export const playRitualAudio = (soundProfile: string = 'bell', soundEnabled: boolean = true) => {
  if (!soundEnabled) return;

  switch (soundProfile) {
    case 'temple':
    case 'chime':
      soundEffects.playRitualSparkle();
      break;
    case 'gong':
      soundEffects.playBellJingle(1.0);
      setTimeout(() => soundEffects.playRitualSparkle(), 100);
      break;
    case 'harp':
    case 'bell':
    default:
      soundEffects.playRitualSparkle();
      break;
  }
};
