import type { AbilityScores, Character } from '../types';

const KEY = 'forja-herois:characters:v1';

/**
 * Normaliza apenas os campos introduzidos em versões posteriores. Os demais
 * campos permanecem intactos para preservar o máximo possível do registro.
 */
export const migrateCharacter = (character: Character): Character => {
  const proficientSkills = Array.isArray(character.proficientSkills)
    ? character.proficientSkills
    : [];
  const legacyExpertise = Array.isArray(character.expertiseSkills)
    ? character.expertiseSkills
    : [];
  const abilities = character.abilities ?? ({} as AbilityScores);

  return {
    ...character,
    abilities,
    purchasedAbilities: character.purchasedAbilities
      ? { ...character.purchasedAbilities }
      : { ...abilities },
    proficientSkills,
    expertiseSkills: legacyExpertise.filter((skill) => proficientSkills.includes(skill)),
  };
};

export const loadCharacters = (): Character[] => {
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(KEY) ?? '[]');
    if (!Array.isArray(stored)) return [];

    return stored.flatMap((entry) => {
      if (!entry || typeof entry !== 'object') return [];
      try {
        return [migrateCharacter(entry as Character)];
      } catch {
        // Um registro corrompido não deve apagar os demais personagens válidos.
        return [];
      }
    });
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
