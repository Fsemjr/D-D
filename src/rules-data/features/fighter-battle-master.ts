import type {
  FeatureDefinition,
  MechanicalEffect,
  TechniqueDefinition,
} from '../types';

function informationalEffect(ptBR: string, enUS: string): MechanicalEffect {
  return {
    type: 'informational',
    note: { 'pt-BR': ptBR, 'en-US': enUS },
  };
}

function maneuver(
  id: string,
  ptBRName: string,
  enUSName: string,
  ptBRMechanic: string,
  enUSMechanic: string,
): TechniqueDefinition {
  return {
    id: `fighter-battle-master-maneuver-${id}`,
    names: { 'pt-BR': ptBRName, 'en-US': enUSName },
    sourceId: 'fighter-battle-master',
    effects: [informationalEffect(ptBRMechanic, enUSMechanic)],
  };
}

export const fighterBattleMasterFeatures: FeatureDefinition[] = [
  {
    id: 'fighter-battle-master-combat-superiority',
    names: { 'pt-BR': 'Superioridade em Combate', 'en-US': 'Combat Superiority' },
    origin: 'subclass',
    sourceId: 'fighter-battle-master',
    minimumLevel: 3,
    effects: [
      {
        type: 'informational',
        abilityOptions: ['strength', 'dexterity'],
        value: '8 + proficiencyBonus + abilityModifier',
        note: {
          'pt-BR': 'CD das manobras que exigem salvaguarda.',
          'en-US': 'Save DC for maneuvers that require a saving throw.',
        },
      },
      informationalEffect(
        'Manobras consomem dados de superioridade conforme indicado.',
        'Maneuvers expend superiority dice as indicated.',
      ),
    ],
  },
  {
    id: 'fighter-battle-master-student-of-war',
    names: { 'pt-BR': 'Estudioso da Guerra', 'en-US': 'Student of War' },
    origin: 'subclass',
    sourceId: 'fighter-battle-master',
    minimumLevel: 3,
    effects: [{
      type: 'tool-proficiency',
      value: 1,
      note: {
        'pt-BR': 'Escolha uma ferramenta de artesão.',
        'en-US': 'Choose one artisan tool.',
      },
    }],
  },
  {
    id: 'fighter-battle-master-know-your-enemy',
    names: { 'pt-BR': 'Conheça seu Inimigo', 'en-US': 'Know Your Enemy' },
    origin: 'subclass',
    sourceId: 'fighter-battle-master',
    minimumLevel: 7,
    effects: [informationalEffect(
      'Observação prolongada permite comparar capacidades de combate com as do Guerreiro.',
      'Extended observation allows combat capabilities to be compared with the Fighter.',
    )],
  },
  {
    id: 'fighter-battle-master-improved-combat-superiority',
    names: {
      'pt-BR': 'Superioridade em Combate Aprimorada',
      'en-US': 'Improved Combat Superiority',
    },
    origin: 'subclass',
    sourceId: 'fighter-battle-master',
    minimumLevel: 10,
    effects: [informationalEffect(
      'O dado de superioridade aumenta para d10 no nível 10 e d12 no nível 18.',
      'The superiority die increases to d10 at level 10 and d12 at level 18.',
    )],
  },
  {
    id: 'fighter-battle-master-relentless',
    names: { 'pt-BR': 'Implacável', 'en-US': 'Relentless' },
    origin: 'subclass',
    sourceId: 'fighter-battle-master',
    minimumLevel: 15,
    effects: [informationalEffect(
      'Recupera um dado de superioridade ao rolar iniciativa sem dados restantes.',
      'Regains one superiority die when rolling initiative with none remaining.',
    )],
  },
];

