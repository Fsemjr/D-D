import { describe, expect, it } from 'vitest';
import {
  fighterRuneKnightFeatures as featuresFromPublicBarrel,
  fighterRuneKnightRunes as runesFromPublicBarrel,
  fighterRuneKnightSubclass as subclassFromPublicBarrel,
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
import { fighterPsiWarriorFeatures } from '../features/fighter-psi-warrior';
import {
  fighterRuneKnightFeatures,
  fighterRuneKnightRuneIds,
  fighterRuneKnightRunes,
  fighterRuneKnightRuneSaveDc,
  fighterRuneKnightRuneUseProgression,
} from '../features/fighter-rune-knight';
import { fighterSamuraiFeatures } from '../features/fighter-samurai';
import type { MechanicalEffect, TechniqueDefinition } from '../types';
import { fighterArcaneArcherSubclass } from './fighter-arcane-archer';
import { fighterBanneretSubclass } from './fighter-banneret';
import { fighterBattleMasterSubclass } from './fighter-battle-master';
import { fighterCavalierSubclass } from './fighter-cavalier';
import { fighterChampionSubclass } from './fighter-champion';
import { fighterEchoKnightSubclass } from './fighter-echo-knight';
import { fighterEldritchKnightSubclass } from './fighter-eldritch-knight';
import { fighterClass } from './fighter';
import { fighterPsiWarriorSubclass } from './fighter-psi-warrior';
import {
  fighterRuneKnightGiantsMightUses,
  fighterRuneKnightRuneChoice,
  fighterRuneKnightRunicShieldUses,
  fighterRuneKnightSubclass,
} from './fighter-rune-knight';
import { fighterSamuraiSubclass } from './fighter-samurai';

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
  'fighter-rune-knight',
];

const expectedFeatureLevels: Array<[string, number]> = [
  ['fighter-rune-knight-bonus-proficiencies', 3],
  ['fighter-rune-knight-rune-carver', 3],
  ['fighter-rune-knight-giants-might', 3],
  ['fighter-rune-knight-runic-shield', 7],
  ['fighter-rune-knight-great-stature', 10],
  ['fighter-rune-knight-master-of-runes', 15],
  ['fighter-rune-knight-runic-juggernaut', 18],
];

const expectedRuneLevels: Array<[string, number]> = [
  ['fighter-rune-knight-cloud-rune', 3],
  ['fighter-rune-knight-fire-rune', 3],
  ['fighter-rune-knight-frost-rune', 3],
  ['fighter-rune-knight-stone-rune', 3],
  ['fighter-rune-knight-hill-rune', 7],
  ['fighter-rune-knight-storm-rune', 7],
];

function featureById(id: string) {
  return fighterRuneKnightFeatures.find((feature) => feature.id === id);
}

function runeById(id: string): TechniqueDefinition | undefined {
  return fighterRuneKnightRunes.find((rune) => rune.id === id);
}

function effectByType(
  effects: MechanicalEffect[] | undefined,
  type: MechanicalEffect['type'],
): MechanicalEffect | undefined {
  return effects?.find((effect) => effect.type === type);
}

function failedSaveEffects(rune: TechniqueDefinition | undefined): MechanicalEffect[] {
  const onFailure = rune?.save?.onFailure;
  return Array.isArray(onFailure) ? onFailure : [];
}

