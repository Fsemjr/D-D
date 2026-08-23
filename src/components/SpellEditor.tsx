import type { Spell } from '../types';

export function SpellEditor({ spells, onChange }: { spells: Spell[]; onChange: (spells: Spell[]) => void }) {
  const update = (index: number, patch: Partial<Spell>) => onChange(spells.map((item, position) => position === index ? { ...item, ...patch } : item));
  return <fieldset className="collection-editor"><legend>Magias</legend>
    {spells.map((item, index) => <div className="collection-row spell-row" key={item.id}>
      <label>Nome<input value={item.name} onChange={(event) => update(index, { name: event.target.value })} /></label>
      <label>Nível<input type="number" min="0" max="9" value={item.level} onChange={(event) => update(index, { level: Number(event.target.value) })} /></label>
      <button className="danger" type="button" onClick={() => onChange(spells.filter((_, position) => position !== index))}>Remover</button>
    </div>)}
    <button type="button" onClick={() => onChange([...spells, { id: crypto.randomUUID(), name: 'Nova magia', level: 1 }])}>+ Adicionar magia</button>
  </fieldset>;
}
