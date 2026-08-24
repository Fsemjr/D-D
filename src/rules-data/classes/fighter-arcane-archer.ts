import type {
  DirectChoiceDefinition,
  ResourceDefinition,
  SubclassDefinition,
} from '../types';
import {
  fighterArcaneArcherFeatures,
  fighterArcaneArcherShotOptionIds,
} from '../features/fighter-arcane-archer';

export const fighterArcaneArcherLoreSkillChoice: DirectChoiceDefinition = {
  id: 'fighter-arcane-archer-lore-skill-choice',
  type: 'skill',
  minimumLevel: 3,
  count: 1,
  optionIds: ['arcana', 'nature'],
};

export const fighterArcaneArcherLoreCantripChoice: DirectChoiceDefinition = {
  id: 'fighter-arcane-archer-lore-cantrip-choice',
  type: 'spell',
  minimumLevel: 3,
  count: 1,
  optionIds: ['prestidigitation', 'druidcraft'],
};

export const fighterArcaneArcherShotChoice: DirectChoiceDefinition = {
  id: 'fighter-arcane-archer-shot-choice',
  type: 'technique',
  minimumLevel: 3,
  count: 2,
  optionIds: [...fighterArcaneArcherShotOptionIds],
  countProgression: [
    { level: 3, count: 2 },
    { level: 7, count: 3 },
    { level: 10, count: 4 },
    { level: 15, count: 5 },
    { level: 18, count: 6 },
  ],
};

export const fighterArcaneArcherShotUses: ResourceDefinition = {
  id: 'fighter-arcane-archer-shot-uses',
  names: { 'pt-BR': 'Usos de Disparo Arcano', 'en-US': 'Arcane Shot Uses' },
  recovery: 'short-or-long-rest',
  progression: [
    { level: 3, maximum: 2 },
    { level: 7, maximum: 2 },
    { level: 10, maximum: 2 },
    { level: 15, maximum: 2 },
    { level: 18, maximum: 2 },
  ],
};

export const fighterArcaneArcherSubclass: SubclassDefinition = {
  id: 'fighter-arcane-archer',
  classId: 'fighter',
  names: { 'pt-BR': 'Arqueiro Arcano', 'en-US': 'Arcane Archer' },
  source: { bookId: 'jvf-classes-subclasses-compendium' },
  tags: [
    'martial',
    'ranged',
    'magical-arrows',
    'tactical',
    'intelligence-based',
  ],
  summary: {
    'pt-BR': 'Arqueiro marcial que aprimora flechas com opções mágicas táticas baseadas em Inteligência.',
    'en-US': 'A martial archer who enhances arrows with tactical, Intelligence-based magical options.',
  },
  featureIds: fighterArcaneArcherFeatures.map(({ id }) => id),
  choices: [
    fighterArcaneArcherLoreSkillChoice,
    fighterArcaneArcherLoreCantripChoice,
    fighterArcaneArcherShotChoice,
  ],
  resources: [fighterArcaneArcherShotUses],
};