describe('Rune Knight subclass rules data', () => {
  it('has the expected identity, names, source, tags, and summaries', () => {
    expect(fighterRuneKnightSubclass).toMatchObject({
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
    });
    expect(fighterRuneKnightSubclass.summary?.['pt-BR'].trim()).not.toBe('');
    expect(fighterRuneKnightSubclass.summary?.['en-US'].trim()).not.toBe('');
  });

  it('registers exactly seven features at levels 3, 3, 3, 7, 10, 15, and 18', () => {
    expect(fighterRuneKnightFeatures).toHaveLength(7);
    expect(fighterRuneKnightFeatures.map(({ id, minimumLevel }) => [
      id,
      minimumLevel,
    ])).toEqual(expectedFeatureLevels);
    expect(fighterRuneKnightSubclass.featureIds).toEqual(
      expectedFeatureLevels.map(([id]) => id),
    );
  });

  it('owns every feature as a Rune Knight subclass feature', () => {
    expect(fighterRuneKnightFeatures.every(
      ({ origin, sourceId }) => origin === 'subclass' && sourceId === 'fighter-rune-knight',
    )).toBe(true);
  });

  it('registers and offers exactly the ten current Fighter subclasses', () => {
    expect(fighterClass.subclassIds).toEqual(expectedSubclassIds);
    expect(fighterClass.progression[3]?.choices).toContainEqual({
      id: 'fighter-subclass-choice',
      type: 'subclass',
      count: 1,
      optionIds: expectedSubclassIds,
    });
  });

  it('preserves the nine previous subclass definitions in order', () => {
    expect([
      fighterChampionSubclass.id,
      fighterBattleMasterSubclass.id,
      fighterEldritchKnightSubclass.id,
      fighterArcaneArcherSubclass.id,
      fighterCavalierSubclass.id,
      fighterSamuraiSubclass.id,
      fighterBanneretSubclass.id,
      fighterEchoKnightSubclass.id,
      fighterPsiWarriorSubclass.id,
    ]).toEqual(expectedSubclassIds.slice(0, 9));
  });

  it('grants smith tools and Giant without a choice', () => {
    expect(featureById('fighter-rune-knight-bonus-proficiencies')?.effects).toEqual([
      { type: 'tool-proficiency', proficiencyId: 'smiths-tools' },
      { type: 'language', proficiencyId: 'giant' },
    ]);
  });
});

describe('Rune Carver mechanics', () => {
  it('models the exact known-rune progression and registered options', () => {
    expect(fighterRuneKnightRuneChoice).toMatchObject({
      type: 'technique',
      minimumLevel: 3,
      count: 2,
      optionIds: fighterRuneKnightRuneIds,
      countProgression: [
        { level: 3, count: 2 },
        { level: 7, count: 3 },
        { level: 10, count: 4 },
        { level: 15, count: 5 },
      ],
    });
  });

  it('allows one known rune replacement whenever a Fighter level is gained', () => {
    expect(fighterRuneKnightRuneChoice.replacement).toEqual({
      trigger: 'class-level-gained',
      classId: 'fighter',
      count: 1,
    });
  });

  it('models inscription count, eligible objects, uniqueness, and lifecycle', () => {
    const inscription = effectByType(
      featureById('fighter-rune-knight-rune-carver')?.effects,
      'inscription',
    );

    expect(inscription).toMatchObject({
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
    });
  });

  it('defines and reuses 8 + PB + Constitution as the rune save DC', () => {
    expect(fighterRuneKnightRuneSaveDc).toEqual({
      base: 8,
      proficiencyBonusMultiplier: 1,
      abilityModifier: 'constitution',
    });
    expect(runeById('fighter-rune-knight-fire-rune')?.save?.dc).toBe(
      fighterRuneKnightRuneSaveDc,
    );
    expect(runeById('fighter-rune-knight-stone-rune')?.save?.dc).toBe(
      fighterRuneKnightRuneSaveDc,
    );
  });
});

