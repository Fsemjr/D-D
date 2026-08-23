import { jsPDF } from 'jspdf';
import type { Character } from '../types';
import { classes, skills, species } from '../data/gameData';
import { labelKey, translate, type Locale } from '../i18n';
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

export const createPdfTranslator = (locale: Locale) =>
  (key: Parameters<typeof translate>[1], values?: Record<string, string | number>) =>
    translate(locale, key, values);

export const exportCharacterPdf = (character: Character, locale: Locale = 'pt-BR') => {
  const t = createPdfTranslator(locale);
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
  document.text(character.name || t('sheet.unnamed'), left, y, { maxWidth: 138 });
  y += 10;
  document.setTextColor(25);
  paragraph(`${t(labelKey('class', characterClass.id))} ${character.level} • ${race ? t(labelKey('species', race.id)) : ''} • ${t('sheet.proficiency')} ${signed(calculateProficiencyBonus(character.level))}`);
  paragraph(`${t('sheet.hp')} ${calculateHitPoints(characterClass, character.level, character.abilities.constitution, character.hpMode, character.manualHp)} | ${t('sheet.ac')} ${character.armorClass} | ${t('sheet.initiative')} ${signed(calculateInitiative(character.abilities))}`);
  y += 3;

  heading(t('steps.abilities'));
  Object.entries(character.abilities).forEach(([key, value]) => paragraph(`${t(labelKey('ability', key))}: ${value} (${signed(calculateAbilityModifier(value))})`));
  heading(t('sheet.saves'));
  Object.entries(character.abilities).forEach(([key, value]) => {
    const proficient = characterClass.savingThrows.includes(key as keyof typeof character.abilities);
    paragraph(`${proficient ? '◆' : '◇'} ${t(labelKey('ability', key))}: ${signed(calculateSavingThrow(value, character.level, proficient))}`);
  });
  heading(t('sheet.skills'));
  skills.forEach((skill) => paragraph(`${character.expertiseSkills.includes(skill.id) ? '✦' : character.proficientSkills.includes(skill.id) ? '◆' : '◇'} ${t(labelKey('skill', skill.id))}: ${signed(calculateSkillFor(skill, character.abilities, character.level, character.proficientSkills, character.expertiseSkills))}`));
  heading(t('sheet.attacks'));
  character.attacks.forEach((attack) => paragraph(`${attack.name}: ${t('sheet.attack')} ${signed(calculateAttackBonus(attack, character.abilities, character.level))} • ${t('sheet.damage')} ${attack.damageDice} ${signed(calculateDamageBonus(attack, character.abilities))}`));
  heading(t('sheet.equipment'));
  character.equipment.forEach((item) => paragraph(`${item.quantity}× ${item.name}`));
  if (character.spells.length) { heading(t('sheet.spells')); character.spells.forEach((item) => paragraph(`${item.name} (${t('common.level')} ${item.level})`)); }
  if (character.features.length) { heading(t('sheet.features')); character.features.forEach((feature) => paragraph(feature.startsWith('preset.') ? t(feature as Parameters<typeof translate>[1]) : feature)); }
  if (character.notes) { heading(t('sheet.notes')); paragraph(character.notes === 'preset.notes' ? t('preset.notes') : character.notes); }
  document.save(`${(character.name || 'personagem').replace(/\s+/g, '-').toLowerCase()}.pdf`);
};
