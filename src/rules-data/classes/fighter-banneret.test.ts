import { describe, expect, it } from 'vitest';
import {
  fighterBanneretFeatures as featuresFromPublicBarrel,
  fighterBanneretSubclass as subclassFromPublicBarrel,
  matchesCatalogQuery,
} from '..';
import { fighterArcaneArcherFeatures } from '../features/fighter-arcane-archer';
import { fighterBanneretFeatures } from '../features/fighter-banneret';
import { fighterBattleMasterFeatures } from '../features/fighter-battle-master';
import { fighterCavalierFeatures } from '../features/fighter-cavalier';
import { fighterChampionFeatures } from '../features/fighter-champion';
import { fighterEldritchKnightFeatures } from '../features/fighter-eldritch-knight';
import { fighterFeatures } from '../features/fighter';
import { fighterSamuraiFeatures } from '../features/fighter-samurai';
import { fighterArcaneArcherSubclass } from './fighter-arcane-archer';
import {
  fighterBanneretRoyalEnvoyFallbackChoice,
  fighterBanneretSubclass,
} from './fighter-banneret';
import { fighterBattleMasterSubclass } from './fighter-battle-master';
import { fighterCavalierSubclass } from './fighter-cavalier';
import { fighterChampionSubclass } from './fighter-champion';
import { fighterEldritchKnightSubclass } from './fighter-eldritch-knight';
import { fighterClass } from './fighter';
import { fighterSamuraiSubclass } from './fighter-samurai';

const expectedFeatureLevels: Array<[string, number]> = [
  ['fighter-banneret-rallying-cry', 3],
  ['fighter-banneret-royal-envoy', 7],
  ['fighter-banneret-inspiring-surge', 10],
  ['fighter-banneret-bulwark', 15],
];

const expectedSubclassIds = [
  'fighter-champion',
  'fighter-battle-master',
  'fighter-eldritch-knight',
  'fighter-arcane-archer',
  'fighter-cavalier',
  'fighter-samurai',
  'fighter-banneret',
  'fighter-echo-knight',
];

function featureById(id: string) {
  return fighterBanneretFeatures.find((feature) => feature.id === id);
}

function featureValues(id: string) {
  return featureById(id)?.effects?.map(({ value }) => value) ?? [];
}

describe('Banneret subclass rules data', () => {
  it('has the expected identity and localized names', () => {
    expect(fighterBanneretSubclass).toMatchObject({
      id: 'fighter-banneret',
      classId: 'fighter',
      names: { 'pt-BR': 'Ginete', 'en-US': 'Banneret' },
    });
  });

  it('has project source, stable tags, and localized summary', () => {
    expect(fighterBanneretSubclass.source).toEqual({
      bookId: 'jvf-classes-subclasses-compendium',
    });
    expect(fighterBanneretSubclass.tags).toEqual([
      'martial',
      'support',
      'leadership',
      'ally-support',
      'social',
    ]);
    expect(fighterBanneretSubclass.summary?.['pt-BR'].trim()).not.toBe('');
    expect(fighterBanneretSubclass.summary?.['en-US'].trim()).not.toBe('');
  });

  it('registers exactly four features', () => {
    expect(fighterBanneretFeatures).toHaveLength(4);
    expect(fighterBanneretSubclass.featureIds).toHaveLength(4);
  });

  it.each(expectedFeatureLevels)('registers %s at Fighter level %i', (id, level) => {
    expect(featureById(id)?.minimumLevel).toBe(level);
  });

  it('owns every feature as a Banneret subclass feature', () => {
    expect(fighterBanneretFeatures.every(({ origin }) => origin === 'subclass')).toBe(true);
    expect(fighterBanneretFeatures.every(
      ({ sourceId }) => sourceId === 'fighter-banneret',
    )).toBe(true);
  });

  it('has no orphaned or missing feature references', () => {
    expect(fighterBanneretSubclass.featureIds).toEqual(
      fighterBanneretFeatures.map(({ id }) => id),
    );
  });

  it('registers and offers exactly the eight current Fighter subclasses', () => {
    expect(fighterClass.subclassIds).toEqual(expectedSubclassIds);
    expect(fighterClass.progression[3]?.choices).toContainEqual({
      id: 'fighter-subclass-choice',
      type: 'subclass',
      count: 1,
      optionIds: expectedSubclassIds,
    });
  });

  it('preserves all six previous subclass definitions', () => {
    expect([
      fighterChampionSubclass.id,
      fighterBattleMasterSubclass.id,
      fighterEldritchKnightSubclass.id,
      fighterArcaneArcherSubclass.id,
      fighterCavalierSubclass.id,
      fighterSamuraiSubclass.id,
    ]).toEqual(expectedSubclassIds.slice(0, 6));
  });
});

