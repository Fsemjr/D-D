import { describe, expect, it } from 'vitest';
import { fighterClass as fighterClassFromPublicBarrel } from '..';
import {
  fighterFeatures,
  fighterFightingStyleIds,
  fighterFightingStyles,
} from '../features/fighter';
import { isValidClassDefinition } from '../validation';
import { fighterClass } from './fighter';

const expectedSkills = [
  'acrobatics',
  'animal-handling',
  'athletics',
  'history',
  'insight',
  'intimidation',
  'perception',
  'survival',
];

const expectedFightingStyleIds = [
  'archery',
  'great-weapon-fighting',
  'two-weapon-fighting',
  'protection',
  'defense',
  'dueling',
  'blind-fighting',
  'interception',
  'superior-technique',
  'thrown-weapon-fighting',
  'unarmed-fighting',
];

const expectedAbilityScoreImprovementLevels = [4, 6, 8, 12, 14, 16, 19];

const expectedProficiencyBonuses = [
  [1, 2], [2, 2], [3, 2], [4, 2],
  [5, 3], [6, 3], [7, 3], [8, 3],
  [9, 4], [10, 4], [11, 4], [12, 4],
  [13, 5], [14, 5], [15, 5], [16, 5],
  [17, 6], [18, 6], [19, 6], [20, 6],
];

function featureIdsAt(level: number): string[] {
  return fighterClass.progression[level]?.featureIds ?? [];
}

