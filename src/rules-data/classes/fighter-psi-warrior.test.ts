import { describe, expect, it } from 'vitest';
import {
  fighterPsiWarriorFeatures as featuresFromPublicBarrel,
  fighterPsiWarriorSubclass as subclassFromPublicBarrel,
  fighterPsiWarriorTechniques as techniquesFromPublicBarrel,
} from '..';
import { matchesCatalogQuery } from '../catalog';
import { fighterArcaneArcherFeatures } from '../features/fighter-arcane-archer';
import { fighterBanneretFeatures } from '../features/fighter-banneret';
import { fighterBattleMasterFeatures } from '../features/fighter-battle-master';
import { fighterCavalierFeatures } from '../features/fighter-cavalier';
import { fighterChampionFeatures } from '../features/fighter-champion';
import { fighterEchoKnightFeatures } from '../features/fighter-echo-knight';
import { fighterEldritchKnightFeatures } from '../features/fighter-eldritch-knight';
import { fighterFeatures } from '../features/fighter';
import {
  fighterPsiWarriorFeatures,
  fighterPsiWarriorTechniqueIds,
  fighterPsiWarriorTechniques,
} from '../features/fighter-psi-warrior';
import { fighterSamuraiFeatures } from '../features/fighter-samurai';
import type {
  MechanicalEffect,
  ResourceLevelDefinition,
  TechniqueDefinition,
} from '../types';
import { fighterArcaneArcherSubclass } from './fighter-arcane-archer';
import { fighterBanneretSubclass } from './fighter-banneret';
import { fighterBattleMasterSubclass } from './fighter-battle-master';
import { fighterCavalierSubclass } from './fighter-cavalier';
import { fighterChampionSubclass } from './fighter-champion';
import { fighterEchoKnightSubclass } from './fighter-echo-knight';
import { fighterEldritchKnightSubclass } from './fighter-eldritch-knight';
import { fighterClass } from './fighter';
import {
  fighterPsiWarriorPsionicEnergyDice,
  fighterPsiWarriorSubclass,
} from './fighter-psi-warrior';
import { fighterSamuraiSubclass } from './fighter-samurai';

const psionicEnergyDiceId = 'fighter-psi-warrior-psionic-energy-dice';

const expectedSubclassIds = [
  'fighter-champion',
  'fighter-battle-master',
  'fighter-eldritch-knight',
  'fighter-arcane-archer',
  'fighter-cavalier',
  'fighter-samurai',
  'fighter-banneret',
  'fighter-echo-knight',
  'fighter-psi-warrior',
];

const expectedFeatureLevels: Array<[string, number]> = [
  ['fighter-psi-warrior-psionic-power', 3],
  ['fighter-psi-warrior-telekinetic-adept', 7],
  ['fighter-psi-warrior-guarded-mind', 10],
  ['fighter-psi-warrior-bulwark-of-force', 15],
  ['fighter-psi-warrior-telekinetic-master', 18],
];

function techniqueById(id: string): TechniqueDefinition | undefined {
  return fighterPsiWarriorTechniques.find((technique) => technique.id === id);
}

function effectByType(
  effects: MechanicalEffect[] | undefined,
  type: MechanicalEffect['type'],
): MechanicalEffect | undefined {
  return effects?.find((effect) => effect.type === type);
}

function resourceDefinitionAt(level: number): ResourceLevelDefinition {
  const definition = fighterPsiWarriorPsionicEnergyDice.progression
    .filter((candidate) => candidate.level <= level)
    .at(-1);

  if (!definition) {
    throw new Error(`Missing Psionic Energy Dice progression at level ${level}`);
  }

  return definition;
}

function psionicEnergyMaximumAt(level: number): number {
  const maximum = resourceDefinitionAt(level).maximum;
  const proficiencyBonus = fighterClass.progression[level]?.proficiencyBonus;

  if (typeof maximum === 'number') {
    return maximum;
  }

  if (maximum.type !== 'proficiency-bonus' || proficiencyBonus === undefined) {
    throw new Error(`Cannot resolve Psionic Energy Dice maximum at level ${level}`);
  }

  return Math.max(
    maximum.minimum ?? 0,
    proficiencyBonus * maximum.multiplier,
  );
}

