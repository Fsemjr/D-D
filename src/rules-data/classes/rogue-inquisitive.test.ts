import { describe, expect, it } from 'vitest';
import {
  rogueInquisitiveFeatures as featuresFromPublicBarrel,
  rogueInquisitiveSubclass as subclassFromPublicBarrel,
  rogueInquisitiveUnerringEyeUses as resourceFromPublicBarrel,
} from '..';
import { matchesCatalogQuery } from '../catalog';
import { rogueFeatures } from '../features/rogue';
import { rogueArcaneTricksterFeatures } from '../features/rogue-arcane-trickster';
import { rogueAssassinFeatures } from '../features/rogue-assassin';
import { rogueInquisitiveFeatures } from '../features/rogue-inquisitive';
import { rogueThiefFeatures } from '../features/rogue-thief';
import type { MechanicalEffect } from '../types';
import { isValidClassDefinition } from '../validation';
import { fighterClass } from './fighter';
import { rogueArcaneTricksterSubclass } from './rogue-arcane-trickster';
import { rogueAssassinSubclass } from './rogue-assassin';
import {
  rogueInquisitiveSubclass,
  rogueInquisitiveUnerringEyeUses,
} from './rogue-inquisitive';
import { rogueThiefSubclass } from './rogue-thief';
import { rogueClass, rogueSubclassChoice } from './rogue';

const expectedFeatureLevels: Array<[string, number]> = [
  ['rogue-inquisitive-ear-for-deceit', 3],
  ['rogue-inquisitive-eye-for-detail', 3],
  ['rogue-inquisitive-insightful-fighting', 3],
  ['rogue-inquisitive-steady-eye', 9],
  ['rogue-inquisitive-unerring-eye', 13],
  ['rogue-inquisitive-eye-for-weakness', 17],
];

const expectedSubclassIds = [
  'rogue-assassin',
  'rogue-thief',
  'rogue-arcane-trickster',
  'rogue-inquisitive',
];

function featureById(id: string) {
  return rogueInquisitiveFeatures.find((feature) => feature.id === id);
}

function effectByType(
  effects: MechanicalEffect[] | undefined,
  type: MechanicalEffect['type'],
): MechanicalEffect | undefined {
  return effects?.find((effect) => effect.type === type);
}

describe('Inquisitive subclass rules data', () => {
  it('has the expected identity, source, tags, and localized metadata', () => {
    expect(rogueInquisitiveSubclass).toMatchObject({
      id: 'rogue-inquisitive',
      classId: 'rogue',
      names: { 'pt-BR': 'Inquiridor', 'en-US': 'Inquisitive' },
      source: { bookId: 'jvf-classes-subclasses-compendium' },
      tags: [
        'investigation',
        'insight',
        'perception',
        'deception-detection',
        'precision',
        'anti-illusion',
      ],
    });
    expect(rogueInquisitiveSubclass.summary?.['pt-BR'].trim()).not.toBe('');
    expect(rogueInquisitiveSubclass.summary?.['en-US'].trim()).not.toBe('');
  });

  it('registers exactly six subclass features at 3, 3, 3, 9, 13, and 17', () => {
    expect(rogueInquisitiveFeatures).toHaveLength(6);
    expect(rogueInquisitiveFeatures.map(({ id, minimumLevel }) => (
      [id, minimumLevel]
    ))).toEqual(expectedFeatureLevels);
    expect(rogueInquisitiveSubclass.featureIds).toEqual(
      expectedFeatureLevels.map(([id]) => id),
    );
    expect(rogueInquisitiveFeatures.every(({ origin, sourceId }) => (
      origin === 'subclass' && sourceId === 'rogue-inquisitive'
    ))).toBe(true);
  });

  it('gives every feature the compendium source metadata', () => {
    expect(rogueInquisitiveFeatures.every(({ source }) => (
      source?.bookId === 'jvf-classes-subclasses-compendium'
    ))).toBe(true);
  });

  it.each([
    'rogue-inquisitive',
    'Inquisitive',
    'Inquiridor',
    'investigation',
    'insight',
    'perception',
    'deception-detection',
    'anti-illusion',
  ])('is found by catalog query %s', (query) => {
    expect(matchesCatalogQuery(rogueInquisitiveSubclass, query)).toBe(true);
  });

  it('exports subclass, features, and resource through public barrels', () => {
    expect(subclassFromPublicBarrel).toBe(rogueInquisitiveSubclass);
    expect(featuresFromPublicBarrel).toBe(rogueInquisitiveFeatures);
    expect(resourceFromPublicBarrel).toBe(rogueInquisitiveUnerringEyeUses);
  });
});

