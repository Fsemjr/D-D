import type { FeatureDefinition, MechanicalEffect } from '../types';

const sourceId = 'rogue-inquisitive';
const source = { bookId: 'jvf-classes-subclasses-compendium' };
const unerringEyeUsesId = 'rogue-inquisitive-unerring-eye-uses';

function halfMovementThreshold(): NonNullable<
  MechanicalEffect['movementThreshold']
> {
  return {
    comparison: 'at-most',
    period: 'current-turn',
    formula: {
      type: 'speed-multiplier',
      speed: 'movement',
      multiplier: 0.5,
    },
  };
}

export const rogueInquisitiveFeatures: FeatureDefinition[] = [
  {
    id: 'rogue-inquisitive-ear-for-deceit',
    names: { 'pt-BR': 'Ouvido para Enganação', 'en-US': 'Ear for Deceit' },
    origin: 'subclass',
    sourceId,
    source,
    minimumLevel: 3,
    effects: [{
      type: 'roll-modifier',
      ability: 'wisdom',
      proficiencyId: 'insight',
      rollTypes: ['ability-check'],
      checkPurpose: 'determine-whether-creature-is-lying',
      condition: 'natural-d20-before-modifiers',
      naturalRollMinimum: 8,
    }],
  },
  {
    id: 'rogue-inquisitive-eye-for-detail',
    names: { 'pt-BR': 'Olho para Detalhes', 'en-US': 'Eye for Detail' },
    origin: 'subclass',
    sourceId,
    source,
    minimumLevel: 3,
    activation: 'bonus-action',
    choices: [{
      type: 'one-of',
      options: [
        {
          id: 'perception-detect-object-or-creature',
          effects: [{
            type: 'informational',
            ability: 'wisdom',
            proficiencyId: 'perception',
            rollTypes: ['ability-check'],
            checkPurpose: 'detect-object-or-creature',
          }],
        },
        {
          id: 'investigation-discover-clues',
          effects: [{
            type: 'informational',
            ability: 'intelligence',
            proficiencyId: 'investigation',
            rollTypes: ['ability-check'],
            checkPurpose: 'discover-clues',
          }],
        },
      ],
    }],
  },
  {
    id: 'rogue-inquisitive-insightful-fighting',
    names: { 'pt-BR': 'Combatente Perspicaz', 'en-US': 'Insightful Fighting' },
    origin: 'subclass',
    sourceId,
    source,
    minimumLevel: 3,
    activation: 'bonus-action',
    target: {
      kind: 'creature',
      visible: true,
      count: 1,
      conditions: ['not-incapacitated'],
    },
    duration: {
      type: 'minutes',
      value: 1,
      endsEarlyWhen: ['successfully-applied-to-another-target'],
    },
    effects: [
      {
        type: 'informational',
        contestedCheck: {
          actor: { ability: 'wisdom', proficiencyId: 'insight' },
          opponent: { ability: 'charisma', proficiencyId: 'deception' },
        },
        condition: 'actor-wins-contested-check',
      },
      {
        type: 'informational',
        modifiesFeatureId: 'rogue-sneak-attack',
        condition: 'contested-check-won;current-affected-target;attack-roll-without-disadvantage',
        value: 'allows-sneak-attack-without-advantage',
      },
    ],
  },
  {
    id: 'rogue-inquisitive-steady-eye',
    names: { 'pt-BR': 'Olhos Firmes', 'en-US': 'Steady Eye' },
    origin: 'subclass',
    sourceId,
    source,
    minimumLevel: 9,
    effects: [
      {
        type: 'roll-modifier',
        ability: 'wisdom',
        proficiencyId: 'perception',
        rollTypes: ['ability-check'],
        condition: 'movement-within-threshold-during-current-turn',
        movementThreshold: halfMovementThreshold(),
        value: 'advantage',
      },
      {
        type: 'roll-modifier',
        ability: 'intelligence',
        proficiencyId: 'investigation',
        rollTypes: ['ability-check'],
        condition: 'movement-within-threshold-during-current-turn',
        movementThreshold: halfMovementThreshold(),
        value: 'advantage',
      },
    ],
  },
  {
    id: 'rogue-inquisitive-unerring-eye',
    names: { 'pt-BR': 'Olhos Infalíveis', 'en-US': 'Unerring Eye' },
    origin: 'subclass',
    sourceId,
    source,
    minimumLevel: 13,
    activation: 'action',
    requirements: ['not-blinded', 'not-prone'],
    range: { value: 9, unit: 'meter' },
    resourceCost: { resourceId: unerringEyeUsesId, amount: 1, roll: false },
    effects: [{
      type: 'detection',
      detectionCategories: [
        'illusion',
        'shapechanger-not-in-original-form',
        'magic-designed-to-deceive-senses',
      ],
      revealsDetails: false,
      value: 'detects-presence-only',
    }],
  },
  {
    id: 'rogue-inquisitive-eye-for-weakness',
    names: { 'pt-BR': 'Olho para Fraquezas', 'en-US': 'Eye for Weakness' },
    origin: 'subclass',
    sourceId,
    source,
    minimumLevel: 17,
    effects: [{
      type: 'damage',
      triggerFeatureId: 'rogue-inquisitive-insightful-fighting',
      modifiesFeatureId: 'rogue-sneak-attack',
      damageMode: 'additional',
      condition: 'target-currently-affected-by-trigger-feature',
      value: '3d6',
    }],
  },
];