describe('Psi Warrior subclass rules data', () => {
  it('has the expected identity, localized names, metadata, and source', () => {
    expect(fighterPsiWarriorSubclass).toMatchObject({
      id: 'fighter-psi-warrior',
      classId: 'fighter',
      names: { 'pt-BR': 'Cavaleiro Psiônico', 'en-US': 'Psi Warrior' },
      source: { bookId: 'jvf-classes-subclasses-compendium' },
      tags: [
        'martial',
        'psionic',
        'telekinesis',
        'intelligence-based',
        'battlefield-control',
        'defensive',
      ],
    });
    expect(fighterPsiWarriorSubclass.summary?.['pt-BR'].trim()).not.toBe('');
    expect(fighterPsiWarriorSubclass.summary?.['en-US'].trim()).not.toBe('');
  });

  it('registers exactly five subclass features at the expected levels', () => {
    expect(fighterPsiWarriorFeatures).toHaveLength(5);
    expect(fighterPsiWarriorFeatures.map(({ id, minimumLevel }) => [
      id,
      minimumLevel,
    ])).toEqual(expectedFeatureLevels);
    expect(fighterPsiWarriorSubclass.featureIds).toEqual(
      expectedFeatureLevels.map(([id]) => id),
    );
  });

  it('owns every feature as a Psi Warrior subclass feature', () => {
    expect(fighterPsiWarriorFeatures.every(
      ({ origin, sourceId }) => origin === 'subclass' && sourceId === 'fighter-psi-warrior',
    )).toBe(true);
  });

  it('registers and offers exactly the nine current Fighter subclasses', () => {
    expect(fighterClass.subclassIds).toEqual(expectedSubclassIds);
    expect(fighterClass.progression[3]?.choices).toContainEqual({
      id: 'fighter-subclass-choice',
      type: 'subclass',
      count: 1,
      optionIds: expectedSubclassIds,
    });
  });

  it('preserves the eight previous subclass definitions in order', () => {
    expect([
      fighterChampionSubclass.id,
      fighterBattleMasterSubclass.id,
      fighterEldritchKnightSubclass.id,
      fighterArcaneArcherSubclass.id,
      fighterCavalierSubclass.id,
      fighterSamuraiSubclass.id,
      fighterBanneretSubclass.id,
      fighterEchoKnightSubclass.id,
    ]).toEqual(expectedSubclassIds.slice(0, 8));
  });
});

describe('Psi Warrior Psionic Energy Dice', () => {
  it('uses twice the proficiency bonus as its generic maximum formula', () => {
    expect(fighterPsiWarriorPsionicEnergyDice.progression.every(
      ({ maximum }) => typeof maximum !== 'number'
        && maximum.type === 'proficiency-bonus'
        && maximum.multiplier === 2,
    )).toBe(true);
  });

  it.each([
    [3, 4],
    [5, 6],
    [9, 8],
    [13, 10],
    [17, 12],
  ])('resolves level %i to %i Psionic Energy Dice', (level, maximum) => {
    expect(psionicEnergyMaximumAt(level)).toBe(maximum);
  });

  it('uses the formula correctly at every Fighter level from 3 through 20', () => {
    for (let level = 3; level <= 20; level += 1) {
      expect(psionicEnergyMaximumAt(level)).toBe(
        (fighterClass.progression[level]?.proficiencyBonus ?? 0) * 2,
      );
    }
  });

  it('recovers all dice on a long rest', () => {
    expect(fighterPsiWarriorPsionicEnergyDice.recovery).toBe('long-rest');
  });

  it('recovers one die as a bonus action once per short or long rest', () => {
    expect(fighterPsiWarriorPsionicEnergyDice.additionalRecoveries).toEqual([{
      amount: 1,
      action: 'bonus-action',
      limitedUses: {
        maximum: 1,
        recovery: 'short-or-long-rest',
      },
    }]);
  });

  it('progresses from d6 to d8, d10, and d12 at the expected levels', () => {
    expect(fighterPsiWarriorPsionicEnergyDice.progression.map(
      ({ level, dieSize }) => ({ level, dieSize }),
    )).toEqual([
      { level: 3, dieSize: 6 },
      { level: 5, dieSize: 8 },
      { level: 11, dieSize: 10 },
      { level: 17, dieSize: 12 },
    ]);
  });
});

