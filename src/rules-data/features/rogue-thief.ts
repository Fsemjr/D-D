import type { FeatureDefinition } from '../types';

const sourceId = 'rogue-thief';
const source = { bookId: 'jvf-classes-subclasses-compendium' };

export const rogueThiefFeatures: FeatureDefinition[] = [
  {
    id: 'rogue-thief-fast-hands',
    names: { 'pt-BR': 'Mãos Rápidas', 'en-US': 'Fast Hands' },
    origin: 'subclass',
    sourceId,
    source,
    minimumLevel: 3,
    activation: 'bonus-action',
    actionOptions: [
      'dexterity-sleight-of-hand-check',
      'thieves-tools:disarm-trap-or-open-lock',
      'use-an-object-action',
    ],
    effects: [{
      type: 'informational',
      triggerFeatureId: 'rogue-cunning-action',
      value: 'expands-trigger-feature-action-options',
      note: {
        'pt-BR': 'Expande as opções da Ação Ardilosa com exatamente uma das três opções cadastradas.',
        'en-US': 'Expands Cunning Action with exactly one of the three registered options.',
      },
    }],
  },
  {
    id: 'rogue-thief-second-story-work',
    names: { 'pt-BR': 'Andarilho de Telhados', 'en-US': 'Second-Story Work' },
    origin: 'subclass',
    sourceId,
    source,
    minimumLevel: 3,
    effects: [
      {
        type: 'movement',
        movementMode: 'climbing',
        extraMovementCostMultiplier: 0,
      },
      {
        type: 'movement',
        movementMode: 'running-jump',
        condition: 'running-jump',
        formula: {
          abilityModifier: 'dexterity',
          multiplier: 0.3,
          unit: 'meter',
        },
      },
    ],
  },
  {
    id: 'rogue-thief-supreme-sneak',
    names: { 'pt-BR': 'Furtividade Suprema', 'en-US': 'Supreme Sneak' },
    origin: 'subclass',
    sourceId,
    source,
    minimumLevel: 9,
    effects: [{
      type: 'roll-modifier',
      ability: 'dexterity',
      proficiencyId: 'stealth',
      rollTypes: ['ability-check'],
      condition: 'movement-within-threshold-during-current-turn',
      movementThreshold: {
        comparison: 'at-most',
        period: 'current-turn',
        formula: {
          type: 'speed-multiplier',
          speed: 'movement',
          multiplier: 0.5,
        },
      },
      value: 'advantage',
    }],
  },
  {
    id: 'rogue-thief-use-magic-device',
    names: { 'pt-BR': 'Usar Instrumento Mágico', 'en-US': 'Use Magic Device' },
    origin: 'subclass',
    sourceId,
    source,
    minimumLevel: 13,
    effects: [{
      type: 'requirement-override',
      condition: 'using-magic-item',
      ignoredRequirementTypes: ['class', 'race', 'level'],
    }],
  },
  {
    id: 'rogue-thief-thiefs-reflexes',
    names: { 'pt-BR': 'Reflexos de Ladrão', 'en-US': "Thief's Reflexes" },
    origin: 'subclass',
    sourceId,
    source,
    minimumLevel: 17,
    effects: [{
      type: 'extra-turn',
      extraTurn: {
        combatRound: 'first',
        turns: [
          { initiative: 'normal' },
          { initiativeOffset: -10 },
        ],
        disabledWhen: ['surprised'],
      },
    }],
  },
];
