import { describe, expect, it } from 'vitest';
import {
  rogueMastermindFeatures as featuresFromPublicBarrel,
  rogueMastermindGamingSetChoice as gamingChoiceFromPublicBarrel,
  rogueMastermindLanguageChoice as languageChoiceFromPublicBarrel,
  rogueMastermindSubclass as subclassFromPublicBarrel,
} from '..';
import { matchesCatalogQuery } from '../catalog';
import { rogueFeatures } from '../features/rogue';
import { rogueArcaneTricksterFeatures } from '../features/rogue-arcane-trickster';
import { rogueAssassinFeatures } from '../features/rogue-assassin';
import { rogueInquisitiveFeatures } from '../features/rogue-inquisitive';
import { rogueMastermindFeatures } from '../features/rogue-mastermind';
import { rogueThiefFeatures } from '../features/rogue-thief';
import type { MechanicalEffect } from '../types';
import { isValidClassDefinition } from '../validation';
import { fighterClass } from './fighter';
import { rogueArcaneTricksterSubclass } from './rogue-arcane-trickster';
import { rogueAssassinSubclass } from './rogue-assassin';
import { rogueInquisitiveSubclass } from './rogue-inquisitive';
import {
  rogueMastermindGamingSetChoice,
  rogueMastermindLanguageChoice,
  rogueMastermindSubclass,
} from './rogue-mastermind';
import { rogueThiefSubclass } from './rogue-thief';
import { rogueClass, rogueSubclassChoice } from './rogue';

const expectedFeatureLevels: Array<[string, number]> = [
  ['rogue-mastermind-master-of-intrigue', 3],
  ['rogue-mastermind-master-of-tactics', 3],
  ['rogue-mastermind-insightful-manipulator', 9],
  ['rogue-mastermind-misdirection', 13],
  ['rogue-mastermind-soul-of-deceit', 17],
];

const expectedSubclassIds = [
  'rogue-assassin',
  'rogue-thief',
  'rogue-arcane-trickster',
  'rogue-inquisitive',
  'rogue-mastermind',
];

function featureById(id: string) {
  return rogueMastermindFeatures.find((feature) => feature.id === id);
}

function effectByType(
  effects: MechanicalEffect[] | undefined,
  type: MechanicalEffect['type'],
): MechanicalEffect | undefined {
  return effects?.find((effect) => effect.type === type);
}

describe('Mastermind subclass rules data', () => {
  it('has the expected identity, source, tags, and localized metadata', () => {
    expect(rogueMastermindSubclass).toMatchObject({
      id: 'rogue-mastermind',
      classId: 'rogue',
      names: { 'pt-BR': 'Mentor', 'en-US': 'Mastermind' },
      source: { bookId: 'jvf-classes-subclasses-compendium' },
      tags: [
        'social',
        'deception',
        'manipulation',
        'support',
        'intrigue',
        'disguise',
        'languages',
      ],
    });
    expect(rogueMastermindSubclass.summary?.['pt-BR'].trim()).not.toBe('');
    expect(rogueMastermindSubclass.summary?.['en-US'].trim()).not.toBe('');
  });

  it('registers exactly five subclass features at 3, 3, 9, 13, and 17', () => {
    expect(rogueMastermindFeatures).toHaveLength(5);
    expect(rogueMastermindFeatures.map(({ id, minimumLevel }) => (
      [id, minimumLevel]
    ))).toEqual(expectedFeatureLevels);
    expect(rogueMastermindSubclass.featureIds).toEqual(
      expectedFeatureLevels.map(([id]) => id),
    );
    expect(rogueMastermindFeatures.every(({ origin, sourceId }) => (
      origin === 'subclass' && sourceId === 'rogue-mastermind'
    ))).toBe(true);
  });

  it('gives every feature the compendium source metadata', () => {
    expect(rogueMastermindFeatures.every(({ source }) => (
      source?.bookId === 'jvf-classes-subclasses-compendium'
    ))).toBe(true);
  });

  it.each([
    'rogue-mastermind',
    'Mastermind',
    'Mentor',
    'social',
    'deception',
    'manipulation',
    'support',
    'intrigue',
  ])('is found by catalog query %s', (query) => {
    expect(matchesCatalogQuery(rogueMastermindSubclass, query)).toBe(true);
  });

  it('exports subclass, features, and choices through public barrels', () => {
    expect(subclassFromPublicBarrel).toBe(rogueMastermindSubclass);
    expect(featuresFromPublicBarrel).toBe(rogueMastermindFeatures);
    expect(gamingChoiceFromPublicBarrel).toBe(rogueMastermindGamingSetChoice);
    expect(languageChoiceFromPublicBarrel).toBe(rogueMastermindLanguageChoice);
  });
});

