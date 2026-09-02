import { describe, expect, it } from 'vitest';
import {
  fighterSamuraiFeatures as featuresFromPublicBarrel,
  fighterSamuraiSubclass as subclassFromPublicBarrel,
  matchesCatalogQuery,
} from '..';
import { fighterArcaneArcherFeatures } from '../features/fighter-arcane-archer';
import { fighterBattleMasterFeatures } from '../features/fighter-battle-master';
import { fighterCavalierFeatures } from '../features/fighter-cavalier';
import { fighterChampionFeatures } from '../features/fighter-champion';
import { fighterEldritchKnightFeatures } from '../features/fighter-eldritch-knight';
import { fighterFeatures } from '../features/fighter';
import { fighterSamuraiFeatures } from '../features/fighter-samurai';
import { fighterArcaneArcherSubclass } from './fighter-arcane-archer';
import { fighterBattleMasterSubclass } from './fighter-battle-master';
import { fighterCavalierSubclass } from './fighter-cavalier';
import { fighterChampionSubclass } from './fighter-champion';
import { fighterEldritchKnightSubclass } from './fighter-eldritch-knight';
import { fighterClass } from './fighter';
import {
  fighterSamuraiBonusProficiencyChoice,
  fighterSamuraiBonusProficiencyLanguageChoice,
  fighterSamuraiBonusProficiencySkillChoice,
  fighterSamuraiElegantCourtierFallbackChoice,
  fighterSamuraiFightingSpiritUses,
  fighterSamuraiStrengthBeforeDeathUses,
  fighterSamuraiSubclass,
} from './fighter-samurai';

const expectedFeatureLevels: Array<[string, number]> = [
  ['fighter-samurai-bonus-proficiency', 3],
  ['fighter-samurai-fighting-spirit', 3],
  ['fighter-samurai-elegant-courtier', 7],
  ['fighter-samurai-tireless-spirit', 10],
  ['fighter-samurai-rapid-strike', 15],
  ['fighter-samurai-strength-before-death', 18],
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
  'fighter-psi-warrior',
];

function featureById(id: string) {
  return fighterSamuraiFeatures.find((feature) => feature.id === id);
}

function featureValues(id: string) {
  return featureById(id)?.effects?.map(({ value }) => value) ?? [];
}

