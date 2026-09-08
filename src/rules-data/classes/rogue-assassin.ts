import type { SubclassDefinition } from '../types';
import { rogueAssassinFeatures } from '../features/rogue-assassin';

export const rogueAssassinSubclass: SubclassDefinition = {
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
  summary: {
    'pt-BR': 'Ladino letal que explora surpresa, identidades falsas e imitação.',
    'en-US': 'A lethal rogue who exploits surprise, false identities, and impersonation.',
  },
  featureIds: rogueAssassinFeatures.map(({ id }) => id),
};