describe('Master of Intrigue', () => {
  it('grants disguise-kit and forgery-kit proficiency', () => {
    const toolEffects = featureById('rogue-mastermind-master-of-intrigue')
      ?.effects?.filter(({ type }) => type === 'tool-proficiency');

    expect(toolEffects).toEqual([
      { type: 'tool-proficiency', proficiencyId: 'disguise-kit' },
      { type: 'tool-proficiency', proficiencyId: 'forgery-kit' },
    ]);
  });

  it('offers exactly one gaming set and two language choices', () => {
    expect(rogueMastermindGamingSetChoice).toEqual({
      id: 'rogue-mastermind-gaming-set-choice',
      type: 'tool',
      minimumLevel: 3,
      condition: 'gaming-set',
      count: 1,
    });
    expect(rogueMastermindLanguageChoice).toEqual({
      id: 'rogue-mastermind-language-choice',
      type: 'language',
      minimumLevel: 3,
      count: 2,
    });
    expect(rogueMastermindSubclass.choices).toEqual([
      rogueMastermindGamingSetChoice,
      rogueMastermindLanguageChoice,
    ]);
  });

  it('models one minute of listening followed by speech and accent imitation', () => {
    const imitation = featureById('rogue-mastermind-master-of-intrigue')
      ?.effects?.find(({ value }) => value === 'speech-and-accent-imitation');

    expect(imitation).toMatchObject({
      preparation: { value: 1, unit: 'minute' },
      requirements: ['listen-to-creature-speaking'],
      actionOptions: [
        'imitate-speech-patterns',
        'imitate-accent',
        'pass-as-native-of-language-associated-region',
      ],
    });
  });
});

describe('Master of Tactics', () => {
  it('allows the Help action as a bonus action', () => {
    expect(featureById('rogue-mastermind-master-of-tactics')).toMatchObject({
      minimumLevel: 3,
      activation: 'bonus-action',
      actionOptions: ['help'],
    });
  });

  it('extends attack Help to 9 meters when the target sees and hears the Rogue', () => {
    const rangeEffect = featureById('rogue-mastermind-master-of-tactics')
      ?.effects?.find(({ value }) => value === 'attack-help-range-replaces-1.5m');

    expect(rangeEffect).toMatchObject({
      condition: 'helping-ally-attack-creature',
      range: { value: 9, unit: 'meter' },
      target: {
        kind: 'creature',
        conditions: ['can-see-rogue', 'can-hear-rogue'],
      },
    });
  });
});

