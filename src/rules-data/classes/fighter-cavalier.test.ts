import { describe, expect, it } from 'vitest';
import {
  fighterCavalierFeatures as featuresFromPublicBarrel,
  fighterCavalierSubclass as subclassFromPublicBarrel,
  matchesCatalogQuery,
} from '..';
import { fighterArcaneArcherFeatures } from '../features/fighter-arcane-archer';
import { fighterBattleMasterFeatures } from '../features/fighter-battle-master';
import { fighterCavalierFeatures } from '../features/fighter-cavalier';
import { fighterChampionFeatures } from '../features/fighter-champion';
import { fighterEldritchKnightFeatures } from '../features/fighter-eldritch-knight';
import { fighterFeatures } from '../features/fighter';
import { fighterArcaneArcherSubclass } from './fighter-arcane-archer';
import { fighterBattleMasterSubclass } from './fighter-battle-master';
import {
  fighterCavalierBonusProficiencyChoice,
  fighterCavalierBonusProficiencyLanguageChoice,
  fighterCavalierBonusProficiencySkillChoice,
  fighterCavalierSubclass,
  fighterCavalierUnwaveringMarkUses,
  fighterCavalierWardingManeuverUses,
} from './fighter-cavalier';
import { fighterChampionSubclass } from './fighter-champion';
import { fighterEldritchKnightSubclass } from './fighter-eldritch-knight';
import { fighterClass } from './fighter';

const expectedFeatureLevels: Array<[string, number]> = [
  ['fighter-cavalier-bonus-proficiency', 3],
  ['fighter-cavalier-born-to-the-saddle', 3],
  ['fighter-cavalier-unwavering-mark', 3],
  ['fighter-cavalier-warding-maneuver', 7],
  ['fighter-cavalier-hold-the-line', 10],
  ['fighter-cavalier-ferocious-charger', 15],
  ['fighter-cavalier-vigilant-defender', 18],
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
  return fighterCavalierFeatures.find((feature) => feature.id === id);
}

function featureValues(id: string) {
  return featureById(id)?.effects?.map(({ value }) => value) ?? [];
}

