import { describe, expect, it } from 'vitest';
import {
  fighterEldritchKnightFeatures as featuresFromPublicBarrel,
  fighterEldritchKnightSpellcasting as spellcastingFromPublicBarrel,
  fighterEldritchKnightSubclass as subclassFromPublicBarrel,
  matchesCatalogQuery,
} from '..';
import { fighterBattleMasterFeatures } from '../features/fighter-battle-master';
import { fighterChampionFeatures } from '../features/fighter-champion';
import { fighterEldritchKnightFeatures } from '../features/fighter-eldritch-knight';
import { fighterFeatures } from '../features/fighter';
import {
  fighterEldritchKnightSpellcasting,
  fighterEldritchKnightSubclass,
} from './fighter-eldritch-knight';
import { fighterClass } from './fighter';

const expectedFeatureLevels: Array<[string, number]> = [
  ['fighter-eldritch-knight-spellcasting', 3],
  ['fighter-eldritch-knight-weapon-bond', 3],
  ['fighter-eldritch-knight-war-magic', 7],
  ['fighter-eldritch-knight-eldritch-strike', 10],
  ['fighter-eldritch-knight-arcane-charge', 15],
  ['fighter-eldritch-knight-improved-war-magic', 18],
];

const expectedSpellsKnown: Array<[number, number]> = [
  [3, 3], [4, 4], [5, 4], [6, 4], [7, 5], [8, 6],
  [9, 6], [10, 7], [11, 8], [12, 8], [13, 9], [14, 10],
  [15, 10], [16, 11], [17, 11], [18, 11], [19, 12], [20, 13],
];

const expectedSpellSlots = [
  [3, { 1: 2 }],
  [4, { 1: 3 }],
  [5, { 1: 3 }],
  [6, { 1: 3 }],
  [7, { 1: 4, 2: 2 }],
  [8, { 1: 4, 2: 2 }],
  [9, { 1: 4, 2: 2 }],
  [10, { 1: 4, 2: 3 }],
  [11, { 1: 4, 2: 3 }],
  [12, { 1: 4, 2: 3 }],
  [13, { 1: 4, 2: 3, 3: 2 }],
  [14, { 1: 4, 2: 3, 3: 2 }],
  [15, { 1: 4, 2: 3, 3: 2 }],
  [16, { 1: 4, 2: 3, 3: 3 }],
  [17, { 1: 4, 2: 3, 3: 3 }],
  [18, { 1: 4, 2: 3, 3: 3 }],
  [19, { 1: 4, 2: 3, 3: 3, 4: 1 }],
  [20, { 1: 4, 2: 3, 3: 3, 4: 1 }],
] as const;

function featureById(id: string) {
  return fighterEldritchKnightFeatures.find((feature) => feature.id === id);
}

describe('Eldritch Knight subclass rules data', () => {
  it('has the expected identity and localized names', () => {
    expect(fighterEldritchKnightSubclass).toMatchObject({
      id: 'fighter-eldritch-knight',
      classId: 'fighter',
      names: {
        'pt-BR': 'Cavaleiro Arcano',
        'en-US': 'Eldritch Knight',
      },
    });
  });

  it('has project source, stable tags, and localized summaries', () => {
    expect(fighterEldritchKnightSubclass.source).toEqual({
      bookId: 'jvf-classes-subclasses-compendium',
    });
    expect(fighterEldritchKnightSubclass.tags).toEqual([
      'martial',
      'spellcasting',
      'wizard-magic',
      'weapon-focused',
    ]);
    expect(fighterEldritchKnightSubclass.summary?.['pt-BR'].trim()).not.toBe('');
    expect(fighterEldritchKnightSubclass.summary?.['en-US'].trim()).not.toBe('');
  });

  it.each(expectedFeatureLevels)('registers %s at Fighter level %i', (id, level) => {
    expect(featureById(id)?.minimumLevel).toBe(level);
  });

  it('owns all six features as subclass features', () => {
    expect(fighterEldritchKnightFeatures).toHaveLength(6);
    expect(
      fighterEldritchKnightFeatures.every(({ origin }) => origin === 'subclass'),
    ).toBe(true);
    expect(
      fighterEldritchKnightFeatures.every(
        ({ sourceId }) => sourceId === 'fighter-eldritch-knight',
      ),
    ).toBe(true);
  });

  it('has no orphaned or missing feature references', () => {
    expect(fighterEldritchKnightSubclass.featureIds).toEqual(
      fighterEldritchKnightFeatures.map(({ id }) => id),
    );
  });

  it('registers all four Fighter subclasses', () => {
    expect(fighterClass.subclassIds).toEqual([
      'fighter-champion',
      'fighter-battle-master',
      'fighter-eldritch-knight',
      'fighter-arcane-archer',
    ]);
  });

  it('offers all four subclasses in the level 3 choice', () => {
    expect(fighterClass.progression[3]?.choices).toContainEqual({
      id: 'fighter-subclass-choice',
      type: 'subclass',
      count: 1,
      optionIds: [
        'fighter-champion',
        'fighter-battle-master',
        'fighter-eldritch-knight',
        'fighter-arcane-archer',
      ],
    });
  });
});

