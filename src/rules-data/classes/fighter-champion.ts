import type { SubclassDefinition } from '../types';

export const fighterChampionSubclass: SubclassDefinition = {
  id: 'fighter-champion',
  classId: 'fighter',
  names: { 'pt-BR': 'Campeão', 'en-US': 'Champion' },
  featureIds: [
    'fighter-champion-improved-critical',
    'fighter-champion-remarkable-athlete',
    'fighter-champion-additional-fighting-style',
    'fighter-champion-superior-critical',
    'fighter-champion-survivor',
  ],
};
