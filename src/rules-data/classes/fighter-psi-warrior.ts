import type { ResourceDefinition, SubclassDefinition } from '../types';
import { fighterPsiWarriorFeatures } from '../features/fighter-psi-warrior';

export const fighterPsiWarriorPsionicEnergyDice: ResourceDefinition = {
  id: 'fighter-psi-warrior-psionic-energy-dice',
  names: {
    'pt-BR': 'Dados de Energia Psiônica',
    'en-US': 'Psionic Energy Dice',
  },
  recovery: 'long-rest',
  additionalRecoveries: [{
    amount: 1,
    action: 'bonus-action',
    limitedUses: {
      maximum: 1,
      recovery: 'short-or-long-rest',
    },
  }],
  progression: [
    {
      level: 3,
      maximum: { type: 'proficiency-bonus', multiplier: 2 },
      dieSize: 6,
    },
    {
      level: 5,
      maximum: { type: 'proficiency-bonus', multiplier: 2 },
      dieSize: 8,
    },
    {
      level: 11,
      maximum: { type: 'proficiency-bonus', multiplier: 2 },
      dieSize: 10,
    },
    {
      level: 17,
      maximum: { type: 'proficiency-bonus', multiplier: 2 },
      dieSize: 12,
    },
  ],
};

export const fighterPsiWarriorSubclass: SubclassDefinition = {
  id: 'fighter-psi-warrior',
  classId: 'fighter',
  names: { 'pt-BR': 'Cavaleiro Psiônico', 'en-US': 'Psi Warrior' },
  source: { bookId: 'jvf-classes-subclasses-compendium' },
  tags: [
    'martial',
    'psionic',
    'telekinesis',
    'intelligence-based',
    'battlefield-control',
    'defensive',
  ],
  summary: {
    'pt-BR': 'Guerreiro psiônico que protege aliados e controla o campo com telecinese.',
    'en-US': 'A psionic warrior who protects allies and controls the battlefield with telekinesis.',
  },
  featureIds: fighterPsiWarriorFeatures.map(({ id }) => id),
  resources: [fighterPsiWarriorPsionicEnergyDice],
  spellIds: ['telekinesis'],
};
