import type { AbilityKey } from '../types';

export type Locale = 'pt-BR' | 'en-US';

export type LocalizedName = Record<Locale, string>;

export type CreatureType =
  | 'aberration'
  | 'beast'
  | 'celestial'
  | 'construct'
  | 'dragon'
  | 'elemental'
  | 'fey'
  | 'fiend'
  | 'giant'
  | 'humanoid'
  | 'monstrosity'
  | 'ooze'
  | 'plant'
  | 'undead';

export type CharacterSize =
  | 'tiny'
  | 'small'
  | 'medium'
  | 'large'
  | 'variable';

export type FeatureOrigin =
  | 'class'
  | 'subclass'
  | 'ancestry'
  | 'subrace'
  | 'lineage';

export type MechanicalEffectType =
  | 'ability-modifier'
  | 'armor-proficiency'
  | 'weapon-proficiency'
  | 'skill-proficiency'
  | 'tool-proficiency'
  | 'saving-throw-proficiency'
  | 'language'
  | 'resistance'
  | 'immunity'
  | 'darkvision'
  | 'walking-speed'
  | 'flying-speed'
  | 'swimming-speed'
  | 'climbing-speed'
  | 'hp-per-level'
  | 'flat-hp'
  | 'granted-spell'
  | 'granted-cantrip'
  | 'natural-weapon'
  | 'informational';

export interface MechanicalEffect {
  type: MechanicalEffectType;

  ability?: AbilityKey;

  value?: number | string | boolean;

  damageType?: string;

  proficiencyId?: string;

  spellId?: string;

  note?: LocalizedName;
}

export interface FeatureDefinition {
  id: string;

  names: LocalizedName;

  origin: FeatureOrigin;

  sourceId: string;

  minimumLevel?: number;

  effects?: MechanicalEffect[];
}

export interface TraitDefinition {
  id: string;

  names: LocalizedName;

  minimumLevel?: number;

  effects?: MechanicalEffect[];
}

export interface FixedAbilityBonusRule {
  type: 'fixed';

  bonuses: Partial<Record<AbilityKey, number>>;
}

export interface FlexibleTwoOneAbilityRule {
  type: 'flexible-2-1';
}

export interface FlexibleThreeOnesAbilityRule {
  type: 'flexible-1-1-1';
}

export interface NoAbilityBonusRule {
  type: 'none';
}

export type AbilityScoreRule =
  | FixedAbilityBonusRule
  | FlexibleTwoOneAbilityRule
  | FlexibleThreeOnesAbilityRule
  | NoAbilityBonusRule;

export interface SkillChoiceDefinition {
  count: number;

  options: string[];
}

export type ChoiceOptionType =
  | 'skill'
  | 'tool'
  | 'language'
  | 'fighting-style'
  | 'feature'
  | 'subclass'
  | 'asi'
  | 'feat'
  | 'spell'
  | 'other';

export interface DirectChoiceDefinition {
  id: string;

  type: ChoiceOptionType;

  count?: number;

  optionIds?: string[];
}

export interface AlternativeChoiceDefinition {
  id: string;

  type: 'one-of';

  count?: number;

  optionTypes: [ChoiceOptionType, ChoiceOptionType, ...ChoiceOptionType[]];
}

export type ChoiceDefinition =
  | DirectChoiceDefinition
  | AlternativeChoiceDefinition;

export interface SpellSlotProgression {
  1?: number;
  2?: number;
  3?: number;
  4?: number;
  5?: number;
  6?: number;
  7?: number;
  8?: number;
  9?: number;
}

export type SpellcastingPreparationMode =
  | 'known'
  | 'prepared'
  | 'spellbook'
  | 'pact'
  | 'none';

export interface SpellcastingDefinition {
  ability: AbilityKey;

  preparationMode: SpellcastingPreparationMode;

  startsAtLevel: number;

  ritualCasting?: boolean;

  spellbook?: boolean;
}

export interface ClassLevelDefinition {
  level: number;

  proficiencyBonus: number;

  featureIds: string[];

  choices?: ChoiceDefinition[];

  spellSlots?: SpellSlotProgression;

  cantripsKnown?: number;

  spellsKnown?: number;

  preparedSpellFormula?: string;
}

export interface ClassDefinition {
  id: string;

  names: LocalizedName;

  hitDie: number;

  primaryAbilities: AbilityKey[];

  savingThrows: AbilityKey[];

  armorProficiencies?: string[];

  weaponProficiencies?: string[];

  toolProficiencies?: string[];

  skillChoices?: SkillChoiceDefinition;

  subclassLevel?: number;

  subclassIds: string[];

  progression: Partial<Record<number, ClassLevelDefinition>>;

  spellcasting?: SpellcastingDefinition;
}

export interface SubclassDefinition {
  id: string;

  classId: string;

  names: LocalizedName;

  featureIds: string[];

  spellIds?: string[];
}

export interface AncestryDefinition {
  id: string;

  names: LocalizedName;

  creatureType: CreatureType;

  size: CharacterSize;

  walkingSpeed: number;

  languages?: string[];

  abilityScoreRule?: AbilityScoreRule;

  traitIds: string[];

  subraceIds?: string[];
}

export interface SubraceDefinition {
  id: string;

  ancestryId: string;

  names: LocalizedName;

  abilityScoreRule?: AbilityScoreRule;

  traitIds: string[];
}

export interface LineageDefinition {
  id: string;

  names: LocalizedName;

  creatureType: CreatureType;

  size: CharacterSize;

  walkingSpeed: number;

  languages?: string[];

  abilityScoreRule?: AbilityScoreRule;

  traitIds: string[];
}

export type SpellSchool =
  | 'abjuration'
  | 'conjuration'
  | 'divination'
  | 'enchantment'
  | 'evocation'
  | 'illusion'
  | 'necromancy'
  | 'transmutation';

export interface SpellDefinition {
  id: string;

  names: LocalizedName;

  level: number;

  school: SpellSchool;

  ritual?: boolean;

  concentration?: boolean;

  classIds: string[];
}
