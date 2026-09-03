import type { FeatureDefinition, MechanicalEffect } from '../types';

const sourceId = 'rogue';

function informationalEffect(
  value: MechanicalEffect['value'],
  ptBR: string,
  enUS: string,
): MechanicalEffect {
  return {
    type: 'informational',
    value,
    note: { 'pt-BR': ptBR, 'en-US': enUS },
  };
}

export const rogueFeatures: FeatureDefinition[] = [
  {
    id: 'rogue-expertise',
    names: { 'pt-BR': 'Especialização', 'en-US': 'Expertise' },
    origin: 'class',
    sourceId,
    minimumLevel: 1,
    effects: [{
      type: 'expertise',
      condition: 'chosen-proficiency-already-owned',
      value: 'double-proficiency-bonus',
    }],
  },
  {
    id: 'rogue-sneak-attack',
    names: { 'pt-BR': 'Ataque Furtivo', 'en-US': 'Sneak Attack' },
    origin: 'class',
    sourceId,
    minimumLevel: 1,
    trigger: {
      event: 'weapon-attack-hit',
      conditions: [
        'target-creature',
        'finesse-or-ranged-weapon',
        'advantage-on-attack-roll-or-alternate-condition',
        'alternate:other-target-enemy-within-1.5m:not-incapacitated',
        'no-disadvantage-on-attack-roll',
      ],
    },
    limit: { maximum: 1, period: 'turn' },
    effects: [{
      type: 'damage',
      progression: [
        { level: 1, value: '1d6' },
        { level: 2, value: '1d6' },
        { level: 3, value: '2d6' },
        { level: 4, value: '2d6' },
        { level: 5, value: '3d6' },
        { level: 6, value: '3d6' },
        { level: 7, value: '4d6' },
        { level: 8, value: '4d6' },
        { level: 9, value: '5d6' },
        { level: 10, value: '5d6' },
        { level: 11, value: '6d6' },
        { level: 12, value: '6d6' },
        { level: 13, value: '7d6' },
        { level: 14, value: '7d6' },
        { level: 15, value: '8d6' },
        { level: 16, value: '8d6' },
        { level: 17, value: '9d6' },
        { level: 18, value: '9d6' },
        { level: 19, value: '10d6' },
        { level: 20, value: '10d6' },
      ],
    }],
  },
  {
    id: 'rogue-thieves-cant',
    names: { 'pt-BR': 'Gíria de Ladrão', 'en-US': "Thieves' Cant" },
    origin: 'class',
    sourceId,
    minimumLevel: 1,
    effects: [
      {
        type: 'language',
        proficiencyId: 'thieves-cant',
        condition: 'understood-only-by-creatures-that-know-thieves-cant',
      },
      informationalEffect(
        4,
        'A comunicação codificada leva quatro vezes o tempo da fala normal.',
        'Coded communication takes four times as long as normal speech.',
      ),
      informationalEffect(
        'includes-simple-secret-signs-and-symbols',
        'Inclui sinais e símbolos secretos simples.',
        'Includes simple secret signs and symbols.',
      ),
    ],
  },
  {
    id: 'rogue-cunning-action',
    names: { 'pt-BR': 'Ação Ardilosa', 'en-US': 'Cunning Action' },
    origin: 'class',
    sourceId,
    minimumLevel: 2,
    activation: 'bonus-action',
    requirements: ['in-combat'],
    actionOptions: ['dash', 'disengage', 'hide'],
    limit: { maximum: 1, period: 'turn' },
  },
  {
    id: 'rogue-roguish-archetype',
    names: { 'pt-BR': 'Arquétipo de Ladino', 'en-US': 'Roguish Archetype' },
    origin: 'class',
    sourceId,
    minimumLevel: 3,
    effects: [informationalEffect(
      'subclass-choice-options-added-in-future-subclass-data',
      'A escolha de subclasse será preenchida quando arquétipos forem cadastrados.',
      'Subclass choice options will be populated when archetypes are registered.',
    )],
  },
  {
    id: 'rogue-steady-aim',
    names: { 'pt-BR': 'Mira Firme', 'en-US': 'Steady Aim' },
    origin: 'class',
    sourceId,
    minimumLevel: 3,
    activation: 'bonus-action',
    requirements: ['no-movement-this-turn'],
    duration: { type: 'until-end-of-current-turn' },
    effects: [
      {
        type: 'roll-modifier',
        rollTypes: ['attack-roll'],
        condition: 'next-attack-roll-this-turn',
        value: 'advantage',
      },
      {
        type: 'walking-speed',
        condition: 'after-activation',
        value: 0,
      },
    ],
  },
  {
    id: 'rogue-ability-score-improvement',
    names: {
      'pt-BR': 'Aumento no Valor de Atributo',
      'en-US': 'Ability Score Improvement',
    },
    origin: 'class',
    sourceId,
    minimumLevel: 4,
    effects: [informationalEffect(
      'ability-score-improvement-or-feat',
      'Permite aumentar atributos ou escolher um talento elegível.',
      'Allows ability score improvements or an eligible feat.',
    )],
  },
  {
    id: 'rogue-uncanny-dodge',
    names: { 'pt-BR': 'Esquiva Sobrenatural', 'en-US': 'Uncanny Dodge' },
    origin: 'class',
    sourceId,
    minimumLevel: 5,
    activation: 'reaction',
    trigger: {
      event: 'hit-by-attack',
      conditions: ['attacker-visible-to-rogue'],
    },
    target: { kind: 'self' },
    effects: [{
      type: 'damage-reduction',
      condition: 'triggering-attack-damage',
      damageMultiplier: 0.5,
      value: 'half-incoming-damage',
    }],
  },
  {
    id: 'rogue-evasion',
    names: { 'pt-BR': 'Evasão', 'en-US': 'Evasion' },
    origin: 'class',
    sourceId,
    minimumLevel: 7,
    trigger: {
      event: 'dexterity-saving-throw',
      conditions: ['effect-normally-deals-half-damage-on-success'],
    },
    effects: [
      {
        type: 'damage-reduction',
        savingThrowAbility: 'dexterity',
        condition: 'successful-save',
        damageMultiplier: 0,
        value: 'zero-damage',
      },
      {
        type: 'damage-reduction',
        savingThrowAbility: 'dexterity',
        condition: 'failed-save',
        damageMultiplier: 0.5,
        value: 'half-damage',
      },
    ],
  },
  {
    id: 'rogue-roguish-archetype-feature',
    names: {
      'pt-BR': 'Característica de Arquétipo de Ladino',
      'en-US': 'Roguish Archetype Feature',
    },
    origin: 'class',
    sourceId,
    minimumLevel: 9,
    effects: [informationalEffect(
      'granted-by-selected-subclass',
      'Concede uma característica definida pela subclasse escolhida.',
      'Grants a feature defined by the selected subclass.',
    )],
  },
  {
    id: 'rogue-reliable-talent',
    names: { 'pt-BR': 'Talento Confiável', 'en-US': 'Reliable Talent' },
    origin: 'class',
    sourceId,
    minimumLevel: 11,
    effects: [{
      type: 'roll-modifier',
      rollTypes: ['ability-check'],
      condition: 'proficiency-bonus-can-be-added;natural-d20-before-modifiers',
      naturalRollMinimum: 10,
    }],
  },
  {
    id: 'rogue-blindsense',
    names: { 'pt-BR': 'Sentido Cego', 'en-US': 'Blindsense' },
    origin: 'class',
    sourceId,
    minimumLevel: 14,
    requirements: ['can-hear'],
    range: { value: 3, unit: 'meter' },
    target: {
      kind: 'creature',
      conditions: ['hidden-or-invisible'],
    },
    effects: [informationalEffect(
      'aware-of-target-location',
      'Fica ciente da localização da criatura.',
      "Becomes aware of the creature's location.",
    )],
  },
  {
    id: 'rogue-slippery-mind',
    names: { 'pt-BR': 'Mente Escorregadia', 'en-US': 'Slippery Mind' },
    origin: 'class',
    sourceId,
    minimumLevel: 15,
    effects: [{
      type: 'saving-throw-proficiency',
      ability: 'wisdom',
    }],
  },
  {
    id: 'rogue-elusive',
    names: { 'pt-BR': 'Elusivo', 'en-US': 'Elusive' },
    origin: 'class',
    sourceId,
    minimumLevel: 18,
    target: { kind: 'self' },
    effects: [{
      type: 'roll-modifier',
      rollTypes: ['attack-roll'],
      condition: 'attack-against-rogue;rogue-not-incapacitated',
      value: 'prevent-advantage',
    }],
  },
  {
    id: 'rogue-stroke-of-luck',
    names: { 'pt-BR': 'Golpe de Sorte', 'en-US': 'Stroke of Luck' },
    origin: 'class',
    sourceId,
    minimumLevel: 20,
    usage: {
      freeUses: 1,
      recovery: 'short-or-long-rest',
    },
    choices: [{
      type: 'one-of',
      options: [
        {
          id: 'attack-miss-to-hit',
          effects: [{
            type: 'roll-modifier',
            trigger: {
              event: 'attack-miss',
              conditions: ['target-within-attack-range'],
            },
            rollTypes: ['attack-roll'],
            value: 'miss-becomes-hit',
          }],
        },
        {
          id: 'failed-check-to-natural-20',
          effects: [{
            type: 'roll-modifier',
            trigger: { event: 'ability-check-failed' },
            rollTypes: ['ability-check'],
            naturalRollSubstitution: 20,
          }],
        },
      ],
    }],
  },
];
