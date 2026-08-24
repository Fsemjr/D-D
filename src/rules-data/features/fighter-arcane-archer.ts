import type {
  FeatureDefinition,
  MechanicalEffect,
  SpellSchool,
  TechniqueDefinition,
} from '../types';

const sourceId = 'fighter-arcane-archer';
const bookId = 'jvf-classes-subclasses-compendium';

function informationalEffect(
  value: MechanicalEffect['value'],
  ptBR: string,
  enUS: string,
): MechanicalEffect {
  return {
    type: 'informational',
    value,
    note: { 'pt-BR': ptBR, 'en-US': enUS },
  };
}

function damageEffect(
  damageType: string,
  initialDamage: string | undefined,
  level18Damage: string,
): MechanicalEffect {
  const progression = [
    ...(initialDamage === undefined ? [] : [{ level: 3, value: initialDamage }]),
    { level: 18, value: level18Damage },
  ];

  return {
    type: 'informational',
    damageType,
    progression,
  };
}

interface ArcaneShotOptionInput {
  id: string;
  ptBRName: string;
  enUSName: string;
  school: SpellSchool;
  requiresAttackRoll: boolean;
  ptBRSummary: string;
  enUSSummary: string;
  effects: MechanicalEffect[];
}

function arcaneShotOption({
  id,
  ptBRName,
  enUSName,
  school,
  requiresAttackRoll,
  ptBRSummary,
  enUSSummary,
  effects,
}: ArcaneShotOptionInput): TechniqueDefinition {
  return {
    id: `fighter-arcane-archer-arcane-shot-${id}`,
    names: { 'pt-BR': ptBRName, 'en-US': enUSName },
    sourceId,
    minimumLevel: 3,
    source: { bookId },
    tags: ['arcane-shot', school],
    summary: { 'pt-BR': ptBRSummary, 'en-US': enUSSummary },
    school,
    requiresAttackRoll,
    effects,
  };
}

export const fighterArcaneArcherFeatures: FeatureDefinition[] = [
  {
    id: 'fighter-arcane-archer-lore',
    names: {
      'pt-BR': 'Tradição do Arqueiro Arcano',
      'en-US': 'Arcane Archer Lore',
    },
    origin: 'subclass',
    sourceId,
    minimumLevel: 3,
  },
  {
    id: 'fighter-arcane-archer-arcane-shot',
    names: { 'pt-BR': 'Disparo Arcano', 'en-US': 'Arcane Shot' },
    origin: 'subclass',
    sourceId,
    minimumLevel: 3,
    effects: [
      {
        type: 'informational',
        ability: 'intelligence',
        value: '8 + proficiencyBonus + intelligenceModifier',
        note: {
          'pt-BR': 'CD das opções de Disparo Arcano.',
          'en-US': 'Arcane Shot option save DC.',
        },
      },
      informationalEffect(
        'maximum-one-arcane-shot-per-turn',
        'No máximo uma opção de Disparo Arcano pode ser usada por turno.',
        'At most one Arcane Shot option can be used per turn.',
      ),
      informationalEffect(
        'magic-arrow:shortbow-or-longbow:attack-action',
        'Usado com flecha mágica de arco curto ou arco longo durante a ação de Ataque.',
        'Used with a magic shortbow or longbow arrow during the Attack action.',
      ),
      informationalEffect(
        'normally-applied-on-hit;some-options-skip-attack-roll',
        'Normalmente aplicado quando a flecha acerta; algumas opções dispensam jogada de ataque.',
        'Normally applied when the arrow hits; some options skip the attack roll.',
      ),
    ],
  },
  {
    id: 'fighter-arcane-archer-magic-arrow',
    names: { 'pt-BR': 'Flecha Mágica', 'en-US': 'Magic Arrow' },
    origin: 'subclass',
    sourceId,
    minimumLevel: 7,
    effects: [informationalEffect(
      'nonmagical-shortbow-or-longbow-arrow:magical-until-hit-or-miss',
      'Flechas não mágicas de arco curto ou longo são mágicas contra resistência e imunidade até acertarem ou errarem.',
      'Nonmagical shortbow or longbow arrows are magical against resistance and immunity until they hit or miss.',
    )],
  },
  {
    id: 'fighter-arcane-archer-curving-shot',
    names: { 'pt-BR': 'Tiro Curvado', 'en-US': 'Curving Shot' },
    origin: 'subclass',
    sourceId,
    minimumLevel: 7,
    effects: [
      informationalEffect(
        'trigger:magic-arrow-attack-miss',
        'Ativado quando um ataque com flecha mágica erra.',
        'Triggered when a magic arrow attack misses.',
      ),
      informationalEffect(
        'bonus-action:reroll-attack',
        'Usa ação bônus para refazer a jogada de ataque.',
        'Uses a bonus action to reroll the attack.',
      ),
      informationalEffect(
        'different-target',
        'A nova jogada deve ter um alvo diferente.',
        'The new attack roll must target a different creature.',
      ),
      informationalEffect(
        18,
        'O novo alvo deve estar a até 18 metros do alvo original.',
        'The new target must be within 18 meters of the original target.',
      ),
    ],
  },
  {
    id: 'fighter-arcane-archer-ever-ready-shot',
    names: { 'pt-BR': 'Disparo Sempre Pronto', 'en-US': 'Ever-Ready Shot' },
    origin: 'subclass',
    sourceId,
    minimumLevel: 15,
    effects: [informationalEffect(
      'initiative-with-zero-resource->recover:1',
      'Ao rolar iniciativa sem usos de Disparo Arcano, recupera um uso.',
      'When rolling initiative with no Arcane Shot uses, recovers one use.',
    )],
  },
];

