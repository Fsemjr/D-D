import type { Spell } from '../types';
import { useI18n } from '../i18n';

export function SpellEditor({ spells, onChange }: { spells: Spell[]; onChange: (spells: Spell[]) => void }) {
  const { t } = useI18n();
  const update = (index: number, patch: Partial<Spell>) => onChange(spells.map((item, position) => position === index ? { ...item, ...patch } : item));
  return <fieldset className="collection-editor"><legend>{t('spell.title')}</legend>
    {spells.map((item, index) => <div className="collection-row spell-row" key={item.id}>
      <label>{t('spell.name')}<input value={item.name} onChange={(event) => update(index, { name: event.target.value })} /></label>
      <label>{t('spell.level')}<input type="number" min="0" max="9" value={item.level} onChange={(event) => update(index, { level: Number(event.target.value) })} /></label>
      <button className="danger" type="button" onClick={() => onChange(spells.filter((_, position) => position !== index))}>{t('common.remove')}</button>
    </div>)}
    <button type="button" onClick={() => onChange([...spells, { id: crypto.randomUUID(), name: t('spell.new'), level: 1 }])}>+ {t('spell.add')}</button>
  </fieldset>;
}
