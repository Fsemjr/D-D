import { describe, expect, it } from 'vitest';
import {
  fighterEchoKnightFeatures as featuresFromPublicBarrel,
  fighterEchoKnightSubclass as subclassFromPublicBarrel,
  matchesCatalogQuery,
} from '..';
import { fighterArcaneArcherFeatures } from '../features/fighter-arcane-archer';
import { fighterBanneretFeatures } from '../features/fighter-banneret';
import { fighterBattleMasterFeatures } from '../features/fighter-battle-master';
import { fighterCavalierFeatures } from '../features/fighter-cavalier';
import { fighterChampionFeatures } from '../features/fighter-champion';
import { fighterEchoKnightFeatures } from '../features/fighter-echo-knight';
import { fighterEldritchKnightFeatures } from '../features/fighter-eldritch-knight';
import { fighterFeatures } from '../features/fighter';
import { fighterSamuraiFeatures } from '../features/fighter-samurai';
import { fighterArcaneArcherSubclass } from './fighter-arcane-archer';
import { fighterBanneretSubclass } from './fighter-banneret';
import { fighterBattleMasterSubclass } from './fighter-battle-master';
import { fighterCavalierSubclass } from './fighter-cavalier';
import { fighterChampionSubclass } from './fighter-champion';
import {
  fighterEchoKnightReclaimPotentialUses,
  fighterEchoKnightShadowMartyrUses,
  fighterEchoKnightSubclass,
  fighterEchoKnightUnleashIncarnationUses,
} from './fighter-echo-knight';
import { fighterEldritchKnightSubclass } from './fighter-eldritch-knight';
import { fighterClass } from './fighter';
import { fighterSamuraiSubclass } from './fighter-samurai';

const expectedFeatureLevels: Array<[string, number]> = [
  ['fighter-echo-knight-manifest-echo', 3],
  ['fighter-echo-knight-unleash-incarnation', 3],
  ['fighter-echo-knight-echo-avatar', 7],
  ['fighter-echo-knight-shadow-martyr', 10],
  ['fighter-echo-knight-reclaim-potential', 15],
  ['fighter-echo-knight-legion-of-one', 18],
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
  return fighterEchoKnightFeatures.find((feature) => feature.id === id);
}

function featureValues(id: string) {
  return featureById(id)?.effects?.map(({ value }) => value) ?? [];
}

