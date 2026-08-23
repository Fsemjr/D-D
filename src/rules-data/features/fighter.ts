import type { FeatureDefinition, MechanicalEffect } from '../types';

function informationalEffect(ptBR: string, enUS: string): MechanicalEffect[] {
  return [{
    type: 'informational',
    note: { 'pt-BR': ptBR, 'en-US': enUS },
  }];
}

export const fighterFeatureDefinitions: FeatureDefinition[] = [
  {
    id: 'fighter-fighting-style',
    names: { 'pt-BR': 'Estilo de Luta', 'en-US': 'Fighting Style' },
    origin: 'class',
    sourceId: 'fighter',
    minimumLevel: 1,
    effects: informationalEffect(
      'Escolha um estilo de luta disponível para o Guerreiro.',
      'Choose one fighting style available to the Fighter.',
    ),
  },
  {
    id: 'fighter-second-wind',
    names: { 'pt-BR': 'Segundo Fôlego', 'en-US': 'Second Wind' },
    origin: 'class',
    sourceId: 'fighter',
    minimumLevel: 1,
    effects: informationalEffect(
      'Recupera 1d10 + nível de Guerreiro pontos de vida como ação bônus.',
      'Recover 1d10 + Fighter level hit points as a bonus action.',
    ),
  },
  {
    id: 'fighter-action-surge',
    names: { 'pt-BR': 'Surto de Ação', 'en-US': 'Action Surge' },
    origin: 'class',
    sourceId: 'fighter',
    minimumLevel: 2,
    effects: informationalEffect(
      'Concede uma ação adicional; os usos aumentam no nível 17.',
      'Grants one additional action; uses increase at level 17.',
    ),
  },
  {
    id: 'fighter-martial-archetype',
    names: { 'pt-BR': 'Arquétipo Marcial', 'en-US': 'Martial Archetype' },
    origin: 'class',
    sourceId: 'fighter',
    minimumLevel: 3,
    effects: informationalEffect(
      'Escolha futura de subclasse do Guerreiro.',
      'Future Fighter subclass choice.',
    ),
  },
  {
    id: 'fighter-martial-archetype-feature',
    names: {
      'pt-BR': 'Característica de Arquétipo Marcial',
      'en-US': 'Martial Archetype Feature',
    },
    origin: 'class',
    sourceId: 'fighter',
    minimumLevel: 7,
    effects: informationalEffect(
      'Concede uma característica definida pela subclasse escolhida.',
      'Grants a feature defined by the chosen subclass.',
    ),
  },
  {
    id: 'fighter-ability-score-improvement',
    names: {
      'pt-BR': 'Aprimoramento de Atributo',
      'en-US': 'Ability Score Improvement',
    },
    origin: 'class',
    sourceId: 'fighter',
    minimumLevel: 4,
    effects: informationalEffect(
      'Permite aprimorar atributos ou escolher um talento elegível.',
      'Allows ability score improvements or an eligible feat.',
    ),
  },
  {
    id: 'fighter-martial-versatility',
    names: { 'pt-BR': 'Versatilidade Marcial', 'en-US': 'Martial Versatility' },
    origin: 'class',
    sourceId: 'fighter',
    minimumLevel: 4,
    effects: informationalEffect(
      'Permite substituir escolhas marciais elegíveis ao obter um ASI.',
      'Allows eligible martial choices to be replaced when gaining an ASI.',
    ),
  },
  {
    id: 'fighter-extra-attack',
    names: { 'pt-BR': 'Ataque Extra', 'en-US': 'Extra Attack' },
    origin: 'class',
    sourceId: 'fighter',
    minimumLevel: 5,
    effects: informationalEffect(
      'Os ataques por ação aumentam nos níveis 5, 11 e 20.',
      'Attacks per action increase at levels 5, 11, and 20.',
    ),
  },
  {
    id: 'fighter-indomitable',
    names: { 'pt-BR': 'Indomável', 'en-US': 'Indomitable' },
    origin: 'class',
    sourceId: 'fighter',
    minimumLevel: 9,
    effects: informationalEffect(
      'Permite repetir uma salvaguarda; os usos aumentam nos níveis 13 e 17.',
      'Allows a saving throw reroll; uses increase at levels 13 and 17.',
    ),
  },
];