describe('Ear for Deceit', () => {
  it('uses the Reliable Talent natural-d20 floor model for lie detection', () => {
    const effect = effectByType(
      featureById('rogue-inquisitive-ear-for-deceit')?.effects,
      'roll-modifier',
    );

    expect(effect).toEqual({
      type: 'roll-modifier',
      ability: 'wisdom',
      proficiencyId: 'insight',
      rollTypes: ['ability-check'],
      checkPurpose: 'determine-whether-creature-is-lying',
      condition: 'natural-d20-before-modifiers',
      naturalRollMinimum: 8,
    });
    expect(effect?.naturalRollMinimum).toBe(8);
  });

  it('does not modify the base Reliable Talent floor', () => {
    expect(featureById('rogue-inquisitive-ear-for-deceit')?.minimumLevel).toBe(3);
    expect(rogueFeatures.find(({ id }) => id === 'rogue-reliable-talent')?.effects)
      .toContainEqual(expect.objectContaining({ naturalRollMinimum: 10 }));
  });
});

describe('Eye for Detail', () => {
  it('offers exactly one of two checks as a bonus action', () => {
    const feature = featureById('rogue-inquisitive-eye-for-detail');
    const choice = feature?.choices?.[0];

    expect(feature?.activation).toBe('bonus-action');
    expect(feature?.choices).toHaveLength(1);
    expect(choice?.type).toBe('one-of');
    expect(choice?.options).toHaveLength(2);
  });

  it('uses Wisdom Perception to detect an object or creature', () => {
    const option = featureById('rogue-inquisitive-eye-for-detail')
      ?.choices?.[0]?.options[0];

    expect(option).toEqual({
      id: 'perception-detect-object-or-creature',
      effects: [{
        type: 'informational',
        ability: 'wisdom',
        proficiencyId: 'perception',
        rollTypes: ['ability-check'],
        checkPurpose: 'detect-object-or-creature',
      }],
    });
  });

  it('uses the standard Intelligence Investigation check to discover clues', () => {
    const option = featureById('rogue-inquisitive-eye-for-detail')
      ?.choices?.[0]?.options[1];

    expect(option).toEqual({
      id: 'investigation-discover-clues',
      effects: [{
        type: 'informational',
        ability: 'intelligence',
        proficiencyId: 'investigation',
        rollTypes: ['ability-check'],
        checkPurpose: 'discover-clues',
      }],
    });
  });
});

describe('Insightful Fighting', () => {
  it('uses a bonus-action Insight versus Deception contested check', () => {
    const feature = featureById('rogue-inquisitive-insightful-fighting');

    expect(feature).toMatchObject({
      activation: 'bonus-action',
      target: {
        kind: 'creature',
        visible: true,
        count: 1,
        conditions: ['not-incapacitated'],
      },
    });
    expect(feature?.effects?.[0]).toEqual({
      type: 'informational',
      contestedCheck: {
        actor: { ability: 'wisdom', proficiencyId: 'insight' },
        opponent: { ability: 'charisma', proficiencyId: 'deception' },
      },
      condition: 'actor-wins-contested-check',
    });
  });

  it('adds an alternate Sneak Attack condition without granting advantage', () => {
    const feature = featureById('rogue-inquisitive-insightful-fighting');
    const sneakAttackEffect = feature?.effects?.[1];

    expect(sneakAttackEffect).toEqual({
      type: 'informational',
      modifiesFeatureId: 'rogue-sneak-attack',
      condition: 'contested-check-won;current-affected-target;attack-roll-without-disadvantage',
      value: 'allows-sneak-attack-without-advantage',
    });
    expect(feature?.effects?.some(({ value }) => value === 'advantage')).toBe(false);
  });

  it('lasts one minute and is replaced after success against another target', () => {
    expect(featureById('rogue-inquisitive-insightful-fighting')?.duration)
      .toEqual({
        type: 'minutes',
        value: 1,
        endsEarlyWhen: ['successfully-applied-to-another-target'],
      });
  });
});

describe('Steady Eye', () => {
  it('grants Perception and Investigation advantage within half movement', () => {
    const effects = featureById('rogue-inquisitive-steady-eye')?.effects;

    expect(effects).toHaveLength(2);
    expect(effects?.map(({ ability, proficiencyId }) => [ability, proficiencyId]))
      .toEqual([
        ['wisdom', 'perception'],
        ['intelligence', 'investigation'],
      ]);
    expect(effects?.every(({ type, rollTypes, value }) => (
      type === 'roll-modifier'
      && rollTypes?.[0] === 'ability-check'
      && value === 'advantage'
    ))).toBe(true);
    expect(effects?.every(({ movementThreshold, condition }) => (
      condition === 'movement-within-threshold-during-current-turn'
      && movementThreshold?.comparison === 'at-most'
      && movementThreshold.period === 'current-turn'
      && movementThreshold.formula.type === 'speed-multiplier'
      && movementThreshold.formula.speed === 'movement'
      && movementThreshold.formula.multiplier === 0.5
    ))).toBe(true);
  });
});

