import { describe, expect, it } from 'vitest';
import { labelKey, persistLocale, resolveInitialLocale, translate, type MessageKey } from './index';
import { presets } from '../presets';

describe('i18n', () => {
  it('usa pt-BR por padrão e detecta navegadores em inglês', () => {
    expect(resolveInitialLocale(null, 'pt-PT')).toBe('pt-BR');
    expect(resolveInitialLocale(null, 'en-GB')).toBe('en-US');
  });
  it('prioriza e preserva a seleção armazenada', () => {
    expect(resolveInitialLocale('en-US', 'pt-BR')).toBe('en-US');
    expect(resolveInitialLocale('pt-BR', 'en-US')).toBe('pt-BR');
  });
  it('persiste o idioma selecionado', () => {
    const values = new Map<string, string>();
    persistLocale({ setItem: (key, value) => values.set(key, value) }, 'en-US');
    expect(values.get('forja-herois:locale')).toBe('en-US');
  });
  it('traduz labels principais nos dois idiomas', () => {
    expect(translate('pt-BR', 'home.create')).toBe('Criar personagem');
    expect(translate('en-US', 'home.create')).toBe('Create character');
    expect(translate('en-US', labelKey('class', 'fighter'))).toBe('Fighter');
    expect(translate('en-US', labelKey('skill', 'stealth'))).toBe('Stealth');
  });
  it('faz fallback seguro para a própria chave', () => {
    expect(translate('en-US', 'missing.key' as MessageKey)).toBe('missing.key');
  });
  it('possui traduções para os textos de todos os presets', () => {
    for (const preset of presets) {
      expect(translate('pt-BR', preset.roleKey)).not.toBe(preset.roleKey);
      expect(translate('en-US', preset.roleKey)).not.toBe(preset.roleKey);
      expect(translate('en-US', 'preset.ready', { role: translate('en-US', preset.roleKey) })).toContain('level 5');
    }
  });
});