describe('Psi Warrior psionic techniques', () => {
  it('registers the three Psionic Power and two Telekinetic Adept techniques', () => {
    expect(fighterPsiWarriorTechniqueIds).toEqual([
      'fighter-psi-warrior-protective-field',
      'fighter-psi-warrior-psionic-strike',
      'fighter-psi-warrior-telekinetic-movement',
      'fighter-psi-warrior-psi-powered-leap',
      'fighter-psi-warrior-telekinetic-thrust',
    ]);
    expect(fighterPsiWarriorFeatures[0]?.techniqueIds).toEqual(
      fighterPsiWarriorTechniqueIds.slice(0, 3),
    );
    expect(fighterPsiWarriorFeatures[1]?.techniqueIds).toEqual(
      fighterPsiWarriorTechniqueIds.slice(3),
    );
  });

  it('structures Protective Field reaction, range, cost, and reduction formula', () => {
    const technique = techniqueById('fighter-psi-warrior-protective-field');

    expect(technique).toMatchObject({
      activation: 'reaction',
      trigger: { event: 'damage-taken' },
      range: { value: 9, unit: 'meter' },
      target: { kind: 'creature', visible: true, canIncludeSelf: true },
      resourceCost: { resourceId: psionicEnergyDiceId, amount: 1, roll: true },
    });
    expect(effectByType(technique?.effects, 'damage-reduction')).toMatchObject({
      formula: {
        type: 'resource-die',
        resourceId: psionicEnergyDiceId,
        abilityModifier: 'intelligence',
        minimum: 1,
      },
      minimum: 1,
    });
  });

  it('structures Psionic Strike trigger, limit, cost, formula, and force damage', () => {
    const technique = techniqueById('fighter-psi-warrior-psionic-strike');

    expect(technique).toMatchObject({
      trigger: {
        event: 'after-hit-and-damage',
        conditions: ['weapon-damage'],
      },
      range: { value: 9, unit: 'meter' },
      limit: { maximum: 1, period: 'turn' },
      resourceCost: { resourceId: psionicEnergyDiceId, amount: 1, roll: true },
    });
    expect(effectByType(technique?.effects, 'damage')).toMatchObject({
      damageType: 'force',
      formula: {
        type: 'resource-die',
        resourceId: psionicEnergyDiceId,
        abilityModifier: 'intelligence',
      },
    });
  });

  it('structures Telekinetic Movement targets, movement, hand interaction, and usage', () => {
    const technique = techniqueById('fighter-psi-warrior-telekinetic-movement');

    expect(technique).toMatchObject({
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
          { kind: 'creature', visible: true, willing: true, excludesSelf: true },
        ],
      },
      usage: {
        freeUses: 1,
        recovery: 'short-or-long-rest',
        additionalUseCost: {
          resourceId: psionicEnergyDiceId,
          amount: 1,
          roll: false,
        },
      },
    });
    expect(effectByType(technique?.effects, 'movement')).toMatchObject({
      movement: {
        distance: { value: 9, unit: 'meter' },
        directions: ['horizontal', 'vertical'],
        destination: 'visible-unoccupied-space',
      },
    });
    expect(technique?.effects).toContainEqual(expect.objectContaining({
      value: 'tiny-object:from-or-to-fighter-hand',
    }));
  });

  it('structures Psi-Powered Leap speed, duration, and usage', () => {
    const technique = techniqueById('fighter-psi-warrior-psi-powered-leap');

    expect(technique).toMatchObject({
      activation: 'bonus-action',
      target: { kind: 'self' },
      duration: { type: 'until-end-of-current-turn' },
      usage: {
        freeUses: 1,
        recovery: 'short-or-long-rest',
        additionalUseCost: { resourceId: psionicEnergyDiceId, amount: 1 },
      },
    });
    expect(effectByType(technique?.effects, 'flying-speed')).toMatchObject({
      formula: { type: 'speed-multiplier', speed: 'walking', multiplier: 2 },
    });
  });

  it('structures Telekinetic Thrust save DC and prone-or-movement choice', () => {
    const technique = techniqueById('fighter-psi-warrior-telekinetic-thrust');

    expect(technique).toMatchObject({
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
    });
  });
});