describe('Rune techniques', () => {
  it('registers exactly six unique runes with the expected IDs and levels', () => {
    expect(fighterRuneKnightRunes).toHaveLength(6);
    expect(fighterRuneKnightRunes.map(({ id, minimumLevel }) => [
      id,
      minimumLevel,
    ])).toEqual(expectedRuneLevels);
    expect(new Set(fighterRuneKnightRuneIds).size).toBe(6);
  });

  it('keeps Hill and Storm at level 7 and all other runes at level 3', () => {
    expect(fighterRuneKnightRunes.filter(({ minimumLevel }) => minimumLevel === 3)).toHaveLength(4);
    expect(fighterRuneKnightRunes.filter(({ minimumLevel }) => minimumLevel === 7)).toHaveLength(2);
    expect(fighterRuneKnightRuneIds.slice(4)).toEqual([
      'fighter-rune-knight-hill-rune',
      'fighter-rune-knight-storm-rune',
    ]);
  });

  it('gives every rune passive effects and one invocation per short or long rest', () => {
    expect(fighterRuneKnightRunes.every(({ passiveEffects }) => (
      (passiveEffects?.length ?? 0) > 0
    ))).toBe(true);
    expect(fighterRuneKnightRunes.every(({ usage }) => (
      usage?.freeUses === 1
      && usage.recovery === 'short-or-long-rest'
      && usage.progression === fighterRuneKnightRuneUseProgression
    ))).toBe(true);
  });

  it('models Cloud Rune passive advantages and attack redirection', () => {
    const rune = runeById('fighter-rune-knight-cloud-rune');

    expect(rune?.passiveEffects).toEqual(expect.arrayContaining([
      expect.objectContaining({
        ability: 'dexterity',
        proficiencyId: 'sleight-of-hand',
        value: 'advantage',
      }),
      expect.objectContaining({
        ability: 'charisma',
        proficiencyId: 'deception',
        value: 'advantage',
      }),
    ]));
    expect(rune).toMatchObject({
      activation: 'reaction',
      trigger: { event: 'hit-by-attack-roll' },
      range: { value: 9, unit: 'meter' },
      target: {
        kind: 'creature',
        conditions: ['other-than-original-target', 'not-attacker'],
      },
      usage: { recovery: 'short-or-long-rest' },
    });
    expect(effectByType(rune?.effects, 'redirection')).toMatchObject({
      rollTypes: ['attack-roll'],
      usesSameRoll: true,
      ignoresOriginalRange: true,
      value: 'chosen-creature-becomes-attack-target',
    });
  });

  it('models Fire Rune tool expertise, hit damage, save, restraint, and recurring damage', () => {
    const rune = runeById('fighter-rune-knight-fire-rune');
    const failedEffects = failedSaveEffects(rune);

    expect(rune?.passiveEffects).toContainEqual(expect.objectContaining({
      type: 'expertise',
      proficiencyId: 'tools',
      value: 'double-proficiency-bonus',
    }));
    expect(rune).toMatchObject({
      trigger: { event: 'weapon-attack-hit', conditions: ['target-creature'] },
      save: { ability: 'strength', dc: fighterRuneKnightRuneSaveDc },
      usage: { recovery: 'short-or-long-rest' },
    });
    expect(effectByType(rune?.effects, 'damage')).toMatchObject({
      damageType: 'fire',
      formula: { type: 'dice', count: 2, dieSize: 6 },
    });
    expect(failedEffects).toContainEqual(expect.objectContaining({
      type: 'condition',
      conditionIds: ['restrained'],
      duration: { type: 'minutes', value: 1 },
    }));
    expect(failedEffects).toContainEqual(expect.objectContaining({
      type: 'damage',
      damageType: 'fire',
      trigger: { event: 'start-of-target-turn' },
      formula: { type: 'dice', count: 2, dieSize: 6 },
    }));
    expect(failedEffects).toContainEqual(expect.objectContaining({
      trigger: { event: 'end-of-target-turn' },
      save: { ability: 'strength', dc: fighterRuneKnightRuneSaveDc },
      value: 'successful-save-ends-effect',
    }));
  });

  it('models Frost Rune passive advantages and its ten-minute +2 bonuses', () => {
    const rune = runeById('fighter-rune-knight-frost-rune');

    expect(rune?.passiveEffects).toEqual(expect.arrayContaining([
      expect.objectContaining({ ability: 'wisdom', proficiencyId: 'animal-handling' }),
      expect.objectContaining({ ability: 'charisma', proficiencyId: 'intimidation' }),
    ]));
    expect(rune).toMatchObject({
      activation: 'bonus-action',
      duration: { type: 'minutes', value: 10 },
      usage: { recovery: 'short-or-long-rest' },
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
    });
  });

  it('models Stone Rune passive Insight advantage and 36-meter darkvision', () => {
    const rune = runeById('fighter-rune-knight-stone-rune');

    expect(rune?.passiveEffects).toContainEqual(expect.objectContaining({
      ability: 'wisdom',
      proficiencyId: 'insight',
      value: 'advantage',
    }));
    expect(effectByType(rune?.passiveEffects, 'darkvision')).toMatchObject({
      value: 36,
      distance: { value: 36, unit: 'meter' },
    });
  });

  it('models Stone Rune end-turn reaction, save, conditions, speed, and repeat save', () => {
    const rune = runeById('fighter-rune-knight-stone-rune');
    const failedEffects = failedSaveEffects(rune);

    expect(rune).toMatchObject({
      activation: 'reaction',
      trigger: { event: 'creature-ends-turn', conditions: ['visible-to-fighter'] },
      range: { value: 9, unit: 'meter' },
      save: { ability: 'wisdom', dc: fighterRuneKnightRuneSaveDc },
      duration: { type: 'minutes', value: 1 },
      usage: { recovery: 'short-or-long-rest' },
    });
    expect(failedEffects).toContainEqual(expect.objectContaining({
      conditionIds: ['charmed', 'incapacitated'],
      condition: 'charmed-by-fighter',
    }));
    expect(failedEffects).toContainEqual({ type: 'walking-speed', value: 0 });
    expect(failedEffects).toContainEqual(expect.objectContaining({
      trigger: { event: 'end-of-target-turn' },
      save: { ability: 'wisdom', dc: fighterRuneKnightRuneSaveDc },
      value: 'successful-save-ends-effect',
    }));
  });

  it('models Hill Rune level, poison defenses, activation, duration, and B/P/S resistance', () => {
    const rune = runeById('fighter-rune-knight-hill-rune');

    expect(rune?.minimumLevel).toBe(7);
    expect(rune?.passiveEffects).toEqual(expect.arrayContaining([
      expect.objectContaining({
        type: 'roll-modifier',
        rollTypes: ['saving-throw'],
        value: 'advantage',
      }),
      expect.objectContaining({ type: 'resistance', damageType: 'poison' }),
    ]));
    expect(rune).toMatchObject({
      activation: 'bonus-action',
      duration: { type: 'minutes', value: 1 },
      usage: { recovery: 'short-or-long-rest' },
    });
    expect(rune?.effects?.map(({ damageType }) => damageType)).toEqual([
      'bludgeoning',
      'piercing',
      'slashing',
    ]);
  });

  it('models Storm Rune passives and prophetic-state lifecycle', () => {
    const rune = runeById('fighter-rune-knight-storm-rune');

    expect(rune?.minimumLevel).toBe(7);
    expect(rune?.passiveEffects).toEqual(expect.arrayContaining([
      expect.objectContaining({
        ability: 'intelligence',
        proficiencyId: 'arcana',
        value: 'advantage',
      }),
      expect.objectContaining({
        type: 'immunity',
        conditionIds: ['surprised'],
      }),
    ]));
    expect(rune).toMatchObject({
      activation: 'bonus-action',
      duration: {
        type: 'minutes',
        value: 1,
        endsEarlyWhen: ['fighter-incapacitated'],
      },
      usage: { recovery: 'short-or-long-rest' },
    });
  });

  it('models Storm Rune reaction range, roll types, and advantage-or-disadvantage choice', () => {
    const rune = runeById('fighter-rune-knight-storm-rune');
    const reaction = rune?.effects?.find(({ activation }) => activation === 'reaction');

    expect(reaction).toMatchObject({
      activation: 'reaction',
      trigger: { event: 'roll-made' },
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
    });
  });
});

