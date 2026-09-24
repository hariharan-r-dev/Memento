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
];

export const DEFAULT_CHARM_ID = 'maneki-neko';

export const getCharmById = (id?: string | null): CharmDefinition => {
  if (!id) return manekiNekoDefinition;
  
  // Migration support for legacy id 'lucky-cat' -> 'maneki-neko'
  const lookupId = id === 'lucky-cat' ? 'maneki-neko' : id;
  const match = ALL_CHARMS.find((c) => c.id === lookupId);
  return match || manekiNekoDefinition;
};
