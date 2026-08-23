import { beforeEach, describe, expect, it } from 'vitest';
import type { Character } from '../types';
import { loadCharacters, migrateCharacter } from './characters';

const KEY = 'forja-herois:characters:v1';
const values = new Map<string, string>();

beforeEach(() => {
  values.clear();
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value),
    },
  });
});

describe('migração da biblioteca local', () => {
  it('tolera campos de perícia e atributos comprados ausentes', () => {
    const legacy = {
      id: 'legacy',
      name: 'Herói antigo',
      abilities: { strength: 15, dexterity: 14, constitution: 13, intelligence: 12, wisdom: 10, charisma: 8 },
    } as unknown as Character;

    const migrated = migrateCharacter(legacy);
    expect(migrated.proficientSkills).toEqual([]);
    expect(migrated.expertiseSkills).toEqual([]);
    expect(migrated.purchasedAbilities).toEqual(legacy.abilities);
    expect(migrated.purchasedAbilities).not.toBe(legacy.abilities);
  });

  it('remove apenas Expertises sem proficiência', () => {
    const legacy = {
      proficientSkills: ['stealth'],
      expertiseSkills: ['stealth', 'arcana'],
      abilities: {},
    } as unknown as Character;
    expect(migrateCharacter(legacy).expertiseSkills).toEqual(['stealth']);
  });

  it('preserva registros válidos quando a lista contém entradas inválidas', () => {
    values.set(KEY, JSON.stringify([
      null,
      'inválido',
      { id: 'one', name: 'Primeiro', abilities: {}, proficientSkills: [] },
      { id: 'two', name: 'Segundo', abilities: {}, expertiseSkills: [] },
    ]));

    expect(loadCharacters().map((character) => character.id)).toEqual(['one', 'two']);
  });

  it('retorna uma lista vazia apenas quando o JSON inteiro é inválido', () => {
    values.set(KEY, '{json quebrado');
    expect(loadCharacters()).toEqual([]);
  });
});
