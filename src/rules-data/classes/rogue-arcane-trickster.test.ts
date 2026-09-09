import { describe, expect, it } from 'vitest';
import {
  rogueArcaneTricksterFeatures as featuresFromPublicBarrel,
  rogueArcaneTricksterSpellcasting as spellcastingFromPublicBarrel,
  rogueArcaneTricksterSubclass as subclassFromPublicBarrel,
} from '..';
import { matchesCatalogQuery } from '../catalog';
import { rogueFeatures } from '../features/rogue';
import { rogueArcaneTricksterFeatures } from '../features/rogue-arcane-trickster';
import { rogueAssassinFeatures } from '../features/rogue-assassin';
import { rogueThiefFeatures } from '../features/rogue-thief';
import type { MechanicalEffect } from '../types';
import { isValidClassDefinition } from '../validation';
import { fighterClass } from './fighter';
import { fighterEldritchKnightSpellcasting } from './fighter-eldritch-knight';
import {
  rogueArcaneTricksterSpellcasting,
  rogueArcaneTricksterSubclass,
} from './rogue-arcane-trickster';
import { rogueAssassinSubclass } from './rogue-assassin';
import { rogueThiefSubclass } from './rogue-thief';
import { rogueClass, rogueSubclassChoice } from './rogue';

const expectedFeatureLevels: Array<[string, number]> = [
  ['rogue-arcane-trickster-spellcasting', 3],
  ['rogue-arcane-trickster-mage-hand-legerdemain', 3],
  ['rogue-arcane-trickster-magical-ambush', 9],
  ['rogue-arcane-trickster-versatile-trickster', 13],
  ['rogue-arcane-trickster-spell-thief', 17],
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
  return rogueArcaneTricksterFeatures.find((feature) => feature.id === id);
}

function effectByType(
  effects: MechanicalEffect[] | undefined,
  type: MechanicalEffect['type'],
): MechanicalEffect | undefined {
  return effects?.find((effect) => effect.type === type);
}

describe('Arcane Trickster subclass rules data', () => {
  it('has the expected identity, source, tags, and localized metadata', () => {
    expect(rogueArcaneTricksterSubclass).toMatchObject({
      id: 'rogue-arcane-trickster',
      classId: 'rogue',
      names: {
        'pt-BR': 'Trapaceiro Arcano',
        'en-US': 'Arcane Trickster',
      },
      source: { bookId: 'jvf-classes-subclasses-compendium' },
      tags: [
        'stealth',
        'spellcasting',
        'illusion',
        'enchantment',
        'intelligence-based',
        'utility',
        'mage-hand',
      ],
    });
    expect(rogueArcaneTricksterSubclass.summary?.['pt-BR'].trim()).not.toBe('');
    expect(rogueArcaneTricksterSubclass.summary?.['en-US'].trim()).not.toBe('');
  });

  it('registers exactly five subclass features at 3, 3, 9, 13, and 17', () => {
    expect(rogueArcaneTricksterFeatures).toHaveLength(5);
    expect(rogueArcaneTricksterFeatures.map(({ id, minimumLevel }) => (
      [id, minimumLevel]
    ))).toEqual(expectedFeatureLevels);
    expect(rogueArcaneTricksterSubclass.featureIds).toEqual(
      expectedFeatureLevels.map(([id]) => id),
    );
    expect(rogueArcaneTricksterFeatures.every(({ origin, sourceId }) => (
      origin === 'subclass' && sourceId === 'rogue-arcane-trickster'
    ))).toBe(true);
  });

  it('gives every feature the compendium source metadata', () => {
    expect(rogueArcaneTricksterFeatures.every(({ source }) => (
      source?.bookId === 'jvf-classes-subclasses-compendium'
    ))).toBe(true);
  });

  it.each([
    'rogue-arcane-trickster',
    'Arcane Trickster',
    'Trapaceiro Arcano',
    'spellcasting',
    'illusion',
    'enchantment',
    'intelligence-based',
    'mage-hand',
  ])('is found by catalog query %s', (query) => {
    expect(matchesCatalogQuery(rogueArcaneTricksterSubclass, query)).toBe(true);
  });

  it('is exported with features and spellcasting through the public barrel', () => {
    expect(subclassFromPublicBarrel).toBe(rogueArcaneTricksterSubclass);
    expect(spellcastingFromPublicBarrel).toBe(rogueArcaneTricksterSpellcasting);
    expect(featuresFromPublicBarrel).toBe(rogueArcaneTricksterFeatures);
  });
});

