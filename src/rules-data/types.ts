import type { AbilityKey } from '../types';

export type Locale = 'pt-BR' | 'en-US';

export type LocalizedName = Record<Locale, string>;

export interface RuleSourceMetadata {
  bookId: string;

  version?: string;

  page?: number | number[];
}

export interface RuleCatalogMetadata {
  source?: RuleSourceMetadata;

  tags?: string[];

  summary?: LocalizedName;
}

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
  | 'huge'
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
  | 'expertise'
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
  | 'temporary-hp'
  | 'granted-spell'
  | 'granted-cantrip'
  | 'natural-weapon'
  | 'damage'
  | 'damage-reduction'
  | 'movement'
  | 'condition'
  | 'remove-condition-effects'
  | 'cover'
  | 'weapon-attack'
  | 'roll-modifier'
  | 'fixed-bonus'
  | 'size'
  | 'reach'
  | 'reroll'
  | 'redirection'
  | 'inscription'
  | 'informational';

export type RollType = 'attack-roll' | 'saving-throw' | 'ability-check';

export type ActionType = 'action' | 'bonus-action' | 'reaction';

export interface DistanceDefinition {
  value: number;

  unit: 'meter';
}

export interface TriggerDefinition {
  event: string;

  sourceId?: string;

  conditions?: string[];
}

export interface ResourceCostDefinition {
  resourceId: string;

  amount: number;

  roll?: boolean;
}

export interface LimitedUseDefinition {
  freeUses: number;

  recovery: ResourceRecovery;

  additionalUseCost?: ResourceCostDefinition;

  progression?: LimitedUseLevelDefinition[];
}

export interface LimitedUseLevelDefinition {
  level: number;

  freeUses: number;
}

export interface UsageLimitDefinition {
  maximum: number;

  period: 'turn' | 'round';
}

export interface AbilityFormulaDefinition {
  base?: number;

  proficiencyBonusMultiplier?: number;

  abilityModifier?: AbilityKey;

  multiplier?: number;

  minimum?: number;
}

export interface ResourceDieFormulaDefinition {
  type: 'resource-die';

  resourceId: string;

  count?: number;

  abilityModifier?: AbilityKey;

  minimum?: number;
}

export interface SpeedMultiplierFormulaDefinition {
  type: 'speed-multiplier';

  speed: 'walking' | 'flying' | 'swimming' | 'climbing';

  multiplier: number;
}

export interface DiceFormulaDefinition {
  type: 'dice';

  count: number;

  dieSize: number;

  multiplier?: number;

  unit?: 'centimeter';
}

export interface ReferenceFormulaDefinition {
  type: 'reference';

  referenceId: string;

  property: 'count';
}

export type MechanicalFormulaDefinition =
  | AbilityFormulaDefinition
  | ResourceDieFormulaDefinition
  | SpeedMultiplierFormulaDefinition
  | DiceFormulaDefinition
  | ReferenceFormulaDefinition;

export interface DurationDefinition {
  type:
    | 'until-end-of-current-turn'
    | 'until-next-long-rest'
    | 'minutes'
    | 'while-concentrating';

  value?: number;

  endsEarlyWhen?: string[];
}

export interface TargetCriteriaDefinition {
  kind: 'self' | 'creature' | 'object';

  visible?: boolean;

  willing?: boolean;

  excludesSelf?: boolean;

  canIncludeSelf?: boolean;

  sizeMaximum?: CharacterSize;

  conditions?: string[];

  count?: number | ResourceMaximumDefinition;

  minimum?: number;
}

export interface TargetChoiceDefinition {
  type: 'one-of';

  options: [
    TargetCriteriaDefinition,
    TargetCriteriaDefinition,
    ...TargetCriteriaDefinition[],
  ];
}

export type TargetDefinition = TargetCriteriaDefinition | TargetChoiceDefinition;

export interface MovementDefinition {
  distance: DistanceDefinition;

  directions?: Array<'horizontal' | 'vertical'>;

  directionChoice?: 'any';

  destination?: 'visible-unoccupied-space';
}

export interface SavingThrowDefinition {
  ability: AbilityKey;

  dc: AbilityFormulaDefinition;

  onFailure?: MechanicalEffectChoiceDefinition | MechanicalEffect[];
}

export interface MechanicalEffectChoiceOption {
  id: string;

  effects: MechanicalEffect[];
}

export interface MechanicalEffectChoiceDefinition {
  type: 'one-of';

  options: [
    MechanicalEffectChoiceOption,
    MechanicalEffectChoiceOption,
    ...MechanicalEffectChoiceOption[],
  ];
}

export interface RuleMechanicDefinition {
  activation?: ActionType;

  trigger?: TriggerDefinition;

  range?: DistanceDefinition;

  target?: TargetDefinition;

  resourceCost?: ResourceCostDefinition;

  usage?: LimitedUseDefinition;

  limit?: UsageLimitDefinition;

  duration?: DurationDefinition;

  save?: SavingThrowDefinition;

  choices?: MechanicalEffectChoiceDefinition[];

}

export interface MechanicalEffect extends RuleMechanicDefinition {
  type: MechanicalEffectType;

  triggerFeatureId?: string;

  condition?: string;

  ability?: AbilityKey;

  abilityOptions?: AbilityKey[];

  savingThrowAbility?: AbilityKey;

  value?: number | string | boolean;

  progression?: MechanicalEffectLevelDefinition[];

  formula?: MechanicalFormulaDefinition;

  minimum?: number;

  damageType?: string;

  rollTypes?: RollType[];

  usesSameRoll?: boolean;

  mustUseNewRoll?: boolean;

