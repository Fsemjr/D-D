import type {
  FeatureDefinition,
  LimitedUseDefinition,
  MechanicalEffect,
  ResourceCostDefinition,
  TechniqueDefinition,
} from '../types';

const sourceId = 'fighter-psi-warrior';
const psionicEnergyDiceId = 'fighter-psi-warrior-psionic-energy-dice';

function psionicEnergyDieCost(roll = true): ResourceCostDefinition {
  return { resourceId: psionicEnergyDiceId, amount: 1, roll };
}

function freeUseWithPsionicFallback(
  recovery: LimitedUseDefinition['recovery'],
): LimitedUseDefinition {
  return {
    freeUses: 1,
    recovery,
    additionalUseCost: psionicEnergyDieCost(false),
  };
}

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

export const fighterPsiWarriorTechniques: TechniqueDefinition[] = [
  {
    id: 'fighter-psi-warrior-protective-field',
    names: { 'pt-BR': 'Campo Protetor', 'en-US': 'Protective Field' },
    sourceId,
    minimumLevel: 3,
    activation: 'reaction',
    trigger: {
      event: 'damage-taken',
      conditions: ['target-is-self-or-other-creature'],
    },
    range: { value: 9, unit: 'meter' },
    target: {
      kind: 'creature',
      visible: true,
      canIncludeSelf: true,
    },
    resourceCost: psionicEnergyDieCost(),
    effects: [{
      type: 'damage-reduction',
      formula: {
        type: 'resource-die',
        resourceId: psionicEnergyDiceId,
        abilityModifier: 'intelligence',
        minimum: 1,
      },
      minimum: 1,
    }],
  },
  {
    id: 'fighter-psi-warrior-psionic-strike',
    names: { 'pt-BR': 'Golpe Psiônico', 'en-US': 'Psionic Strike' },
    sourceId,
    minimumLevel: 3,
    trigger: {
      event: 'after-hit-and-damage',
      conditions: ['weapon-damage'],
    },
    range: { value: 9, unit: 'meter' },
    resourceCost: psionicEnergyDieCost(),
    limit: { maximum: 1, period: 'turn' },
    effects: [{
      type: 'damage',
      damageType: 'force',
      formula: {
        type: 'resource-die',
        resourceId: psionicEnergyDiceId,
        abilityModifier: 'intelligence',
      },
    }],
  },
  {
    id: 'fighter-psi-warrior-telekinetic-movement',
    names: { 'pt-BR': 'Movimento Telecinético', 'en-US': 'Telekinetic Movement' },
    sourceId,
    minimumLevel: 3,
    activation: 'action',
    range: { value: 9, unit: 'meter' },
    target: {
      type: 'one-of',
      options: [
        {
          kind: 'object',
          visible: true,
          sizeMaximum: 'large',
          conditions: ['loose'],
        },
        {
          kind: 'creature',
          visible: true,
          willing: true,
          excludesSelf: true,
        },
      ],
    },
    usage: freeUseWithPsionicFallback('short-or-long-rest'),
    effects: [
      {
        type: 'movement',
        movement: {
          distance: { value: 9, unit: 'meter' },
          directions: ['horizontal', 'vertical'],
          destination: 'visible-unoccupied-space',
        },
      },
      informationalEffect(
        'tiny-object:from-or-to-fighter-hand',
        'Um objeto Miúdo pode ser movido da mão do Guerreiro ou para ela.',
        "A Tiny object can be moved from or to the Fighter's hand.",
      ),
    ],
  },
  {
    id: 'fighter-psi-warrior-psi-powered-leap',
    names: { 'pt-BR': 'Salto Psíquico', 'en-US': 'Psi-Powered Leap' },
    sourceId,
    minimumLevel: 7,
    activation: 'bonus-action',
    target: { kind: 'self' },
    duration: { type: 'until-end-of-current-turn' },
    usage: freeUseWithPsionicFallback('short-or-long-rest'),
    effects: [{
      type: 'flying-speed',
      formula: {
        type: 'speed-multiplier',
        speed: 'walking',
        multiplier: 2,
      },
    }],
  },
  {
    id: 'fighter-psi-warrior-telekinetic-thrust',
    names: { 'pt-BR': 'Impulso Telecinético', 'en-US': 'Telekinetic Thrust' },
    sourceId,
    minimumLevel: 7,
    trigger: {
      event: 'damage-with-technique',
      sourceId: 'fighter-psi-warrior-psionic-strike',
    },
    save: {
      ability: 'strength',
      dc: {
        base: 8,
        proficiencyBonusMultiplier: 1,
        abilityModifier: 'intelligence',
      },
      onFailure: {
        type: 'one-of',
        options: [
          {
            id: 'prone',
            effects: [{ type: 'condition', conditionIds: ['prone'] }],
          },
          {
            id: 'horizontal-movement',
            effects: [{
              type: 'movement',
              movement: {
                distance: { value: 3, unit: 'meter' },
                directions: ['horizontal'],
                directionChoice: 'any',
              },
            }],
          },
        ],
      },
    },
  },
];

