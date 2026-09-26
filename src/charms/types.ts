import React from 'react';
import type { CharmPhysicsParams } from '../physics/pendulum';

export type CharmCategory =
  | 'all'
  | 'protection'
  | 'prosperity'
  | 'calm'
  | 'goals'
  | 'cultural'
  | 'devotional'
  | 'cars'
  | 'marvel'
  | 'food';

export interface CharmArtworkProps {
  scale?: number;
  angle?: number;
  isHovered?: boolean;
  isRitual?: boolean;
  pawWavePhase?: number;
  bellJingle?: number;
  opacity?: number;
}

export interface CharmDefinition {
  id: string;
  name: string;
  shortDescription: string;
  category: 'protection' | 'prosperity' | 'calm' | 'goals' | 'cultural' | 'devotional' | 'cars' | 'marvel' | 'food';
  region: string;
  culturalContext: string;
  tags: string[];
  artwork: React.ComponentType<CharmArtworkProps>;
  attachmentPoint: {
    x: number;
    y: number;
  };
  size?: {
    width: number;
    height: number;
  };
  ropeStyle: 'red-white' | 'gold' | 'indigo' | 'natural' | 'black';
  defaultScale: number;
  defaultRopeLength: number;
  colorTheme: {
    primary: string;
    accent: string;
    cordPrimary: string;
    cordSecondary: string;
    glow: string;
  };
  physics: {
    swingIntensity: number;
    damping: number;
    bounciness: number;
    idleMovement: number;
  };
  physicsConfig: Partial<CharmPhysicsParams>;
  ritual: {
    impulse: number;
    duration: number;
    particles: 'gold' | 'sparkle' | 'chime' | 'petals' | 'coins';
    sound: 'bell' | 'chime' | 'gong' | 'temple' | 'harp';
  };
  fortunes: string[];
  status: 'available' | 'coming-soon' | 'preview';
}

export type CharmId =
  | 'maneki-neko'
  | 'evil-eye'
  | 'hamsa'
  | 'drishti-bommai'
  | 'nimbu-mirchi'
  | 'daruma'
  | 'lucky-coin'
  | 'bell'
  | 'venkateswara'
  | 'kandhan-karunai'
  | 'red-car'
  | 'iron-man'
  | 'croissant'
  | 'chocolate-strawberry'
  | 'chocolate-milkshake'
  | 'pistachio-chocolate-donut'
  | 'matcha-drink'
  | 'matcha'
  | 'disco-ball-stars';

