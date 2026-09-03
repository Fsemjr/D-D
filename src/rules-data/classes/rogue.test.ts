import { describe, expect, it } from 'vitest';
import {
  rogueClass as rogueClassFromPublicBarrel,
  rogueFeatures as rogueFeaturesFromPublicBarrel,
} from '..';
import { matchesCatalogQuery } from '../catalog';
import { fighterClass } from './fighter';
import { rogueFeatures } from '../features/rogue';
import type { MechanicalEffect } from '../types';
import { isValidClassDefinition } from '../validation';
import {
  rogueAdditionalExpertiseChoice,
  rogueClass,
  rogueInitialExpertiseChoice,
  rogueSubclassChoice,
} from './rogue';

const expectedSkills = [
  'acrobatics',
  'athletics',
  'performance',
  'deception',
  'stealth',
  'intimidation',
  'insight',
  'investigation',
  'perception',
  'persuasion',
  'sleight-of-hand',
];

const expectedFeaturesByLevel: Record<number, string[]> = {
  1: ['rogue-expertise', 'rogue-sneak-attack', 'rogue-thieves-cant'],
  2: ['rogue-cunning-action'],
  3: ['rogue-roguish-archetype', 'rogue-steady-aim'],
  4: ['rogue-ability-score-improvement'],
  5: ['rogue-uncanny-dodge'],
  6: ['rogue-expertise'],
  7: ['rogue-evasion'],
  8: ['rogue-ability-score-improvement'],
  9: ['rogue-roguish-archetype-feature'],
  10: ['rogue-ability-score-improvement'],
  11: ['rogue-reliable-talent'],
  12: ['rogue-ability-score-improvement'],
  13: ['rogue-roguish-archetype-feature'],
  14: ['rogue-blindsense'],
  15: ['rogue-slippery-mind'],
  16: ['rogue-ability-score-improvement'],
  17: ['rogue-roguish-archetype-feature'],
  18: ['rogue-elusive'],
  19: ['rogue-ability-score-improvement'],
  20: ['rogue-stroke-of-luck'],
};

const expectedSneakAttackProgression = Array.from(
  { length: 20 },
  (_, index) => {
    const level = index + 1;
    return { level, value: `${Math.ceil(level / 2)}d6` };
  },
);

function featureById(id: string) {
  return rogueFeatures.find((feature) => feature.id === id);
}

function effectByType(
  effects: MechanicalEffect[] | undefined,
  type: MechanicalEffect['type'],
): MechanicalEffect | undefined {
  return effects?.find((effect) => effect.type === type);
}

describe('Rogue class rules data', () => {
  it('has the expected identity, localized names, metadata, and source', () => {
    expect(rogueClass).toMatchObject({
      id: 'rogue',
      names: { 'pt-BR': 'Ladino', 'en-US': 'Rogue' },
      source: { bookId: 'jvf-classes-subclasses-compendium' },
      tags: [
        'martial',
        'skill-expert',
        'stealth',
        'precision',
        'dexterity-based',
        'utility',
      ],
    });
    expect(rogueClass.summary?.['pt-BR'].trim()).not.toBe('');
    expect(rogueClass.summary?.['en-US'].trim()).not.toBe('');
  });

  it('uses a d8, Dexterity, and Dexterity/Intelligence saves', () => {
    expect(rogueClass.hitDie).toBe(8);
    expect(rogueClass.primaryAbilities).toEqual(['dexterity']);
    expect(rogueClass.savingThrows).toEqual(['dexterity', 'intelligence']);
  });

  it('has the exact armor, weapon, and tool proficiencies', () => {
    expect(rogueClass.armorProficiencies).toEqual(['light-armor']);
    expect(rogueClass.weaponProficiencies).toEqual([
      'simple-weapons',
      'hand-crossbows',
      'longswords',
      'rapiers',
      'shortswords',
    ]);
    expect(rogueClass.toolProficiencies).toEqual(['thieves-tools']);
  });

  it('chooses exactly four skills from the exact eleven options', () => {
    expect(rogueClass.skillChoices).toEqual({
      count: 4,
      options: expectedSkills,
    });
  });

  it('is accepted by the generic ClassDefinition validator', () => {
    expect(isValidClassDefinition(rogueClass)).toBe(true);
  });

  it('does not add a class-specific starting-equipment schema', () => {
    expect('startingEquipment' in rogueClass).toBe(false);
  });
});

