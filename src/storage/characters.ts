import type { Character } from '../types';

const KEY = 'forja-herois:characters:v1';

const migrateCharacter = (character: Character): Character => ({
  ...character,
  purchasedAbilities: character.purchasedAbilities ?? { ...character.abilities },
  expertiseSkills: character.expertiseSkills.filter((skill) => character.proficientSkills.includes(skill)),
});

export const loadCharacters = (): Character[] => {
  try {
    return (JSON.parse(localStorage.getItem(KEY) ?? '[]') as Character[]).map(migrateCharacter);
  } catch {
    return [];
  }
};

export const saveCharacters = (characters: Character[]) =>
  localStorage.setItem(KEY, JSON.stringify(characters));

export const duplicateCharacter = (character: Character): Character => ({
  ...structuredClone(character),
  id: crypto.randomUUID(),
  name: `${character.name} (cópia)`,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});
