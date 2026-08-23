import type {
  AbilityScoreRule,
  AncestryDefinition,
  ClassDefinition,
  LocalizedName,
  SpellcastingDefinition,
} from './types';

const abilityKeys = new Set([
  'strength',
  'dexterity',
  'constitution',
  'intelligence',
  'wisdom',
  'charisma',
]);

const creatureTypes = new Set([
  'aberration',
  'beast',
  'celestial',
  'construct',
  'dragon',
  'elemental',
  'fey',
  'fiend',
  'giant',
  'humanoid',
  'monstrosity',
  'ooze',
  'plant',
  'undead',
]);

const characterSizes = new Set([
  'tiny',
  'small',
  'medium',
  'large',
  'variable',
]);

const preparationModes = new Set([
  'known',
  'prepared',
  'spellbook',
  'pact',
  'none',
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(isNonEmptyString);
}

function isAbilityKey(value: unknown): boolean {
  return typeof value === 'string' && abilityKeys.has(value);
}

function isAbilityKeyArray(value: unknown): boolean {
  return Array.isArray(value) && value.length > 0 && value.every(isAbilityKey);
}

function isLocalizedName(value: unknown): value is LocalizedName {
  return isRecord(value)
    && isNonEmptyString(value['pt-BR'])
    && isNonEmptyString(value['en-US']);
}

export function isValidClassLevel(level: unknown): level is number {
  return Number.isInteger(level) && Number(level) >= 1 && Number(level) <= 20;
}

export function isValidSpellLevel(level: unknown): level is number {
  return Number.isInteger(level) && Number(level) >= 0 && Number(level) <= 9;
}

export function isValidAbilityScoreRule(rule: unknown): rule is AbilityScoreRule {
  if (!isRecord(rule) || !isNonEmptyString(rule.type)) {
    return false;
  }

  if (rule.type === 'none' || rule.type === 'flexible-2-1' || rule.type === 'flexible-1-1-1') {
    return true;
  }

  if (rule.type !== 'fixed' || !isRecord(rule.bonuses)) {
    return false;
  }

  const bonuses = Object.entries(rule.bonuses);
  return bonuses.length > 0 && bonuses.every(([ability, bonus]) => (
    abilityKeys.has(ability)
    && Number.isInteger(bonus)
    && Number(bonus) > 0
  ));
}

function isValidSpellcasting(value: unknown): value is SpellcastingDefinition {
  return isRecord(value)
    && isAbilityKey(value.ability)
    && typeof value.preparationMode === 'string'
    && preparationModes.has(value.preparationMode)
    && isValidClassLevel(value.startsAtLevel)
    && (value.ritualCasting === undefined || typeof value.ritualCasting === 'boolean')
    && (value.spellbook === undefined || typeof value.spellbook === 'boolean');
}

function isValidClassProgression(value: unknown): boolean {
  if (!isRecord(value) || !Object.hasOwn(value, '1')) {
    return false;
  }

  return Object.entries(value).every(([levelKey, definition]) => {
    const level = Number(levelKey);
    return isValidClassLevel(level)
      && isRecord(definition)
      && definition.level === level
      && Number.isInteger(definition.proficiencyBonus)
      && Number(definition.proficiencyBonus) > 0
      && isStringArray(definition.featureIds);
  });
}

export function isValidClassDefinition(value: unknown): value is ClassDefinition {
  if (!isRecord(value)) {
    return false;
  }

  return isNonEmptyString(value.id)
    && isLocalizedName(value.names)
    && Number.isInteger(value.hitDie)
    && Number(value.hitDie) > 0
    && isAbilityKeyArray(value.primaryAbilities)
    && isAbilityKeyArray(value.savingThrows)
    && isStringArray(value.subclassIds)
    && isValidClassProgression(value.progression)
    && (value.subclassLevel === undefined || isValidClassLevel(value.subclassLevel))
    && (value.spellcasting === undefined || isValidSpellcasting(value.spellcasting));
}

export function isValidAncestryDefinition(value: unknown): value is AncestryDefinition {
  if (!isRecord(value)) {
    return false;
  }

  return isNonEmptyString(value.id)
    && isLocalizedName(value.names)
    && typeof value.creatureType === 'string'
    && creatureTypes.has(value.creatureType)
    && typeof value.size === 'string'
    && characterSizes.has(value.size)
    && Number.isInteger(value.walkingSpeed)
    && Number(value.walkingSpeed) >= 0
    && isStringArray(value.traitIds)
    && (value.languages === undefined || isStringArray(value.languages))
    && (value.subraceIds === undefined || isStringArray(value.subraceIds))
    && (value.abilityScoreRule === undefined || isValidAbilityScoreRule(value.abilityScoreRule));
}
