import type {
  AbilityFormulaDefinition,
  FeatureDefinition,
  LimitedUseDefinition,
  LimitedUseLevelDefinition,
  MechanicalEffect,
  TechniqueDefinition,
} from '../types';

const sourceId = 'fighter-rune-knight';
const bookId = 'jvf-classes-subclasses-compendium';
const giantMightUsesId = 'fighter-rune-knight-giants-might-uses';
const runicShieldUsesId = 'fighter-rune-knight-runic-shield-uses';

export const fighterRuneKnightRuneSaveDc: AbilityFormulaDefinition = {
  base: 8,
  proficiencyBonusMultiplier: 1,
  abilityModifier: 'constitution',
};

export const fighterRuneKnightRuneUseProgression: LimitedUseLevelDefinition[] = [
  { level: 3, freeUses: 1 },
  { level: 15, freeUses: 2 },
];

function runeInvocationUsage(): LimitedUseDefinition {
  return {
    freeUses: 1,
    recovery: 'short-or-long-rest',
    progression: fighterRuneKnightRuneUseProgression,
  };
}

function passiveEffect(effect: MechanicalEffect): MechanicalEffect {
  const passiveCondition = 'while-wearing-or-carrying-inscribed-object';

  return {
    ...effect,
    condition: effect.condition
      ? `${passiveCondition};${effect.condition}`
      : passiveCondition,
  };
}

function rollAdvantage(
  ability: MechanicalEffect['ability'],
  proficiencyId: string,
): MechanicalEffect {
  return passiveEffect({
    type: 'roll-modifier',
    ability,
    proficiencyId,
    rollTypes: ['ability-check'],
    value: 'advantage',
  });
}

function repeatedSaveEffect(
  ability: 'strength' | 'wisdom',
): MechanicalEffect {
  return {
    type: 'informational',
    trigger: { event: 'end-of-target-turn' },
    save: { ability, dc: fighterRuneKnightRuneSaveDc },
    value: 'successful-save-ends-effect',
  };
}

