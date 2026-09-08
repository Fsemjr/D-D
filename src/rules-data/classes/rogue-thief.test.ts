import { describe, expect, it } from 'vitest';
import {
  rogueThiefFeatures as featuresFromPublicBarrel,
  rogueThiefSubclass as subclassFromPublicBarrel,
} from '..';
import { matchesCatalogQuery } from '../catalog';
import { fighterClass } from './fighter';
import { rogueFeatures } from '../features/rogue';
import { rogueAssassinFeatures } from '../features/rogue-assassin';
import { rogueThiefFeatures } from '../features/rogue-thief';
import type { MechanicalEffect } from '../types';
import { isValidClassDefinition } from '../validation';
import { rogueAssassinSubclass } from './rogue-assassin';
import { rogueThiefSubclass } from './rogue-thief';
import { rogueClass, rogueSubclassChoice } from './rogue';

const expectedFeatureLevels: Array<[string, number]> = [
  ['rogue-thief-fast-hands', 3],
  ['rogue-thief-second-story-work', 3],
  ['rogue-thief-supreme-sneak', 9],
  ['rogue-thief-use-magic-device', 13],
  ['rogue-thief-thiefs-reflexes', 17],
];

function featureById(id: string) {
  return rogueThiefFeatures.find((feature) => feature.id === id);
}

function effectByType(
  effects: MechanicalEffect[] | undefined,
  type: MechanicalEffect['type'],
): MechanicalEffect | undefined {
  return effects?.find((effect) => effect.type === type);
}

describe('Thief subclass rules data', () => {
  it('has the expected identity and localized metadata', () => {
    expect(rogueThiefSubclass).toMatchObject({
      id: 'rogue-thief',
      classId: 'rogue',
      names: { 'pt-BR': 'Ladrão', 'en-US': 'Thief' },
      source: { bookId: 'jvf-classes-subclasses-compendium' },
      tags: [
        'stealth',
        'utility',
        'mobility',
        'dungeon-exploration',
        'object-interaction',
        'magic-items',
      ],
    });
    expect(rogueThiefSubclass.summary?.['pt-BR'].trim()).not.toBe('');
    expect(rogueThiefSubclass.summary?.['en-US'].trim()).not.toBe('');
  });

  it('registers exactly five features at levels 3, 3, 9, 13, and 17', () => {
    expect(rogueThiefFeatures).toHaveLength(5);
    expect(rogueThiefFeatures.map(({ id, minimumLevel }) => [id, minimumLevel]))
      .toEqual(expectedFeatureLevels);
    expect(rogueThiefSubclass.featureIds).toEqual(
      expectedFeatureLevels.map(([id]) => id),
    );
  });

  it('owns every feature and gives it the compendium source', () => {
    expect(rogueThiefFeatures.every(({ origin, sourceId, source }) => (
      origin === 'subclass'
      && sourceId === 'rogue-thief'
      && source?.bookId === 'jvf-classes-subclasses-compendium'
    ))).toBe(true);
  });

  it.each([
    'rogue-thief',
    'Thief',
    'Ladrão',
    'stealth',
    'utility',
    'mobility',
    'dungeon-exploration',
    'object-interaction',
    'magic-items',
  ])('is found by catalog query %s', (query) => {
    expect(matchesCatalogQuery(rogueThiefSubclass, query)).toBe(true);
  });

  it('exports the subclass and features through the public barrel', () => {
    expect(subclassFromPublicBarrel).toBe(rogueThiefSubclass);
    expect(featuresFromPublicBarrel).toBe(rogueThiefFeatures);
  });
});

describe('Fast Hands', () => {
  it('expands Cunning Action as a bonus action with exactly three option groups', () => {
    const feature = featureById('rogue-thief-fast-hands');

    expect(feature).toMatchObject({
      minimumLevel: 3,
      activation: 'bonus-action',
      actionOptions: [
        'dexterity-sleight-of-hand-check',
        'thieves-tools:disarm-trap-or-open-lock',
        'use-an-object-action',
      ],
    });
    expect(feature?.effects).toEqual([expect.objectContaining({
      type: 'informational',
      triggerFeatureId: 'rogue-cunning-action',
      value: 'expands-trigger-feature-action-options',
    })]);
  });

  it('references the one base Cunning Action definition without duplicating it', () => {
    const reference = featureById('rogue-thief-fast-hands')?.effects?.[0]
      .triggerFeatureId;

    expect(reference).toBe('rogue-cunning-action');
    expect(rogueFeatures.filter(({ id }) => id === reference)).toHaveLength(1);
    expect(rogueThiefFeatures.some(({ id }) => id === reference)).toBe(false);
  });
});

describe('Second-Story Work', () => {
  it('removes the additional movement cost of climbing', () => {
    const effect = featureById('rogue-thief-second-story-work')?.effects?.find(
      ({ movementMode }) => movementMode === 'climbing',
    );

    expect(effect).toMatchObject({
      type: 'movement',
      movementMode: 'climbing',
      extraMovementCostMultiplier: 0,
    });
  });

  it('adds 0.3 meter per Dexterity modifier only to running jumps', () => {
    const effect = featureById('rogue-thief-second-story-work')?.effects?.find(
      ({ movementMode }) => movementMode === 'running-jump',
    );

    expect(effect).toMatchObject({
      type: 'movement',
      movementMode: 'running-jump',
      condition: 'running-jump',
      formula: {
        abilityModifier: 'dexterity',
        multiplier: 0.3,
        unit: 'meter',
      },
    });
  });
});