export const fighterPsiWarriorTechniqueIds = fighterPsiWarriorTechniques.map(
  ({ id }) => id,
);

export const fighterPsiWarriorFeatures: FeatureDefinition[] = [
  {
    id: 'fighter-psi-warrior-psionic-power',
    names: { 'pt-BR': 'Poder Psiônico', 'en-US': 'Psionic Power' },
    origin: 'subclass',
    sourceId,
    minimumLevel: 3,
    techniqueIds: fighterPsiWarriorTechniqueIds.slice(0, 3),
  },
  {
    id: 'fighter-psi-warrior-telekinetic-adept',
    names: { 'pt-BR': 'Adepto Telecinético', 'en-US': 'Telekinetic Adept' },
    origin: 'subclass',
    sourceId,
    minimumLevel: 7,
    techniqueIds: fighterPsiWarriorTechniqueIds.slice(3),
  },
  {
    id: 'fighter-psi-warrior-guarded-mind',
    names: { 'pt-BR': 'Mente Protegida', 'en-US': 'Guarded Mind' },
    origin: 'subclass',
    sourceId,
    minimumLevel: 10,
    effects: [
      { type: 'resistance', damageType: 'psychic' },
      {
        type: 'remove-condition-effects',
        trigger: {
          event: 'start-of-turn',
          conditions: ['charmed-or-frightened'],
        },
        resourceCost: psionicEnergyDieCost(false),
        conditionIds: ['charmed', 'frightened'],
        value: 'all-effects-causing-listed-conditions',
      },
    ],
  },
  {
    id: 'fighter-psi-warrior-bulwark-of-force',
    names: { 'pt-BR': 'Bastião de Energia', 'en-US': 'Bulwark of Force' },
    origin: 'subclass',
    sourceId,
    minimumLevel: 15,
    activation: 'bonus-action',
    range: { value: 9, unit: 'meter' },
    target: {
      kind: 'creature',
      visible: true,
      canIncludeSelf: true,
      count: {
        type: 'ability-modifier',
        ability: 'intelligence',
        minimum: 1,
      },
      minimum: 1,
    },
    duration: {
      type: 'minutes',
      value: 1,
      endsEarlyWhen: ['fighter-incapacitated'],
    },
    usage: freeUseWithPsionicFallback('long-rest'),
    effects: [{ type: 'cover', cover: 'half' }],
  },
  {
    id: 'fighter-psi-warrior-telekinetic-master',
    names: { 'pt-BR': 'Mestre Telecinético', 'en-US': 'Telekinetic Master' },
    origin: 'subclass',
    sourceId,
    minimumLevel: 18,
    effects: [
      {
        type: 'granted-spell',
        spellId: 'telekinesis',
        ability: 'intelligence',
        components: 'none',
        concentration: true,
        usage: freeUseWithPsionicFallback('long-rest'),
      },
      {
        type: 'weapon-attack',
        activation: 'bonus-action',
        trigger: {
          event: 'while-concentrating-on-spell',
          sourceId: 'telekinesis',
          conditions: ['each-turn', 'including-casting-turn'],
        },
        limit: { maximum: 1, period: 'turn' },
        duration: { type: 'while-concentrating' },
      },
    ],
  },
];