export const fighterArcaneArcherShotOptions: TechniqueDefinition[] = [
  arcaneShotOption({
    id: 'bursting-arrow',
    ptBRName: 'Flecha da Explosão',
    enUSName: 'Bursting Arrow',
    school: 'evocation',
    requiresAttackRoll: true,
    ptBRSummary: 'Explode após atingir e causa dano de energia em uma área próxima.',
    enUSSummary: 'Explodes after hitting and deals force damage in a nearby area.',
    effects: [
      damageEffect('force', '2d6', '4d6'),
      informationalEffect(
        'after-hit:target-and-creatures-within-3m',
        'Após atingir, afeta o alvo e criaturas a até 3 metros.',
        'After hitting, affects the target and creatures within 3 meters.',
      ),
    ],
  }),
  arcaneShotOption({
    id: 'beguiling-arrow',
    ptBRName: 'Flecha da Sedução',
    enUSName: 'Beguiling Arrow',
    school: 'enchantment',
    requiresAttackRoll: true,
    ptBRSummary: 'Causa dano psíquico e pode enfeitiçar o alvo por um aliado.',
    enUSSummary: 'Deals psychic damage and can charm the target toward an ally.',
    effects: [
      damageEffect('psychic', '2d6', '4d6'),
      {
        ...informationalEffect(
          'failed-save:charmed-by-ally-within-9m:until-start-of-next-turn',
          'Em falha, fica enfeitiçado por um aliado próximo até o início do próximo turno do arqueiro.',
          "On a failure, is charmed by a nearby ally until the start of the archer's next turn.",
        ),
        savingThrowAbility: 'wisdom',
      },
      informationalEffect(
        'ends-if-ally-attacks-damages-or-forces-save',
        'Termina antes se o aliado atacar, causar dano ou forçar uma salvaguarda.',
        'Ends early if the ally attacks, deals damage, or forces a saving throw.',
      ),
    ],
  }),
  arcaneShotOption({
    id: 'grasping-arrow',
    ptBRName: 'Flecha de Agarrar',
    enUSName: 'Grasping Arrow',
    school: 'conjuration',
    requiresAttackRoll: true,
    ptBRSummary: 'Enreda o alvo, reduz seu deslocamento e pune movimento.',
    enUSSummary: 'Entangles the target, reduces its speed, and punishes movement.',
    effects: [
      damageEffect('poison', '2d6', '4d6'),
      damageEffect('slashing', '2d6', '4d6'),
      informationalEffect(
        'speed:-3m',
        'Reduz o deslocamento em 3 metros.',
        'Reduces speed by 3 meters.',
      ),
      informationalEffect(
        'first-nonteleport-movement-per-turn:minimum-0.3m->slashing-damage',
        'O primeiro movimento sem teleporte de ao menos 0,3 metro por turno ativa o dano cortante.',
        'The first non-teleport movement of at least 0.3 meter each turn triggers the slashing damage.',
      ),
      {
        ...informationalEffect(
          'action:strength-athletics-check-vs-arcane-shot-dc',
          'Pode ser removida com uma ação e teste de Força (Atletismo) contra a CD do Disparo Arcano.',
          'Can be removed with an action and a Strength (Athletics) check against the Arcane Shot DC.',
        ),
        ability: 'strength',
        proficiencyId: 'athletics',
      },
      informationalEffect(
        'duration:1-minute-or-until-option-used-again',
        'Dura 1 minuto ou até esta opção ser usada novamente.',
        'Lasts 1 minute or until this option is used again.',
      ),
    ],
  }),
  arcaneShotOption({
    id: 'banishing-arrow',
    ptBRName: 'Flecha do Banimento',
    enUSName: 'Banishing Arrow',
    school: 'abjuration',
    requiresAttackRoll: true,
    ptBRSummary: 'Pode banir e incapacitar brevemente o alvo atingido.',
    enUSSummary: 'Can briefly banish and incapacitate the target it hits.',
    effects: [
      damageEffect('force', undefined, '2d6'),
      {
        ...informationalEffect(
          'failed-save:banished;speed:0;incapacitated;return:end-of-target-next-turn',
          'Em falha, o alvo é banido, fica incapacitado e com deslocamento zero até o fim do próximo turno dele.',
          'On a failure, the target is banished, incapacitated, and has zero speed until the end of its next turn.',
        ),
        savingThrowAbility: 'charisma',
      },
    ],
  }),
  arcaneShotOption({
    id: 'enfeebling-arrow',
    ptBRName: 'Flecha do Enfraquecimento',
    enUSName: 'Enfeebling Arrow',
    school: 'necromancy',
    requiresAttackRoll: true,
    ptBRSummary: 'Causa dano necrótico e pode reduzir o dano com armas do alvo.',
    enUSSummary: "Deals necrotic damage and can reduce the target's weapon damage.",
    effects: [
      damageEffect('necrotic', '2d6', '4d6'),
      {
        ...informationalEffect(
          'failed-save:weapon-attack-damage-halved:until-start-of-next-turn',
          'Em falha, reduz pela metade o dano dos ataques com arma até o início do próximo turno do arqueiro.',
          "On a failure, halves weapon attack damage until the start of the archer's next turn.",
        ),
        savingThrowAbility: 'constitution',
      },
    ],
  }),
  arcaneShotOption({
    id: 'piercing-arrow',
    ptBRName: 'Flecha Perfurante',
    enUSName: 'Piercing Arrow',
    school: 'transmutation',
    requiresAttackRoll: false,
    ptBRSummary: 'Atravessa uma linha de criaturas sem usar jogada de ataque.',
    enUSSummary: 'Passes through a line of creatures without using an attack roll.',
    effects: [
      damageEffect('piercing', '1d6', '2d6'),
      informationalEffect(
        'line:0.3m-wide:9m-long;ignores-cover-and-objects',
        'Percorre uma linha de 0,3 por 9 metros e ignora cobertura e objetos conforme a regra.',
        'Travels through a 0.3-by-9-meter line and ignores cover and objects as specified.',
      ),
      {
        ...informationalEffect(
          'failed-save:normal-arrow-plus-extra-damage;success:half-damage',
          'Falha causa dano normal da flecha mais dano extra; sucesso causa metade.',
          'Failure deals normal arrow damage plus extra damage; success deals half.',
        ),
        savingThrowAbility: 'dexterity',
      },
    ],
  }),
  arcaneShotOption({
    id: 'seeking-arrow',
    ptBRName: 'Flecha Perseguidora',
    enUSName: 'Seeking Arrow',
    school: 'divination',
    requiresAttackRoll: false,
    ptBRSummary: 'Persegue uma criatura vista recentemente e pode revelar sua posição.',
    enUSSummary: 'Pursues a recently seen creature and can reveal its position.',
    effects: [
      damageEffect('force', '1d6', '2d6'),
      informationalEffect(
        'target-seen-within-1-minute;within-weapon-range;physical-path-required',
        'Busca uma criatura vista no último minuto, no alcance da arma e com caminho físico suficiente.',
        'Seeks a creature seen within the last minute, within weapon range, with a sufficient physical path.',
      ),
      informationalEffect(
        'can-turn-corners;ignores-half-and-three-quarters-cover',
        'Pode contornar cantos e ignora meia cobertura e três quartos de cobertura.',
        'Can turn corners and ignores half and three-quarters cover.',
      ),
      {
        ...informationalEffect(
          'failed-save:normal-arrow-plus-extra-damage;reveal-position;success:half-damage:no-reveal',
          'Falha causa dano normal e extra e revela a posição; sucesso causa metade sem revelar.',
          'Failure deals normal and extra damage and reveals position; success deals half without revealing.',
        ),
        savingThrowAbility: 'dexterity',
      },
    ],
  }),
  arcaneShotOption({
    id: 'shadow-arrow',
    ptBRName: 'Flecha Sombria',
    enUSName: 'Shadow Arrow',
    school: 'illusion',
    requiresAttackRoll: true,
    ptBRSummary: 'Causa dano psíquico e restringe severamente a visão do alvo.',
    enUSSummary: "Deals psychic damage and severely restricts the target's vision.",
    effects: [
      damageEffect('psychic', '2d6', '4d6'),
      {
        ...informationalEffect(
          'failed-save:cannot-see-beyond-1.5m:until-next-turn',
          'Em falha, não enxerga além de 1,5 metro até o próximo turno do arqueiro.',
          "On a failure, cannot see beyond 1.5 meters until the archer's next turn.",
        ),
        savingThrowAbility: 'wisdom',
      },
    ],
  }),
];

export const fighterArcaneArcherShotOptionIds = fighterArcaneArcherShotOptions.map(
  ({ id }) => id,
);