export const fighterFightingStyles: FeatureDefinition[] = [
  {
    id: 'archery',
    names: { 'pt-BR': 'Arqueria', 'en-US': 'Archery' },
    origin: 'class',
    sourceId: 'fighter',
    minimumLevel: 1,
    effects: informationalEffect(
      '+2 em jogadas de ataque com armas à distância.',
      '+2 to attack rolls with ranged weapons.',
    ),
  },
  {
    id: 'great-weapon-fighting',
    names: { 'pt-BR': 'Combate com Armas Grandes', 'en-US': 'Great Weapon Fighting' },
    origin: 'class',
    sourceId: 'fighter',
    minimumLevel: 1,
    effects: informationalEffect(
      'Permite repetir resultados baixos nos dados de dano de armas empunhadas com duas mãos.',
      'Allows low weapon damage die results to be rerolled while wielding with two hands.',
    ),
  },
  {
    id: 'two-weapon-fighting',
    names: { 'pt-BR': 'Combate com Duas Armas', 'en-US': 'Two-Weapon Fighting' },
    origin: 'class',
    sourceId: 'fighter',
    minimumLevel: 1,
    effects: informationalEffect(
      'Adiciona o modificador de atributo ao dano do ataque com a segunda arma.',
      'Adds the ability modifier to the damage of the second weapon attack.',
    ),
  },
  {
    id: 'protection',
    names: { 'pt-BR': 'Proteção', 'en-US': 'Protection' },
    origin: 'class',
    sourceId: 'fighter',
    minimumLevel: 1,
    effects: informationalEffect(
      'Usa reação e escudo para impor desvantagem a um ataque contra um aliado próximo.',
      'Uses a reaction and shield to impose disadvantage on an attack against a nearby ally.',
    ),
  },
  {
    id: 'defense',
    names: { 'pt-BR': 'Defesa', 'en-US': 'Defense' },
    origin: 'class',
    sourceId: 'fighter',
    minimumLevel: 1,
    effects: informationalEffect(
      '+1 de CA enquanto estiver usando armadura.',
      '+1 AC while wearing armor.',
    ),
  },
  {
    id: 'dueling',
    names: { 'pt-BR': 'Duelo', 'en-US': 'Dueling' },
    origin: 'class',
    sourceId: 'fighter',
    minimumLevel: 1,
    effects: informationalEffect(
      '+2 no dano com uma arma corpo a corpo em uma mão e nenhuma outra arma.',
      '+2 damage with a one-handed melee weapon while wielding no other weapon.',
    ),
  },
  {
    id: 'blind-fighting',
    names: { 'pt-BR': 'Combate às Cegas', 'en-US': 'Blind Fighting' },
    origin: 'class',
    sourceId: 'fighter',
    minimumLevel: 1,
    effects: informationalEffect(
      'Concede percepção às cegas a 3 metros.',
      'Grants blindsight out to 10 feet.',
    ),
  },
  {
    id: 'interception',
    names: { 'pt-BR': 'Interceptação', 'en-US': 'Interception' },
    origin: 'class',
    sourceId: 'fighter',
    minimumLevel: 1,
    effects: informationalEffect(
      'Usa reação para reduzir o dano sofrido por um aliado próximo.',
      'Uses a reaction to reduce damage taken by a nearby ally.',
    ),
  },
  {
    id: 'superior-technique',
    names: { 'pt-BR': 'Técnica Superior', 'en-US': 'Superior Technique' },
    origin: 'class',
    sourceId: 'fighter',
    minimumLevel: 1,
    effects: informationalEffect(
      'Concede uma manobra e um dado de superioridade d6.',
      'Grants one maneuver and one d6 superiority die.',
    ),
  },
  {
    id: 'thrown-weapon-fighting',
    names: {
      'pt-BR': 'Combate com Armas de Arremesso',
      'en-US': 'Thrown Weapon Fighting',
    },
    origin: 'class',
    sourceId: 'fighter',
    minimumLevel: 1,
    effects: informationalEffect(
      'Facilita sacar armas de arremesso e concede +2 no dano desses ataques.',
      'Supports drawing thrown weapons and grants +2 damage with those attacks.',
    ),
  },
  {
    id: 'unarmed-fighting',
    names: { 'pt-BR': 'Combate Desarmado', 'en-US': 'Unarmed Fighting' },
    origin: 'class',
    sourceId: 'fighter',
    minimumLevel: 1,
    effects: informationalEffect(
      'Melhora ataques desarmados e causa dano adicional em criaturas agarradas.',
      'Improves unarmed strikes and deals additional damage to grappled creatures.',
    ),
  },
];

export const fighterFightingStyleIds = fighterFightingStyles.map(({ id }) => id);

export const fighterFeatures: FeatureDefinition[] = [
  ...fighterFeatureDefinitions,
  ...fighterFightingStyles,
];
