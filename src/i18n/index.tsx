import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { ptBR } from './ptBR';
import { enUS } from './enUS';

export type Locale = 'pt-BR' | 'en-US';
export type MessageKey = keyof typeof ptBR;
export type Translate = (key: MessageKey, values?: Record<string, string | number>) => string;

const STORAGE_KEY = 'forja-herois:locale';
const dictionaries: Record<Locale, Record<MessageKey, string>> = { 'pt-BR': ptBR, 'en-US': enUS };

export const resolveInitialLocale = (stored?: string | null, browserLanguage?: string): Locale => {
  if (stored === 'pt-BR' || stored === 'en-US') return stored;
  return browserLanguage?.toLowerCase().startsWith('en') ? 'en-US' : 'pt-BR';
};

export const translate = (locale: Locale, key: MessageKey, values: Record<string, string | number> = {}): string => {
  const message = dictionaries[locale][key] ?? dictionaries['pt-BR'][key] ?? key;
  return Object.entries(values).reduce((result, [name, value]) => result.replaceAll(`{${name}}`, String(value)), message);
};

export const persistLocale = (storage: Pick<Storage, 'setItem'>, locale: Locale) => storage.setItem(STORAGE_KEY, locale);

interface I18nValue { locale: Locale; setLocale: (locale: Locale) => void; t: Translate }
const I18nContext = createContext<I18nValue | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, updateLocale] = useState<Locale>(() => resolveInitialLocale(localStorage.getItem(STORAGE_KEY), navigator.language));
  useEffect(() => { document.documentElement.lang = locale; }, [locale]);
  const value = useMemo<I18nValue>(() => ({
    locale,
    setLocale: (next) => { persistLocale(localStorage, next); updateLocale(next); },
    t: (key, values) => translate(locale, key, values),
  }), [locale]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export const useI18n = () => {
  const value = useContext(I18nContext);
  if (!value) throw new Error('useI18n must be used inside I18nProvider');
  return value;
};

export const labelKey = (group: 'ability'|'class'|'species'|'skill', id: string) => `${group}.${id}` as MessageKey;
