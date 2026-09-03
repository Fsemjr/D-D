import type {
  AlternativeChoiceDefinition,
  ChoiceDefinition,
  ClassDefinition,
  DirectChoiceDefinition,
} from '../types';

function abilityScoreImprovementChoice(level: number): ChoiceDefinition {
  return {
    id: `rogue-asi-or-feat-choice-${level}`,
    type: 'one-of',
    count: 1,
    optionTypes: ['asi', 'feat'],
  };
}

export const rogueInitialExpertiseChoice: AlternativeChoiceDefinition = {
  id: 'rogue-expertise-choice-1',
  type: 'one-of',
  count: 1,
  optionTypes: ['skill', 'other'],
  choices: [
    {
      id: 'rogue-expertise-choice-1-two-skills',
      type: 'skill',
      minimumLevel: 1,
      count: 2,
      condition: 'already-proficient',
    },
    {
      id: 'rogue-expertise-choice-1-skill-and-tools',
      type: 'other',
      minimumLevel: 1,
      count: 2,
      optionIds: ['one-proficient-skill', 'thieves-tools'],
      condition: 'all-options-already-proficient',
    },
  ],
};

export const rogueAdditionalExpertiseChoice: DirectChoiceDefinition = {
  id: 'rogue-expertise-choice-6',
  type: 'other',
  minimumLevel: 6,
  count: 2,
  optionIds: ['proficient-skills', 'thieves-tools'],
  condition: 'already-proficient',
};

export const rogueSubclassChoice: DirectChoiceDefinition = {
  id: 'rogue-subclass-choice',
  type: 'subclass',
  minimumLevel: 3,
  count: 1,
  optionIds: ['rogue-assassin'],
};

export const rogueClass: ClassDefinition = {
  id: 'rogue',
  names: { 'pt-BR': 'Ladino', 'en-US': 'Rogue' },
  source: { bookId: 'jvf-classes-subclasses-compendium' },
  tags: [
    'martial',
    'skill-expert',
    'stealth',
    'precision',
    'dexterity-based',
    'utility',
  ],
  summary: {
    'pt-BR': 'Especialista ágil em perícias, furtividade e ataques precisos.',
    'en-US': 'An agile expert in skills, stealth, and precise attacks.',
  },
  hitDie: 8,
  primaryAbilities: ['dexterity'],
  savingThrows: ['dexterity', 'intelligence'],
  armorProficiencies: ['light-armor'],
  weaponProficiencies: [
    'simple-weapons',
    'hand-crossbows',
    'longswords',
    'rapiers',
    'shortswords',
  ],
  toolProficiencies: ['thieves-tools'],
  skillChoices: {
    count: 4,
    options: [
      'acrobatics',
      'athletics',
      'performance',
      'deception',
      'stealth',
      'intimidation',
      'insight',
      'investigation',
      'perception',
      'persuasion',
      'sleight-of-hand',
    ],
  },
  subclassLevel: 3,
  subclassIds: ['rogue-assassin'],
  progression: {
    1: {
      level: 1,
      proficiencyBonus: 2,
      featureIds: ['rogue-expertise', 'rogue-sneak-attack', 'rogue-thieves-cant'],
      choices: [rogueInitialExpertiseChoice],
    },
    2: {
      level: 2,
      proficiencyBonus: 2,
      featureIds: ['rogue-cunning-action'],
    },
    3: {
      level: 3,
      proficiencyBonus: 2,
      featureIds: ['rogue-roguish-archetype', 'rogue-steady-aim'],
      choices: [rogueSubclassChoice],
    },
    4: {
      level: 4,
      proficiencyBonus: 2,
      featureIds: ['rogue-ability-score-improvement'],
      choices: [abilityScoreImprovementChoice(4)],
    },
    5: {
      level: 5,
      proficiencyBonus: 3,
      featureIds: ['rogue-uncanny-dodge'],
    },
    6: {
      level: 6,
      proficiencyBonus: 3,
      featureIds: ['rogue-expertise'],
      choices: [rogueAdditionalExpertiseChoice],
    },
    7: {
      level: 7,
      proficiencyBonus: 3,
      featureIds: ['rogue-evasion'],
    },
    8: {
      level: 8,
      proficiencyBonus: 3,
      featureIds: ['rogue-ability-score-improvement'],
      choices: [abilityScoreImprovementChoice(8)],
    },
    9: {
      level: 9,
      proficiencyBonus: 4,
      featureIds: ['rogue-roguish-archetype-feature'],
    },
    10: {
      level: 10,
      proficiencyBonus: 4,
      featureIds: ['rogue-ability-score-improvement'],
      choices: [abilityScoreImprovementChoice(10)],
    },
    11: {
      level: 11,
      proficiencyBonus: 4,
      featureIds: ['rogue-reliable-talent'],
    },
    12: {
      level: 12,
      proficiencyBonus: 4,
      featureIds: ['rogue-ability-score-improvement'],
      choices: [abilityScoreImprovementChoice(12)],
    },
    13: {
      level: 13,
      proficiencyBonus: 5,
      featureIds: ['rogue-roguish-archetype-feature'],
    },
    14: {
      level: 14,
      proficiencyBonus: 5,
      featureIds: ['rogue-blindsense'],
    },
    15: {
      level: 15,
      proficiencyBonus: 5,
      featureIds: ['rogue-slippery-mind'],
    },
    16: {
      level: 16,
      proficiencyBonus: 5,
      featureIds: ['rogue-ability-score-improvement'],
      choices: [abilityScoreImprovementChoice(16)],
    },
    17: {
      level: 17,
      proficiencyBonus: 6,
      featureIds: ['rogue-roguish-archetype-feature'],
    },
    18: {
      level: 18,
      proficiencyBonus: 6,
      featureIds: ['rogue-elusive'],
    },
    19: {
      level: 19,
      proficiencyBonus: 6,
      featureIds: ['rogue-ability-score-improvement'],
      choices: [abilityScoreImprovementChoice(19)],
    },
    20: {
      level: 20,
      proficiencyBonus: 6,
      featureIds: ['rogue-stroke-of-luck'],
    },
  },
};
