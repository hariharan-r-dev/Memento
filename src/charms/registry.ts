import type { CharmDefinition } from './types';
import { manekiNekoDefinition } from './definitions/manekiNeko';
import { evilEyeDefinition } from './definitions/evilEye';
import { hamsaDefinition } from './definitions/hamsa';
import { drishtiBommaiDefinition } from './definitions/drishtiBommai';
import { nimbuMirchiDefinition } from './definitions/nimbuMirchi';
import { darumaDefinition } from './definitions/daruma';
import { luckyCoinDefinition } from './definitions/luckyCoin';
import { bellDefinition } from './definitions/bell';
import { venkateswaraDefinition } from './definitions/venkateswara';
import { muruganDefinition } from './definitions/murugan';
import { redCarDefinition } from './definitions/redCar';
import { ironManDefinition } from './definitions/ironMan';
import { croissantDefinition } from './definitions/croissant';
import { chocolateStrawberryDefinition } from './definitions/chocolateStrawberry';
import { chocolateMilkshakeDefinition } from './definitions/chocolateMilkshake';
import { pistachioChocolateDonutDefinition } from './definitions/pistachioChocolateDonut';
import { matchaDefinition } from './definitions/matcha';
import { discoBallStarsDefinition } from './definitions/discoBallStars';

export const ALL_CHARMS: CharmDefinition[] = [
  manekiNekoDefinition,
  evilEyeDefinition,
  hamsaDefinition,
  drishtiBommaiDefinition,
  nimbuMirchiDefinition,
  darumaDefinition,
  luckyCoinDefinition,
  bellDefinition,
  venkateswaraDefinition,
  muruganDefinition,
  redCarDefinition,
  ironManDefinition,
  croissantDefinition,
  chocolateStrawberryDefinition,
  chocolateMilkshakeDefinition,
  pistachioChocolateDonutDefinition,
  matchaDefinition,
  discoBallStarsDefinition,
];

export const DEFAULT_CHARM_ID = 'maneki-neko';

export const getCharmById = (id?: string | null): CharmDefinition => {
  if (!id) return manekiNekoDefinition;
  
  // Migration support for legacy id 'lucky-cat' -> 'maneki-neko' and 'matcha' -> 'matcha-drink'
  let lookupId = id;
  if (id === 'lucky-cat') lookupId = 'maneki-neko';
  else if (id === 'matcha') lookupId = 'matcha-drink';

  const match = ALL_CHARMS.find((c) => c.id === lookupId);
  return match || manekiNekoDefinition;
};
