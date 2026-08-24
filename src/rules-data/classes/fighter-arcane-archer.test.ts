import { describe, expect, it } from 'vitest';
import {
  fighterArcaneArcherFeatures as featuresFromPublicBarrel,
  fighterArcaneArcherShotOptions as optionsFromPublicBarrel,
  fighterArcaneArcherSubclass as subclassFromPublicBarrel,
  matchesCatalogQuery,
} from '..';
import { fighterBattleMasterFeatures } from '../features/fighter-battle-master';
import { fighterChampionFeatures } from '../features/fighter-champion';
import {
  fighterArcaneArcherFeatures,
  fighterArcaneArcherShotOptionIds,
  fighterArcaneArcherShotOptions,
} from '../features/fighter-arcane-archer';
import { fighterEldritchKnightFeatures } from '../features/fighter-eldritch-knight';
import { fighterFeatures } from '../features/fighter';
import {
  fighterArcaneArcherLoreCantripChoice,
  fighterArcaneArcherLoreSkillChoice,
  fighterArcaneArcherShotChoice,
  fighterArcaneArcherShotUses,
  fighterArcaneArcherSubclass,
} from './fighter-arcane-archer';
import { fighterBattleMasterSubclass } from './fighter-battle-master';
import { fighterChampionSubclass } from './fighter-champion';
import { fighterEldritchKnightSubclass } from './fighter-eldritch-knight';
import { fighterClass } from './fighter';

const expectedFeatureLevels: Array<[string, number]> = [
  ['fighter-arcane-archer-lore', 3],
  ['fighter-arcane-archer-arcane-shot', 3],
  ['fighter-arcane-archer-magic-arrow', 7],
  ['fighter-arcane-archer-curving-shot', 7],
  ['fighter-arcane-archer-ever-ready-shot', 15],
];

const expectedOptions = [
  ['bursting-arrow', 'Flecha da Explosão', 'Bursting Arrow', 'evocation'],
  ['beguiling-arrow', 'Flecha da Sedução', 'Beguiling Arrow', 'enchantment'],
  ['grasping-arrow', 'Flecha de Agarrar', 'Grasping Arrow', 'conjuration'],
  ['banishing-arrow', 'Flecha do Banimento', 'Banishing Arrow', 'abjuration'],
  ['enfeebling-arrow', 'Flecha do Enfraquecimento', 'Enfeebling Arrow', 'necromancy'],
  ['piercing-arrow', 'Flecha Perfurante', 'Piercing Arrow', 'transmutation'],
  ['seeking-arrow', 'Flecha Perseguidora', 'Seeking Arrow', 'divination'],
  ['shadow-arrow', 'Flecha Sombria', 'Shadow Arrow', 'illusion'],
] as const;

const expectedKnownOptionsProgression = [
  { level: 3, count: 2 },
  { level: 7, count: 3 },
  { level: 10, count: 4 },
  { level: 15, count: 5 },
  { level: 18, count: 6 },
];

const expectedLevel18Damage = {
  'bursting-arrow': [{ damageType: 'force', value: '4d6' }],
  'beguiling-arrow': [{ damageType: 'psychic', value: '4d6' }],
  'grasping-arrow': [
    { damageType: 'poison', value: '4d6' },
    { damageType: 'slashing', value: '4d6' },
  ],
  'banishing-arrow': [{ damageType: 'force', value: '2d6' }],
  'enfeebling-arrow': [{ damageType: 'necrotic', value: '4d6' }],
  'piercing-arrow': [{ damageType: 'piercing', value: '2d6' }],
  'seeking-arrow': [{ damageType: 'force', value: '2d6' }],
  'shadow-arrow': [{ damageType: 'psychic', value: '4d6' }],
} as const;

function featureById(id: string) {
  return fighterArcaneArcherFeatures.find((feature) => feature.id === id);
}

function optionByShortId(id: string) {
  return fighterArcaneArcherShotOptions.find(
    (option) => option.id === `fighter-arcane-archer-arcane-shot-${id}`,
  );
}