export const fighterRuneKnightRunes: TechniqueDefinition[] = [
  {
    id: 'fighter-rune-knight-cloud-rune',
    names: { 'pt-BR': 'Runa da Nuvem', 'en-US': 'Cloud Rune' },
    sourceId,
    minimumLevel: 3,
    source: { bookId },
    tags: ['rune', 'cloud-rune'],
    passiveEffects: [
      rollAdvantage('dexterity', 'sleight-of-hand'),
      rollAdvantage('charisma', 'deception'),
    ],
    activation: 'reaction',
    trigger: {
      event: 'hit-by-attack-roll',
      conditions: ['fighter-or-visible-creature-within-range'],
    },
    range: { value: 9, unit: 'meter' },
    target: {
      kind: 'creature',
      conditions: ['other-than-original-target', 'not-attacker'],
    },
    usage: runeInvocationUsage(),
    effects: [{
      type: 'redirection',
      rollTypes: ['attack-roll'],
      usesSameRoll: true,
      ignoresOriginalRange: true,
      value: 'chosen-creature-becomes-attack-target',
    }],
  },
  {
    id: 'fighter-rune-knight-fire-rune',
    names: { 'pt-BR': 'Runa do Fogo', 'en-US': 'Fire Rune' },
    sourceId,
    minimumLevel: 3,
    source: { bookId },
    tags: ['rune', 'fire-rune'],
    passiveEffects: [passiveEffect({
      type: 'expertise',
      proficiencyId: 'tools',
      condition: 'ability-check-using-tool-proficiency',
      value: 'double-proficiency-bonus',
    })],
    trigger: {
      event: 'weapon-attack-hit',
      conditions: ['target-creature'],
    },
    target: { kind: 'creature' },
    save: {
      ability: 'strength',
      dc: fighterRuneKnightRuneSaveDc,
      onFailure: [
        {
          type: 'condition',
          conditionIds: ['restrained'],
          duration: { type: 'minutes', value: 1 },
        },
        {
          type: 'damage',
          damageType: 'fire',
          trigger: { event: 'start-of-target-turn' },
          formula: { type: 'dice', count: 2, dieSize: 6 },
          duration: { type: 'minutes', value: 1 },
        },
        repeatedSaveEffect('strength'),
      ],
    },
    usage: runeInvocationUsage(),
    effects: [{
      type: 'damage',
      damageType: 'fire',
      formula: { type: 'dice', count: 2, dieSize: 6 },
    }],
  },
  {
    id: 'fighter-rune-knight-frost-rune',
    names: { 'pt-BR': 'Runa do Gelo', 'en-US': 'Frost Rune' },
    sourceId,
    minimumLevel: 3,
    source: { bookId },
    tags: ['rune', 'frost-rune'],
    passiveEffects: [
      rollAdvantage('wisdom', 'animal-handling'),
      rollAdvantage('charisma', 'intimidation'),
    ],
    activation: 'bonus-action',
    duration: { type: 'minutes', value: 10 },
    usage: runeInvocationUsage(),
    effects: [
      {
        type: 'fixed-bonus',
        abilityOptions: ['strength', 'constitution'],
        rollTypes: ['ability-check'],
        value: 2,
      },
      {
        type: 'fixed-bonus',
        abilityOptions: ['strength', 'constitution'],
        rollTypes: ['saving-throw'],
        value: 2,
      },
    ],
  },
  {
    id: 'fighter-rune-knight-stone-rune',
    names: { 'pt-BR': 'Runa da Pedra', 'en-US': 'Stone Rune' },
    sourceId,
    minimumLevel: 3,
    source: { bookId },
    tags: ['rune', 'stone-rune'],
    passiveEffects: [
      rollAdvantage('wisdom', 'insight'),
      passiveEffect({
        type: 'darkvision',
        value: 36,
        distance: { value: 36, unit: 'meter' },
      }),
    ],
    activation: 'reaction',
    trigger: {
      event: 'creature-ends-turn',
      conditions: ['visible-to-fighter'],
    },
    range: { value: 9, unit: 'meter' },
    target: { kind: 'creature', visible: true },
    duration: { type: 'minutes', value: 1 },
    save: {
      ability: 'wisdom',
      dc: fighterRuneKnightRuneSaveDc,
      onFailure: [
        {
          type: 'condition',
          conditionIds: ['charmed', 'incapacitated'],
          condition: 'charmed-by-fighter',
        },
        { type: 'walking-speed', value: 0 },
        repeatedSaveEffect('wisdom'),
      ],
    },
    usage: runeInvocationUsage(),
  },
  {
    id: 'fighter-rune-knight-hill-rune',
    names: { 'pt-BR': 'Runa da Colina', 'en-US': 'Hill Rune' },
    sourceId,
    minimumLevel: 7,
    source: { bookId },
    tags: ['rune', 'hill-rune'],
    passiveEffects: [
      passiveEffect({
        type: 'roll-modifier',
        rollTypes: ['saving-throw'],
        condition: 'against-poison',
        value: 'advantage',
      }),
      passiveEffect({ type: 'resistance', damageType: 'poison' }),
    ],
    activation: 'bonus-action',
    duration: { type: 'minutes', value: 1 },
    usage: runeInvocationUsage(),
    effects: [
      { type: 'resistance', damageType: 'bludgeoning' },
      { type: 'resistance', damageType: 'piercing' },
      { type: 'resistance', damageType: 'slashing' },
    ],
  },
  {
    id: 'fighter-rune-knight-storm-rune',
    names: { 'pt-BR': 'Runa da Tempestade', 'en-US': 'Storm Rune' },
    sourceId,
    minimumLevel: 7,
    source: { bookId },
    tags: ['rune', 'storm-rune'],
    passiveEffects: [
      rollAdvantage('intelligence', 'arcana'),
      passiveEffect({
        type: 'immunity',
        conditionIds: ['surprised'],
        condition: 'fighter-not-incapacitated',
      }),
    ],
    activation: 'bonus-action',
    duration: {
      type: 'minutes',
      value: 1,
      endsEarlyWhen: ['fighter-incapacitated'],
    },
    usage: runeInvocationUsage(),
    effects: [{
      type: 'informational',
      activation: 'reaction',
      trigger: {
        event: 'roll-made',
        conditions: ['fighter-or-visible-creature-within-range'],
      },
      range: { value: 18, unit: 'meter' },
      target: { kind: 'creature', visible: true, canIncludeSelf: true },
      rollTypes: ['attack-roll', 'saving-throw', 'ability-check'],
      choices: [{
        type: 'one-of',
        options: [
          {
            id: 'advantage',
            effects: [{ type: 'roll-modifier', value: 'advantage' }],
          },
          {
            id: 'disadvantage',
            effects: [{ type: 'roll-modifier', value: 'disadvantage' }],
          },
        ],
      }],
    }],
  },
];

export const fighterRuneKnightRuneIds = fighterRuneKnightRunes.map(({ id }) => id);

