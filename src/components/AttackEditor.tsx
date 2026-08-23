import type { AbilityKey, Attack } from '../types';
import { labelKey, useI18n } from '../i18n';

interface Props { attacks: Attack[]; onChange: (attacks: Attack[]) => void }

export function AttackEditor({ attacks, onChange }: Props) {
  const { t } = useI18n();
  const update = (index: number, patch: Partial<Attack>) =>
    onChange(attacks.map((attack, position) => position === index ? { ...attack, ...patch } : attack));
  const optionalNumber = (value: string) => value === '' ? undefined : Number(value);
  return <fieldset className="collection-editor"><legend>{t('attack.title')}</legend>
    {attacks.map((attack, index) => <div className="collection-row attack-row" key={attack.id}>
      <label>{t('attack.name')}<input value={attack.name} onChange={(event) => update(index, { name: event.target.value })} /></label>
      <label>{t('attack.damageDie')}<input value={attack.damageDice} onChange={(event) => update(index, { damageDice: event.target.value })} /></label>
      <label>{t('attack.ability')}<select value={attack.ability} onChange={(event) => update(index, { ability: event.target.value as AbilityKey })}>{(['strength','dexterity','constitution','intelligence','wisdom','charisma'] as AbilityKey[]).map((key) => <option key={key} value={key}>{t(labelKey('ability', key))}</option>)}</select></label>
      <label className="inline-check"><input type="checkbox" checked={attack.proficient} onChange={(event) => update(index, { proficient: event.target.checked })} /> {t('attack.proficient')}</label>
      <label>{t('attack.attackBonus')}<input type="number" placeholder={t('common.auto')} value={attack.attackBonusOverride ?? ''} onChange={(event) => update(index, { attackBonusOverride: optionalNumber(event.target.value) })} /></label>
      <label>{t('attack.damageBonus')}<input type="number" placeholder={t('common.auto')} value={attack.damageBonusOverride ?? ''} onChange={(event) => update(index, { damageBonusOverride: optionalNumber(event.target.value) })} /></label>
      <button className="danger" type="button" onClick={() => onChange(attacks.filter((_, position) => position !== index))}>{t('common.remove')}</button>
    </div>)}
    <button type="button" onClick={() => onChange([...attacks, { id: crypto.randomUUID(), name: t('attack.new'), damageDice: '1d6', ability: 'strength', proficient: true }])}>+ {t('attack.add')}</button>
  </fieldset>;
}
