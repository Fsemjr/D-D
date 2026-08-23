import type { AbilityKey, AbilityScores } from '../types';
import { labelKey, useI18n } from '../i18n';

export function FinalAbilityEditor({ scores, onChange }: { scores: AbilityScores; onChange: (scores: AbilityScores) => void }) {
  const { t } = useI18n();
  return <section className="final-scores"><h3>{t('pointBuy.final')}</h3><p>{t('pointBuy.finalHelp')}</p><div className="custom-grid">{Object.entries(scores).map(([ability, score]) => <label key={ability}>{t(labelKey('ability', ability))}<input type="number" min="1" max="30" value={score} onChange={(event) => onChange({ ...scores, [ability as AbilityKey]: Number(event.target.value) })} /></label>)}</div></section>;
}
