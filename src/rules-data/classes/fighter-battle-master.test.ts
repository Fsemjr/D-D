import { describe, expect, it } from 'vitest';
import {
  fighterBattleMasterSubclass as battleMasterFromPublicBarrel,
  fighterChampionSubclass as championFromPublicBarrel,
  fighterClass as fighterFromPublicBarrel,
} from '..';
import { fighterChampionFeatures } from '../features/fighter-champion';
import {
  fighterBattleMasterFeatures,
  fighterBattleMasterManeuverIds,
  fighterBattleMasterManeuvers,
} from '../features/fighter-battle-master';
import { fighterFeatures } from '../features/fighter';
import {
  fighterBattleMasterManeuverChoice,
  fighterBattleMasterSubclass,
  fighterBattleMasterSuperiorityDice,
} from './fighter-battle-master';
import { fighterChampionSubclass } from './fighter-champion';
import { fighterClass } from './fighter';

const expectedFeatureLevels: Array<[string, number]> = [
  ['fighter-battle-master-combat-superiority', 3],
  ['fighter-battle-master-student-of-war', 3],
  ['fighter-battle-master-know-your-enemy', 7],
  ['fighter-battle-master-improved-combat-superiority', 10],
  ['fighter-battle-master-relentless', 15],
];

const expectedManeuverIds = [
  'fighter-battle-master-maneuver-ambush',
  'fighter-battle-master-maneuver-bait-and-switch',
  'fighter-battle-master-maneuver-brace',
  'fighter-battle-master-maneuver-commanders-strike',
  'fighter-battle-master-maneuver-commanding-presence',
  'fighter-battle-master-maneuver-disarming-attack',
  'fighter-battle-master-maneuver-distracting-strike',
  'fighter-battle-master-maneuver-evasive-footwork',
  'fighter-battle-master-maneuver-feinting-attack',
  'fighter-battle-master-maneuver-goading-attack',
  'fighter-battle-master-maneuver-grappling-strike',
  'fighter-battle-master-maneuver-lunging-attack',
  'fighter-battle-master-maneuver-maneuvering-attack',
  'fighter-battle-master-maneuver-menacing-attack',
  'fighter-battle-master-maneuver-parry',
  'fighter-battle-master-maneuver-precision-attack',
  'fighter-battle-master-maneuver-pushing-attack',
  'fighter-battle-master-maneuver-quick-toss',
  'fighter-battle-master-maneuver-rally',
  'fighter-battle-master-maneuver-riposte',
  'fighter-battle-master-maneuver-sweeping-attack',
  'fighter-battle-master-maneuver-tactical-assessment',
  'fighter-battle-master-maneuver-trip-attack',
];

const expectedPortugueseManeuverNames = [
  'Aparar',
  'Ataque Ameaçador',
  'Ataque de Encontrão',
  'Ataque de Finta',
  'Ataque de Manobra',
  'Ataque de Precisão',
  'Ataque Desarmante',
  'Ataque Estendido',
  'Ataque Provocante',
  'Ataque Trespassante',
  'Contra-Atacar',
  'Derrubar',
  'Golpe Distrativo',
  'Golpe do Comandante',
  'Inspirar',
  'Passo Evasivo',
  'Emboscada',
  'Substituição',
  'Reforçar',
  'Presença Dominante',
  'Ataque de Agarrar',
  'Lance Rápido',
  'Avaliação Tática',
];

const expectedSuperiorityDiceProgression = [
  { level: 3, maximum: 4, dieSize: 8 },
  { level: 7, maximum: 5, dieSize: 8 },
  { level: 10, maximum: 5, dieSize: 10 },
  { level: 15, maximum: 6, dieSize: 10 },
  { level: 18, maximum: 6, dieSize: 12 },
];

const expectedManeuversKnownProgression = [
  { level: 3, count: 3 },
  { level: 7, count: 5 },
  { level: 10, count: 7 },
  { level: 15, count: 9 },
];

