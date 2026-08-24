import type {
  AlternativeChoiceDefinition,
  DirectChoiceDefinition,
  ResourceDefinition,
  SubclassDefinition,
} from '../types';
import { fighterSamuraiFeatures } from '../features/fighter-samurai';

export const fighterSamuraiBonusProficiencySkillChoice: DirectChoiceDefinition = {
  id: 'fighter-samurai-bonus-proficiency-skill-choice',
  type: 'skill',
  minimumLevel: 3,
  count: 1,
  optionIds: ['history', 'insight', 'performance', 'persuasion'],
};

export const fighterSamuraiBonusProficiencyLanguageChoice: DirectChoiceDefinition = {
  id: 'fighter-samurai-bonus-proficiency-language-choice',
  type: 'language',
  minimumLevel: 3,
  count: 1,
};

export const fighterSamuraiBonusProficiencyChoice: AlternativeChoiceDefinition = {
  id: 'fighter-samurai-bonus-proficiency-choice',
  type: 'one-of',
  count: 1,
  optionTypes: ['skill', 'language'],
  choices: [
    fighterSamuraiBonusProficiencySkillChoice,
    fighterSamuraiBonusProficiencyLanguageChoice,
  ],
};

export const fighterSamuraiElegantCourtierFallbackChoice: DirectChoiceDefinition = {
  id: 'fighter-samurai-elegant-courtier-fallback-save-choice',
  type: 'saving-throw-proficiency',
  minimumLevel: 7,
  condition: 'already-proficient:wisdom-saving-throw',
  count: 1,
  optionIds: ['intelligence', 'charisma'],
};

export const fighterSamuraiFightingSpiritUses: ResourceDefinition = {
  id: 'fighter-samurai-fighting-spirit-uses',
  names: { 'pt-BR': 'Usos de Espírito de Batalha', 'en-US': 'Fighting Spirit Uses' },
  recovery: 'long-rest',
  progression: [{ level: 3, maximum: 3 }],
};

export const fighterSamuraiStrengthBeforeDeathUses: ResourceDefinition = {
  id: 'fighter-samurai-strength-before-death-uses',
  names: {
    'pt-BR': 'Usos de Força Diante da Morte',
    'en-US': 'Strength Before Death Uses',
  },
  recovery: 'long-rest',
  progression: [{ level: 18, maximum: 1 }],
};

export const fighterSamuraiSubclass: SubclassDefinition = {
  id: 'fighter-samurai',
  classId: 'fighter',
  names: { 'pt-BR': 'Samurai', 'en-US': 'Samurai' },
  source: { bookId: 'jvf-classes-subclasses-compendium' },
  tags: [
    'martial',
    'weapon-combat',
    'resilience',
    'advantage',
    'wisdom-synergy',
  ],
  summary: {
    'pt-BR': 'Combatente marcial resiliente que conquista vantagem, vigor temporário e sinergia com Sabedoria.',
    'en-US': 'A resilient martial combatant who gains advantage, temporary vigor, and Wisdom synergy.',
  },
  featureIds: fighterSamuraiFeatures.map(({ id }) => id),
  choices: [
    fighterSamuraiBonusProficiencyChoice,
    fighterSamuraiElegantCourtierFallbackChoice,
  ],
  resources: [
    fighterSamuraiFightingSpiritUses,
    fighterSamuraiStrengthBeforeDeathUses,
  ],
};
