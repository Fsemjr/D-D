import type { FeatureDefinition, MechanicalEffect } from '../types';

const sourceId = 'rogue-mastermind';
const source = { bookId: 'jvf-classes-subclasses-compendium' };

function informationalEffect(
  value: MechanicalEffect['value'],
  ptBR: string,
  enUS: string,
): MechanicalEffect {
  return {
    type: 'informational',
    value,
    note: { 'pt-BR': ptBR, 'en-US': enUS },
  };
}

export const rogueMastermindFeatures: FeatureDefinition[] = [
  {
    id: 'rogue-mastermind-master-of-intrigue',
    names: { 'pt-BR': 'Mestre da Intriga', 'en-US': 'Master of Intrigue' },
    origin: 'subclass',
    sourceId,
    source,
    minimumLevel: 3,
    effects: [
      { type: 'tool-proficiency', proficiencyId: 'disguise-kit' },
      { type: 'tool-proficiency', proficiencyId: 'forgery-kit' },
      {
        ...informationalEffect(
          'speech-and-accent-imitation',
          'Após ouvir a criatura, permite imitar sua fala e sotaque de forma convincente.',
          "After listening to the creature, allows convincing imitation of its speech and accent.",
        ),
        preparation: { value: 1, unit: 'minute' },
        requirements: ['listen-to-creature-speaking'],
        actionOptions: [
          'imitate-speech-patterns',
          'imitate-accent',
          'pass-as-native-of-language-associated-region',
        ],
      },
    ],
  },
  {
    id: 'rogue-mastermind-master-of-tactics',
    names: { 'pt-BR': 'Mestre da Tática', 'en-US': 'Master of Tactics' },
    origin: 'subclass',
    sourceId,
    source,
    minimumLevel: 3,
    activation: 'bonus-action',
    actionOptions: ['help'],
    effects: [
      informationalEffect(
        'help-action-as-bonus-action',
        'Permite usar a ação Ajudar como ação bônus.',
        'Allows taking the Help action as a bonus action.',
      ),
      {
        ...informationalEffect(
          'attack-help-range-replaces-1.5m',
          'Ao ajudar um aliado a atacar, o alvo pode estar a até 9 metros se puder ver e ouvir o Ladino.',
          'When helping an ally attack, the target can be within 9 meters if it can see and hear the Rogue.',
        ),
        condition: 'helping-ally-attack-creature',
        range: { value: 9, unit: 'meter' },
        target: {
          kind: 'creature',
          conditions: ['can-see-rogue', 'can-hear-rogue'],
        },
      },
    ],
  },
  {
    id: 'rogue-mastermind-insightful-manipulator',
    names: {
      'pt-BR': 'Manipulador Perspicaz',
      'en-US': 'Insightful Manipulator',
    },
    origin: 'subclass',
    sourceId,
    source,
    minimumLevel: 9,
    preparation: { value: 1, unit: 'minute' },
    requirements: ['out-of-combat', 'observe-and-interact-with-creature'],
    target: { kind: 'creature', count: 1 },
    effects: [
      {
        type: 'informational',
        value: 'relative-comparison',
        comparisonCategories: [
          'intelligence-score',
          'wisdom-score',
          'charisma-score',
          'class-level-if-any',
        ],
        comparisonResults: ['equal', 'superior', 'inferior'],
      },
      informationalEffect(
        'gm-optional-creature-history-or-personality-trait',
        'A critério do Mestre, também pode revelar parte da história ou um traço de personalidade da criatura.',
        "At the GM's discretion, it can also reveal part of the creature's history or one personality trait.",
      ),
    ],
  },
  {
    id: 'rogue-mastermind-misdirection',
    names: { 'pt-BR': 'Redirecionar', 'en-US': 'Misdirection' },
    origin: 'subclass',
    sourceId,
    source,
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
    effects: [{
      type: 'redirection',
      rollTypes: ['attack-roll'],
      value: 'chosen-creature-becomes-attack-target',
    }],
  },
  {
    id: 'rogue-mastermind-soul-of-deceit',
    names: { 'pt-BR': 'Alma do Enganador', 'en-US': 'Soul of Deceit' },
    origin: 'subclass',
    sourceId,
    source,
    minimumLevel: 17,
    effects: [
      {
        type: 'immunity',
        condition: 'unless-rogue-allows',
        value: 'thought-reading-by-telepathy-or-equivalent-means',
      },
      {
        type: 'informational',
        value: 'project-false-thoughts',
        contestedCheck: {
          actor: { ability: 'charisma', proficiencyId: 'deception' },
          opponent: { ability: 'wisdom', proficiencyId: 'insight' },
        },
      },
      {
        type: 'informational',
        condition: 'rogue-chooses',
        value: 'magical-truth-detection-can-report-sincere',
      },
      {
        type: 'immunity',
        value: 'magical-compulsion-to-tell-truth',
      },
    ],
  },
];
