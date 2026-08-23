import type { ChoiceDefinition, ClassDefinition } from '../types';
import { fighterFightingStyleIds } from '../features/fighter';

function abilityScoreImprovementChoice(level: number): ChoiceDefinition {
  return {
    id: `fighter-asi-or-feat-choice-${level}`,
    type: 'one-of',
    count: 1,
    optionTypes: ['asi', 'feat'],
  };
}

export const fighterClass: ClassDefinition = {
  id: 'fighter',
  names: { 'pt-BR': 'Guerreiro', 'en-US': 'Fighter' },
  hitDie: 10,
  primaryAbilities: ['strength', 'dexterity'],
  savingThrows: ['strength', 'constitution'],
  armorProficiencies: [
    'light-armor',
    'medium-armor',
    'heavy-armor',
    'shields',
  ],
  weaponProficiencies: ['simple-weapons', 'martial-weapons'],
  toolProficiencies: [],
  skillChoices: {
    count: 2,
    options: [
      'acrobatics',
      'animal-handling',
      'athletics',
      'history',
      'insight',
      'intimidation',
      'perception',
      'survival',
    ],
  },
  subclassLevel: 3,
  subclassIds: ['fighter-champion'],
  progression: {
    1: {
      level: 1,
      proficiencyBonus: 2,
      featureIds: ['fighter-fighting-style', 'fighter-second-wind'],
      choices: [{
        id: 'fighter-fighting-style-choice',
        type: 'fighting-style',
        count: 1,
        optionIds: [...fighterFightingStyleIds],
      }],
    },
    2: {
      level: 2,
      proficiencyBonus: 2,
      featureIds: ['fighter-action-surge'],
    },
    3: {
      level: 3,
      proficiencyBonus: 2,
      featureIds: ['fighter-martial-archetype'],
      choices: [{
        id: 'fighter-subclass-choice',
        type: 'subclass',
        count: 1,
        optionIds: ['fighter-champion'],
      }],
    },
    4: {
      level: 4,
      proficiencyBonus: 2,
      featureIds: [
        'fighter-ability-score-improvement',
        'fighter-martial-versatility',
      ],
      choices: [abilityScoreImprovementChoice(4)],
    },
    5: {
      level: 5,
      proficiencyBonus: 3,
      featureIds: ['fighter-extra-attack'],
    },
    6: {
      level: 6,
      proficiencyBonus: 3,
      featureIds: ['fighter-ability-score-improvement'],
      choices: [abilityScoreImprovementChoice(6)],
    },
    7: {
      level: 7,
      proficiencyBonus: 3,
      featureIds: ['fighter-martial-archetype-feature'],
    },
    8: {
      level: 8,
      proficiencyBonus: 3,
      featureIds: ['fighter-ability-score-improvement'],
      choices: [abilityScoreImprovementChoice(8)],
    },
    9: {
      level: 9,
      proficiencyBonus: 4,
      featureIds: ['fighter-indomitable'],
    },
    10: {
      level: 10,
      proficiencyBonus: 4,
      featureIds: ['fighter-martial-archetype-feature'],
    },
    11: {
      level: 11,
      proficiencyBonus: 4,
      featureIds: ['fighter-extra-attack'],
    },
    12: {
      level: 12,
      proficiencyBonus: 4,
      featureIds: ['fighter-ability-score-improvement'],
      choices: [abilityScoreImprovementChoice(12)],
    },
    13: {
      level: 13,
      proficiencyBonus: 5,
      featureIds: ['fighter-indomitable'],
    },
    14: {
      level: 14,
      proficiencyBonus: 5,
      featureIds: ['fighter-ability-score-improvement'],
      choices: [abilityScoreImprovementChoice(14)],
    },
    15: {
      level: 15,
      proficiencyBonus: 5,
      featureIds: ['fighter-martial-archetype-feature'],
    },
    16: {
      level: 16,
      proficiencyBonus: 5,
      featureIds: ['fighter-ability-score-improvement'],
      choices: [abilityScoreImprovementChoice(16)],
    },
    17: {
      level: 17,
      proficiencyBonus: 6,
      featureIds: ['fighter-action-surge', 'fighter-indomitable'],
    },
    18: {
      level: 18,
      proficiencyBonus: 6,
      featureIds: ['fighter-martial-archetype-feature'],
    },
    19: {
      level: 19,
      proficiencyBonus: 6,
      featureIds: ['fighter-ability-score-improvement'],
      choices: [abilityScoreImprovementChoice(19)],
    },
    20: {
      level: 20,
      proficiencyBonus: 6,
      featureIds: ['fighter-extra-attack'],
    },
  },
};
