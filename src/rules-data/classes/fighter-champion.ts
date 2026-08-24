import type { SubclassDefinition } from '../types';

export const fighterChampionSubclass: SubclassDefinition = {
  id: 'fighter-champion',
  classId: 'fighter',
  names: { 'pt-BR': 'Campeão', 'en-US': 'Champion' },
  source: { bookId: 'jvf-classes-subclasses-compendium' },
  tags: ['martial', 'passive-features', 'critical-focused'],
  summary: {
    'pt-BR': 'Arquétipo direto focado em melhorias passivas de combate e golpes críticos.',
    'en-US': 'A straightforward archetype focused on passive combat improvements and critical hits.',
  },
  featureIds: [
    'fighter-champion-improved-critical',
    'fighter-champion-remarkable-athlete',
    'fighter-champion-additional-fighting-style',
    'fighter-champion-superior-critical',
    'fighter-champion-survivor',
  ],
};
