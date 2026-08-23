import { describe, expect, it } from 'vitest';
import type {
  AbilityScoreRule,
  AncestryDefinition,
  ClassDefinition,
  TraitDefinition,
} from './types';
import {
  isValidAbilityScoreRule,
  isValidAncestryDefinition,
  isValidClassDefinition,
  isValidClassLevel,
  isValidSpellLevel,
} from './validation';

const classWithoutMagic: ClassDefinition = {
  id: 'warrior',
  names: { 'pt-BR': 'Guerreiro', 'en-US': 'Warrior' },
  hitDie: 10,
  primaryAbilities: ['strength'],
  savingThrows: ['strength', 'constitution'],
  subclassIds: [],
  progression: {
    1: { level: 1, proficiencyBonus: 2, featureIds: ['second-wind'] },
  },
};

const spellcastingClass: ClassDefinition = {
  id: 'mage',
  names: { 'pt-BR': 'Mago', 'en-US': 'Mage' },
  hitDie: 6,
  primaryAbilities: ['intelligence'],
  savingThrows: ['intelligence', 'wisdom'],
  subclassLevel: 2,
  subclassIds: ['evoker'],
  progression: {
    1: {
      level: 1,
      proficiencyBonus: 2,
      featureIds: ['spellcasting'],
      cantripsKnown: 3,
      spellSlots: { 1: 2 },
    },
  },
  spellcasting: {
    ability: 'intelligence',
    preparationMode: 'spellbook',
    startsAtLevel: 1,
    ritualCasting: true,
    spellbook: true,
  },
};

const levelThreeTrait: TraitDefinition = {
  id: 'ancestral-step',
  names: { 'pt-BR': 'Passo Ancestral', 'en-US': 'Ancestral Step' },
  minimumLevel: 3,
  effects: [{ type: 'informational' }],
};

const fixedAbilityBonus: AbilityScoreRule = {
  type: 'fixed',
  bonuses: { constitution: 2, wisdom: 1 },
};

const flexibleTwoOneBonus: AbilityScoreRule = { type: 'flexible-2-1' };
const flexibleThreeOnesBonus: AbilityScoreRule = { type: 'flexible-1-1-1' };

const simpleAncestry: AncestryDefinition = {
  id: 'stonefolk',
  names: { 'pt-BR': 'Povo da Pedra', 'en-US': 'Stonefolk' },
  creatureType: 'humanoid',
  size: 'medium',
  walkingSpeed: 30,
  languages: ['common'],
  abilityScoreRule: fixedAbilityBonus,
  traitIds: [levelThreeTrait.id],
};

const ancestryWithSubrace: AncestryDefinition = {
  id: 'elf',
  names: { 'pt-BR': 'Elfo', 'en-US': 'Elf' },
  creatureType: 'humanoid',
  size: 'medium',
  walkingSpeed: 30,
  abilityScoreRule: flexibleTwoOneBonus,
  traitIds: ['darkvision'],
  subraceIds: ['high-elf'],
};

describe('rules-data level validation', () => {
  it('accepts only integer class levels from 1 through 20', () => {
    expect(isValidClassLevel(1)).toBe(true);
    expect(isValidClassLevel(20)).toBe(true);
    expect(isValidClassLevel(0)).toBe(false);
    expect(isValidClassLevel(21)).toBe(false);
    expect(isValidClassLevel(1.5)).toBe(false);
  });

  it('accepts only integer spell levels from 0 through 9', () => {
    expect(isValidSpellLevel(0)).toBe(true);
    expect(isValidSpellLevel(9)).toBe(true);
    expect(isValidSpellLevel(-1)).toBe(false);
    expect(isValidSpellLevel(10)).toBe(false);
    expect(isValidSpellLevel(2.5)).toBe(false);
  });
});

describe('AbilityScoreRule validation', () => {
  it.each([
    fixedAbilityBonus,
    flexibleTwoOneBonus,
    flexibleThreeOnesBonus,
  ])('accepts a supported ability bonus rule', (rule) => {
    expect(isValidAbilityScoreRule(rule)).toBe(true);
  });

  it('rejects malformed fixed bonuses and unknown variants', () => {
    expect(isValidAbilityScoreRule({ type: 'fixed', bonuses: {} })).toBe(false);
    expect(isValidAbilityScoreRule({ type: 'fixed', bonuses: { luck: 2 } })).toBe(false);
    expect(isValidAbilityScoreRule({ type: 'flexible-3' })).toBe(false);
  });
});

describe('ClassDefinition validation', () => {
  it('accepts a minimal class without magic', () => {
    expect(isValidClassDefinition(classWithoutMagic)).toBe(true);
  });

  it('accepts a spellcasting class', () => {
    expect(isValidClassDefinition(spellcastingClass)).toBe(true);
  });

  it('rejects a class with an invalid progression level', () => {
    expect(isValidClassDefinition({
      ...classWithoutMagic,
      progression: {
        1: { level: 21, proficiencyBonus: 2, featureIds: [] },
      },
    })).toBe(false);
  });
});

describe('AncestryDefinition validation', () => {
  it('accepts simple ancestries and ancestries with subraces', () => {
    expect(isValidAncestryDefinition(simpleAncestry)).toBe(true);
    expect(isValidAncestryDefinition(ancestryWithSubrace)).toBe(true);
  });

  it('supports a trait unlocked at level 3', () => {
    expect(simpleAncestry.traitIds).toContain(levelThreeTrait.id);
    expect(isValidClassLevel(levelThreeTrait.minimumLevel)).toBe(true);
  });

  it('also accepts the flexible +1/+1/+1 rule on an ancestry', () => {
    expect(isValidAncestryDefinition({
      ...simpleAncestry,
      abilityScoreRule: flexibleThreeOnesBonus,
    })).toBe(true);
  });

  it('rejects an ancestry with an invalid ability rule', () => {
    expect(isValidAncestryDefinition({
      ...simpleAncestry,
      abilityScoreRule: { type: 'fixed', bonuses: {} },
    })).toBe(false);
  });
});