describe('Echo Knight subclass rules data', () => {
  it('has the expected identity and localized names', () => {
    expect(fighterEchoKnightSubclass).toMatchObject({
      id: 'fighter-echo-knight',
      classId: 'fighter',
      names: { 'pt-BR': 'Cavaleiro do Eco', 'en-US': 'Echo Knight' },
    });
  });

  it('has project source, stable tags, and localized summary', () => {
    expect(fighterEchoKnightSubclass.source).toEqual({
      bookId: 'jvf-classes-subclasses-compendium',
    });
    expect(fighterEchoKnightSubclass.tags).toEqual([
      'martial',
      'teleportation',
      'battlefield-control',
      'echo',
      'positioning',
      'tactical',
    ]);
    expect(fighterEchoKnightSubclass.summary?.['pt-BR'].trim()).not.toBe('');
    expect(fighterEchoKnightSubclass.summary?.['en-US'].trim()).not.toBe('');
  });

  it('registers exactly six features', () => {
    expect(fighterEchoKnightFeatures).toHaveLength(6);
    expect(fighterEchoKnightSubclass.featureIds).toHaveLength(6);
  });

  it.each(expectedFeatureLevels)('registers %s at Fighter level %i', (id, level) => {
    expect(featureById(id)?.minimumLevel).toBe(level);
  });

  it('owns every feature as an Echo Knight subclass feature', () => {
    expect(fighterEchoKnightFeatures.every(({ origin }) => origin === 'subclass')).toBe(true);
    expect(fighterEchoKnightFeatures.every(
      ({ sourceId }) => sourceId === 'fighter-echo-knight',
    )).toBe(true);
  });

  it('has no orphaned or missing feature references', () => {
    expect(fighterEchoKnightSubclass.featureIds).toEqual(
      fighterEchoKnightFeatures.map(({ id }) => id),
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

  it('preserves all seven previous subclass definitions', () => {
    expect([
      fighterChampionSubclass.id,
      fighterBattleMasterSubclass.id,
      fighterEldritchKnightSubclass.id,
      fighterArcaneArcherSubclass.id,
      fighterCavalierSubclass.id,
      fighterSamuraiSubclass.id,
      fighterBanneretSubclass.id,
    ]).toEqual(expectedSubclassIds.slice(0, 7));
  });
});

describe('Manifest Echo mechanics', () => {
  it('structures creation, statistics, movement, and termination', () => {
    expect(featureValues('fighter-echo-knight-manifest-echo')).toEqual(
      expect.arrayContaining([
        'bonus-action:manifest-echo',
        'create:visible-unoccupied-space-within-4.5m',
        'echo-ac:14+proficiencyBonus',
        'echo-hp:1',
        'echo-condition-immunity:all',
        'echo-saving-throws:use-fighter-bonuses',
        'echo-size:same-as-fighter;occupies-own-space',
        'fighter-turn:mental-command;move-up-to-9m;no-action',
        'end-of-turn-distance-over-9m->echo-destroyed',
        'ends:destroyed-or-bonus-action-dismiss-or-replaced-or-fighter-incapacitated',
      ]),
    );
  });

  it('structures teleport position swap and its movement cost', () => {
    expect(featureValues('fighter-echo-knight-manifest-echo')).toContain(
      'bonus-action:teleport-swap-with-echo;movement-cost:4.5m;distance-independent',
    );
  });

  it('allows each Attack action attack to use an alternate origin', () => {
    expect(featureValues('fighter-echo-knight-manifest-echo')).toContain(
      'attack-action:each-attack-origin:fighter-or-echo',
    );
  });

  it('structures the echo-space opportunity attack trigger and reaction', () => {
    expect(featureValues('fighter-echo-knight-manifest-echo')).toContain(
      'visible-creature-within-1.5m-of-echo-moves-at-least-1.5m-away->fighter-reaction:opportunity-attack-from-echo-space',
    );
  });
});

describe('Echo Knight feature mechanics and resources', () => {
  it('adds a melee attack from the echo on the Attack action', () => {
    expect(featureValues('fighter-echo-knight-unleash-incarnation')).toEqual([
      'trigger:attack-action->additional-melee-attack-from-echo-space',
    ]);
  });

  it('derives Unleash Incarnation uses from Constitution and recovers on long rest', () => {
    expect(fighterEchoKnightUnleashIncarnationUses).toMatchObject({
      recovery: 'long-rest',
      progression: [{
        level: 3,
        maximum: { type: 'ability-modifier', ability: 'constitution', minimum: 1 },
      }],
    });
  });

  it('structures every Echo Avatar state, duration, and distance', () => {
    expect(featureValues('fighter-echo-knight-echo-avatar')).toEqual([
      'action:transfer-consciousness-to-echo',
      'duration:maximum-10-minutes',
      'see-and-hear-through-echo;fighter:blinded-and-deafened',
      'maximum-echo-distance:300m',
      'end:any-time:no-action',
    ]);
  });

  it('structures Shadow Martyr before-roll reaction and redirection', () => {
    expect(featureValues('fighter-echo-knight-shadow-martyr')).toEqual([
      'trigger:before-attack-roll-against-other-visible-creature',
      'reaction',
      'teleport-echo:visible-unoccupied-space-within-1.5m-of-target',
      'redirect-attack-to-echo-before-attack-roll',
    ]);
  });

  it('gives Shadow Martyr one use per short or long rest', () => {
    expect(fighterEchoKnightShadowMartyrUses).toMatchObject({
      recovery: 'short-or-long-rest',
      progression: [{ level: 10, maximum: 1 }],
    });
  });

  it('structures Reclaim Potential trigger, condition, and temporary HP formula', () => {
    expect(featureValues('fighter-echo-knight-reclaim-potential')).toContain(
      'trigger:echo-destroyed-by-damage',
    );
    expect(featureById('fighter-echo-knight-reclaim-potential')?.effects).toContainEqual({
      type: 'temporary-hp',
      ability: 'constitution',
      condition: 'fighter-has-no-temporary-hp',
      value: '2d6 + constitutionModifier',
    });
  });

  it('derives Reclaim Potential uses from Constitution and recovers on long rest', () => {
    expect(fighterEchoKnightReclaimPotentialUses).toMatchObject({
      recovery: 'long-rest',
      progression: [{
        level: 15,
        maximum: { type: 'ability-modifier', ability: 'constitution', minimum: 1 },
      }],
    });
  });

  it('structures Legion of One echoes and conditional resource recovery', () => {
    expect(featureValues('fighter-echo-knight-legion-of-one')).toEqual([
      'bonus-action:manifest-up-to-2-simultaneous-echoes',
      'manifest-third-echo->destroy-both-existing-echoes',
      'capabilities-from-either-echo-space',
      'initiative-with-zero-resource->recover:1',
    ]);
  });

  it('registers all three Echo Knight resources on the subclass', () => {
    expect(fighterEchoKnightSubclass.resources).toEqual([
      fighterEchoKnightUnleashIncarnationUses,
      fighterEchoKnightShadowMartyrUses,
      fighterEchoKnightReclaimPotentialUses,
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
      ...fighterEchoKnightFeatures,
    ].map(({ id }) => id);

    expect(new Set(allFeatureIds).size).toBe(allFeatureIds.length);
  });
});

describe('Echo Knight catalog and exports', () => {
  it.each([
    'fighter-echo-knight',
    'Echo Knight',
    'Cavaleiro do Eco',
    'control positions',
    'teleportation',
    'battlefield-control',
    'echo',
    'tactical',
  ])('is found by catalog query %s', (query) => {
    expect(matchesCatalogQuery(fighterEchoKnightSubclass, query)).toBe(true);
  });

  it('exports the subclass and features through the public barrel', () => {
    expect(subclassFromPublicBarrel).toBe(fighterEchoKnightSubclass);
    expect(featuresFromPublicBarrel).toBe(fighterEchoKnightFeatures);
  });
});