  ignoresOriginalRange?: boolean;

  movement?: MovementDefinition;

  distance?: DistanceDefinition;

  conditionIds?: string[];

  cover?: 'half';

  components?: 'none';

  concentration?: boolean;

  eligibleObjectCategories?: string[];

  maximumPerObject?: number;

  proficiencyId?: string;

  spellId?: string;

  note?: LocalizedName;
}

export interface MechanicalEffectLevelDefinition {
  level: number;

  value: number | string | boolean;
}

export interface FeatureDefinition extends RuleCatalogMetadata, RuleMechanicDefinition {
  id: string;

  names: LocalizedName;

  origin: FeatureOrigin;

  sourceId: string;

  minimumLevel?: number;

  techniqueIds?: string[];

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

export interface ChoiceCountProgression {
  level: number;

  count: number;
}

export type ChoiceOptionType =
  | 'skill'
  | 'tool'
  | 'language'
  | 'fighting-style'
  | 'feature'
  | 'technique'
  | 'subclass'
  | 'asi'
  | 'feat'
  | 'spell'
  | 'saving-throw-proficiency'
  | 'other';

export interface DirectChoiceDefinition {
  id: string;

  type: ChoiceOptionType;

  minimumLevel?: number;

  condition?: string;

  count?: number;

  optionIds?: string[];

  countProgression?: ChoiceCountProgression[];

  replacement?: {
    trigger: 'class-level-gained';

    classId: string;

    count: number;
  };
}

export interface AlternativeChoiceDefinition {
  id: string;

  type: 'one-of';

  count?: number;

  optionTypes: [ChoiceOptionType, ChoiceOptionType, ...ChoiceOptionType[]];

  choices?: [DirectChoiceDefinition, DirectChoiceDefinition, ...DirectChoiceDefinition[]];
}

export type ChoiceDefinition =
  | DirectChoiceDefinition
  | AlternativeChoiceDefinition;

export interface TechniqueDefinition extends RuleCatalogMetadata, RuleMechanicDefinition {
  id: string;

  names: LocalizedName;

  sourceId: string;

  minimumLevel?: number;

  school?: SpellSchool;

  requiresAttackRoll?: boolean;

  passiveEffects?: MechanicalEffect[];

  effects?: MechanicalEffect[];
}

export type ResourceRecovery =
  | 'short-rest'
  | 'long-rest'
  | 'short-or-long-rest'
  | 'dawn'
  | 'none';

export interface ResourceLevelDefinition {
  level: number;

  maximum: number | ResourceMaximumDefinition;

  dieSize?: number;
}

export interface AbilityModifierResourceMaximumDefinition {
  type: 'ability-modifier';

  ability: AbilityKey;

  minimum?: number;
}

export interface ProficiencyBonusResourceMaximumDefinition {
  type: 'proficiency-bonus';

  multiplier: number;

  minimum?: number;
}

export type ResourceMaximumDefinition =
  | AbilityModifierResourceMaximumDefinition
  | ProficiencyBonusResourceMaximumDefinition;

export interface ResourceRecoveryDefinition {
  amount: number | 'all';

  action?: ActionType;

  limitedUses?: {
    maximum: number;

    recovery: ResourceRecovery;
  };
}

export interface ResourceDefinition {
  id: string;

  names: LocalizedName;

  recovery: ResourceRecovery;

  additionalRecoveries?: ResourceRecoveryDefinition[];

  progression: ResourceLevelDefinition[];
}

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

export type KnownSpellLevelLimit = 'available-spell-slots';

export interface SpellcastingDefinition {
  ability: AbilityKey;

  preparationMode: SpellcastingPreparationMode;

  startsAtLevel: number;

  spellListId?: string;

  progression?: Partial<Record<number, SpellcastingLevelDefinition>>;

  slotRecovery?: ResourceRecovery;

  allowedSchools?: SpellSchool[];

  schoolRestrictionExceptionLevels?: number[];

  initialUnrestrictedSpells?: number;

  knownSpellReplacementsPerLevel?: number;

  preserveUnrestrictedSchoolChoiceOnReplacement?: boolean;

  knownSpellLevelLimit?: KnownSpellLevelLimit;

  saveDcFormula?: string;

  attackModifierFormula?: string;

  ritualCasting?: boolean;

  spellbook?: boolean;
}

export interface SpellcastingLevelDefinition {
  level: number;

  cantripsKnown?: number;

  spellsKnown?: number;

  spellSlots?: SpellSlotProgression;

  preparedSpellFormula?: string;
}

export interface ClassLevelDefinition extends SpellcastingLevelDefinition {
  proficiencyBonus: number;

  featureIds: string[];

  choices?: ChoiceDefinition[];
}

export interface ClassDefinition extends RuleCatalogMetadata {
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

export interface SubclassDefinition extends RuleCatalogMetadata {
  id: string;

  classId: string;

  names: LocalizedName;

  featureIds: string[];

  choices?: ChoiceDefinition[];

  resources?: ResourceDefinition[];

  spellIds?: string[];

  spellcasting?: SpellcastingDefinition;
}

export interface AncestryDefinition extends RuleCatalogMetadata {
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

export interface SubraceDefinition extends RuleCatalogMetadata {
  id: string;

  ancestryId: string;

  names: LocalizedName;

  abilityScoreRule?: AbilityScoreRule;

  traitIds: string[];
}

export interface LineageDefinition extends RuleCatalogMetadata {
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

export interface SpellDefinition extends RuleCatalogMetadata {
  id: string;

  names: LocalizedName;

  level: number;

  school: SpellSchool;

  ritual?: boolean;

  concentration?: boolean;

  classIds: string[];
}