describe('Arcane Trickster spellcasting', () => {
  it('reuses generic known Wizard spellcasting based on Intelligence', () => {
    expect(rogueArcaneTricksterSpellcasting).toMatchObject({
      ability: 'intelligence',
      preparationMode: 'known',
      startsAtLevel: 3,
      spellListId: 'wizard',
      slotRecovery: 'long-rest',
      saveDcFormula: '8 + proficiencyBonus + intelligenceModifier',
      attackModifierFormula: 'proficiencyBonus + intelligenceModifier',
    });
    expect(rogueArcaneTricksterSubclass.spellcasting)
      .toBe(rogueArcaneTricksterSpellcasting);
  });

  it('knows mandatory mage hand plus two choices at level 3 and four total at 10', () => {
    expect(rogueArcaneTricksterSpellcasting.mandatoryCantripIds)
      .toEqual(['mage-hand']);

    for (let level = 3; level <= 20; level += 1) {
      const expectedTotal = level < 10 ? 3 : 4;
      const known = rogueArcaneTricksterSpellcasting.progression?.[level]
        ?.cantripsKnown;
      const mandatoryCount = rogueArcaneTricksterSpellcasting
        .mandatoryCantripIds?.length ?? 0;

      expect(known).toBe(expectedTotal);
      expect((known ?? 0) - mandatoryCount)
        .toBe(level < 10 ? 2 : 3);
    }
  });

  it.each(expectedSpellsKnown)('at Rogue level %i knows exactly %i spells', (
    level,
    count,
  ) => {
    expect(rogueArcaneTricksterSpellcasting.progression?.[level]?.spellsKnown)
      .toBe(count);
  });

  it('defines every spellcasting level from 3 through 20', () => {
    expect(Object.keys(
      rogueArcaneTricksterSpellcasting.progression ?? {},
    ).map(Number)).toEqual(Array.from({ length: 18 }, (_, index) => index + 3));
  });

  it('models initial, general, and exception school restrictions', () => {
    expect(rogueArcaneTricksterSpellcasting.allowedSchools).toEqual([
      'enchantment',
      'illusion',
    ]);
    expect(rogueArcaneTricksterSpellcasting.initialUnrestrictedSpells).toBe(1);
    expect(rogueArcaneTricksterSpellcasting.progression?.[3]?.spellsKnown).toBe(3);
    expect(rogueArcaneTricksterSpellcasting.schoolRestrictionExceptionLevels)
      .toEqual([8, 14, 20]);
  });

  it('replaces one Wizard spell per Rogue level within available slots', () => {
    expect(rogueArcaneTricksterSpellcasting.spellListId).toBe('wizard');
    expect(rogueArcaneTricksterSpellcasting.knownSpellReplacementsPerLevel).toBe(1);
    expect(rogueArcaneTricksterSpellcasting.knownSpellLevelLimit)
      .toBe('available-spell-slots');
    expect(
      rogueArcaneTricksterSpellcasting.preserveUnrestrictedSchoolChoiceOnReplacement,
    ).toBe(true);
    expect(rogueArcaneTricksterSpellcasting.schoolRestrictionExceptionLevels)
      .toEqual([8, 14, 20]);
  });

  it.each(expectedSpellSlots)('has exact spell slots at level %i', (level, slots) => {
    expect(rogueArcaneTricksterSpellcasting.progression?.[level]?.spellSlots)
      .toEqual(slots);
  });

  it('matches the required spell-slot milestones', () => {
    const progression = rogueArcaneTricksterSpellcasting.progression;

    expect(progression?.[3]?.spellSlots).toEqual({ 1: 2 });
    expect(progression?.[7]?.spellSlots).toEqual({ 1: 4, 2: 2 });
    expect(progression?.[10]?.spellSlots).toEqual({ 1: 4, 2: 3 });
    expect(progression?.[13]?.spellSlots).toEqual({ 1: 4, 2: 3, 3: 2 });
    expect(progression?.[16]?.spellSlots).toEqual({ 1: 4, 2: 3, 3: 3 });
    expect(progression?.[19]?.spellSlots).toEqual({ 1: 4, 2: 3, 3: 3, 4: 1 });
    expect(progression?.[20]?.spellSlots).toEqual({ 1: 4, 2: 3, 3: 3, 4: 1 });
  });

  it('keeps the shared Eldritch Knight spellcasting schema valid', () => {
    expect(fighterEldritchKnightSpellcasting.ability).toBe('intelligence');
    expect(fighterEldritchKnightSpellcasting.allowedSchools)
      .toEqual(['abjuration', 'evocation']);
    expect(fighterEldritchKnightSpellcasting.progression?.[20]?.spellSlots)
      .toEqual({ 1: 4, 2: 3, 3: 3, 4: 1 });
  });
});

