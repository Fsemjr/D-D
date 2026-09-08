import type { SubclassDefinition } from '../types';
import { rogueThiefFeatures } from '../features/rogue-thief';

export const rogueThiefSubclass: SubclassDefinition = {
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
  summary: {
    'pt-BR': 'Ladino ágil que explora mobilidade, furtividade e interação rápida com objetos.',
    'en-US': 'An agile rogue focused on mobility, stealth, and swift object interaction.',
  },
  featureIds: rogueThiefFeatures.map(({ id }) => id),
};
