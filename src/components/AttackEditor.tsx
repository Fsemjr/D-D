import type { AbilityKey, Attack } from '../types';
import { useI18n } from '../i18n';
import { abilityLabels } from '../data/gameData';

interface Props { attacks: Attack[]; onChange: (attacks: Attack[]) => void }

export function AttackEditor({ attacks, onChange }: Props) { const {tr,name}=useI18n();
  const update = (index: number, patch: Partial<Attack>) =>
    onChange(attacks.map((attack, position) => position === index ? { ...attack, ...patch } : attack));
  const optionalNumber = (value: string) => value === '' ? undefined : Number(value);
  return <fieldset className="collection-editor"><legend>{tr('Ataques')}</legend>
    {attacks.map((attack, index) => <div className="collection-row attack-row" key={attack.id}>
      <label>{tr('Nome')}<input value={attack.name} onChange={(event) => update(index, { name: event.target.value })} /></label>
      <label>{tr('Dano')}<input value={attack.damageDice} onChange={(event) => update(index, { damageDice: event.target.value })} /></label>
      <label>{tr('Atributo')}<select value={attack.ability} onChange={(event) => update(index, { ability: event.target.value as AbilityKey })}>{Object.entries(abilityLabels).map(([key, label]) => <option key={key} value={key}>{name(key,label)}</option>)}</select></label>
      <label className="inline-check"><input type="checkbox" checked={attack.proficient} onChange={(event) => update(index, { proficient: event.target.checked })} /> {tr('Proficiente')}</label>
      <label>{tr('Bônus de ataque')}<input type="number" placeholder={tr('Auto')} value={attack.attackBonusOverride ?? ''} onChange={(event) => update(index, { attackBonusOverride: optionalNumber(event.target.value) })} /></label>
      <label>{tr('Bônus de dano')}<input type="number" placeholder={tr('Auto')} value={attack.damageBonusOverride ?? ''} onChange={(event) => update(index, { damageBonusOverride: optionalNumber(event.target.value) })} /></label>
      <button className="danger" type="button" onClick={() => onChange(attacks.filter((_, position) => position !== index))}>{tr('Remover')}</button>
    </div>)}
    <button type="button" onClick={() => onChange([...attacks, { id: crypto.randomUUID(), name: tr('Nova arma'), damageDice: '1d6', ability: 'strength', proficient: true }])}>+ {tr('Adicionar ataque')}</button>
  </fieldset>;
}