describe('Mage Hand Legerdemain', () => {
  it('references mage hand and allows the hand to be invisible', () => {
    const feature = featureById('rogue-arcane-trickster-mage-hand-legerdemain');

    expect(feature?.trigger).toEqual({ event: 'spell-cast', sourceId: 'mage-hand' });
    expect(feature?.effects).toContainEqual(expect.objectContaining({
      spellId: 'mage-hand',
      value: 'may-be-invisible',
    }));
  });

  it('models remote stash and retrieval object interactions', () => {
    expect(featureById('rogue-arcane-trickster-mage-hand-legerdemain')?.effects)
      .toContainEqual(expect.objectContaining({
        spellId: 'mage-hand',
        value: 'remote-object-interaction',
        actionOptions: [
          'stash-held-object-in-container-worn-or-carried-by-another-creature',
          'retrieve-object-from-container-worn-or-carried-by-another-creature',
        ],
      }));
  });

  it('models remote thieves tools for locks and traps', () => {
    expect(featureById('rogue-arcane-trickster-mage-hand-legerdemain')?.effects)
      .toContainEqual(expect.objectContaining({
        value: 'remote-thieves-tools',
        proficiencyId: 'thieves-tools',
        actionOptions: ['open-lock', 'disarm-trap'],
      }));
  });

  it('models Dexterity Sleight of Hand versus Wisdom Perception', () => {
    expect(featureById('rogue-arcane-trickster-mage-hand-legerdemain')?.effects)
      .toContainEqual(expect.objectContaining({
        value: 'unnoticed-on-successful-contested-check',
        contestedCheck: {
          actor: { ability: 'dexterity', proficiencyId: 'sleight-of-hand' },
          opponent: { ability: 'wisdom', proficiencyId: 'perception' },
        },
      }));
  });

  it('uses the Cunning Action bonus action to control mage hand', () => {
    expect(featureById('rogue-arcane-trickster-mage-hand-legerdemain')?.effects)
      .toContainEqual(expect.objectContaining({
        activation: 'bonus-action',
        spellId: 'mage-hand',
        triggerFeatureId: 'rogue-cunning-action',
        value: 'bonus-action-control-mage-hand',
      }));
  });
});

describe('Arcane Trickster higher-level features', () => {
  it('models Magical Ambush hidden targeting and current-turn save disadvantage', () => {
    const feature = featureById('rogue-arcane-trickster-magical-ambush');

    expect(feature).toMatchObject({
      trigger: {
        event: 'spell-cast',
        conditions: ['caster-hidden-from-target', 'spell-targets-creature'],
      },
      duration: { type: 'until-end-of-current-turn' },
    });
    expect(effectByType(feature?.effects, 'roll-modifier')).toEqual({
      type: 'roll-modifier',
      rollTypes: ['saving-throw'],
      condition: 'target-save-against-triggering-spell',
      value: 'disadvantage',
    });
  });

  it('models Versatile Trickster from mage hand to one target within 1.5 meters', () => {
    const feature = featureById('rogue-arcane-trickster-versatile-trickster');

    expect(feature).toMatchObject({
      activation: 'bonus-action',
      range: { value: 1.5, unit: 'meter' },
      rangeOriginId: 'mage-hand',
      target: { kind: 'creature', count: 1 },
      duration: { type: 'until-end-of-current-turn' },
    });
    expect(effectByType(feature?.effects, 'roll-modifier')).toEqual({
      type: 'roll-modifier',
      spellId: 'mage-hand',
      rollTypes: ['attack-roll'],
      condition: 'attacks-against-selected-target',
      value: 'advantage',
    });
  });

  it('models the Spell Thief reaction, trigger, caster save, usage, and DC', () => {
    const feature = featureById('rogue-arcane-trickster-spell-thief');

    expect(feature).toMatchObject({
      minimumLevel: 17,
      activation: 'reaction',
      trigger: {
        event: 'after-spell-cast',
        conditions: ['rogue-is-target-or-included-in-area-of-effect'],
      },
      target: { kind: 'self' },
      usage: { freeUses: 1, recovery: 'long-rest' },
      save: {
        abilitySource: 'caster-spellcasting-ability',
        roller: 'triggering-creature',
        dc: {
          type: 'reference',
          referenceId: 'rogue-arcane-trickster-spellcasting',
          property: 'spell-save-dc',
        },
      },
    });
  });

  it('negates the spell effect on the Rogue when the caster fails', () => {
    const onFailure = featureById('rogue-arcane-trickster-spell-thief')
      ?.save?.onFailure;

    expect(Array.isArray(onFailure) ? onFailure : []).toContainEqual({
      type: 'spell-effect-negation',
      condition: 'triggering-spell-effect-on-rogue',
    });
  });

  it('models eligible non-Wizard spell theft for eight hours using Rogue slots', () => {
    const onFailure = featureById('rogue-arcane-trickster-spell-thief')
      ?.save?.onFailure;
    const effects = Array.isArray(onFailure) ? onFailure : [];

    expect(effectByType(effects, 'temporary-spell-knowledge')).toEqual({
      type: 'temporary-spell-knowledge',
      condition: 'triggering-spell-eligible-for-theft',
      spellLevelMinimum: 1,
      spellLevelMaximum: 'available-spell-slots',
      spellListRestriction: 'none',
      duration: { type: 'hours', value: 8 },
      usesOwnSpellSlots: true,
      originalCasterLockout: true,
    });
  });
});