describe('Rogue level progression', () => {
  it('defines exactly every level from 1 through 20', () => {
    expect(Object.keys(rogueClass.progression).map(Number)).toEqual(
      Array.from({ length: 20 }, (_, index) => index + 1),
    );
  });

  it.each([
    [1, 2], [2, 2], [3, 2], [4, 2],
    [5, 3], [6, 3], [7, 3], [8, 3],
    [9, 4], [10, 4], [11, 4], [12, 4],
    [13, 5], [14, 5], [15, 5], [16, 5],
    [17, 6], [18, 6], [19, 6], [20, 6],
  ])('uses level %i proficiency bonus +%i', (level, bonus) => {
    expect(rogueClass.progression[level]?.proficiencyBonus).toBe(bonus);
  });

  it.each(Object.entries(expectedFeaturesByLevel))(
    'registers the exact features at level %s',
    (level, featureIds) => {
      expect(rogueClass.progression[Number(level)]?.featureIds).toEqual(featureIds);
    },
  );

  it('uses subclass feature levels 3, 9, 13, and 17', () => {
    expect(rogueClass.subclassLevel).toBe(3);
    expect(rogueClass.progression[3]?.featureIds).toContain('rogue-roguish-archetype');

    const laterSubclassLevels = Object.values(rogueClass.progression)
      .filter((level) => level?.featureIds.includes('rogue-roguish-archetype-feature'))
      .map((level) => level?.level);

    expect(laterSubclassLevels).toEqual([9, 13, 17]);
  });

  it.each([4, 8, 10, 12, 16, 19])(
    'offers the generic ASI-or-feat choice at level %i',
    (level) => {
      expect(rogueClass.progression[level]?.featureIds).toContain(
        'rogue-ability-score-improvement',
      );
      expect(rogueClass.progression[level]?.choices).toContainEqual({
        id: `rogue-asi-or-feat-choice-${level}`,
        type: 'one-of',
        count: 1,
        optionTypes: ['asi', 'feat'],
      });
    },
  );

  it('offers ASI only at the six expected levels', () => {
    const levels = Object.values(rogueClass.progression)
      .filter((level) => level?.featureIds.includes('rogue-ability-score-improvement'))
      .map((level) => level?.level);

    expect(levels).toEqual([4, 8, 10, 12, 16, 19]);
  });
});

describe('Rogue Expertise', () => {
  it('models the level 1 two-skills or skill-plus-tools alternatives', () => {
    expect(rogueClass.progression[1]?.choices).toContain(rogueInitialExpertiseChoice);
    expect(rogueInitialExpertiseChoice).toMatchObject({
      type: 'one-of',
      count: 1,
      optionTypes: ['skill', 'other'],
      choices: [
        {
          type: 'skill',
          minimumLevel: 1,
          count: 2,
          condition: 'already-proficient',
        },
        {
          type: 'other',
          minimumLevel: 1,
          count: 2,
          optionIds: ['one-proficient-skill', 'thieves-tools'],
          condition: 'all-options-already-proficient',
        },
      ],
    });
  });

  it('models the level 6 choice of two additional owned proficiencies', () => {
    expect(rogueClass.progression[6]?.choices).toContain(rogueAdditionalExpertiseChoice);
    expect(rogueAdditionalExpertiseChoice).toMatchObject({
      type: 'other',
      minimumLevel: 6,
      count: 2,
      optionIds: ['proficient-skills', 'thieves-tools'],
      condition: 'already-proficient',
    });
  });

  it('doubles proficiency only for a chosen proficiency already owned', () => {
    expect(featureById('rogue-expertise')?.effects).toContainEqual({
      type: 'expertise',
      condition: 'chosen-proficiency-already-owned',
      value: 'double-proficiency-bonus',
    });
  });

  it('uses one Expertise definition at both levels without duplicate IDs', () => {
    expect(rogueClass.progression[1]?.featureIds).toContain('rogue-expertise');
    expect(rogueClass.progression[6]?.featureIds).toContain('rogue-expertise');
    expect(rogueFeatures.filter(({ id }) => id === 'rogue-expertise')).toHaveLength(1);
  });
});

