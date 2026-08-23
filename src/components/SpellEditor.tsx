import type { Spell } from '../types';
import { useI18n } from '../i18n';

export function SpellEditor({ spells, onChange }: { spells: Spell[]; onChange: (spells: Spell[]) => void }) { const {tr}=useI18n();
  const update = (index: number, patch: Partial<Spell>) => onChange(spells.map((item, position) => position === index ? { ...item, ...patch } : item));
  return <fieldset className="collection-editor"><legend>{tr('Magias')}</legend>
    {spells.map((item, index) => <div className="collection-row spell-row" key={item.id}>
      <label>{tr('Nome')}<input value={item.name} onChange={(event) => update(index, { name: event.target.value })} /></label>
      <label>{tr('Nível')}<input type="number" min="0" max="9" value={item.level} onChange={(event) => update(index, { level: Number(event.target.value) })} /></label>
      <button className="danger" type="button" onClick={() => onChange(spells.filter((_, position) => position !== index))}>{tr('Remover')}</button>
    </div>)}
    <button type="button" onClick={() => onChange([...spells, { id: crypto.randomUUID(), name: tr('Nova magia'), level: 1 }])}>+ {tr('Adicionar magia')}</button>
  </fieldset>;
}