describe('Psi Warrior higher-level features', () => {
  it('structures Guarded Mind resistance and condition-clearing die cost', () => {
    const feature = fighterPsiWarriorFeatures.find(
      ({ id }) => id === 'fighter-psi-warrior-guarded-mind',
    );

    expect(feature?.effects).toContainEqual({
      type: 'resistance',
      damageType: 'psychic',
    });
    expect(effectByType(feature?.effects, 'remove-condition-effects')).toMatchObject({
      trigger: { event: 'start-of-turn', conditions: ['charmed-or-frightened'] },
      resourceCost: { resourceId: psionicEnergyDiceId, amount: 1, roll: false },
      conditionIds: ['charmed', 'frightened'],
      value: 'all-effects-causing-listed-conditions',
    });
  });

  it('structures Bulwark of Force targets, cover, duration, and usage', () => {
    const feature = fighterPsiWarriorFeatures.find(
      ({ id }) => id === 'fighter-psi-warrior-bulwark-of-force',
    );

    expect(feature).toMatchObject({
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
      usage: {
        freeUses: 1,
        recovery: 'long-rest',
        additionalUseCost: { resourceId: psionicEnergyDiceId, amount: 1 },
      },
      effects: [{ type: 'cover', cover: 'half' }],
    });
  });

  it('structures Telekinetic Master spell use and concentration-linked attack', () => {
    const feature = fighterPsiWarriorFeatures.find(
      ({ id }) => id === 'fighter-psi-warrior-telekinetic-master',
    );
    const spell = effectByType(feature?.effects, 'granted-spell');
    const attack = effectByType(feature?.effects, 'weapon-attack');

    expect(fighterPsiWarriorSubclass.spellIds).toEqual(['telekinesis']);
    expect(spell).toMatchObject({
      spellId: 'telekinesis',
      ability: 'intelligence',
      components: 'none',
      concentration: true,
      usage: {
        freeUses: 1,
        recovery: 'long-rest',
        additionalUseCost: { resourceId: psionicEnergyDiceId, amount: 1 },
      },
    });
    expect(attack).toMatchObject({
      activation: 'bonus-action',
      trigger: {
        event: 'while-concentrating-on-spell',
        sourceId: 'telekinesis',
        conditions: ['each-turn', 'including-casting-turn'],
      },
      limit: { maximum: 1, period: 'turn' },
      duration: { type: 'while-concentrating' },
    });
  });
});

describe('Psi Warrior catalog, references, and exports', () => {
  it.each([
    'fighter-psi-warrior',
    'Psi Warrior',
    'Cavaleiro Psiônico',
    'protects allies',
    'psionic',
    'telekinesis',
    'intelligence-based',
    'battlefield-control',
  ])('is found by catalog query %s', (query) => {
    expect(matchesCatalogQuery(fighterPsiWarriorSubclass, query)).toBe(true);
  });

  it('has unique IDs and no orphaned feature or technique references', () => {
    const featureIds = fighterPsiWarriorFeatures.map(({ id }) => id);
    const techniqueIds = fighterPsiWarriorTechniques.map(({ id }) => id);
    const resourceIds = (fighterPsiWarriorSubclass.resources ?? []).map(({ id }) => id);
    const allIds = [...featureIds, ...techniqueIds, ...resourceIds];
    const referencedTechniqueIds = fighterPsiWarriorFeatures.flatMap(
      ({ techniqueIds: ids }) => ids ?? [],
    );
    const mechanics = [
      ...fighterPsiWarriorFeatures,
      ...fighterPsiWarriorTechniques,
      ...fighterPsiWarriorFeatures.flatMap(({ effects }) => effects ?? []),
      ...fighterPsiWarriorTechniques.flatMap(({ effects }) => effects ?? []),
    ];
    const referencedResourceIds = mechanics.flatMap((mechanic) => [
      mechanic.resourceCost?.resourceId,
      mechanic.usage?.additionalUseCost?.resourceId,
    ]).filter((id) => id !== undefined);

    expect(new Set(featureIds).size).toBe(featureIds.length);
    expect(new Set(techniqueIds).size).toBe(techniqueIds.length);
    expect(new Set(allIds).size).toBe(allIds.length);
    expect(fighterPsiWarriorSubclass.featureIds).toEqual(featureIds);
    expect(referencedTechniqueIds).toEqual(techniqueIds);
    expect(referencedResourceIds.every((id) => resourceIds.includes(id))).toBe(true);
    expect(techniqueIds).toContain(
      techniqueById('fighter-psi-warrior-telekinetic-thrust')?.trigger?.sourceId,
    );
  });

  it('has no duplicate Fighter-family feature IDs', () => {
    const allFeatureIds = [
      ...fighterFeatures,
      ...fighterChampionFeatures,
      ...fighterBattleMasterFeatures,
      ...fighterEldritchKnightFeatures,
      ...fighterArcaneArcherFeatures,
      ...fighterCavalierFeatures,
      ...fighterSamuraiFeatures,
      ...fighterBanneretFeatures,
      ...fighterEchoKnightFeatures,
      ...fighterPsiWarriorFeatures,
    ].map(({ id }) => id);

    expect(new Set(allFeatureIds).size).toBe(allFeatureIds.length);
  });

  it('exports the subclass, features, and techniques through the public barrel', () => {
    expect(subclassFromPublicBarrel).toBe(fighterPsiWarriorSubclass);
    expect(featuresFromPublicBarrel).toBe(fighterPsiWarriorFeatures);
    expect(techniquesFromPublicBarrel).toBe(fighterPsiWarriorTechniques);
  });
});