describe('Cavalier subclass rules data', () => {
  it('has the expected identity and localized names', () => {
    expect(fighterCavalierSubclass).toMatchObject({
      id: 'fighter-cavalier',
      classId: 'fighter',
      names: { 'pt-BR': 'Cavaleiro', 'en-US': 'Cavalier' },
    });
  });

  it('has project source, stable tags, and localized summary', () => {
    expect(fighterCavalierSubclass.source).toEqual({
      bookId: 'jvf-classes-subclasses-compendium',
    });
    expect(fighterCavalierSubclass.tags).toEqual([
      'martial',
      'mounted-combat',
      'defender',
      'melee',
      'battlefield-control',
    ]);
    expect(fighterCavalierSubclass.summary?.['pt-BR'].trim()).not.toBe('');
    expect(fighterCavalierSubclass.summary?.['en-US'].trim()).not.toBe('');
  });

  it('registers exactly seven features', () => {
    expect(fighterCavalierFeatures).toHaveLength(7);
    expect(fighterCavalierSubclass.featureIds).toHaveLength(7);
  });

  it.each(expectedFeatureLevels)('registers %s at Fighter level %i', (id, level) => {
    expect(featureById(id)?.minimumLevel).toBe(level);
  });

  it('owns every feature as a Cavalier subclass feature', () => {
    expect(fighterCavalierFeatures.every(({ origin }) => origin === 'subclass')).toBe(true);
    expect(fighterCavalierFeatures.every(
      ({ sourceId }) => sourceId === 'fighter-cavalier',
    )).toBe(true);
  });

  it('has no orphaned or missing feature references', () => {
    expect(fighterCavalierSubclass.featureIds).toEqual(
      fighterCavalierFeatures.map(({ id }) => id),
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

  it('preserves all four previous subclass definitions', () => {
    expect([
      fighterChampionSubclass.id,
      fighterBattleMasterSubclass.id,
      fighterEldritchKnightSubclass.id,
      fighterArcaneArcherSubclass.id,
    ]).toEqual(expectedSubclassIds.slice(0, 4));
  });
});

describe('Cavalier Bonus Proficiency', () => {
  it('offers exactly the five permitted skills', () => {
    expect(fighterCavalierBonusProficiencySkillChoice).toMatchObject({
      type: 'skill',
      count: 1,
      optionIds: [
        'animal-handling',
        'history',
        'insight',
        'performance',
        'persuasion',
      ],
    });
  });

  it('offers one unrestricted language as the alternative', () => {
    expect(fighterCavalierBonusProficiencyLanguageChoice).toMatchObject({
      type: 'language',
      count: 1,
    });
    expect(fighterCavalierBonusProficiencyLanguageChoice.optionIds).toBeUndefined();
  });

  it('structures skill versus language as one alternative choice', () => {
    expect(fighterCavalierBonusProficiencyChoice).toMatchObject({
      type: 'one-of',
      count: 1,
      optionTypes: ['skill', 'language'],
      choices: [
        fighterCavalierBonusProficiencySkillChoice,
        fighterCavalierBonusProficiencyLanguageChoice,
      ],
    });
    expect(fighterCavalierSubclass.choices).toEqual([
      fighterCavalierBonusProficiencyChoice,
    ]);
  });
});

describe('Cavalier feature mechanics', () => {
  it('preserves Born to the Saddle fall and movement limits', () => {
    expect(featureValues('fighter-cavalier-born-to-the-saddle')).toEqual([
      'advantage:saves-to-avoid-falling-from-mount',
      'fall-from-mount:land-on-feet:maximum-3m:not-incapacitated',
      3,
      'mount-or-dismount-movement-cost:1.5m',
      1.5,
    ]);
  });

  it('structures every required Unwavering Mark trigger and effect', () => {
    expect(featureValues('fighter-cavalier-unwavering-mark')).toEqual([
      'trigger:melee-weapon-hit->mark',
      'mark:until-end-of-next-turn;ends:incapacitated-or-dead-or-other-mark',
      1.5,
      'marked-target-within-1.5m:disadvantage-attacks-against-others',
      'marked-target-damages-other->next-turn:bonus-action:melee-weapon-attack',
      'retaliatory-attack:advantage',
      'retaliatory-hit:extra-damage=fighterLevel/2',
    ]);
  });

  it('derives Unwavering Mark uses from Strength with a minimum of one', () => {
    expect(fighterCavalierUnwaveringMarkUses.progression).toEqual([{
      level: 3,
      maximum: { type: 'ability-modifier', ability: 'strength', minimum: 1 },
    }]);
    expect(fighterCavalierUnwaveringMarkUses.recovery).toBe('long-rest');
  });

  it('structures Warding Maneuver reaction, range, die, AC, and resistance', () => {
    expect(featureValues('fighter-cavalier-warding-maneuver')).toEqual([
      'trigger:self-or-visible-creature-hit-by-attack',
      1.5,
      'requires:wielding-melee-weapon-or-shield',
      'reaction',
      '1d8',
      'add-roll-to-target-ac-against-triggering-attack',
      'if-attack-still-hits:resistance-to-attack-damage',
    ]);
  });

  it('derives Warding Maneuver uses from Constitution with a minimum of one', () => {
    expect(fighterCavalierWardingManeuverUses.progression).toEqual([{
      level: 7,
      maximum: { type: 'ability-modifier', ability: 'constitution', minimum: 1 },
    }]);
    expect(fighterCavalierWardingManeuverUses.recovery).toBe('long-rest');
  });

  it('structures Hold the Line movement, opportunity attack, and speed reduction', () => {
    expect(featureValues('fighter-cavalier-hold-the-line')).toEqual([
      1.5,
      'movement-at-least-1.5m-within-reach->opportunity-attack',
      'opportunity-attack-hit->speed:0:until-end-of-current-turn',
    ]);
  });

  it('structures Ferocious Charger movement, Strength save, prone, and limit', () => {
    expect(featureValues('fighter-cavalier-ferocious-charger')).toEqual([
      3,
      'move-at-least-3m-straight-before-attack-hit',
      '8 + proficiencyBonus + strengthModifier',
      'failed-save:prone',
      'maximum-once-per-turn',
    ]);
    expect(featureById('fighter-cavalier-ferocious-charger')?.effects).toContainEqual(
      expect.objectContaining({
        ability: 'strength',
        savingThrowAbility: 'strength',
        value: '8 + proficiencyBonus + strengthModifier',
      }),
    );
  });

  it('preserves every Vigilant Defender reaction restriction', () => {
    expect(featureValues('fighter-cavalier-vigilant-defender')).toEqual([
      'combat:special-reaction:once-per-other-creature-turn',
      'special-reaction:opportunity-attack-only',
      'special-reaction:unavailable-on-own-turn',
      'special-reaction:blocked-if-normal-reaction-used-this-turn',
    ]);
  });

  it('registers both derived resources on the subclass', () => {
    expect(fighterCavalierSubclass.resources).toEqual([
      fighterCavalierUnwaveringMarkUses,
      fighterCavalierWardingManeuverUses,
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
    ].map(({ id }) => id);

    expect(new Set(allFeatureIds).size).toBe(allFeatureIds.length);
  });
});

describe('Cavalier catalog and exports', () => {
  it.each([
    'fighter-cavalier',
    'Cavalier',
    'Cavaleiro',
    'protects allies',
    'mounted-combat',
    'defender',
  ])('is found by catalog query %s', (query) => {
    expect(matchesCatalogQuery(fighterCavalierSubclass, query)).toBe(true);
  });

  it('exports the subclass and features through the public barrel', () => {
    expect(subclassFromPublicBarrel).toBe(fighterCavalierSubclass);
    expect(featuresFromPublicBarrel).toBe(fighterCavalierFeatures);
  });
});
