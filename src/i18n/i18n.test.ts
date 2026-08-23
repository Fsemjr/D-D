import { describe, expect, it } from 'vitest';
import { gameName, getStoredLocale, LANGUAGE_KEY, persistLocale, translate } from '.';

describe('internationalization', () => {
  it('translates interface and game data without changing internal IDs', () => {
    expect(translate('pt-BR', 'Criar personagem')).toBe('Criar personagem');
    expect(translate('en-US', 'Criar personagem')).toBe('Create character');
    expect(gameName('en-US', 'strength')).toBe('Strength');
    expect(gameName('pt-BR', 'strength')).toBe('Força');
  });
  it('defaults to Portuguese and restores a persisted supported language', () => {
    expect(getStoredLocale({ getItem: () => null })).toBe('pt-BR');
    expect(getStoredLocale({ getItem: () => 'en-US' })).toBe('en-US');
    expect(getStoredLocale({ getItem: () => 'unsupported' })).toBe('pt-BR');
  });
  it('persists the selected language', () => {
    const values = new Map<string,string>();
    persistLocale('en-US', { setItem: (key, value) => values.set(key, value) });
    expect(values.get(LANGUAGE_KEY)).toBe('en-US');
  });
});
