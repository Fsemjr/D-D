import type {
  AlternativeChoiceDefinition,
  DirectChoiceDefinition,
  ResourceDefinition,
  SubclassDefinition,
} from '../types';
import { fighterCavalierFeatures } from '../features/fighter-cavalier';

export const fighterCavalierBonusProficiencySkillChoice: DirectChoiceDefinition = {
  id: 'fighter-cavalier-bonus-proficiency-skill-choice',
  type: 'skill',
  minimumLevel: 3,
  count: 1,
  optionIds: [
    'animal-handling',
    'history',
    'insight',
    'performance',
    'persuasion',
  ],
};

export const fighterCavalierBonusProficiencyLanguageChoice: DirectChoiceDefinition = {
  id: 'fighter-cavalier-bonus-proficiency-language-choice',
  type: 'language',
  minimumLevel: 3,
  count: 1,
};

export const fighterCavalierBonusProficiencyChoice: AlternativeChoiceDefinition = {
  id: 'fighter-cavalier-bonus-proficiency-choice',
  type: 'one-of',
  count: 1,
  optionTypes: ['skill', 'language'],
  choices: [
    fighterCavalierBonusProficiencySkillChoice,
    fighterCavalierBonusProficiencyLanguageChoice,
  ],
};

export const fighterCavalierUnwaveringMarkUses: ResourceDefinition = {
  id: 'fighter-cavalier-unwavering-mark-uses',
  names: {
    'pt-BR': 'Usos do Ataque da Marca Inabalável',
    'en-US': 'Unwavering Mark Attack Uses',
  },
  recovery: 'long-rest',
  progression: [{
    level: 3,
    maximum: { type: 'ability-modifier', ability: 'strength', minimum: 1 },
  }],
};

export const fighterCavalierWardingManeuverUses: ResourceDefinition = {
  id: 'fighter-cavalier-warding-maneuver-uses',
  names: {
    'pt-BR': 'Usos de Manobra de Proteção',
    'en-US': 'Warding Maneuver Uses',
  },
  recovery: 'long-rest',
  progression: [{
    level: 7,
    maximum: { type: 'ability-modifier', ability: 'constitution', minimum: 1 },
  }],
};

export const fighterCavalierSubclass: SubclassDefinition = {
  id: 'fighter-cavalier',
  classId: 'fighter',
  names: { 'pt-BR': 'Cavaleiro', 'en-US': 'Cavalier' },
  source: { bookId: 'jvf-classes-subclasses-compendium' },
  tags: [
    'martial',
    'mounted-combat',
    'defender',
    'melee',
    'battlefield-control',
  ],
  summary: {
    'pt-BR': 'Defensor marcial que protege aliados, controla inimigos próximos e domina o combate montado.',
    'en-US': 'A martial defender who protects allies, controls nearby enemies, and excels in mounted combat.',
  },
  featureIds: fighterCavalierFeatures.map(({ id }) => id),
  choices: [fighterCavalierBonusProficiencyChoice],
  resources: [
    fighterCavalierUnwaveringMarkUses,
    fighterCavalierWardingManeuverUses,
  ],
};