describe('Unerring Eye', () => {
  it('uses an action within 9 meters only while not blinded or prone', () => {
    expect(featureById('rogue-inquisitive-unerring-eye')).toMatchObject({
      minimumLevel: 13,
      activation: 'action',
      requirements: ['not-blinded', 'not-prone'],
      range: { value: 9, unit: 'meter' },
      resourceCost: {
        resourceId: 'rogue-inquisitive-unerring-eye-uses',
        amount: 1,
        roll: false,
      },
    });
  });

  it('detects all three categories without revealing their details', () => {
    expect(effectByType(
      featureById('rogue-inquisitive-unerring-eye')?.effects,
      'detection',
    )).toEqual({
      type: 'detection',
      detectionCategories: [
        'illusion',
        'shapechanger-not-in-original-form',
        'magic-designed-to-deceive-senses',
      ],
      revealsDetails: false,
      value: 'detects-presence-only',
    });
  });

  it('has Wisdom-modifier uses with minimum one and long-rest recovery', () => {
    expect(rogueInquisitiveUnerringEyeUses).toEqual({
      id: 'rogue-inquisitive-unerring-eye-uses',
      names: {
        'pt-BR': 'Usos de Olhos Infalíveis',
        'en-US': 'Unerring Eye Uses',
      },
      recovery: 'long-rest',
      progression: [{
        level: 13,
        maximum: { type: 'ability-modifier', ability: 'wisdom', minimum: 1 },
      }],
    });
    expect(rogueInquisitiveSubclass.resources)
      .toEqual([rogueInquisitiveUnerringEyeUses]);
  });
});

describe('Eye for Weakness', () => {
  it('adds exactly 3d6 to Sneak Attack for the Insightful Fighting target', () => {
    expect(featureById('rogue-inquisitive-eye-for-weakness')).toMatchObject({
      minimumLevel: 17,
      effects: [{
        type: 'damage',
        triggerFeatureId: 'rogue-inquisitive-insightful-fighting',
        modifiesFeatureId: 'rogue-sneak-attack',
        damageMode: 'additional',
        condition: 'target-currently-affected-by-trigger-feature',
        value: '3d6',
      }],
    });
  });

  it('does not alter or replace the base Sneak Attack progression', () => {
    const sneakAttack = rogueFeatures.find(({ id }) => id === 'rogue-sneak-attack');
    const progression = effectByType(sneakAttack?.effects, 'damage')?.progression;

    expect(progression).toHaveLength(20);
    expect(progression?.[0]).toEqual({ level: 1, value: '1d6' });
    expect(progression?.[16]).toEqual({ level: 17, value: '9d6' });
    expect(progression?.[19]).toEqual({ level: 20, value: '10d6' });
  });
});

describe('Inquisitive registration and regressions', () => {
  it('registers exactly four Rogue subclasses and level 3 options', () => {
    expect(rogueClass.subclassIds).toEqual(expectedSubclassIds);
    expect(rogueSubclassChoice.optionIds).toEqual(expectedSubclassIds);
    expect(rogueClass.progression[3]?.choices).toContainEqual(rogueSubclassChoice);
  });

  it('keeps subclass progression at levels 3, 9, 13, and 17', () => {
    expect(rogueClass.subclassLevel).toBe(3);
    expect(rogueClass.progression[3]?.featureIds)
      .toContain('rogue-roguish-archetype');
    expect(Object.values(rogueClass.progression)
      .filter((level) => level?.featureIds.includes('rogue-roguish-archetype-feature'))
      .map((level) => level?.level)).toEqual([9, 13, 17]);
  });

  it('has unique Rogue-family IDs and no orphaned references', () => {
    const allFeatureIds = [
      ...rogueFeatures,
      ...rogueAssassinFeatures,
      ...rogueThiefFeatures,
      ...rogueArcaneTricksterFeatures,
      ...rogueInquisitiveFeatures,
    ].map(({ id }) => id);
    const knownFeatureIds = new Set(allFeatureIds);
    const inquisitiveFeatureIds = rogueInquisitiveFeatures.map(({ id }) => id);
    const references = rogueInquisitiveFeatures.flatMap(({ effects }) => (
      effects?.flatMap(({ triggerFeatureId, modifiesFeatureId }) => (
        [triggerFeatureId, modifiesFeatureId].filter((id) => id !== undefined)
      )) ?? []
    ));
    const resourceIds = (rogueInquisitiveSubclass.resources ?? [])
      .map(({ id }) => id);

    expect(new Set(allFeatureIds).size).toBe(allFeatureIds.length);
    expect(rogueInquisitiveSubclass.featureIds).toEqual(inquisitiveFeatureIds);
    expect(references.every((id) => knownFeatureIds.has(id))).toBe(true);
    expect(resourceIds).toContain(
      featureById('rogue-inquisitive-unerring-eye')?.resourceCost?.resourceId,
    );
  });

  it('keeps Rogue, prior subclasses, Fighter, and Fighter subclasses valid', () => {
    expect(isValidClassDefinition(rogueClass)).toBe(true);
    expect(isValidClassDefinition(fighterClass)).toBe(true);
    expect(rogueFeatures).toHaveLength(15);
    expect(rogueAssassinSubclass.featureIds).toEqual(
      rogueAssassinFeatures.map(({ id }) => id),
    );
    expect(rogueThiefSubclass.featureIds).toEqual(
      rogueThiefFeatures.map(({ id }) => id),
    );
    expect(rogueArcaneTricksterSubclass.featureIds).toEqual(
      rogueArcaneTricksterFeatures.map(({ id }) => id),
    );
    expect(fighterClass.subclassIds).toHaveLength(10);
  });
});