describe('Banneret feature mechanics', () => {
  it('triggers Rallying Cry from the registered Second Wind feature', () => {
    const trigger = featureById('fighter-banneret-rallying-cry')?.effects?.find(
      ({ triggerFeatureId }) => triggerFeatureId,
    );

    expect(trigger).toMatchObject({
      triggerFeatureId: 'fighter-second-wind',
      value: 'trigger:feature-use',
    });
    expect(fighterFeatures.some(({ id }) => id === trigger?.triggerFeatureId)).toBe(true);
  });

  it('structures Rallying Cry targets, range, requirements, and healing', () => {
    const rallyingCry = featureById('fighter-banneret-rallying-cry');

    expect(rallyingCry?.effects).toContainEqual(expect.objectContaining({
      value: 'maximum-allied-target-count',
      progression: [{ level: 3, value: 3 }],
    }));
    expect(featureValues(rallyingCry?.id ?? '')).toEqual(expect.arrayContaining([
      18,
      'allies:must-see-and-hear-fighter',
      'fighterLevel',
    ]));
    expect(rallyingCry?.effects).toContainEqual(expect.objectContaining({
      type: 'flat-hp',
      value: 'fighterLevel',
    }));
  });

  it('does not create a standalone Rallying Cry resource', () => {
    expect(fighterBanneretSubclass.resources).toBeUndefined();
  });

  it('grants Persuasion proficiency and independent expertise', () => {
    expect(featureById('fighter-banneret-royal-envoy')?.effects).toEqual([
      expect.objectContaining({
        type: 'skill-proficiency',
        proficiencyId: 'persuasion',
      }),
      expect.objectContaining({
        type: 'expertise',
        proficiencyId: 'persuasion',
        value: 2,
      }),
    ]);
  });

  it('offers exactly the Royal Envoy fallback skills when Persuasion already exists', () => {
    expect(fighterBanneretRoyalEnvoyFallbackChoice).toMatchObject({
      type: 'skill',
      condition: 'already-proficient:persuasion',
      count: 1,
      optionIds: [
        'animal-handling',
        'insight',
        'intimidation',
        'performance',
      ],
    });
    expect(fighterBanneretSubclass.choices).toEqual([
      fighterBanneretRoyalEnvoyFallbackChoice,
    ]);
  });

  it('triggers Inspiring Surge from the registered Action Surge feature', () => {
    const trigger = featureById('fighter-banneret-inspiring-surge')?.effects?.find(
      ({ triggerFeatureId }) => triggerFeatureId,
    );

    expect(trigger?.triggerFeatureId).toBe('fighter-action-surge');
    expect(fighterFeatures.some(({ id }) => id === trigger?.triggerFeatureId)).toBe(true);
  });

  it('uses the exact Inspiring Surge target progression', () => {
    expect(featureById('fighter-banneret-inspiring-surge')?.effects).toContainEqual(
      expect.objectContaining({
        value: 'maximum-allied-target-count',
        progression: [
          { level: 10, value: 1 },
          { level: 17, value: 2 },
        ],
      }),
    );
  });

  it('preserves Inspiring Surge range, senses, and allied reaction attacks', () => {
    expect(featureValues('fighter-banneret-inspiring-surge')).toEqual(
      expect.arrayContaining([
        18,
        'allies:must-see-and-hear-fighter',
        'ally-reaction:melee-or-ranged-attack',
      ]),
    );
  });

  it('triggers Bulwark from Indomitable for exactly Int, Wis, or Cha saves', () => {
    const trigger = featureById('fighter-banneret-bulwark')?.effects?.find(
      ({ triggerFeatureId }) => triggerFeatureId,
    );

    expect(trigger).toMatchObject({
      triggerFeatureId: 'fighter-indomitable',
      abilityOptions: ['intelligence', 'wisdom', 'charisma'],
    });
    expect(fighterFeatures.some(({ id }) => id === trigger?.triggerFeatureId)).toBe(true);
  });

  it('preserves every Bulwark requirement and mandatory reroll result', () => {
    expect(featureValues('fighter-banneret-bulwark')).toEqual([
      'trigger:feature-use-to-reroll-saving-throw',
      'requires:fighter-not-incapacitated',
      'allied-target-count:1',
      18,
      'ally:failed-save-against-same-effect;must-see-and-hear-fighter',
      'ally-reroll-saving-throw:must-use-new-result',
    ]);
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
    ].map(({ id }) => id);

    expect(new Set(allFeatureIds).size).toBe(allFeatureIds.length);
  });
});

describe('Banneret catalog and exports', () => {
  it.each([
    'fighter-banneret',
    'Banneret',
    'Ginete',
    'heal, inspire, and protect allies',
    'support',
    'leadership',
    'ally-support',
  ])('is found by catalog query %s', (query) => {
    expect(matchesCatalogQuery(fighterBanneretSubclass, query)).toBe(true);
  });

  it('exports the subclass and features through the public barrel', () => {
    expect(subclassFromPublicBarrel).toBe(fighterBanneretSubclass);
    expect(featuresFromPublicBarrel).toBe(fighterBanneretFeatures);
  });
});
