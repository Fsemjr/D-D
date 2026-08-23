import type { RuleSet } from '../types';

export const standardRuleSet: RuleSet = {
  id: 'standard',
  name: 'D&D 5e Standard',
  totalPoints: 27,
  minimumAbility: 8,
  maximumAbility: 15,
  costTable: { 8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9 },
  levelLimit: 20,
};

export const createCustomRuleSet = (
  totalPoints = 27,
  minimumAbility = 8,
  maximumAbility = 15,
): RuleSet => ({
  id: 'custom',
  name: 'Custom',
  totalPoints,
  minimumAbility,
  maximumAbility,
  costTable: Object.fromEntries(
    Array.from({ length: Math.max(0, maximumAbility - minimumAbility + 1) }, (_, index) => [
      minimumAbility + index,
      index,
    ]),
  ),
  levelLimit: 20,
  custom: true,
});

export const validateRuleSet = (ruleSet: RuleSet): string[] => {
  const errors: string[] = [];
  if (!Number.isInteger(ruleSet.totalPoints) || ruleSet.totalPoints < 0) errors.push('Total de pontos inválido.');
  if (!Number.isInteger(ruleSet.minimumAbility) || !Number.isInteger(ruleSet.maximumAbility)) errors.push('Limites devem ser inteiros.');
  if (ruleSet.minimumAbility > ruleSet.maximumAbility) errors.push('O mínimo não pode superar o máximo.');
  if (!Number.isInteger(ruleSet.levelLimit) || ruleSet.levelLimit < 1 || ruleSet.levelLimit > 20) errors.push('O limite de nível deve estar entre 1 e 20.');
  for (let score = ruleSet.minimumAbility; score <= ruleSet.maximumAbility; score += 1) {
    const cost = ruleSet.costTable[score];
    if (!Number.isFinite(cost) || cost < 0) errors.push(`Custo inválido para o atributo ${score}.`);
  }
  return errors;
};