describe('Arcane Archer subclass rules data', () => {
  it('has the expected identity and localized names', () => {
    expect(fighterArcaneArcherSubclass).toMatchObject({
      id: 'fighter-arcane-archer',
      classId: 'fighter',
      names: {
        'pt-BR': 'Arqueiro Arcano',
        'en-US': 'Arcane Archer',
      },
    });
  });

  it('has project source, stable tags, and localized summary', () => {
    expect(fighterArcaneArcherSubclass.source).toEqual({
      bookId: 'jvf-classes-subclasses-compendium',
    });
    expect(fighterArcaneArcherSubclass.tags).toEqual([
      'martial',
      'ranged',
      'magical-arrows',
      'tactical',
      'intelligence-based',
    ]);
    expect(fighterArcaneArcherSubclass.summary?.['pt-BR'].trim()).not.toBe('');
    expect(fighterArcaneArcherSubclass.summary?.['en-US'].trim()).not.toBe('');
  });

  it.each(expectedFeatureLevels)('registers %s at Fighter level %i', (id, level) => {
    expect(featureById(id)?.minimumLevel).toBe(level);
  });

  it('owns all features as Arcane Archer subclass features', () => {
    expect(fighterArcaneArcherFeatures).toHaveLength(5);
    expect(fighterArcaneArcherFeatures.every(({ origin }) => origin === 'subclass')).toBe(true);
    expect(fighterArcaneArcherFeatures.every(
      ({ sourceId }) => sourceId === 'fighter-arcane-archer',
    )).toBe(true);
  });

  it('has no orphaned or missing feature references', () => {
    expect(fighterArcaneArcherSubclass.featureIds).toEqual(
      fighterArcaneArcherFeatures.map(({ id }) => id),
    );
  });

  it('registers and offers all four Fighter subclasses', () => {
    const expectedSubclassIds = [
      'fighter-champion',
      'fighter-battle-master',
      'fighter-eldritch-knight',
      'fighter-arcane-archer',
    ];

    expect(fighterClass.subclassIds).toEqual(expectedSubclassIds);
    expect(fighterClass.progression[3]?.choices).toContainEqual({
      id: 'fighter-subclass-choice',
      type: 'subclass',
      count: 1,
      optionIds: expectedSubclassIds,
    });
  });

  it('preserves the previously registered subclass definitions', () => {
    expect([
      fighterChampionSubclass.id,
      fighterBattleMasterSubclass.id,
      fighterEldritchKnightSubclass.id,
    ]).toEqual([
      'fighter-champion',
      'fighter-battle-master',
      'fighter-eldritch-knight',
    ]);
  });
});

describe('Arcane Archer choices and resources', () => {
  it('offers exactly Arcana or Nature for its Lore proficiency', () => {
    expect(fighterArcaneArcherLoreSkillChoice).toMatchObject({
      type: 'skill',
      count: 1,
      optionIds: ['arcana', 'nature'],
    });
  });

  it('offers exactly prestidigitation or druidcraft for its Lore cantrip', () => {
    expect(fighterArcaneArcherLoreCantripChoice).toMatchObject({
      type: 'spell',
      count: 1,
      optionIds: ['prestidigitation', 'druidcraft'],
    });
  });

  it('starts with two known Arcane Shot options and follows the exact progression', () => {
    expect(fighterArcaneArcherShotChoice.count).toBe(2);
    expect(fighterArcaneArcherShotChoice.countProgression).toEqual(
      expectedKnownOptionsProgression,
    );
  });

  it('references every Arcane Shot option and no unknown option', () => {
    expect(fighterArcaneArcherShotChoice.optionIds).toEqual(
      fighterArcaneArcherShotOptionIds,
    );
    expect(fighterArcaneArcherSubclass.choices).toContain(
      fighterArcaneArcherShotChoice,
    );
  });

  it('has exactly two uses at every progression entry', () => {
    expect(fighterArcaneArcherShotUses.progression).toHaveLength(5);
    expect(
      fighterArcaneArcherShotUses.progression.every(({ maximum }) => maximum === 2),
    ).toBe(true);
  });

  it('recovers all Arcane Shot uses on a short or long rest', () => {
    expect(fighterArcaneArcherShotUses.recovery).toBe('short-or-long-rest');
    expect(fighterArcaneArcherSubclass.resources).toContain(
      fighterArcaneArcherShotUses,
    );
  });

  it('uses Intelligence structurally for the Arcane Shot save DC', () => {
    expect(featureById('fighter-arcane-archer-arcane-shot')?.effects).toContainEqual(
      expect.objectContaining({
        ability: 'intelligence',
        value: '8 + proficiencyBonus + intelligenceModifier',
      }),
    );
  });
});

