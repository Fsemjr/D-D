import type { RuleSet } from '../types';
import { validateRuleSet } from '../rules/ruleSets';

export function CustomRuleSetEditor({ ruleSet, onChange }: { ruleSet: RuleSet; onChange: (ruleSet: RuleSet) => void }) {
  const updateRange = (minimumAbility: number, maximumAbility: number) => {
    const costTable = Object.fromEntries(Array.from({ length: Math.max(0, maximumAbility - minimumAbility + 1) }, (_, index) => {
      const score = minimumAbility + index;
      return [score, ruleSet.costTable[score] ?? index];
    }));
    onChange({ ...ruleSet, minimumAbility, maximumAbility, costTable });
  };
  const errors = validateRuleSet(ruleSet);
  return <section className="custom-rules">
    <div className="custom-grid">
      <label>Total de pontos<input type="number" min="0" value={ruleSet.totalPoints} onChange={(event) => onChange({ ...ruleSet, totalPoints: Number(event.target.value) })} /></label>
      <label>Atributo mínimo<input type="number" value={ruleSet.minimumAbility} onChange={(event) => updateRange(Number(event.target.value), ruleSet.maximumAbility)} /></label>
      <label>Atributo máximo<input type="number" value={ruleSet.maximumAbility} onChange={(event) => updateRange(ruleSet.minimumAbility, Number(event.target.value))} /></label>
      <label>Limite de nível<input type="number" min="1" max="20" value={ruleSet.levelLimit} onChange={(event) => onChange({ ...ruleSet, levelLimit: Number(event.target.value) })} /></label>
    </div>
    <h3>Tabela de custos</h3>
    <div className="cost-grid">{Object.entries(ruleSet.costTable).map(([score, cost]) => <label key={score}>{score}<input type="number" min="0" value={cost} onChange={(event) => onChange({ ...ruleSet, costTable: { ...ruleSet.costTable, [score]: Number(event.target.value) } })} /></label>)}</div>
    {errors.map((error) => <p className="error" key={error}>{error}</p>)}
  </section>;
}
