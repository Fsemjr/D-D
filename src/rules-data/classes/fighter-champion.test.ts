import { describe, expect, it } from 'vitest';
import { fighterChampionSubclass as fighterChampionFromPublicBarrel } from '..';
import { fighterChampionFeatures } from '../features/fighter-champion';
import { fighterFeatures } from '../features/fighter';
import { fighterChampionSubclass } from './fighter-champion';
import { fighterClass } from './fighter';

const expectedFeatureLevels: Array<[string, number]> = [
  ['fighter-champion-improved-critical', 3],
  ['fighter-champion-remarkable-athlete', 7],
  ['fighter-champion-additional-fighting-style', 10],
  ['fighter-champion-superior-critical', 15],
  ['fighter-champion-survivor', 18],
];

describe('Champion subclass rules data', () => {
  it('has the expected identity and localized names', () => {
    expect(fighterChampionSubclass.id).toBe('fighter-champion');
    expect(fighterChampionSubclass.classId).toBe('fighter');
    expect(fighterChampionSubclass.names).toEqual({
      'pt-BR': 'Campeão',
      'en-US': 'Champion',
    });
  });

  it('references only registered Champion features', () => {
    const registeredFeatureIds = new Set(fighterChampionFeatures.map(({ id }) => id));

    expect(
      fighterChampionSubclass.featureIds.every((id) => registeredFeatureIds.has(id)),
    ).toBe(true);
  });

  it('has no orphaned Champion features', () => {
    const subclassFeatureIds = new Set(fighterChampionSubclass.featureIds);

    expect(
      fighterChampionFeatures.every(({ id }) => subclassFeatureIds.has(id)),
    ).toBe(true);
  });

  it('is registered by the Fighter and offered by its level 3 choice', () => {
    expect(fighterClass.subclassIds).toEqual([
      'fighter-champion',
      'fighter-battle-master',
      'fighter-eldritch-knight',
      'fighter-arcane-archer',
      'fighter-cavalier',
      'fighter-samurai',
      'fighter-banneret',
      'fighter-echo-knight',
      'fighter-psi-warrior',
    ]);
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
        'fighter-psi-warrior',
      ],
    });
  });

  it('has no duplicate feature IDs', () => {
    const championFeatureIds = fighterChampionFeatures.map(({ id }) => id);
    const allFighterFeatureIds = [
      ...fighterFeatures.map(({ id }) => id),
      ...championFeatureIds,
    ];

    expect(new Set(championFeatureIds).size).toBe(championFeatureIds.length);
    expect(new Set(allFighterFeatureIds).size).toBe(allFighterFeatureIds.length);
    expect(new Set(fighterChampionSubclass.featureIds).size).toBe(
      fighterChampionSubclass.featureIds.length,
    );
  });

  it('owns all of its features as subclass features', () => {
    expect(
      fighterChampionFeatures.every(({ origin }) => origin === 'subclass'),
    ).toBe(true);
    expect(
      fighterChampionFeatures.every(({ sourceId }) => sourceId === 'fighter-champion'),
    ).toBe(true);
  });

  it.each(expectedFeatureLevels)(
    'registers %s at Fighter level %i',
    (featureId, expectedLevel) => {
      const feature = fighterChampionFeatures.find(({ id }) => id === featureId);

      expect(feature?.minimumLevel).toBe(expectedLevel);
    },
  );

  it('does not add spellcasting to the base Fighter', () => {
    expect(fighterClass.spellcasting).toBeUndefined();
    expect(
      Object.values(fighterClass.progression).every((level) => level?.spellSlots === undefined),
    ).toBe(true);
  });

  it('is exported by the public rules-data barrel', () => {
    expect(fighterChampionFromPublicBarrel).toBe(fighterChampionSubclass);
  });
});
