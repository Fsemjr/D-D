import { describe, expect, it } from 'vitest';
import {
  fighterBattleMasterSubclass,
  fighterChampionSubclass,
  fighterClass,
  getRuleSummary,
  hasTag,
  matchesCatalogQuery,
} from '.';
import type {
  CatalogRule,
  RuleCatalogMetadata,
  RuleSourceMetadata,
} from '.';
import {
  getRuleSummary as getRuleSummaryDirect,
  hasTag as hasTagDirect,
  matchesCatalogQuery as matchesCatalogQueryDirect,
} from './catalog';

const compendiumBookId = 'jvf-classes-subclasses-compendium';
const catalogRules: CatalogRule[] = [
  fighterClass,
  fighterChampionSubclass,
  fighterBattleMasterSubclass,
];

describe('rules-data catalog metadata', () => {
  it.each(catalogRules)('$id has a valid project compendium source', (rule) => {
    expect(rule.source).toEqual({ bookId: compendiumBookId });
    expect(rule.source?.bookId.trim()).toBe(compendiumBookId);
  });

  it.each(catalogRules)('$id has short summaries in both supported locales', (rule) => {
    expect(getRuleSummary(rule, 'pt-BR')?.trim()).not.toBe('');
    expect(getRuleSummary(rule, 'en-US')?.trim()).not.toBe('');
  });

  it.each(catalogRules)('$id has unique, stable tag IDs', (rule) => {
    const tags = rule.tags ?? [];

    expect(tags.length).toBeGreaterThan(0);
    expect(new Set(tags).size).toBe(tags.length);
    expect(tags.every((tag) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(tag))).toBe(true);
  });
});

describe('rules-data catalog helpers', () => {
  it.each([
    ['id', 'fighter'],
    ['English name', 'Fighter'],
    ['Portuguese name', 'Guerreiro'],
    ['summary', 'broad feat progression'],
    ['tag', 'weapon-focused'],
  ])('finds Fighter by %s', (_field, query) => {
    expect(matchesCatalogQuery(fighterClass, query)).toBe(true);
  });

  it('finds Champion across its catalog fields', () => {
    expect(matchesCatalogQuery(fighterChampionSubclass, 'Champion')).toBe(true);
    expect(matchesCatalogQuery(fighterChampionSubclass, 'golpes críticos')).toBe(true);
    expect(matchesCatalogQuery(fighterChampionSubclass, 'passive-features')).toBe(true);
  });

  it('finds Battle Master across its catalog fields', () => {
    expect(matchesCatalogQuery(fighterBattleMasterSubclass, 'fighter-battle-master')).toBe(true);
    expect(matchesCatalogQuery(fighterBattleMasterSubclass, 'Mestre de Batalha')).toBe(true);
    expect(matchesCatalogQuery(fighterBattleMasterSubclass, 'superiority dice')).toBe(true);
    expect(matchesCatalogQuery(fighterBattleMasterSubclass, 'maneuvers')).toBe(true);
  });

  it('is case-insensitive', () => {
    expect(matchesCatalogQuery(fighterClass, 'fIgHtEr')).toBe(true);
    expect(hasTag(fighterBattleMasterSubclass, 'TACTICAL')).toBe(true);
  });

  it('ignores surrounding query and tag whitespace', () => {
    expect(matchesCatalogQuery(fighterClass, '  Guerreiro  ')).toBe(true);
    expect(hasTag(fighterClass, '  martial  ')).toBe(true);
  });

  it('does not return an obvious false positive', () => {
    expect(catalogRules.some((rule) => matchesCatalogQuery(rule, 'wizard spellbook'))).toBe(false);
  });

  it('treats an empty trimmed query as an unfiltered match', () => {
    expect(matchesCatalogQuery(fighterClass, '   ')).toBe(true);
  });

  it('returns undefined when a summary is absent', () => {
    expect(getRuleSummary({}, 'pt-BR')).toBeUndefined();
  });

  it('does not mutate its input objects', () => {
    const before = JSON.stringify(catalogRules);

    for (const rule of catalogRules) {
      getRuleSummary(rule, 'pt-BR');
      hasTag(rule, 'martial');
      matchesCatalogQuery(rule, 'fighter');
    }

    expect(JSON.stringify(catalogRules)).toBe(before);
  });

  it('exports catalog helpers and types from the public barrel', () => {
    const sourceFromPublicType: RuleSourceMetadata = { bookId: compendiumBookId };
    const metadataFromPublicType: RuleCatalogMetadata = { source: sourceFromPublicType };

    expect(metadataFromPublicType.source).toBe(sourceFromPublicType);
    expect(getRuleSummary).toBe(getRuleSummaryDirect);
    expect(hasTag).toBe(hasTagDirect);
    expect(matchesCatalogQuery).toBe(matchesCatalogQueryDirect);
  });
});