describe('Eldritch Knight spellcasting', () => {
  it('starts at level 3 and uses Intelligence and the Wizard spell list', () => {
    expect(fighterEldritchKnightSpellcasting).toMatchObject({
      ability: 'intelligence',
      preparationMode: 'known',
      startsAtLevel: 3,
      spellListId: 'wizard',
    });
  });

  it('knows two cantrips through level 9 and three from level 10', () => {
    for (let level = 3; level <= 20; level += 1) {
      const expected = level < 10 ? 2 : 3;
      expect(fighterEldritchKnightSpellcasting.progression?.[level]?.cantripsKnown).toBe(expected);
    }
  });

  it.each(expectedSpellsKnown)('at level %i knows %i spells', (level, count) => {
    expect(fighterEldritchKnightSpellcasting.progression?.[level]?.spellsKnown).toBe(count);
  });

  it.each(expectedSpellSlots)('has the exact spell slots at level %i', (level, slots) => {
    expect(fighterEldritchKnightSpellcasting.progression?.[level]?.spellSlots).toEqual(slots);
  });

  it('defines every spellcasting level from 3 through 20', () => {
    expect(Object.keys(fighterEldritchKnightSpellcasting.progression ?? {}).map(Number)).toEqual(
      Array.from({ length: 18 }, (_, index) => index + 3),
    );
  });

  it('recovers spell slots on a long rest', () => {
    expect(fighterEldritchKnightSpellcasting.slotRecovery).toBe('long-rest');
  });

  it('structures school restrictions and unrestricted acquisition levels', () => {
    expect(fighterEldritchKnightSpellcasting.allowedSchools).toEqual([
      'abjuration',
      'evocation',
    ]);
    expect(
      fighterEldritchKnightSpellcasting.schoolRestrictionExceptionLevels,
    ).toEqual([8, 14, 20]);
    expect(fighterEldritchKnightSpellcasting.initialUnrestrictedSpells).toBe(1);
    expect(fighterEldritchKnightSpellcasting.knownSpellReplacementsPerLevel).toBe(1);
    expect(
      fighterEldritchKnightSpellcasting.preserveUnrestrictedSchoolChoiceOnReplacement,
    ).toBe(true);
    expect(fighterEldritchKnightSpellcasting.knownSpellLevelLimit).toBe(
      'available-spell-slots',
    );
  });

  it('uses Intelligence in the save DC and spell attack formulas', () => {
    expect(fighterEldritchKnightSpellcasting.saveDcFormula).toBe(
      '8 + proficiencyBonus + intelligenceModifier',
    );
    expect(fighterEldritchKnightSpellcasting.attackModifierFormula).toBe(
      'proficiencyBonus + intelligenceModifier',
    );

    const spellcastingFeature = featureById('fighter-eldritch-knight-spellcasting');
    expect(spellcastingFeature?.effects?.every(
      ({ ability }) => ability === 'intelligence',
    )).toBe(true);
  });
});

describe('Eldritch Knight feature mechanics', () => {
  it('structures the Weapon Bond limits and activation', () => {
    const values = featureById('fighter-eldritch-knight-weapon-bond')
      ?.effects?.map(({ value }) => value);

    expect(values).toEqual([
      60,
      'ritual-during-short-rest',
      2,
      'immune-to-disarm-while-not-incapacitated',
      'summon-bonded-weapon-bonus-action',
      'same-plane',
    ]);
  });

  it('distinguishes War Magic cantrips from Improved War Magic spells', () => {
    expect(featureById('fighter-eldritch-knight-war-magic')?.effects).toContainEqual(
      expect.objectContaining({
        value: 'action:cast-cantrip->bonus-action:weapon-attack',
      }),
    );
    expect(featureById('fighter-eldritch-knight-improved-war-magic')?.effects).toContainEqual(
      expect.objectContaining({
        value: 'action:cast-spell->bonus-action:weapon-attack',
      }),
    );
  });

  it('preserves Eldritch Strike timing and Arcane Charge distance semantically', () => {
    expect(featureById('fighter-eldritch-knight-eldritch-strike')?.effects).toContainEqual(
      expect.objectContaining({
        value: 'weapon-attack-hit->disadvantage-next-save-against-own-spell:until-end-of-next-turn',
      }),
    );
    expect(featureById('fighter-eldritch-knight-arcane-charge')?.effects).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ value: 9 }),
        expect.objectContaining({
          value: 'visible-unoccupied-space:before-or-after-additional-action',
        }),
      ]),
    );
  });

  it('has no duplicate Fighter-family feature IDs', () => {
    const allFeatureIds = [
      ...fighterFeatures,
      ...fighterChampionFeatures,
      ...fighterBattleMasterFeatures,
      ...fighterEldritchKnightFeatures,
    ].map(({ id }) => id);

    expect(new Set(allFeatureIds).size).toBe(allFeatureIds.length);
  });
});

describe('Eldritch Knight catalog and exports', () => {
  it.each([
    'fighter-eldritch-knight',
    'Eldritch Knight',
    'Cavaleiro Arcano',
    'Intelligence-based wizard spellcasting',
    'spellcasting',
  ])('is found by catalog query %s', (query) => {
    expect(matchesCatalogQuery(fighterEldritchKnightSubclass, query)).toBe(true);
  });

  it('is exported with its features and spellcasting through the public barrel', () => {
    expect(subclassFromPublicBarrel).toBe(fighterEldritchKnightSubclass);
    expect(spellcastingFromPublicBarrel).toBe(fighterEldritchKnightSpellcasting);
    expect(featuresFromPublicBarrel).toBe(fighterEldritchKnightFeatures);
  });
});
