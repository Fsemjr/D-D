import type { AbilityKey, Attack } from '../types';
import { abilityLabels } from '../data/gameData';

interface Props { attacks: Attack[]; onChange: (attacks: Attack[]) => void }

export function AttackEditor({ attacks, onChange }: Props) {
  const update = (index: number, patch: Partial<Attack>) =>
    onChange(attacks.map((attack, position) => position === index ? { ...attack, ...patch } : attack));
  const optionalNumber = (value: string) => value === '' ? undefined : Number(value);
  return <fieldset className="collection-editor"><legend>Ataques</legend>
    {attacks.map((attack, index) => <div className="collection-row attack-row" key={attack.id}>
      <label>Nome<input value={attack.name} onChange={(event) => update(index, { name: event.target.value })} /></label>
      <label>Dano<input value={attack.damageDice} onChange={(event) => update(index, { damageDice: event.target.value })} /></label>
      <label>Atributo<select value={attack.ability} onChange={(event) => update(index, { ability: event.target.value as AbilityKey })}>{Object.entries(abilityLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label>
      <label className="inline-check"><input type="checkbox" checked={attack.proficient} onChange={(event) => update(index, { proficient: event.target.checked })} /> Proficiente</label>
      <label>Bônus de ataque<input type="number" placeholder="Auto" value={attack.attackBonusOverride ?? ''} onChange={(event) => update(index, { attackBonusOverride: optionalNumber(event.target.value) })} /></label>
      <label>Bônus de dano<input type="number" placeholder="Auto" value={attack.damageBonusOverride ?? ''} onChange={(event) => update(index, { damageBonusOverride: optionalNumber(event.target.value) })} /></label>
      <button className="danger" type="button" onClick={() => onChange(attacks.filter((_, position) => position !== index))}>Remover</button>
    </div>)}
    <button type="button" onClick={() => onChange([...attacks, { id: crypto.randomUUID(), name: 'Nova arma', damageDice: '1d6', ability: 'strength', proficient: true }])}>+ Adicionar ataque</button>
  </fieldset>;
}
