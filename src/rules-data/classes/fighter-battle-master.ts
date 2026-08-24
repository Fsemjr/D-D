import type {
  DirectChoiceDefinition,
  ResourceDefinition,
  SubclassDefinition,
} from '../types';
import { fighterBattleMasterManeuverIds } from '../features/fighter-battle-master';

export const fighterBattleMasterManeuverChoice: DirectChoiceDefinition = {
  id: 'fighter-battle-master-maneuver-choice',
  type: 'technique',
  minimumLevel: 3,
  count: 3,
  optionIds: [...fighterBattleMasterManeuverIds],
  countProgression: [
    { level: 3, count: 3 },
    { level: 7, count: 5 },
    { level: 10, count: 7 },
    { level: 15, count: 9 },
  ],
};

export const fighterBattleMasterSuperiorityDice: ResourceDefinition = {
  id: 'fighter-battle-master-superiority-dice',
  names: { 'pt-BR': 'Dados de Superioridade', 'en-US': 'Superiority Dice' },
  recovery: 'short-or-long-rest',
  progression: [
    { level: 3, maximum: 4, dieSize: 8 },
    { level: 7, maximum: 5, dieSize: 8 },
    { level: 10, maximum: 5, dieSize: 10 },
    { level: 15, maximum: 6, dieSize: 10 },
    { level: 18, maximum: 6, dieSize: 12 },
  ],
};

export const fighterBattleMasterSubclass: SubclassDefinition = {
  id: 'fighter-battle-master',
  classId: 'fighter',
  names: { 'pt-BR': 'Mestre de Batalha', 'en-US': 'Battle Master' },
  source: { bookId: 'jvf-classes-subclasses-compendium' },
  tags: ['martial', 'maneuvers', 'resource-management', 'tactical'],
  summary: {
    'pt-BR': 'Arquétipo tático baseado em manobras e dados de superioridade.',
    'en-US': 'A tactical archetype built around maneuvers and superiority dice.',
  },
  featureIds: [
    'fighter-battle-master-combat-superiority',
    'fighter-battle-master-student-of-war',
    'fighter-battle-master-know-your-enemy',
    'fighter-battle-master-improved-combat-superiority',
    'fighter-battle-master-relentless',
  ],
  choices: [fighterBattleMasterManeuverChoice],
  resources: [fighterBattleMasterSuperiorityDice],
};