describe('Rune Knight class features and resources', () => {
  it('models Giant Might activation, duration, size, Strength advantage, and damage progression', () => {
    const feature = featureById('fighter-rune-knight-giants-might');

    expect(feature).toMatchObject({
      activation: 'bonus-action',
      duration: { type: 'minutes', value: 1 },
      resourceCost: {
        resourceId: 'fighter-rune-knight-giants-might-uses',
        amount: 1,
        roll: false,
      },
    });
    expect(effectByType(feature?.effects, 'size')).toMatchObject({
      progression: [
        { level: 3, value: 'large' },
        { level: 18, value: 'huge' },
      ],
    });
    expect(effectByType(feature?.effects, 'roll-modifier')).toMatchObject({
      ability: 'strength',
      rollTypes: ['ability-check', 'saving-throw'],
      value: 'advantage',
    });
    expect(effectByType(feature?.effects, 'damage')).toMatchObject({
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
    });
  });

  it('gives Giant Might PB-based uses with long-rest recovery', () => {
    expect(fighterRuneKnightGiantsMightUses).toMatchObject({
      recovery: 'long-rest',
      progression: [{
        level: 3,
        maximum: { type: 'proficiency-bonus', multiplier: 1 },
      }],
    });
  });

  it('models Runic Shield reaction, range, mandatory reroll, uses, and recovery', () => {
    const feature = featureById('fighter-rune-knight-runic-shield');

    expect(feature).toMatchObject({
      activation: 'reaction',
      trigger: { event: 'hit-by-attack-roll', conditions: ['other-visible-creature'] },
      range: { value: 18, unit: 'meter' },
      target: { kind: 'creature', visible: true, excludesSelf: true },
      resourceCost: {
        resourceId: 'fighter-rune-knight-runic-shield-uses',
        amount: 1,
      },
      effects: [{
        type: 'reroll',
        rollTypes: ['attack-roll'],
        mustUseNewRoll: true,
        value: 'attacker-rerolls-d20',
      }],
    });
    expect(fighterRuneKnightRunicShieldUses).toMatchObject({
      recovery: 'long-rest',
      progression: [{
        level: 7,
        maximum: { type: 'proficiency-bonus', multiplier: 1 },
      }],
    });
  });

  it('models Great Stature 3d4 × 2.5 cm and the d8 Giant Might upgrade', () => {
    const feature = featureById('fighter-rune-knight-great-stature');

    expect(feature?.effects).toContainEqual(expect.objectContaining({
      trigger: { event: 'feature-gained' },
      value: 'height-increase',
      formula: {
        type: 'dice',
        count: 3,
        dieSize: 4,
        multiplier: 2.5,
        unit: 'centimeter',
      },
    }));
    expect(feature?.effects).toContainEqual(expect.objectContaining({
      type: 'damage',
      triggerFeatureId: 'fighter-rune-knight-giants-might',
      value: '1d8',
    }));
  });

  it('models Master of Runes as a shared 1-to-2 invocation-use progression', () => {
    const feature = featureById('fighter-rune-knight-master-of-runes');

    expect(fighterRuneKnightRuneUseProgression).toEqual([
      { level: 3, freeUses: 1 },
      { level: 15, freeUses: 2 },
    ]);
    expect(feature?.effects).toContainEqual(expect.objectContaining({
      triggerFeatureId: 'fighter-rune-knight-rune-carver',
      value: 'invocations-per-known-rune',
      progression: [
        { level: 3, value: 1 },
        { level: 15, value: 2 },
      ],
    }));
    expect(fighterRuneKnightRunes.every(
      ({ usage }) => usage?.progression === fighterRuneKnightRuneUseProgression,
    )).toBe(true);
  });

  it('models Runic Juggernaut d10 damage, Huge size, and 1.5-meter reach', () => {
    const feature = featureById('fighter-rune-knight-runic-juggernaut');

    expect(feature?.effects).toEqual(expect.arrayContaining([
      expect.objectContaining({
        type: 'damage',
        triggerFeatureId: 'fighter-rune-knight-giants-might',
        value: '1d10',
      }),
      expect.objectContaining({
        type: 'size',
        triggerFeatureId: 'fighter-rune-knight-giants-might',
        value: 'huge',
      }),
      expect.objectContaining({
        type: 'reach',
        condition: 'while-huge',
        distance: { value: 1.5, unit: 'meter' },
      }),
    ]));
  });
});

