import type { Character } from '../types';
import { classes, skills, species } from '../data/gameData';
import { labelKey, useI18n } from '../i18n';
import {
  calculateAbilityModifier, calculateAttackBonus, calculateDamageBonus, calculateHitPoints,
  calculateInitiative, calculateProficiencyBonus, calculateSavingThrow, calculateSkillFor,
} from '../rules/calculations';

const signed = (value: number) => value >= 0 ? `+${value}` : String(value);

export function CharacterSheet({ character }: { character: Character }) {
  const { t } = useI18n();
  const characterClass = classes.find((item) => item.id === character.classId) ?? classes[0];
  return <article className="sheet">
    <header><div>{character.portrait ? <img className="sheet-portrait" src={character.portrait} alt={t('portrait.title')} /> : <div className="portrait-empty">✦</div>}<div><small>{t('sheet.title')}</small><h2>{character.name || t('sheet.unnamed')}</h2><p>{t(labelKey('class', characterClass.id))} · {t('common.level')} {character.level} · {t(labelKey('species', character.speciesId))}</p></div></div></header>
    <div className="vitals"><b><span>{t('sheet.hp')}</span>{calculateHitPoints(characterClass, character.level, character.abilities.constitution, character.hpMode, character.manualHp)}</b><b><span>{t('sheet.ac')}</span>{character.armorClass}</b><b><span>{t('sheet.initiative')}</span>{signed(calculateInitiative(character.abilities))}</b><b><span>{t('sheet.proficiency')}</span>{signed(calculateProficiencyBonus(character.level))}</b></div>
    <section className="ability-grid">{Object.entries(character.abilities).map(([key, value]) => <div key={key}><span>{t(labelKey('ability', key)).slice(0, 3).toUpperCase()}</span><strong>{signed(calculateAbilityModifier(value))}</strong><small>{value}</small></div>)}</section>
    <section><h3>{t('sheet.saves')}</h3><div className="save-grid">{Object.entries(character.abilities).map(([key, value]) => { const proficient = characterClass.savingThrows.includes(key as keyof typeof character.abilities); return <p className={proficient ? 'trained' : ''} key={key}><span>{proficient ? '◆' : '◇'} {t(labelKey('ability', key))}</span><b>{signed(calculateSavingThrow(value, character.level, proficient))}</b></p>; })}</div></section>
    <div className="sheet-columns"><section><h3>{t('sheet.skills')}</h3>{skills.map((skill) => <p key={skill.id} className={character.proficientSkills.includes(skill.id) ? 'trained' : ''}><span>{character.expertiseSkills.includes(skill.id) ? '✦' : character.proficientSkills.includes(skill.id) ? '◆' : '◇'} {t(labelKey('skill', skill.id))}</span><b>{signed(calculateSkillFor(skill, character.abilities, character.level, character.proficientSkills, character.expertiseSkills))}</b></p>)}</section>
      <section><h3>{t('sheet.attacks')}</h3>{character.attacks.map((attack) => <p key={attack.id}><span>{attack.name}</span><b>{signed(calculateAttackBonus(attack, character.abilities, character.level))} · {attack.damageDice} {signed(calculateDamageBonus(attack, character.abilities))}</b></p>)}<h3>{t('sheet.equipment')}</h3>{character.equipment.map((item) => <p key={item.id}>{item.quantity}× {item.name}</p>)}{character.spells.length > 0 && <><h3>{t('sheet.spells')}</h3>{character.spells.map((item) => <p key={item.id}>{item.name} <small>{t('common.level')} {item.level}</small></p>)}</>}</section>
    </div>{character.notes && <section><h3>{t('sheet.notes')}</h3><p>{character.notes === 'preset.notes' ? t('preset.notes') : character.notes}</p></section>}
  </article>;
}