describe('Battle Master subclass rules data', () => {
  it('has the expected identity and localized names', () => {
    expect(fighterBattleMasterSubclass.id).toBe('fighter-battle-master');
    expect(fighterBattleMasterSubclass.classId).toBe('fighter');
    expect(fighterBattleMasterSubclass.names).toEqual({
      'pt-BR': 'Mestre de Batalha',
      'en-US': 'Battle Master',
    });
  });

  it('references only registered Battle Master features', () => {
    const registeredFeatureIds = new Set(fighterBattleMasterFeatures.map(({ id }) => id));

    expect(
      fighterBattleMasterSubclass.featureIds.every((id) => registeredFeatureIds.has(id)),
    ).toBe(true);
  });

  it('has no orphaned Battle Master features', () => {
    const subclassFeatureIds = new Set(fighterBattleMasterSubclass.featureIds);

    expect(
      fighterBattleMasterFeatures.every(({ id }) => subclassFeatureIds.has(id)),
    ).toBe(true);
  });

  it.each(expectedFeatureLevels)(
    'registers %s at Fighter level %i',
    (featureId, expectedLevel) => {
      const feature = fighterBattleMasterFeatures.find(({ id }) => id === featureId);

      expect(feature?.minimumLevel).toBe(expectedLevel);
    },
  );

  it('owns every feature as a Battle Master subclass feature', () => {
    expect(
      fighterBattleMasterFeatures.every(({ origin }) => origin === 'subclass'),
    ).toBe(true);
    expect(
      fighterBattleMasterFeatures.every(
        ({ sourceId }) => sourceId === 'fighter-battle-master',
      ),
    ).toBe(true);
  });

  it('registers Champion and Battle Master on the base Fighter', () => {
    expect(fighterClass.subclassIds).toEqual([
      'fighter-champion',
      'fighter-battle-master',
    ]);
    expect(fighterClass.progression[3]?.choices).toContainEqual({
      id: 'fighter-subclass-choice',
      type: 'subclass',
      count: 1,
      optionIds: ['fighter-champion', 'fighter-battle-master'],
    });
  });

  it('registers the expected maneuvers with unique IDs', () => {
    expect(fighterBattleMasterManeuvers).toHaveLength(23);
    expect(fighterBattleMasterManeuverIds).toEqual(expectedManeuverIds);
    expect(new Set(fighterBattleMasterManeuverIds).size).toBe(
      fighterBattleMasterManeuverIds.length,
    );
  });

  it('matches the exact Portuguese maneuver list from the project compendium', () => {
    const registeredNames = fighterBattleMasterManeuvers.map(
      ({ names }) => names['pt-BR'],
    );

    expect([...registeredNames].sort()).toEqual(
      [...expectedPortugueseManeuverNames].sort(),
    );
  });

  it('offers only registered maneuvers and leaves none orphaned', () => {
    const registeredManeuverIds = new Set(
      fighterBattleMasterManeuvers.map(({ id }) => id),
    );
    const referencedManeuverIds = new Set(fighterBattleMasterManeuverChoice.optionIds);

    expect(
      fighterBattleMasterManeuverChoice.optionIds?.every(
        (id) => registeredManeuverIds.has(id),
      ),
    ).toBe(true);
    expect(
      fighterBattleMasterManeuvers.every(({ id }) => referencedManeuverIds.has(id)),
    ).toBe(true);
  });

  it('models maneuver choices and maneuvers known progression', () => {
    expect(fighterBattleMasterManeuverChoice).toMatchObject({
      type: 'technique',
      minimumLevel: 3,
      count: 3,
      countProgression: expectedManeuversKnownProgression,
    });
  });

  it('models superiority dice quantity, die size, and recovery', () => {
    expect(fighterBattleMasterSuperiorityDice.progression).toEqual(
      expectedSuperiorityDiceProgression,
    );
    expect(fighterBattleMasterSuperiorityDice.recovery).toBe('short-or-long-rest');
  });

  it('stores the maneuver save DC basis mechanically', () => {
    const combatSuperiority = fighterBattleMasterFeatures.find(
      ({ id }) => id === 'fighter-battle-master-combat-superiority',
    );

    expect(combatSuperiority?.effects).toContainEqual(expect.objectContaining({
      type: 'informational',
      abilityOptions: ['strength', 'dexterity'],
      value: '8 + proficiencyBonus + abilityModifier',
    }));
  });

  it('allows exactly Strength or Dexterity for the maneuver save DC', () => {
    const combatSuperiority = fighterBattleMasterFeatures.find(
      ({ id }) => id === 'fighter-battle-master-combat-superiority',
    );
    const saveDcEffect = combatSuperiority?.effects?.find(
      ({ value }) => value === '8 + proficiencyBonus + abilityModifier',
    );

    expect(saveDcEffect?.abilityOptions).toEqual(['strength', 'dexterity']);
    expect(saveDcEffect?.abilityOptions).toHaveLength(2);
  });

  it('has no duplicate Fighter-family feature IDs', () => {
    const allFeatureIds = [
      ...fighterFeatures,
      ...fighterChampionFeatures,
      ...fighterBattleMasterFeatures,
    ].map(({ id }) => id);

    expect(new Set(allFeatureIds).size).toBe(allFeatureIds.length);
  });

  it('does not add spellcasting to the base Fighter', () => {
    expect(fighterClass.spellcasting).toBeUndefined();
    expect(
      Object.values(fighterClass.progression).every((level) => level?.spellSlots === undefined),
    ).toBe(true);
  });

  it('exports Fighter, Champion, and Battle Master from the public barrel', () => {
    expect(fighterFromPublicBarrel).toBe(fighterClass);
    expect(championFromPublicBarrel).toBe(fighterChampionSubclass);
    expect(battleMasterFromPublicBarrel).toBe(fighterBattleMasterSubclass);
  });
});
