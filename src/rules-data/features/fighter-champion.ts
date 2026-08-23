import type { FeatureDefinition, MechanicalEffect } from '../types';

function informationalEffect(ptBR: string, enUS: string): MechanicalEffect[] {
  return [{
    type: 'informational',
    note: { 'pt-BR': ptBR, 'en-US': enUS },
  }];
}

export const fighterChampionFeatures: FeatureDefinition[] = [
  {
    id: 'fighter-champion-improved-critical',
    names: { 'pt-BR': 'Crítico Aprimorado', 'en-US': 'Improved Critical' },
    origin: 'subclass',
    sourceId: 'fighter-champion',
    minimumLevel: 3,
    effects: informationalEffect(
      'Ataques com armas também causam acerto crítico com resultado 19.',
      'Weapon attacks also score a critical hit on a roll of 19.',
    ),
  },
  {
    id: 'fighter-champion-remarkable-athlete',
    names: { 'pt-BR': 'Atleta Extraordinário', 'en-US': 'Remarkable Athlete' },
    origin: 'subclass',
    sourceId: 'fighter-champion',
    minimumLevel: 7,
    effects: informationalEffect(
      'Aprimora testes físicos sem proficiência e a distância de saltos correndo.',
      'Improves non-proficient physical checks and running jump distance.',
    ),
  },
  {
    id: 'fighter-champion-additional-fighting-style',
    names: {
      'pt-BR': 'Estilo de Luta Adicional',
      'en-US': 'Additional Fighting Style',
    },
    origin: 'subclass',
    sourceId: 'fighter-champion',
    minimumLevel: 10,
    effects: informationalEffect(
      'Concede uma segunda escolha de Estilo de Luta.',
      'Grants a second Fighting Style choice.',
    ),
  },
  {
    id: 'fighter-champion-superior-critical',
    names: { 'pt-BR': 'Crítico Superior', 'en-US': 'Superior Critical' },
    origin: 'subclass',
    sourceId: 'fighter-champion',
    minimumLevel: 15,
    effects: informationalEffect(
      'Ataques com armas também causam acerto crítico com resultado 18.',
      'Weapon attacks also score a critical hit on a roll of 18.',
    ),
  },
  {
    id: 'fighter-champion-survivor',
    names: { 'pt-BR': 'Sobrevivente', 'en-US': 'Survivor' },
    origin: 'subclass',
    sourceId: 'fighter-champion',
    minimumLevel: 18,
    effects: informationalEffect(
      'Recupera pontos de vida no início do turno quando está abaixo da metade dos PV.',
      'Recovers hit points at the start of the turn while below half hit points.',
    ),
  },
];
