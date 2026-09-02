import type {
  DirectChoiceDefinition,
  ResourceDefinition,
  SubclassDefinition,
} from '../types';
import {
  fighterRuneKnightFeatures,
  fighterRuneKnightRuneIds,
} from '../features/fighter-rune-knight';

export const fighterRuneKnightRuneChoice: DirectChoiceDefinition = {
  id: 'fighter-rune-knight-rune-choice',
  type: 'technique',
  minimumLevel: 3,
  count: 2,
  optionIds: [...fighterRuneKnightRuneIds],
  countProgression: [
    { level: 3, count: 2 },
    { level: 7, count: 3 },
    { level: 10, count: 4 },
    { level: 15, count: 5 },
  ],
  replacement: {
    trigger: 'class-level-gained',
    classId: 'fighter',
    count: 1,
  },
};

export const fighterRuneKnightGiantsMightUses: ResourceDefinition = {
  id: 'fighter-rune-knight-giants-might-uses',
  names: {
    'pt-BR': 'Usos de Potência dos Gigantes',
    'en-US': "Giant's Might Uses",
  },
  recovery: 'long-rest',
  progression: [{
    level: 3,
    maximum: { type: 'proficiency-bonus', multiplier: 1 },
  }],
};

export const fighterRuneKnightRunicShieldUses: ResourceDefinition = {
  id: 'fighter-rune-knight-runic-shield-uses',
  names: {
    'pt-BR': 'Usos de Escudo Rúnico',
    'en-US': 'Runic Shield Uses',
  },
  recovery: 'long-rest',
  progression: [{
    level: 7,
    maximum: { type: 'proficiency-bonus', multiplier: 1 },
  }],
};

export const fighterRuneKnightSubclass: SubclassDefinition = {
  id: 'fighter-rune-knight',
  classId: 'fighter',
  names: { 'pt-BR': 'Cavaleiro Rúnico', 'en-US': 'Rune Knight' },
  source: { bookId: 'jvf-classes-subclasses-compendium' },
  tags: [
    'martial',
    'runes',
    'giant-magic',
    'constitution-based',
    'battlefield-control',
    'defensive',
    'size-manipulation',
  ],
  summary: {
    'pt-BR': 'Guerreiro rúnico que canaliza magia gigante para crescer, resistir e controlar o campo.',
    'en-US': 'A runic warrior who channels giant magic to grow, endure, and control the battlefield.',
  },
  featureIds: fighterRuneKnightFeatures.map(({ id }) => id),
  choices: [fighterRuneKnightRuneChoice],
  resources: [
    fighterRuneKnightGiantsMightUses,
    fighterRuneKnightRunicShieldUses,
  ],
};
