import type { DirectChoiceDefinition, SubclassDefinition } from '../types';
import { fighterBanneretFeatures } from '../features/fighter-banneret';

export const fighterBanneretRoyalEnvoyFallbackChoice: DirectChoiceDefinition = {
  id: 'fighter-banneret-royal-envoy-fallback-skill-choice',
  type: 'skill',
  minimumLevel: 7,
  condition: 'already-proficient:persuasion',
  count: 1,
  optionIds: [
    'animal-handling',
    'insight',
    'intimidation',
    'performance',
  ],
};

export const fighterBanneretSubclass: SubclassDefinition = {
  id: 'fighter-banneret',
  classId: 'fighter',
  names: { 'pt-BR': 'Ginete', 'en-US': 'Banneret' },
  source: { bookId: 'jvf-classes-subclasses-compendium' },
  tags: ['martial', 'support', 'leadership', 'ally-support', 'social'],
  summary: {
    'pt-BR': 'Líder marcial que amplia recursos do Guerreiro para curar, inspirar e proteger aliados.',
    'en-US': 'A martial leader who extends Fighter abilities to heal, inspire, and protect allies.',
  },
  featureIds: fighterBanneretFeatures.map(({ id }) => id),
  choices: [fighterBanneretRoyalEnvoyFallbackChoice],
};
