import { describe, expect, it } from 'vitest';
import {
  rogueAssassinFeatures as featuresFromPublicBarrel,
  rogueAssassinSubclass as subclassFromPublicBarrel,
} from '..';
import { matchesCatalogQuery } from '../catalog';
import {
  rogueAssassinDeathStrikeSaveDc,
  rogueAssassinFeatures,
} from '../features/rogue-assassin';
import { rogueFeatures } from '../features/rogue';
import type { MechanicalEffect } from '../types';
import { isValidClassDefinition } from '../validation';
import { rogueAssassinSubclass } from './rogue-assassin';
import { rogueClass, rogueSubclassChoice } from './rogue';

const expectedFeatureLevels: Array<[string, number]> = [
  ['rogue-assassin-bonus-proficiencies', 3],
  ['rogue-assassin-assassinate', 3],
  ['rogue-assassin-infiltration-expertise', 9],
  ['rogue-assassin-impostor', 13],
  ['rogue-assassin-death-strike', 17],
];

function featureById(id: string) {
  return rogueAssassinFeatures.find((feature) => feature.id === id);
}

function effectsByType(
  effects: MechanicalEffect[] | undefined,
  type: MechanicalEffect['type'],
): MechanicalEffect[] {
  return effects?.filter((effect) => effect.type === type) ?? [];
}

describe('Assassin subclass rules data', () => {
  it('has the expected identity, source, tags, and localized metadata', () => {
    expect(rogueAssassinSubclass).toMatchObject({
      id: 'rogue-assassin',
      classId: 'rogue',
      names: { 'pt-BR': 'Assassino', 'en-US': 'Assassin' },
      source: { bookId: 'jvf-classes-subclasses-compendium' },
      tags: [
        'stealth',
        'burst-damage',
        'surprise',
        'infiltration',
        'deception',
        'precision',
      ],
    });
    expect(rogueAssassinSubclass.summary?.['pt-BR'].trim()).not.toBe('');
    expect(rogueAssassinSubclass.summary?.['en-US'].trim()).not.toBe('');
  });

  it('registers exactly five features at levels 3, 3, 9, 13, and 17', () => {
    expect(rogueAssassinFeatures).toHaveLength(5);
    expect(rogueAssassinFeatures.map(({ id, minimumLevel }) => [id, minimumLevel]))
      .toEqual(expectedFeatureLevels);
    expect(rogueAssassinSubclass.featureIds).toEqual(
      expectedFeatureLevels.map(([id]) => id),
    );
  });

  it('owns every feature and gives it the compendium source', () => {
    expect(rogueAssassinFeatures.every(({ origin, sourceId, source }) => (
      origin === 'subclass'
      && sourceId === 'rogue-assassin'
      && source?.bookId === 'jvf-classes-subclasses-compendium'
    ))).toBe(true);
  });

  it('exports the subclass and features from the public barrel', () => {
    expect(subclassFromPublicBarrel).toBe(rogueAssassinSubclass);
    expect(featuresFromPublicBarrel).toBe(rogueAssassinFeatures);
  });

  it('is discoverable by English, Portuguese, tag, and summary queries', () => {
    for (const query of [
      'rogue-assassin',
      'Assassin',
      'Assassino',
      'surprise',
      'infiltration',
      'deception',
      'burst-damage',
    ]) {
      expect(matchesCatalogQuery(rogueAssassinSubclass, query)).toBe(true);
    }
    expect(matchesCatalogQuery(rogueAssassinSubclass, 'identidades falsas')).toBe(true);
    expect(matchesCatalogQuery(rogueAssassinSubclass, 'paladin')).toBe(false);
  });
});