describe('Rogue core feature mechanics', () => {
  it('models the complete Sneak Attack progression from 1d6 through 10d6', () => {
    const sneakAttack = featureById('rogue-sneak-attack');

    expect(effectByType(sneakAttack?.effects, 'damage')?.progression).toEqual(
      expectedSneakAttackProgression,
    );
  });

  it('increases Sneak Attack on every odd Rogue level and retains it on even levels', () => {
    const progression = effectByType(
      featureById('rogue-sneak-attack')?.effects,
      'damage',
    )?.progression ?? [];

    for (let level = 1; level <= 20; level += 1) {
      expect(progression[level - 1]?.value).toBe(`${Math.ceil(level / 2)}d6`);
    }
  });

  it('models Sneak Attack weapon, advantage, alternate-enemy, and no-disadvantage rules', () => {
    expect(featureById('rogue-sneak-attack')).toMatchObject({
      trigger: {
        event: 'weapon-attack-hit',
        conditions: [
          'target-creature',
          'finesse-or-ranged-weapon',
          'advantage-on-attack-roll-or-alternate-condition',
          'alternate:other-target-enemy-within-1.5m:not-incapacitated',
          'no-disadvantage-on-attack-roll',
        ],
      },
      limit: { maximum: 1, period: 'turn' },
    });
  });

  it('models Thieves Cant secrecy, four-times communication, and symbols', () => {
    const effects = featureById('rogue-thieves-cant')?.effects;

    expect(effects).toContainEqual(expect.objectContaining({
      type: 'language',
      proficiencyId: 'thieves-cant',
      condition: 'understood-only-by-creatures-that-know-thieves-cant',
    }));
    expect(effects).toContainEqual(expect.objectContaining({ value: 4 }));
    expect(effects).toContainEqual(expect.objectContaining({
      value: 'includes-simple-secret-signs-and-symbols',
    }));
  });

  it('models Cunning Action as exactly Dash, Disengage, or Hide', () => {
    expect(featureById('rogue-cunning-action')).toMatchObject({
      activation: 'bonus-action',
      requirements: ['in-combat'],
      actionOptions: ['dash', 'disengage', 'hide'],
      limit: { maximum: 1, period: 'turn' },
    });
  });

  it('models Steady Aim prerequisite, advantage, speed zero, and duration', () => {
    const feature = featureById('rogue-steady-aim');

    expect(feature).toMatchObject({
      activation: 'bonus-action',
      requirements: ['no-movement-this-turn'],
      duration: { type: 'until-end-of-current-turn' },
    });
    expect(effectByType(feature?.effects, 'roll-modifier')).toMatchObject({
      rollTypes: ['attack-roll'],
      condition: 'next-attack-roll-this-turn',
      value: 'advantage',
    });
    expect(feature?.effects).toContainEqual({
      type: 'walking-speed',
      condition: 'after-activation',
      value: 0,
    });
  });

  it('models Uncanny Dodge as a visible-attacker reaction that halves damage', () => {
    const feature = featureById('rogue-uncanny-dodge');

    expect(feature).toMatchObject({
      activation: 'reaction',
      trigger: { event: 'hit-by-attack', conditions: ['attacker-visible-to-rogue'] },
      target: { kind: 'self' },
    });
    expect(effectByType(feature?.effects, 'damage-reduction')).toMatchObject({
      condition: 'triggering-attack-damage',
      damageMultiplier: 0.5,
      value: 'half-incoming-damage',
    });
  });

  it('models Evasion Dexterity-save success as zero and failure as half damage', () => {
    const feature = featureById('rogue-evasion');

    expect(feature?.trigger).toEqual({
      event: 'dexterity-saving-throw',
      conditions: ['effect-normally-deals-half-damage-on-success'],
    });
    expect(feature?.effects).toEqual([
      {
        type: 'damage-reduction',
        savingThrowAbility: 'dexterity',
        condition: 'successful-save',
        damageMultiplier: 0,
        value: 'zero-damage',
      },
      {
        type: 'damage-reduction',
        savingThrowAbility: 'dexterity',
        condition: 'failed-save',
        damageMultiplier: 0.5,
        value: 'half-damage',
      },
    ]);
  });

  it('models Reliable Talent as a natural d20 floor on proficient checks', () => {
    expect(featureById('rogue-reliable-talent')?.effects).toContainEqual({
      type: 'roll-modifier',
      rollTypes: ['ability-check'],
      condition: 'proficiency-bonus-can-be-added;natural-d20-before-modifiers',
      naturalRollMinimum: 10,
    });
  });

  it('models Blindsense hearing, range, hidden/invisible targets, and awareness', () => {
    expect(featureById('rogue-blindsense')).toMatchObject({
      requirements: ['can-hear'],
      range: { value: 3, unit: 'meter' },
      target: { kind: 'creature', conditions: ['hidden-or-invisible'] },
      effects: [expect.objectContaining({ value: 'aware-of-target-location' })],
    });
  });

  it('grants Wisdom saving throw proficiency through Slippery Mind', () => {
    expect(featureById('rogue-slippery-mind')?.effects).toContainEqual({
      type: 'saving-throw-proficiency',
      ability: 'wisdom',
    });
  });

  it('prevents advantage against a non-incapacitated Rogue through Elusive', () => {
    expect(featureById('rogue-elusive')).toMatchObject({
      target: { kind: 'self' },
      effects: [{
        type: 'roll-modifier',
        rollTypes: ['attack-roll'],
        condition: 'attack-against-rogue;rogue-not-incapacitated',
        value: 'prevent-advantage',
      }],
    });
  });

  it('models both Stroke of Luck alternatives and its recovery', () => {
    expect(featureById('rogue-stroke-of-luck')).toMatchObject({
      usage: { freeUses: 1, recovery: 'short-or-long-rest' },
      choices: [{
        type: 'one-of',
        options: [
          {
            id: 'attack-miss-to-hit',
            effects: [{
              type: 'roll-modifier',
              trigger: {
                event: 'attack-miss',
                conditions: ['target-within-attack-range'],
              },
              rollTypes: ['attack-roll'],
              value: 'miss-becomes-hit',
            }],
          },
          {
            id: 'failed-check-to-natural-20',
            effects: [{
              type: 'roll-modifier',
              trigger: { event: 'ability-check-failed' },
              rollTypes: ['ability-check'],
              naturalRollSubstitution: 20,
            }],
          },
        ],
      }],
    });
  });
});

