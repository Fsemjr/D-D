import type { ResourceDefinition, SubclassDefinition } from '../types';
import { rogueInquisitiveFeatures } from '../features/rogue-inquisitive';

export const rogueInquisitiveUnerringEyeUses: ResourceDefinition = {
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
};

export const rogueInquisitiveSubclass: SubclassDefinition = {
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
  summary: {
    'pt-BR': 'Ladino observador especializado em investigação, percepção e leitura de oponentes.',
    'en-US': 'An observant rogue specializing in investigation, perception, and reading opponents.',
  },
  featureIds: rogueInquisitiveFeatures.map(({ id }) => id),
  resources: [rogueInquisitiveUnerringEyeUses],
};