describe('Supreme Sneak', () => {
  it('grants Stealth advantage within half speed during the current turn', () => {
    expect(effectByType(
      featureById('rogue-thief-supreme-sneak')?.effects,
      'roll-modifier',
    )).toEqual({
      type: 'roll-modifier',
      ability: 'dexterity',
      proficiencyId: 'stealth',
      rollTypes: ['ability-check'],
      condition: 'movement-within-threshold-during-current-turn',
      movementThreshold: {
        comparison: 'at-most',
        period: 'current-turn',
        formula: {
          type: 'speed-multiplier',
          speed: 'movement',
          multiplier: 0.5,
        },
      },
      value: 'advantage',
    });
  });
});

describe('Use Magic Device', () => {
  it('ignores exactly class, race, and level magic-item requirements', () => {
    const effect = effectByType(
      featureById('rogue-thief-use-magic-device')?.effects,
      'requirement-override',
    );

    expect(effect).toEqual({
      type: 'requirement-override',
      condition: 'using-magic-item',
      ignoredRequirementTypes: ['class', 'race', 'level'],
    });
    expect(effect?.ignoredRequirementTypes).not.toContain('alignment');
    expect(effect?.ignoredRequirementTypes).not.toContain('spellcasting');
    expect(effect?.ignoredRequirementTypes).not.toContain('attunement');
  });
});

describe("Thief's Reflexes", () => {
  it('grants exactly two first-round turns at normal initiative and minus ten', () => {
    const feature = featureById('rogue-thief-thiefs-reflexes');
    const effect = effectByType(feature?.effects, 'extra-turn');

    expect(feature?.minimumLevel).toBe(17);
    expect(effect?.extraTurn).toEqual({
      combatRound: 'first',
      turns: [
        { initiative: 'normal' },
        { initiativeOffset: -10 },
      ],
      disabledWhen: ['surprised'],
    });
    expect(effect?.extraTurn?.turns).toHaveLength(2);
  });
});

describe('Thief registration and regressions', () => {
  it('registers exactly Assassin and Thief in the Rogue class and level 3 choice', () => {
    expect(rogueClass.subclassIds).toEqual(['rogue-assassin', 'rogue-thief']);
    expect(rogueSubclassChoice.optionIds).toEqual([
      'rogue-assassin',
      'rogue-thief',
    ]);
    expect(rogueClass.progression[3]?.choices).toContainEqual(rogueSubclassChoice);
  });

  it('keeps Rogue subclass progression at levels 3, 9, 13, and 17', () => {
    expect(rogueClass.subclassLevel).toBe(3);
    expect(rogueClass.progression[3]?.featureIds)
      .toContain('rogue-roguish-archetype');

    const laterLevels = Object.values(rogueClass.progression)
      .filter((level) => level?.featureIds.includes('rogue-roguish-archetype-feature'))
      .map((level) => level?.level);

    expect(laterLevels).toEqual([9, 13, 17]);
  });

  it('has unique Rogue-family feature IDs and no orphaned references', () => {
    const baseFeatureIds = rogueFeatures.map(({ id }) => id);
    const assassinFeatureIds = rogueAssassinFeatures.map(({ id }) => id);
    const thiefFeatureIds = rogueThiefFeatures.map(({ id }) => id);
    const allFeatureIds = [
      ...baseFeatureIds,
      ...assassinFeatureIds,
      ...thiefFeatureIds,
    ];
    const knownFeatureIds = new Set(allFeatureIds);
    const triggerFeatureIds = rogueThiefFeatures.flatMap(({ effects }) => (
      effects?.flatMap(({ triggerFeatureId }) => triggerFeatureId ?? []) ?? []
    ));

    expect(new Set(allFeatureIds).size).toBe(allFeatureIds.length);
    expect(rogueThiefSubclass.featureIds).toEqual(thiefFeatureIds);
    expect(rogueAssassinSubclass.featureIds).toEqual(assassinFeatureIds);
    expect(rogueThiefSubclass.featureIds.every((id) => knownFeatureIds.has(id)))
      .toBe(true);
    expect(triggerFeatureIds.every((id) => knownFeatureIds.has(id))).toBe(true);
  });

  it('keeps the Rogue base, Assassin, Fighter, and Fighter subclasses valid', () => {
    expect(isValidClassDefinition(rogueClass)).toBe(true);
    expect(isValidClassDefinition(fighterClass)).toBe(true);
    expect(rogueFeatures).toHaveLength(15);
    expect(rogueAssassinFeatures).toHaveLength(5);
    expect(rogueAssassinSubclass.id).toBe('rogue-assassin');
    expect(fighterClass.subclassIds).toHaveLength(10);
  });
});