describe('Rune Knight catalog, references, and exports', () => {
  it.each([
    'fighter-rune-knight',
    'Rune Knight',
    'Cavaleiro Rúnico',
    'runes',
    'giant-magic',
    'constitution-based',
    'battlefield-control',
    'size-manipulation',
  ])('finds the subclass by catalog query %s', (query) => {
    expect(matchesCatalogQuery(fighterRuneKnightSubclass, query)).toBe(true);
  });

  it.each([
    ['fighter-rune-knight-cloud-rune', 'Cloud Rune', 'Runa da Nuvem'],
    ['fighter-rune-knight-fire-rune', 'Fire Rune', 'Runa do Fogo'],
    ['fighter-rune-knight-frost-rune', 'Frost Rune', 'Runa do Gelo'],
    ['fighter-rune-knight-stone-rune', 'Stone Rune', 'Runa da Pedra'],
    ['fighter-rune-knight-hill-rune', 'Hill Rune', 'Runa da Colina'],
    ['fighter-rune-knight-storm-rune', 'Storm Rune', 'Runa da Tempestade'],
  ])('finds %s by both localized names', (id, enUS, ptBR) => {
    const rune = runeById(id);

    expect(rune).toBeDefined();
    if (rune) {
      expect(matchesCatalogQuery(rune, enUS)).toBe(true);
      expect(matchesCatalogQuery(rune, ptBR)).toBe(true);
    }
  });

  it('has unique IDs and no orphaned feature, technique, choice, resource, or feature links', () => {
    const featureIds = fighterRuneKnightFeatures.map(({ id }) => id);
    const runeIds = fighterRuneKnightRunes.map(({ id }) => id);
    const resourceIds = (fighterRuneKnightSubclass.resources ?? []).map(({ id }) => id);
    const allIds = [...featureIds, ...runeIds, ...resourceIds];
    const linkedFeatureIds = fighterRuneKnightFeatures.flatMap(({ effects }) => (
      effects?.flatMap(({ triggerFeatureId }) => triggerFeatureId ?? []) ?? []
    ));
    const resourceReferences = fighterRuneKnightFeatures.flatMap(
      ({ resourceCost }) => resourceCost?.resourceId ?? [],
    );

    expect(new Set(allIds).size).toBe(allIds.length);
    expect(fighterRuneKnightSubclass.featureIds).toEqual(featureIds);
    expect(featureById('fighter-rune-knight-rune-carver')?.techniqueIds).toEqual(runeIds);
    expect(fighterRuneKnightRuneChoice.optionIds).toEqual(runeIds);
    expect(linkedFeatureIds.every((id) => featureIds.includes(id))).toBe(true);
    expect(resourceReferences.every((id) => resourceIds.includes(id))).toBe(true);
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
      ...fighterRuneKnightFeatures,
    ].map(({ id }) => id);

    expect(new Set(allFeatureIds).size).toBe(allFeatureIds.length);
  });

  it('exports the subclass, features, and runes through the public barrel', () => {
    expect(subclassFromPublicBarrel).toBe(fighterRuneKnightSubclass);
    expect(featuresFromPublicBarrel).toBe(fighterRuneKnightFeatures);
    expect(runesFromPublicBarrel).toBe(fighterRuneKnightRunes);
  });
});