describe('Rogue subclass placeholder policy', () => {
  it('keeps subclass IDs empty while preserving the level 3 subclass choice', () => {
    expect(rogueClass.subclassIds).toEqual([]);
    expect(rogueSubclassChoice).toEqual({
      id: 'rogue-subclass-choice',
      type: 'subclass',
      minimumLevel: 3,
      count: 1,
      optionIds: [],
    });
    expect(rogueClass.progression[3]?.choices).toContain(rogueSubclassChoice);
  });

  it('does not accidentally register a Rogue subclass feature definition', () => {
    expect(rogueFeatures.every(({ origin }) => origin === 'class')).toBe(true);
    expect(rogueFeatures.every(({ sourceId }) => sourceId === 'rogue')).toBe(true);
    expect(rogueClass.subclassIds).toHaveLength(0);
  });
});

describe('Rogue catalog, references, exports, and Fighter regression', () => {
  it.each([
    'rogue',
    'Rogue',
    'Ladino',
    'stealth',
    'precision',
    'skill-expert',
    'dexterity-based',
    'utility',
  ])('is found by catalog query %s', (query) => {
    expect(matchesCatalogQuery(rogueClass, query)).toBe(true);
  });

  it('has unique feature IDs and no orphaned progression references', () => {
    const featureIds = rogueFeatures.map(({ id }) => id);
    const registeredIds = new Set(featureIds);
    const referencedIds = Object.values(rogueClass.progression)
      .flatMap((level) => level?.featureIds ?? []);

    expect(new Set(featureIds).size).toBe(featureIds.length);
    expect(referencedIds.every((id) => registeredIds.has(id))).toBe(true);
    expect(rogueFeatures.every(({ id }) => referencedIds.includes(id))).toBe(true);
  });

  it('exports Rogue class and features through the public barrel', () => {
    expect(rogueClassFromPublicBarrel).toBe(rogueClass);
    expect(rogueFeaturesFromPublicBarrel).toBe(rogueFeatures);
  });

  it('does not alter Fighter or its ten registered subclasses', () => {
    expect(fighterClass.id).toBe('fighter');
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
      'fighter-rune-knight',
    ]);
    expect(isValidClassDefinition(fighterClass)).toBe(true);
  });
});