describe('Arcane Shot options', () => {
  it('registers exactly eight options with unique stable IDs', () => {
    expect(fighterArcaneArcherShotOptions).toHaveLength(8);
    expect(new Set(fighterArcaneArcherShotOptionIds).size).toBe(8);
    expect(fighterArcaneArcherShotOptionIds).toEqual(
      expectedOptions.map(([id]) => `fighter-arcane-archer-arcane-shot-${id}`),
    );
  });

  it.each(expectedOptions)(
    'registers %s with localized names and school metadata',
    (id, ptBRName, enUSName, school) => {
      expect(optionByShortId(id)).toMatchObject({
        names: { 'pt-BR': ptBRName, 'en-US': enUSName },
        school,
        sourceId: 'fighter-arcane-archer',
        source: { bookId: 'jvf-classes-subclasses-compendium' },
      });
      expect(optionByShortId(id)?.tags).toContain(school);
      expect(optionByShortId(id)?.summary?.['pt-BR'].trim()).not.toBe('');
      expect(optionByShortId(id)?.summary?.['en-US'].trim()).not.toBe('');
    },
  );

  it('identifies exactly Piercing Arrow and Seeking Arrow as not using attack rolls', () => {
    expect(
      fighterArcaneArcherShotOptions
        .filter(({ requiresAttackRoll }) => requiresAttackRoll === false)
        .map(({ id }) => id),
    ).toEqual([
      'fighter-arcane-archer-arcane-shot-piercing-arrow',
      'fighter-arcane-archer-arcane-shot-seeking-arrow',
    ]);
    expect(
      fighterArcaneArcherShotOptions.filter(({ requiresAttackRoll }) => (
        requiresAttackRoll === true
      )),
    ).toHaveLength(6);
  });

  it.each(Object.entries(expectedLevel18Damage))(
    '%s has the exact level 18 damage scaling',
    (id, expectedDamage) => {
      const level18Damage = optionByShortId(id)?.effects?.flatMap((effect) => (
        effect.progression
          ?.filter(({ level }) => level === 18)
          .map(({ value }) => ({ damageType: effect.damageType, value })) ?? []
      ));

      expect(level18Damage).toEqual(expectedDamage);
    },
  );

  it('assigns the specified saving throw abilities', () => {
    const savingThrows = Object.fromEntries(
      fighterArcaneArcherShotOptions.map((option) => [
        option.id,
        option.effects?.find(({ savingThrowAbility }) => savingThrowAbility)
          ?.savingThrowAbility,
      ]),
    );

    expect(savingThrows).toMatchObject({
      'fighter-arcane-archer-arcane-shot-beguiling-arrow': 'wisdom',
      'fighter-arcane-archer-arcane-shot-banishing-arrow': 'charisma',
      'fighter-arcane-archer-arcane-shot-enfeebling-arrow': 'constitution',
      'fighter-arcane-archer-arcane-shot-piercing-arrow': 'dexterity',
      'fighter-arcane-archer-arcane-shot-seeking-arrow': 'dexterity',
      'fighter-arcane-archer-arcane-shot-shadow-arrow': 'wisdom',
    });
  });
});

describe('Arcane Archer feature mechanics', () => {
  it('limits Arcane Shot to one per turn and the specified bows', () => {
    const values = featureById('fighter-arcane-archer-arcane-shot')
      ?.effects?.map(({ value }) => value);

    expect(values).toEqual(expect.arrayContaining([
      'maximum-one-arcane-shot-per-turn',
      'magic-arrow:shortbow-or-longbow:attack-action',
      'normally-applied-on-hit;some-options-skip-attack-roll',
    ]));
  });

  it('treats eligible arrows as magical only until the attack resolves', () => {
    expect(featureById('fighter-arcane-archer-magic-arrow')?.effects).toContainEqual(
      expect.objectContaining({
        value: 'nonmagical-shortbow-or-longbow-arrow:magical-until-hit-or-miss',
      }),
    );
  });

  it('structures Curving Shot trigger, bonus action, different target, and range', () => {
    const values = featureById('fighter-arcane-archer-curving-shot')
      ?.effects?.map(({ value }) => value);

    expect(values).toEqual([
      'trigger:magic-arrow-attack-miss',
      'bonus-action:reroll-attack',
      'different-target',
      18,
    ]);
  });

  it('recovers one use when initiative starts with no Arcane Shot uses', () => {
    expect(featureById('fighter-arcane-archer-ever-ready-shot')?.effects).toContainEqual(
      expect.objectContaining({
        value: 'initiative-with-zero-resource->recover:1',
      }),
    );
  });

  it('has no duplicate Fighter-family feature IDs', () => {
    const allFeatureIds = [
      ...fighterFeatures,
      ...fighterChampionFeatures,
      ...fighterBattleMasterFeatures,
      ...fighterEldritchKnightFeatures,
      ...fighterArcaneArcherFeatures,
    ].map(({ id }) => id);

    expect(new Set(allFeatureIds).size).toBe(allFeatureIds.length);
  });
});

describe('Arcane Archer catalog and exports', () => {
  it.each([
    'fighter-arcane-archer',
    'Arcane Archer',
    'Arqueiro Arcano',
    'Intelligence-based magical options',
    'ranged',
    'magical-arrows',
  ])('is found by catalog query %s', (query) => {
    expect(matchesCatalogQuery(fighterArcaneArcherSubclass, query)).toBe(true);
  });

  it('exports the subclass, features, and options through the public barrel', () => {
    expect(subclassFromPublicBarrel).toBe(fighterArcaneArcherSubclass);
    expect(featuresFromPublicBarrel).toBe(fighterArcaneArcherFeatures);
    expect(optionsFromPublicBarrel).toBe(fighterArcaneArcherShotOptions);
  });
});