describe('Arcane Trickster registration and regressions', () => {
  it('keeps Arcane Trickster registered with all five Rogue subclasses', () => {
    const expectedSubclassIds = [
      'rogue-assassin',
      'rogue-thief',
      'rogue-arcane-trickster',
      'rogue-inquisitive',
      'rogue-mastermind',
    ];

    expect(rogueClass.subclassIds).toEqual(expectedSubclassIds);
    expect(rogueSubclassChoice.optionIds).toEqual(expectedSubclassIds);
    expect(rogueClass.progression[3]?.choices).toContainEqual(rogueSubclassChoice);
  });

  it('keeps Rogue subclass progression at levels 3, 9, 13, and 17', () => {
    expect(rogueClass.subclassLevel).toBe(3);
    expect(rogueClass.progression[3]?.featureIds)
      .toContain('rogue-roguish-archetype');
    expect(Object.values(rogueClass.progression)
      .filter((level) => level?.featureIds.includes('rogue-roguish-archetype-feature'))
      .map((level) => level?.level)).toEqual([9, 13, 17]);
  });

  it('has unique Rogue-family feature IDs and no orphaned references', () => {
    const allFeatureIds = [
      ...rogueFeatures,
      ...rogueAssassinFeatures,
      ...rogueThiefFeatures,
      ...rogueArcaneTricksterFeatures,
    ].map(({ id }) => id);
    const knownFeatureIds = new Set(allFeatureIds);
    const arcaneFeatureIds = rogueArcaneTricksterFeatures.map(({ id }) => id);
    const effectReferences = rogueArcaneTricksterFeatures.flatMap(({ effects }) => (
      effects?.flatMap(({ triggerFeatureId }) => triggerFeatureId ?? []) ?? []
    ));
    const saveDcReference = featureById('rogue-arcane-trickster-spell-thief')
      ?.save?.dc;

    expect(new Set(allFeatureIds).size).toBe(allFeatureIds.length);
    expect(rogueArcaneTricksterSubclass.featureIds).toEqual(arcaneFeatureIds);
    expect(effectReferences.every((id) => knownFeatureIds.has(id))).toBe(true);
    expect(saveDcReference).toMatchObject({
      referenceId: 'rogue-arcane-trickster-spellcasting',
    });
    expect(knownFeatureIds.has('rogue-arcane-trickster-spellcasting')).toBe(true);
    expect(rogueArcaneTricksterSpellcasting.mandatoryCantripIds)
      .toContain('mage-hand');
  });

  it('keeps Rogue, Assassin, Thief, Fighter, and Fighter subclasses valid', () => {
    expect(isValidClassDefinition(rogueClass)).toBe(true);
    expect(isValidClassDefinition(fighterClass)).toBe(true);
    expect(rogueFeatures).toHaveLength(15);
    expect(rogueAssassinFeatures).toHaveLength(5);
    expect(rogueThiefFeatures).toHaveLength(5);
    expect(rogueAssassinSubclass.id).toBe('rogue-assassin');
    expect(rogueThiefSubclass.id).toBe('rogue-thief');
    expect(fighterClass.subclassIds).toHaveLength(10);
  });
});