describe('Samurai subclass rules data', () => {
  it('has the expected identity and localized names', () => {
    expect(fighterSamuraiSubclass).toMatchObject({
      id: 'fighter-samurai',
      classId: 'fighter',
      names: { 'pt-BR': 'Samurai', 'en-US': 'Samurai' },
    });
  });

  it('has project source, stable tags, and localized summary', () => {
    expect(fighterSamuraiSubclass.source).toEqual({
      bookId: 'jvf-classes-subclasses-compendium',
    });
    expect(fighterSamuraiSubclass.tags).toEqual([
      'martial',
      'weapon-combat',
      'resilience',
      'advantage',
      'wisdom-synergy',
    ]);
    expect(fighterSamuraiSubclass.summary?.['pt-BR'].trim()).not.toBe('');
    expect(fighterSamuraiSubclass.summary?.['en-US'].trim()).not.toBe('');
  });

  it('registers exactly six features', () => {
    expect(fighterSamuraiFeatures).toHaveLength(6);
    expect(fighterSamuraiSubclass.featureIds).toHaveLength(6);
  });

  it.each(expectedFeatureLevels)('registers %s at Fighter level %i', (id, level) => {
    expect(featureById(id)?.minimumLevel).toBe(level);
  });

  it('owns every feature as a Samurai subclass feature', () => {
    expect(fighterSamuraiFeatures.every(({ origin }) => origin === 'subclass')).toBe(true);
    expect(fighterSamuraiFeatures.every(
      ({ sourceId }) => sourceId === 'fighter-samurai',
    )).toBe(true);
  });

  it('has no orphaned or missing feature references', () => {
    expect(fighterSamuraiSubclass.featureIds).toEqual(
      fighterSamuraiFeatures.map(({ id }) => id),
    );
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

  it('preserves all five previous subclass definitions', () => {
    expect([
      fighterChampionSubclass.id,
      fighterBattleMasterSubclass.id,
      fighterEldritchKnightSubclass.id,
      fighterArcaneArcherSubclass.id,
      fighterCavalierSubclass.id,
    ]).toEqual(expectedSubclassIds.slice(0, 5));
  });
});

describe('Samurai Bonus Proficiency', () => {
  it('offers exactly the four permitted skills', () => {
    expect(fighterSamuraiBonusProficiencySkillChoice).toMatchObject({
      type: 'skill',
      count: 1,
      optionIds: ['history', 'insight', 'performance', 'persuasion'],
    });
  });

  it('offers one unrestricted language as the alternative', () => {
    expect(fighterSamuraiBonusProficiencyLanguageChoice).toMatchObject({
      type: 'language',
      count: 1,
    });
    expect(fighterSamuraiBonusProficiencyLanguageChoice.optionIds).toBeUndefined();
  });

  it('structures skill versus language as one alternative choice', () => {
    expect(fighterSamuraiBonusProficiencyChoice).toMatchObject({
      type: 'one-of',
      count: 1,
      optionTypes: ['skill', 'language'],
      choices: [
        fighterSamuraiBonusProficiencySkillChoice,
        fighterSamuraiBonusProficiencyLanguageChoice,
      ],
    });
  });
});

describe('Samurai feature mechanics', () => {
  it('structures Fighting Spirit bonus action and weapon attack advantage', () => {
    expect(featureValues('fighter-samurai-fighting-spirit')).toEqual([
      'bonus-action',
      'weapon-attack-rolls:advantage:until-end-of-current-turn',
      undefined,
    ]);
  });

  it('uses the exact Fighting Spirit temporary HP progression', () => {
    expect(featureById('fighter-samurai-fighting-spirit')?.effects).toContainEqual({
      type: 'temporary-hp',
      progression: [
        { level: 3, value: 5 },
        { level: 10, value: 10 },
        { level: 15, value: 15 },
      ],
    });
  });

  it('gives Fighting Spirit three uses recovered on a long rest', () => {
    expect(fighterSamuraiFightingSpiritUses).toMatchObject({
      recovery: 'long-rest',
      progression: [{ level: 3, maximum: 3 }],
    });
  });

  it('adds Wisdom to Persuasion and grants Wisdom save proficiency', () => {
    expect(featureById('fighter-samurai-elegant-courtier')?.effects).toEqual([
      expect.objectContaining({
        type: 'ability-modifier',
        ability: 'wisdom',
        proficiencyId: 'persuasion',
        value: 'add-to-charisma-persuasion-check',
      }),
      expect.objectContaining({
        type: 'saving-throw-proficiency',
        ability: 'wisdom',
      }),
    ]);
  });

  it('offers Intelligence or Charisma save proficiency when Wisdom already exists', () => {
    expect(fighterSamuraiElegantCourtierFallbackChoice).toMatchObject({
      type: 'saving-throw-proficiency',
      condition: 'already-proficient:wisdom-saving-throw',
      count: 1,
      optionIds: ['intelligence', 'charisma'],
    });
    expect(fighterSamuraiSubclass.choices).toContain(
      fighterSamuraiElegantCourtierFallbackChoice,
    );
  });

  it('recovers exactly one Fighting Spirit use on initiative with zero uses', () => {
    expect(featureValues('fighter-samurai-tireless-spirit')).toEqual([
      'initiative-with-zero-resource->recover:1',
    ]);
  });

  it('structures every Rapid Strike requirement and conversion', () => {
    expect(featureValues('fighter-samurai-rapid-strike')).toEqual([
      'trigger:attack-action;requires:advantage-against-target',
      'exchange-advantage->additional-weapon-attack:same-target',
      'maximum-once-per-turn',
    ]);
  });

  it('preserves Strength Before Death trigger, reaction, and extra-turn semantics', () => {
    expect(featureValues('fighter-samurai-strength-before-death')).toEqual([
      'trigger:damage-reduces-to-0-hp-without-instant-death',
      'reaction',
      'delay-unconscious;immediate-extra-turn:interrupt-current-turn',
      'extra-turn:remain-at-0-hp;damage-causes-death-save-failure;three-failures-can-kill',
      'extra-turn-end:if-0-hp->unconscious',
    ]);
  });

  it('gives Strength Before Death one use recovered on a long rest', () => {
    expect(fighterSamuraiStrengthBeforeDeathUses).toMatchObject({
      recovery: 'long-rest',
      progression: [{ level: 18, maximum: 1 }],
    });
  });

  it('registers both Samurai resources on the subclass', () => {
    expect(fighterSamuraiSubclass.resources).toEqual([
      fighterSamuraiFightingSpiritUses,
      fighterSamuraiStrengthBeforeDeathUses,
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
    ].map(({ id }) => id);

    expect(new Set(allFeatureIds).size).toBe(allFeatureIds.length);
  });
});

describe('Samurai catalog and exports', () => {
  it.each([
    'fighter-samurai',
    'Samurai',
    'temporary vigor',
    'resilience',
    'advantage',
    'wisdom-synergy',
  ])('is found by catalog query %s', (query) => {
    expect(matchesCatalogQuery(fighterSamuraiSubclass, query)).toBe(true);
  });

  it('exports the subclass and features through the public barrel', () => {
    expect(subclassFromPublicBarrel).toBe(fighterSamuraiSubclass);
    expect(featuresFromPublicBarrel).toBe(fighterSamuraiFeatures);
  });
});
