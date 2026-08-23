import type { RuleSet } from '../types';
import { useI18n } from '../i18n';
import { validateRuleSet } from '../rules/ruleSets';

export function CustomRuleSetEditor({ ruleSet, onChange }: { ruleSet: RuleSet; onChange: (ruleSet: RuleSet) => void }) {
  const { t } = useI18n();
  const updateRange = (minimumAbility: number, maximumAbility: number) => {
    const costTable = Object.fromEntries(Array.from({ length: Math.max(0, maximumAbility - minimumAbility + 1) }, (_, index) => { const score = minimumAbility + index; return [score, ruleSet.costTable[score] ?? index]; }));
    onChange({ ...ruleSet, minimumAbility, maximumAbility, costTable });
  };
  const errors = validateRuleSet(ruleSet);
  return <section className="custom-rules"><div className="custom-grid">
    <label>{t('custom.total')}<input type="number" min="0" value={ruleSet.totalPoints} onChange={(event) => onChange({ ...ruleSet, totalPoints: Number(event.target.value) })} /></label>
    <label>{t('custom.minimum')}<input type="number" value={ruleSet.minimumAbility} onChange={(event) => updateRange(Number(event.target.value), ruleSet.maximumAbility)} /></label>
    <label>{t('custom.maximum')}<input type="number" value={ruleSet.maximumAbility} onChange={(event) => updateRange(ruleSet.minimumAbility, Number(event.target.value))} /></label>
    <label>{t('custom.levelLimit')}<input type="number" min="1" max="20" value={ruleSet.levelLimit} onChange={(event) => onChange({ ...ruleSet, levelLimit: Number(event.target.value) })} /></label>
  </div><h3>{t('custom.costTable')}</h3><div className="cost-grid">{Object.entries(ruleSet.costTable).map(([score, cost]) => <label key={score}>{score}<input type="number" min="0" value={cost} onChange={(event) => onChange({ ...ruleSet, costTable: { ...ruleSet.costTable, [score]: Number(event.target.value) } })} /></label>)}</div>{errors.map((error, index) => <p className="error" key={`${error.code}-${error.score ?? index}`}>{t(`validation.${error.code}` as Parameters<typeof t>[0], error.score === undefined ? undefined : { score: error.score })}</p>)}</section>;
}
