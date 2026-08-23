import { jsPDF } from 'jspdf';
import type { Character } from '../types';
import { gameName, translate, type Locale } from '../i18n';
import { abilityLabels, classes, skills, species } from '../data/gameData';
import {
  calculateAbilityModifier, calculateAttackBonus, calculateDamageBonus, calculateHitPoints,
  calculateInitiative, calculateProficiencyBonus, calculateSavingThrow, calculateSkillFor,
} from '../rules/calculations';

const signed = (value: number) => value >= 0 ? `+${value}` : String(value);

export type SupportedImageFormat = 'PNG' | 'JPEG' | 'WEBP';

export const detectImageFormat = (dataUrl: string): SupportedImageFormat | undefined => {
  const mime = /^data:image\/(png|jpeg|jpg|webp);/i.exec(dataUrl)?.[1]?.toLowerCase();
  if (mime === 'png') return 'PNG';
  if (mime === 'jpeg' || mime === 'jpg') return 'JPEG';
  if (mime === 'webp') return 'WEBP';
  return undefined;
};

type ImageDocument = Pick<jsPDF, 'addImage'>;

/** Adiciona somente formatos suportados e repassa o formato real ao jsPDF. */
export const addPortraitToPdf = (document: ImageDocument, dataUrl?: string): boolean => {
  if (!dataUrl) return false;
  const format = detectImageFormat(dataUrl);
  if (!format) return false;
  document.addImage(dataUrl, format, 158, 12, 38, 45, undefined, 'FAST');
  return true;
};

export const exportCharacterPdf = (character: Character, locale: Locale = 'pt-BR') => {
  const tr = (value: string) => translate(locale, value);
  const name = (id: string, fallback?: string) => gameName(locale, id, fallback);
  const document = new jsPDF();
  const characterClass = classes.find((item) => item.id === character.classId) ?? classes[0];
  const race = species.find((item) => item.id === character.speciesId);
  const left = 14;
  const width = 180;
  const bottom = 282;
  let y = 18;

  const ensureSpace = (height: number) => {
    if (y + height > bottom) { document.addPage(); y = 18; }
  };
  const heading = (value: string) => {
    ensureSpace(12);
    document.setTextColor(120, 72, 32);
    document.setFontSize(14);
    document.text(value, left, y);
    y += 7;
    document.setTextColor(25);
  };
  const paragraph = (value: string, indent = 0) => {
    document.setFontSize(10);
    const lines = document.splitTextToSize(value, width - indent) as string[];
    const height = Math.max(1, lines.length) * 5;
    ensureSpace(height);
    document.text(lines, left + indent, y);
    y += height;
  };

  addPortraitToPdf(document, character.portrait);
  document.setFontSize(24);
  document.setTextColor(92, 52, 24);
  document.text(character.name || tr('Herói sem nome'), left, y, { maxWidth: 138 });
  y += 10;
  document.setTextColor(25);
  paragraph(`${name(characterClass.id, characterClass.name)} ${character.level} • ${name(character.speciesId, race?.name)} • ${tr('Proficiência')} ${signed(calculateProficiencyBonus(character.level))}`);
  paragraph(`${tr('PV')} ${calculateHitPoints(characterClass, character.level, character.abilities.constitution, character.hpMode, character.manualHp)} | CA ${character.armorClass} | ${tr('Iniciativa')} ${signed(calculateInitiative(character.abilities))}`);
  y += 3;

  heading(tr('Atributos'));
  Object.entries(character.abilities).forEach(([key, value]) => paragraph(`${name(key, abilityLabels[key])}: ${value} (${signed(calculateAbilityModifier(value))})`));
  heading(tr('Salvaguardas'));
  Object.entries(character.abilities).forEach(([key, value]) => {
    const proficient = characterClass.savingThrows.includes(key as keyof typeof character.abilities);
    paragraph(`${proficient ? '◆' : '◇'} ${name(key, abilityLabels[key])}: ${signed(calculateSavingThrow(value, character.level, proficient))}`);
  });
  heading(tr('Perícias'));
  skills.forEach((skill) => paragraph(`${character.expertiseSkills.includes(skill.id) ? '✦' : character.proficientSkills.includes(skill.id) ? '◆' : '◇'} ${name(skill.id, skill.name)}: ${signed(calculateSkillFor(skill, character.abilities, character.level, character.proficientSkills, character.expertiseSkills))}`));
  heading(tr('Ataques'));
  character.attacks.forEach((attack) => paragraph(`${attack.name}: ${tr('ataque')} ${signed(calculateAttackBonus(attack, character.abilities, character.level))} • ${tr('dano')} ${attack.damageDice} ${signed(calculateDamageBonus(attack, character.abilities))}`));
  heading(tr('Equipamento'));
  character.equipment.forEach((item) => paragraph(`${item.quantity}× ${item.name}`));
  if (character.spells.length) { heading(tr('Magias')); character.spells.forEach((item) => paragraph(`${item.name} (${tr('nível')} ${item.level})`)); }
  if (character.features.length) { heading(tr('Recursos')); character.features.forEach((feature) => paragraph(feature)); }
  if (character.notes) { heading(tr('Anotações')); paragraph(character.notes); }
  document.save(`${(character.name || tr('personagem')).replace(/\s+/g, '-').toLowerCase()}.pdf`);
};