export const fighterBattleMasterManeuvers: TechniqueDefinition[] = [
  maneuver(
    'ambush',
    'Emboscada',
    'Ambush',
    'Adiciona o dado de superioridade a Furtividade ou iniciativa.',
    'Adds the superiority die to Stealth or initiative.',
  ),
  maneuver(
    'bait-and-switch',
    'Substituição',
    'Bait and Switch',
    'Troca de posição com um aliado próximo e melhora temporariamente a CA.',
    'Swaps positions with a nearby ally and temporarily improves AC.',
  ),
  maneuver(
    'brace',
    'Reforçar',
    'Brace',
    'Permite atacar como reação quando um inimigo entra no alcance.',
    'Allows a reaction attack when an enemy enters reach.',
  ),
  maneuver(
    'commanders-strike',
    'Golpe do Comandante',
    "Commander's Strike",
    'Abre mão de um ataque para permitir que um aliado ataque como reação.',
    'Forfeits one attack to let an ally attack as a reaction.',
  ),
  maneuver(
    'commanding-presence',
    'Presença Dominante',
    'Commanding Presence',
    'Adiciona o dado de superioridade a testes sociais específicos.',
    'Adds the superiority die to specific social checks.',
  ),
  maneuver(
    'disarming-attack',
    'Ataque Desarmante',
    'Disarming Attack',
    'Adiciona dano e pode fazer o alvo soltar um objeto.',
    'Adds damage and can make the target drop an object.',
  ),
  maneuver(
    'distracting-strike',
    'Golpe Distrativo',
    'Distracting Strike',
    'Adiciona dano e facilita o próximo ataque de um aliado contra o alvo.',
    "Adds damage and aids an ally's next attack against the target.",
  ),
  maneuver(
    'evasive-footwork',
    'Passo Evasivo',
    'Evasive Footwork',
    'Adiciona o dado de superioridade à CA durante o movimento.',
    'Adds the superiority die to AC while moving.',
  ),
  maneuver(
    'feinting-attack',
    'Ataque de Finta',
    'Feinting Attack',
    'Usa ação bônus para obter vantagem e adicionar dano ao próximo ataque.',
    'Uses a bonus action to gain advantage and add damage to the next attack.',
  ),
  maneuver(
    'goading-attack',
    'Ataque Provocante',
    'Goading Attack',
    'Adiciona dano e dificulta ataques do alvo contra outras criaturas.',
    "Adds damage and hinders the target's attacks against other creatures.",
  ),
  maneuver(
    'grappling-strike',
    'Ataque de Agarrar',
    'Grappling Strike',
    'Permite tentar agarrar como ação bônus após acertar um ataque.',
    'Allows a grapple attempt as a bonus action after hitting.',
  ),
  maneuver(
    'lunging-attack',
    'Ataque Estendido',
    'Lunging Attack',
    'Aumenta o alcance de um ataque corpo a corpo e adiciona dano.',
    'Increases the reach of one melee attack and adds damage.',
  ),
  maneuver(
    'maneuvering-attack',
    'Ataque de Manobra',
    'Maneuvering Attack',
    'Adiciona dano e permite reposicionar um aliado.',
    'Adds damage and allows an ally to reposition.',
  ),
  maneuver(
    'menacing-attack',
    'Ataque Ameaçador',
    'Menacing Attack',
    'Adiciona dano e pode amedrontar o alvo.',
    'Adds damage and can frighten the target.',
  ),
  maneuver(
    'parry',
    'Aparar',
    'Parry',
    'Usa reação para reduzir dano de um ataque corpo a corpo.',
    'Uses a reaction to reduce damage from a melee attack.',
  ),
  maneuver(
    'precision-attack',
    'Ataque de Precisão',
    'Precision Attack',
    'Adiciona o dado de superioridade à jogada de ataque.',
    'Adds the superiority die to an attack roll.',
  ),
  maneuver(
    'pushing-attack',
    'Ataque de Encontrão',
    'Pushing Attack',
    'Adiciona dano e pode empurrar o alvo.',
    'Adds damage and can push the target.',
  ),
  maneuver(
    'quick-toss',
    'Lance Rápido',
    'Quick Toss',
    'Permite atacar com arma de arremesso como ação bônus.',
    'Allows a thrown weapon attack as a bonus action.',
  ),
  maneuver(
    'rally',
    'Inspirar',
    'Rally',
    'Concede pontos de vida temporários a um aliado como ação bônus.',
    'Grants temporary hit points to an ally as a bonus action.',
  ),
  maneuver(
    'riposte',
    'Contra-Atacar',
    'Riposte',
    'Permite atacar como reação quando um inimigo erra um ataque corpo a corpo.',
    'Allows a reaction attack when an enemy misses with a melee attack.',
  ),
  maneuver(
    'sweeping-attack',
    'Ataque Trespassante',
    'Sweeping Attack',
    'Pode causar dano a uma segunda criatura próxima do alvo.',
    'Can damage a second creature near the target.',
  ),
  maneuver(
    'tactical-assessment',
    'Avaliação Tática',
    'Tactical Assessment',
    'Adiciona o dado de superioridade a testes mentais específicos.',
    'Adds the superiority die to specific mental checks.',
  ),
  maneuver(
    'trip-attack',
    'Derrubar',
    'Trip Attack',
    'Adiciona dano e pode derrubar o alvo.',
    'Adds damage and can knock the target prone.',
  ),
];

export const fighterBattleMasterManeuverIds = fighterBattleMasterManeuvers.map(
  ({ id }) => id,
);
