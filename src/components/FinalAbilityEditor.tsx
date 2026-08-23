import type { AbilityKey, AbilityScores } from '../types';
import { useI18n } from '../i18n';
import { abilityLabels } from '../data/gameData';

export function FinalAbilityEditor({ scores, onChange }: { scores: AbilityScores; onChange: (scores: AbilityScores) => void }) { const {tr,name}=useI18n();
  return <section className="final-scores"><h3>{tr('Atributos finais')}</h3><p>{tr('Inclua aqui bônus de espécie, background, talentos e ASI. Estes valores não alteram o Point Buy.')}</p><div className="custom-grid">{Object.entries(scores).map(([ability, score]) => <label key={ability}>{name(ability,abilityLabels[ability])}<input type="number" min="1" max="30" value={score} onChange={(event) => onChange({ ...scores, [ability as AbilityKey]: Number(event.target.value) })} /></label>)}</div></section>;
}