describe('Assassin mechanics', () => {
  it('grants both required tool proficiencies without a choice', () => {
    const feature = featureById('rogue-assassin-bonus-proficiencies');

    expect(feature?.choices).toBeUndefined();
    expect(feature?.effects).toEqual([
      { type: 'tool-proficiency', proficiencyId: 'disguise-kit' },
      { type: 'tool-proficiency', proficiencyId: 'poisoners-kit' },
    ]);
  });

  it('keeps Assassinate advantage and automatic critical conditions separate', () => {
    const effects = featureById('rogue-assassin-assassinate')?.effects;

    expect(effects).toHaveLength(2);
    expect(effects?.[0]).toEqual({
      type: 'roll-modifier',
      rollTypes: ['attack-roll'],
      condition: 'target-has-not-taken-turn-in-current-combat',
      value: 'advantage',
    });
    expect(effects?.[1]).toMatchObject({
      trigger: { event: 'attack-hit', conditions: ['target-surprised'] },
      condition: 'target-surprised',
      automaticCriticalHit: true,
      value: 'critical-hit',
    });
    expect(effects?.[0].condition).not.toContain('surprised');
    expect(effects?.[1].condition).not.toContain('not-taken-turn');
  });

  it('models Infiltration Expertise preparation, cost, identity, and belief limit', () => {
    const feature = featureById('rogue-assassin-infiltration-expertise');
    const values = effectsByType(feature?.effects, 'informational').map(({ value }) => value);

    expect(feature?.preparation).toEqual({ value: 7, unit: 'day' });
    expect(feature?.cost).toEqual({ amount: 25, currency: 'gp' });
    expect(values).toEqual([
      'fabricated-identity',
      'identity-has-history',
      'identity-has-profession',
      'identity-has-affiliations',
      'cannot-be-existing-real-person',
      'believed-until-evident-reason-to-suspect',
    ]);
  });

  it('models Impostor study, imitated traits, casual observers, and challenged Deception', () => {
    const feature = featureById('rogue-assassin-impostor');

    expect(feature?.preparation).toEqual({ value: 3, unit: 'hour' });
    expect(feature?.effects?.map(({ value }) => value)).toEqual([
      'mimic-speech-after-listening',
      'mimic-writing-after-examining',
      'mimic-behavior-after-observing-mannerisms',
      'indistinguishable-to-casual-observer',
      'advantage',
    ]);
    expect(effectsByType(feature?.effects, 'roll-modifier')).toEqual([{
      type: 'roll-modifier',
      ability: 'charisma',
      proficiencyId: 'deception',
      rollTypes: ['ability-check'],
      condition: 'identity-challenged-by-suspicious-creature',
      value: 'advantage',
    }]);
  });

  it('models Death Strike as a surprised-target Constitution save for double damage', () => {
    const feature = featureById('rogue-assassin-death-strike');

    expect(rogueAssassinDeathStrikeSaveDc).toEqual({
      base: 8,
      proficiencyBonusMultiplier: 1,
      abilityModifier: 'dexterity',
    });
    expect(feature).toMatchObject({
      minimumLevel: 17,
      trigger: { event: 'attack-hit', conditions: ['target-surprised'] },
      target: { kind: 'creature', conditions: ['surprised'] },
      save: {
        ability: 'constitution',
        dc: rogueAssassinDeathStrikeSaveDc,
        onFailure: [{ type: 'damage', damageMultiplier: 2 }],
      },
    });
  });
});

describe('Rogue and Fighter regressions', () => {
  it('registers Assassin as the sole current Rogue subclass choice', () => {
    expect(rogueClass.subclassIds).toEqual(['rogue-assassin']);
    expect(rogueSubclassChoice.optionIds).toEqual(['rogue-assassin']);
    expect(rogueClass.progression[3]?.choices).toContainEqual(rogueSubclassChoice);
  });

  it('keeps Rogue subclass feature progression at levels 3, 9, 13, and 17', () => {
    expect(rogueClass.subclassLevel).toBe(3);
    expect(rogueClass.progression[3]?.featureIds).toContain('rogue-roguish-archetype');
    for (const level of [9, 13, 17]) {
      expect(rogueClass.progression[level]?.featureIds)
        .toContain('rogue-roguish-archetype-feature');
    }
  });

  it('keeps the complete valid Rogue base progression and feature set', () => {
    expect(isValidClassDefinition(rogueClass)).toBe(true);
    expect(Object.keys(rogueClass.progression).map(Number)).toEqual(
      Array.from({ length: 20 }, (_, index) => index + 1),
    );
    expect(rogueFeatures.map(({ id }) => id)).toEqual([
      'rogue-expertise', 'rogue-sneak-attack', 'rogue-thieves-cant',
      'rogue-cunning-action', 'rogue-roguish-archetype', 'rogue-steady-aim',
      'rogue-ability-score-improvement', 'rogue-uncanny-dodge', 'rogue-evasion',
      'rogue-roguish-archetype-feature', 'rogue-reliable-talent', 'rogue-blindsense',
      'rogue-slippery-mind', 'rogue-elusive', 'rogue-stroke-of-luck',
    ]);
  });

  it('has unique Assassin feature IDs and no orphaned feature references', () => {
    const featureIds = rogueAssassinFeatures.map(({ id }) => id);

    expect(new Set(featureIds).size).toBe(featureIds.length);
    expect(rogueAssassinSubclass.featureIds).toEqual(featureIds);
    expect(rogueAssassinSubclass.featureIds.every((id) => featureIds.includes(id))).toBe(true);
  });
});
