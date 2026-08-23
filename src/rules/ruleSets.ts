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

export type RuleSetErrorCode = 'total' | 'integerLimits' | 'range' | 'level' | 'cost';
export interface RuleSetValidationError { code: RuleSetErrorCode; score?: number }

export const validateRuleSet = (ruleSet: RuleSet): RuleSetValidationError[] => {
  const errors: RuleSetValidationError[] = [];
  if (!Number.isInteger(ruleSet.totalPoints) || ruleSet.totalPoints < 0) errors.push({ code: 'total' });
  if (!Number.isInteger(ruleSet.minimumAbility) || !Number.isInteger(ruleSet.maximumAbility)) errors.push({ code: 'integerLimits' });
  if (ruleSet.minimumAbility > ruleSet.maximumAbility) errors.push({ code: 'range' });
  if (!Number.isInteger(ruleSet.levelLimit) || ruleSet.levelLimit < 1 || ruleSet.levelLimit > 20) errors.push({ code: 'level' });
  for (let score = ruleSet.minimumAbility; score <= ruleSet.maximumAbility; score += 1) {
    const cost = ruleSet.costTable[score];
    if (!Number.isFinite(cost) || cost < 0) errors.push({ code: 'cost', score });
  }
  return errors;
};
