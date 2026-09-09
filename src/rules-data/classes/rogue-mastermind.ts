import type { DirectChoiceDefinition, SubclassDefinition } from '../types';
import { rogueMastermindFeatures } from '../features/rogue-mastermind';

export const rogueMastermindGamingSetChoice: DirectChoiceDefinition = {
  id: 'rogue-mastermind-gaming-set-choice',
  type: 'tool',
  minimumLevel: 3,
  condition: 'gaming-set',
  count: 1,
};

export const rogueMastermindLanguageChoice: DirectChoiceDefinition = {
  id: 'rogue-mastermind-language-choice',
  type: 'language',
  minimumLevel: 3,
  count: 2,
};

export const rogueMastermindSubclass: SubclassDefinition = {
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
  summary: {
    'pt-BR': 'Ladino estrategista especializado em intriga, disfarces e manipulação social.',
    'en-US': 'A strategic rogue specializing in intrigue, disguises, and social manipulation.',
  },
  featureIds: rogueMastermindFeatures.map(({ id }) => id),
  choices: [
    rogueMastermindGamingSetChoice,
    rogueMastermindLanguageChoice,
  ],
};