export const fighterRuneKnightFeatures: FeatureDefinition[] = [
  {
    id: 'fighter-rune-knight-bonus-proficiencies',
    names: { 'pt-BR': 'Proficiência Adicional', 'en-US': 'Bonus Proficiencies' },
    origin: 'subclass',
    sourceId,
    minimumLevel: 3,
    effects: [
      { type: 'tool-proficiency', proficiencyId: 'smiths-tools' },
      { type: 'language', proficiencyId: 'giant' },
    ],
  },
  {
    id: 'fighter-rune-knight-rune-carver',
    names: { 'pt-BR': 'Entalhador de Runas', 'en-US': 'Rune Carver' },
    origin: 'subclass',
    sourceId,
    minimumLevel: 3,
    techniqueIds: fighterRuneKnightRuneIds,
    effects: [
      {
        type: 'informational',
        ability: 'constitution',
        value: 'rune-save-dc',
        formula: fighterRuneKnightRuneSaveDc,
      },
      {
        type: 'inscription',
        trigger: { event: 'long-rest-finished' },
        formula: {
          type: 'reference',
          referenceId: 'fighter-rune-knight-rune-choice',
          property: 'count',
        },
        eligibleObjectCategories: [
          'weapon',
          'armor',
          'shield',
          'jewelry',
          'wearable-or-one-hand-object',
        ],
        maximumPerObject: 1,
        condition: 'different-rune-per-object',
        duration: { type: 'until-next-long-rest' },
      },
    ],
  },
  {
    id: 'fighter-rune-knight-giants-might',
    names: { 'pt-BR': 'Potência dos Gigantes', 'en-US': "Giant's Might" },
    origin: 'subclass',
    sourceId,
    minimumLevel: 3,
    activation: 'bonus-action',
    duration: { type: 'minutes', value: 1 },
    resourceCost: { resourceId: giantMightUsesId, amount: 1, roll: false },
    effects: [
      {
        type: 'size',
        condition: 'if-smaller-than-maximum;unchanged-if-no-space;worn-items-grow',
        progression: [
          { level: 3, value: 'large' },
          { level: 18, value: 'huge' },
        ],
      },
      {
        type: 'roll-modifier',
        ability: 'strength',
        rollTypes: ['ability-check', 'saving-throw'],
        value: 'advantage',
      },
      {
        type: 'damage',
        trigger: {
          event: 'attack-damage',
          conditions: ['weapon-attack-or-unarmed-strike'],
        },
        limit: { maximum: 1, period: 'turn' },
        progression: [
          { level: 3, value: '1d6' },
          { level: 10, value: '1d8' },
          { level: 18, value: '1d10' },
        ],
      },
    ],
  },
  {
    id: 'fighter-rune-knight-runic-shield',
    names: { 'pt-BR': 'Escudo Rúnico', 'en-US': 'Runic Shield' },
    origin: 'subclass',
    sourceId,
    minimumLevel: 7,
    activation: 'reaction',
    trigger: {
      event: 'hit-by-attack-roll',
      conditions: ['other-visible-creature'],
    },
    range: { value: 18, unit: 'meter' },
    target: { kind: 'creature', visible: true, excludesSelf: true },
    resourceCost: { resourceId: runicShieldUsesId, amount: 1, roll: false },
    effects: [{
      type: 'reroll',
      rollTypes: ['attack-roll'],
      mustUseNewRoll: true,
      value: 'attacker-rerolls-d20',
    }],
  },
  {
    id: 'fighter-rune-knight-great-stature',
    names: { 'pt-BR': 'Estatura Grandiosa', 'en-US': 'Great Stature' },
    origin: 'subclass',
    sourceId,
    minimumLevel: 10,
    effects: [
      {
        type: 'informational',
        trigger: { event: 'feature-gained' },
        value: 'height-increase',
        formula: {
          type: 'dice',
          count: 3,
          dieSize: 4,
          multiplier: 2.5,
          unit: 'centimeter',
        },
      },
      {
        type: 'damage',
        triggerFeatureId: 'fighter-rune-knight-giants-might',
        condition: 'updates-extra-damage',
        value: '1d8',
      },
    ],
  },
  {
    id: 'fighter-rune-knight-master-of-runes',
    names: { 'pt-BR': 'Mestre das Runas', 'en-US': 'Master of Runes' },
    origin: 'subclass',
    sourceId,
    minimumLevel: 15,
    effects: [{
      type: 'informational',
      triggerFeatureId: 'fighter-rune-knight-rune-carver',
      value: 'invocations-per-known-rune',
      progression: [
        { level: 3, value: 1 },
        { level: 15, value: 2 },
      ],
    }],
  },
  {
    id: 'fighter-rune-knight-runic-juggernaut',
    names: { 'pt-BR': 'Demolidor Rúnico', 'en-US': 'Runic Juggernaut' },
    origin: 'subclass',
    sourceId,
    minimumLevel: 18,
    effects: [
      {
        type: 'damage',
        triggerFeatureId: 'fighter-rune-knight-giants-might',
        condition: 'updates-extra-damage',
        value: '1d10',
      },
      {
        type: 'size',
        triggerFeatureId: 'fighter-rune-knight-giants-might',
        value: 'huge',
      },
      {
        type: 'reach',
        triggerFeatureId: 'fighter-rune-knight-giants-might',
        condition: 'while-huge',
        distance: { value: 1.5, unit: 'meter' },
      },
    ],
  },
];
