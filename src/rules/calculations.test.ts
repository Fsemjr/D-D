import { describe, expect, it } from 'vitest';
import { presets } from '../presets';
import {
  calculateAbilityModifier, calculateAttackBonus, calculateDamageBonus, calculateHitPoints,
  calculatePointBuyCost, calculateProficiencyBonus, calculateSavingThrow, calculateSkillBonus,
  validatePointBuy,
} from './calculations';
import { createCustomRuleSet, standardRuleSet, validateRuleSet } from './ruleSets';

const scores = { strength: 15, dexterity: 14, constitution: 13, intelligence: 12, wisdom: 10, charisma: 8 };

describe('motor de regras', () => {
  it('calcula modificadores', () => {
    expect(calculateAbilityModifier(8)).toBe(-1);
    expect(calculateAbilityModifier(10)).toBe(0);
    expect(calculateAbilityModifier(15)).toBe(2);
  });
  it('calcula proficiência em todos os patamares', () => {
    expect([1, 5, 9, 13, 17].map(calculateProficiencyBonus)).toEqual([2, 3, 4, 5, 6]);
  });
  it('calcula e valida Point Buy', () => {
    expect(calculatePointBuyCost(scores, standardRuleSet)).toBe(27);
    expect(validatePointBuy(scores, standardRuleSet)).toMatchObject({ valid: true, remaining: 0 });
    expect(validatePointBuy({ ...scores, strength: 16 }, standardRuleSet).valid).toBe(false);
  });
  it('calcula perícia, proficiência e expertise', () => {
    expect(calculateSkillBonus(14, 5, false, false)).toBe(2);
    expect(calculateSkillBonus(14, 5, true)).toBe(5);
    expect(calculateSkillBonus(14, 5, true, true)).toBe(8);
    expect(calculateSkillBonus(14, 5, false, true)).toBe(2);
  });
  it('calcula salvaguardas proficientes e não proficientes', () => {
    expect(calculateSavingThrow(15, 5, true)).toBe(5);
    expect(calculateSavingThrow(15, 5, false)).toBe(2);
  });
  it('calcula ataques automáticos e respeita overrides inclusive zero', () => {
    const attack = { id: 'x', name: 'Arco', damageDice: '1d8', ability: 'dexterity' as const, proficient: true };
    expect(calculateAttackBonus(attack, scores, 5)).toBe(5);
    expect(calculateDamageBonus(attack, scores)).toBe(2);
    expect(calculateAttackBonus({ ...attack, attackBonusOverride: 0 }, scores, 5)).toBe(0);
    expect(calculateDamageBonus({ ...attack, damageBonusOverride: -1 }, scores)).toBe(-1);
  });
  it('calcula PV médio e permite valor manual', () => {
    const fighter = { id: 'fighter', name: 'Guerreiro', hitDie: 10, savingThrows: ['strength' as const] };
    expect(calculateHitPoints(fighter, 5, 14)).toBe(44);
    expect(calculateHitPoints(fighter, 5, 14, 'manual', 37)).toBe(37);
  });
});

describe('presets', () => {
  it.each(presets)('$title possui Point Buy válido separado dos atributos finais', (preset) => {
    expect(validatePointBuy(preset.character.purchasedAbilities, preset.character.ruleSet).valid).toBe(true);
    expect(preset.character.abilities).not.toBe(preset.character.purchasedAbilities);
  });
  it('Ladino só possui expertise em uma perícia proficiente', () => {
    const rogue = presets.find((preset) => preset.id === 'rogue')!;
    expect(rogue.character.expertiseSkills).toContain('stealth');
    expect(rogue.character.expertiseSkills.every((skill) => rogue.character.proficientSkills.includes(skill))).toBe(true);
  });
  it('declara níveis de magia explicitamente e corretamente', () => {
    const wizard = presets.find((preset) => preset.id === 'wizard')!;
    expect(wizard.character.spells.find((item) => item.name === 'Bola de Fogo')?.level).toBe(3);
    expect(presets.flatMap((preset) => preset.character.spells).every((item) => item.level >= 0 && item.level <= 9)).toBe(true);
  });
});

describe('RuleSet customizado', () => {
  it('aceita configuração consistente e usa sua tabela', () => {
    const custom = createCustomRuleSet(40, 6, 18);
    expect(validateRuleSet(custom)).toEqual([]);
    expect(Object.keys(custom.costTable)).toHaveLength(13);
  });
  it('rejeita limites, custos e nível inválidos', () => {
    const invalid = { ...createCustomRuleSet(), minimumAbility: 16, maximumAbility: 8, levelLimit: 21, costTable: {} };
    expect(validateRuleSet(invalid).length).toBeGreaterThan(0);
  });
});