describe('Insightful Manipulator', () => {
  it('requires one minute of observation and interaction outside combat', () => {
    expect(featureById('rogue-mastermind-insightful-manipulator')).toMatchObject({
      minimumLevel: 9,
      preparation: { value: 1, unit: 'minute' },
      requirements: ['out-of-combat', 'observe-and-interact-with-creature'],
      target: { kind: 'creature', count: 1 },
    });
  });

  it('compares INT, WIS, CHA, and class level as equal, superior, or inferior', () => {
    expect(featureById('rogue-mastermind-insightful-manipulator')?.effects)
      .toContainEqual({
        type: 'informational',
        value: 'relative-comparison',
        comparisonCategories: [
          'intelligence-score',
          'wisdom-score',
          'charisma-score',
          'class-level-if-any',
        ],
        comparisonResults: ['equal', 'superior', 'inferior'],
      });
  });

  it('preserves optional GM-provided history or personality information', () => {
    expect(featureById('rogue-mastermind-insightful-manipulator')?.effects)
      .toContainEqual(expect.objectContaining({
        value: 'gm-optional-creature-history-or-personality-trait',
      }));
  });
});

describe('Misdirection', () => {
  it('redirects an attack targeting the Rogue to an adjacent cover provider', () => {
    const feature = featureById('rogue-mastermind-misdirection');

    expect(feature).toMatchObject({
      minimumLevel: 13,
      activation: 'reaction',
      trigger: { event: 'self-targeted-by-attack' },
      range: { value: 1.5, unit: 'meter' },
      target: {
        kind: 'creature',
        excludesSelf: true,
        count: 1,
        conditions: ['provides-cover-against-triggering-attack'],
      },
    });
    expect(effectByType(feature?.effects, 'redirection')).toEqual({
      type: 'redirection',
      rollTypes: ['attack-roll'],
      value: 'chosen-creature-becomes-attack-target',
    });
  });
});

describe('Soul of Deceit', () => {
  it('blocks thought reading by telepathy or equivalent means unless allowed', () => {
    expect(featureById('rogue-mastermind-soul-of-deceit')?.effects)
      .toContainEqual({
        type: 'immunity',
        condition: 'unless-rogue-allows',
        value: 'thought-reading-by-telepathy-or-equivalent-means',
      });
  });

  it('projects false thoughts through Deception opposed by Insight', () => {
    expect(featureById('rogue-mastermind-soul-of-deceit')?.effects)
      .toContainEqual({
        type: 'informational',
        value: 'project-false-thoughts',
        contestedCheck: {
          actor: { ability: 'charisma', proficiencyId: 'deception' },
          opponent: { ability: 'wisdom', proficiencyId: 'insight' },
        },
      });
  });

  it('can spoof magical truth detection and blocks magical truth compulsion', () => {
    const effects = featureById('rogue-mastermind-soul-of-deceit')?.effects;

    expect(effects).toContainEqual({
      type: 'informational',
      condition: 'rogue-chooses',
      value: 'magical-truth-detection-can-report-sincere',
    });
    expect(effects).toContainEqual({
      type: 'immunity',
      value: 'magical-compulsion-to-tell-truth',
    });
  });
});

describe('Mastermind registration and regressions', () => {
  it('registers exactly five Rogue subclasses and level 3 options', () => {
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

  it('has unique Rogue-family feature and choice IDs with no orphaned references', () => {
    const allFeatureIds = [
      ...rogueFeatures,
      ...rogueAssassinFeatures,
      ...rogueThiefFeatures,
      ...rogueArcaneTricksterFeatures,
      ...rogueInquisitiveFeatures,
      ...rogueMastermindFeatures,
    ].map(({ id }) => id);
    const choiceIds = (rogueMastermindSubclass.choices ?? []).map(({ id }) => id);

    expect(new Set(allFeatureIds).size).toBe(allFeatureIds.length);
    expect(new Set(choiceIds).size).toBe(choiceIds.length);
    expect(rogueMastermindSubclass.featureIds).toEqual(
      rogueMastermindFeatures.map(({ id }) => id),
    );
    expect(rogueMastermindSubclass.choices).toEqual([
      rogueMastermindGamingSetChoice,
      rogueMastermindLanguageChoice,
    ]);
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
    expect(rogueInquisitiveSubclass.featureIds).toEqual(
      rogueInquisitiveFeatures.map(({ id }) => id),
    );
    expect(fighterClass.subclassIds).toHaveLength(10);
  });
});
