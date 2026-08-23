import type { Character } from '../types';
import { abilityLabels, classes, skills, species } from '../data/gameData';
import {
  calculateAbilityModifier, calculateAttackBonus, calculateDamageBonus, calculateHitPoints,
  calculateInitiative, calculateProficiencyBonus, calculateSavingThrow, calculateSkillFor,
} from '../rules/calculations';

const signed = (value: number) => value >= 0 ? `+${value}` : String(value);

export function CharacterSheet({ character }: { character: Character }) {
  const characterClass = classes.find((item) => item.id === character.classId) ?? classes[0];
  return <article className="sheet">
    <header><div>{character.portrait ? <img className="sheet-portrait" src={character.portrait} alt="Retrato" /> : <div className="portrait-empty">✦</div>}<div><small>FICHA DE AVENTUREIRO</small><h2>{character.name || 'Herói sem nome'}</h2><p>{characterClass.name} · Nível {character.level} · {species.find((item) => item.id === character.speciesId)?.name}</p></div></div></header>
    <div className="vitals"><b><span>PV</span>{calculateHitPoints(characterClass, character.level, character.abilities.constitution, character.hpMode, character.manualHp)}</b><b><span>CA</span>{character.armorClass}</b><b><span>INIC.</span>{signed(calculateInitiative(character.abilities))}</b><b><span>PROF.</span>{signed(calculateProficiencyBonus(character.level))}</b></div>
    <section className="ability-grid">{Object.entries(character.abilities).map(([key, value]) => <div key={key}><span>{abilityLabels[key].slice(0, 3).toUpperCase()}</span><strong>{signed(calculateAbilityModifier(value))}</strong><small>{value}</small></div>)}</section>
    <section><h3>Salvaguardas</h3><div className="save-grid">{Object.entries(character.abilities).map(([key, value]) => { const proficient = characterClass.savingThrows.includes(key as keyof typeof character.abilities); return <p className={proficient ? 'trained' : ''} key={key}><span>{proficient ? '◆' : '◇'} {abilityLabels[key]}</span><b>{signed(calculateSavingThrow(value, character.level, proficient))}</b></p>; })}</div></section>
    <div className="sheet-columns"><section><h3>Perícias</h3>{skills.map((skill) => <p key={skill.id} className={character.proficientSkills.includes(skill.id) ? 'trained' : ''}><span>{character.expertiseSkills.includes(skill.id) ? '✦' : character.proficientSkills.includes(skill.id) ? '◆' : '◇'} {skill.name}</span><b>{signed(calculateSkillFor(skill, character.abilities, character.level, character.proficientSkills, character.expertiseSkills))}</b></p>)}</section>
      <section><h3>Ataques</h3>{character.attacks.map((attack) => <p key={attack.id}><span>{attack.name}</span><b>{signed(calculateAttackBonus(attack, character.abilities, character.level))} · {attack.damageDice} {signed(calculateDamageBonus(attack, character.abilities))}</b></p>)}<h3>Equipamento</h3>{character.equipment.map((item) => <p key={item.id}>{item.quantity}× {item.name}</p>)}{character.spells.length > 0 && <><h3>Magias</h3>{character.spells.map((item) => <p key={item.id}>{item.name} <small>nv. {item.level}</small></p>)}</>}</section>
    </div>{character.notes && <section><h3>Anotações</h3><p>{character.notes}</p></section>}
  </article>;
}
