import type {
  Locale,
  LocalizedName,
  RuleCatalogMetadata,
} from './types';

export interface CatalogRule extends RuleCatalogMetadata {
  id: string;

  names: LocalizedName;
}

function normalizeCatalogText(value: string): string {
  return value.trim().toLocaleLowerCase('en-US');
}

export function getRuleSummary(
  rule: RuleCatalogMetadata,
  locale: Locale,
): string | undefined {
  return rule.summary?.[locale];
}

export function hasTag(rule: RuleCatalogMetadata, tag: string): boolean {
  const normalizedTag = normalizeCatalogText(tag);

  return normalizedTag.length > 0
    && (rule.tags?.some((candidate) => (
      normalizeCatalogText(candidate) === normalizedTag
    )) ?? false);
}

export function matchesCatalogQuery(rule: CatalogRule, query: string): boolean {
  const normalizedQuery = normalizeCatalogText(query);

  if (normalizedQuery.length === 0) {
    return true;
  }

  const searchableValues = [
    rule.id,
    ...Object.values(rule.names),
    ...Object.values(rule.summary ?? {}),
    ...(rule.tags ?? []),
  ];

  return searchableValues.some((value) => (
    normalizeCatalogText(value).includes(normalizedQuery)
  ));
}