describe('Fighter rules data', () => {
  it('has the expected identity, localized names, and hit die', () => {
    expect(fighterClass.id).toBe('fighter');
    expect(fighterClass.names).toEqual({ 'pt-BR': 'Guerreiro', 'en-US': 'Fighter' });
    expect(fighterClass.hitDie).toBe(10);
  });

  it('is a valid ClassDefinition', () => {
    expect(isValidClassDefinition(fighterClass)).toBe(true);
  });

  it('uses Strength and Dexterity as primary abilities', () => {
    expect(fighterClass.primaryAbilities).toEqual(['strength', 'dexterity']);
  });

  it('is proficient in Strength and Constitution saving throws', () => {
    expect(fighterClass.savingThrows).toEqual(['strength', 'constitution']);
  });

  it('has all armor and shield proficiencies', () => {
    expect(fighterClass.armorProficiencies).toEqual([
      'light-armor',
      'medium-armor',
      'heavy-armor',
      'shields',
    ]);
  });

  it('has simple and martial weapon proficiencies', () => {
    expect(fighterClass.weaponProficiencies).toEqual([
      'simple-weapons',
      'martial-weapons',
    ]);
  });

  it('has no tool proficiencies', () => {
    expect(fighterClass.toolProficiencies).toEqual([]);
  });

  it('chooses exactly two skills from the eight expected options', () => {
    expect(fighterClass.skillChoices?.count).toBe(2);
    expect(fighterClass.skillChoices?.options).toEqual(expectedSkills);
  });

  it('chooses a subclass explicitly at level 3', () => {
    expect(fighterClass.subclassLevel).toBe(3);
    expect(fighterClass.progression[3]?.choices).toContainEqual({
      id: 'fighter-subclass-choice',
      type: 'subclass',
      count: 1,
      optionIds: [
        'fighter-champion',
        'fighter-battle-master',
        'fighter-eldritch-knight',
        'fighter-arcane-archer',
        'fighter-cavalier',
        'fighter-samurai',
        'fighter-banneret',
        'fighter-echo-knight',
      ],
    });
  });

  it('contains every level from 1 through 20', () => {
    expect(Object.keys(fighterClass.progression).map(Number)).toEqual(
      Array.from({ length: 20 }, (_, index) => index + 1),
    );
  });

  it.each(expectedProficiencyBonuses)(
    'uses level %i -> expected proficiency bonus +%i',
    (level, expectedBonus) => {
      expect(fighterClass.progression[level]?.proficiencyBonus).toBe(expectedBonus);
    },
  );

  it('grants Fighting Style and Second Wind at level 1', () => {
    expect(featureIdsAt(1)).toEqual([
      'fighter-fighting-style',
      'fighter-second-wind',
    ]);
  });

  it('represents the level 1 Fighting Style choice structurally', () => {
    expect(fighterClass.progression[1]?.choices).toContainEqual({
      id: 'fighter-fighting-style-choice',
      type: 'fighting-style',
      count: 1,
      optionIds: fighterFightingStyleIds,
    });
  });

  it('offers exactly the registered Fighting Style options', () => {
    const fightingStyleChoice = fighterClass.progression[1]?.choices?.find(
      ({ type }) => type === 'fighting-style',
    );
    const optionIds = fightingStyleChoice && 'optionIds' in fightingStyleChoice
      ? fightingStyleChoice.optionIds
      : undefined;

    expect(optionIds).toEqual(expectedFightingStyleIds);
    expect(fighterFightingStyleIds).toEqual(expectedFightingStyleIds);
  });

  it('grants Action Surge at level 2 and scales it without a duplicate feature', () => {
    expect(featureIdsAt(2)).toContain('fighter-action-surge');
    expect(featureIdsAt(17)).toContain('fighter-action-surge');
    expect(
      fighterFeatures.filter(({ id }) => id === 'fighter-action-surge'),
    ).toHaveLength(1);
  });

  it.each(expectedAbilityScoreImprovementLevels)(
    'offers an explicit ASI or feat choice at level %i',
    (level) => {
      expect(featureIdsAt(level)).toContain('fighter-ability-score-improvement');
      expect(fighterClass.progression[level]?.choices).toContainEqual({
        id: `fighter-asi-or-feat-choice-${level}`,
        type: 'one-of',
        count: 1,
        optionTypes: ['asi', 'feat'],
      });
    },
  );

  it('offers ASI or feat choices only at the expected levels', () => {
    const levelsWithAbilityScoreImprovementChoices = Object.values(fighterClass.progression)
      .filter((level) => level?.choices?.some(({ type }) => type === 'one-of'))
      .map((level) => level?.level);

    expect(levelsWithAbilityScoreImprovementChoices).toEqual(
      expectedAbilityScoreImprovementLevels,
    );
  });

  it.each([5, 11, 20])('scales Extra Attack at level %i', (level) => {
    expect(featureIdsAt(level)).toContain('fighter-extra-attack');
  });

  it.each([9, 13, 17])('scales Indomitable at level %i', (level) => {
    expect(featureIdsAt(level)).toContain('fighter-indomitable');
  });

  it('does not define spellcasting or spell slots', () => {
    expect(fighterClass.spellcasting).toBeUndefined();
    expect(
      Object.values(fighterClass.progression).every((level) => level?.spellSlots === undefined),
    ).toBe(true);
  });

  it('references only registered Fighter features in its progression', () => {
    const registeredFeatureIds = new Set(fighterFeatures.map(({ id }) => id));
    const progressionFeatureIds = Object.values(fighterClass.progression)
      .flatMap((level) => level?.featureIds ?? []);

    expect(progressionFeatureIds.every((id) => registeredFeatureIds.has(id))).toBe(true);
  });

  it('references only registered Fighting Styles in its level 1 choice', () => {
    const registeredStyleIds = new Set(fighterFightingStyles.map(({ id }) => id));
    const fightingStyleChoice = fighterClass.progression[1]?.choices?.find(
      ({ type }) => type === 'fighting-style',
    );
    const optionIds = fightingStyleChoice && 'optionIds' in fightingStyleChoice
      ? fightingStyleChoice.optionIds
      : undefined;

    expect(optionIds?.every((id) => registeredStyleIds.has(id))).toBe(true);
  });

  it('has no duplicate Fighter feature or Fighting Style IDs', () => {
    const featureIds = fighterFeatures.map(({ id }) => id);
    const styleIds = fighterFightingStyles.map(({ id }) => id);

    expect(new Set(featureIds).size).toBe(featureIds.length);
    expect(new Set(styleIds).size).toBe(styleIds.length);
  });

  it('is exported by the public rules-data barrel', () => {
    expect(fighterClassFromPublicBarrel).toBe(fighterClass);
  });
});
