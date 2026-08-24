import type { FeatureDefinition, MechanicalEffect } from '../types';

const sourceId = 'fighter-samurai';

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

export const fighterSamuraiFeatures: FeatureDefinition[] = [
  {
    id: 'fighter-samurai-bonus-proficiency',
    names: { 'pt-BR': 'Proficiência Adicional', 'en-US': 'Bonus Proficiency' },
    origin: 'subclass',
    sourceId,
    minimumLevel: 3,
  },
  {
    id: 'fighter-samurai-fighting-spirit',
    names: { 'pt-BR': 'Espírito de Batalha', 'en-US': 'Fighting Spirit' },
    origin: 'subclass',
    sourceId,
    minimumLevel: 3,
    effects: [
      informationalEffect(
        'bonus-action',
        'Ativado como ação bônus.',
        'Activated as a bonus action.',
      ),
      informationalEffect(
        'weapon-attack-rolls:advantage:until-end-of-current-turn',
        'Concede vantagem em ataques com arma até o fim do turno atual.',
        'Grants advantage on weapon attack rolls until the end of the current turn.',
      ),
      {
        type: 'temporary-hp',
        progression: [
          { level: 3, value: 5 },
          { level: 10, value: 10 },
          { level: 15, value: 15 },
        ],
      },
    ],
  },
  {
    id: 'fighter-samurai-elegant-courtier',
    names: { 'pt-BR': 'Cortesão Elegante', 'en-US': 'Elegant Courtier' },
    origin: 'subclass',
    sourceId,
    minimumLevel: 7,
    effects: [
      {
        type: 'ability-modifier',
        ability: 'wisdom',
        proficiencyId: 'persuasion',
        value: 'add-to-charisma-persuasion-check',
        note: {
          'pt-BR': 'Adiciona o modificador de Sabedoria ao teste de Carisma (Persuasão).',
          'en-US': 'Adds the Wisdom modifier to a Charisma (Persuasion) check.',
        },
      },
      {
        type: 'saving-throw-proficiency',
        ability: 'wisdom',
      },
    ],
  },
  {
    id: 'fighter-samurai-tireless-spirit',
    names: { 'pt-BR': 'Espírito Incansável', 'en-US': 'Tireless Spirit' },
    origin: 'subclass',
    sourceId,
    minimumLevel: 10,
    effects: [informationalEffect(
      'initiative-with-zero-resource->recover:1',
      'Ao rolar iniciativa sem usos de Espírito de Batalha, recupera um uso.',
      'When rolling initiative with no Fighting Spirit uses, recovers one use.',
    )],
  },
  {
    id: 'fighter-samurai-rapid-strike',
    names: { 'pt-BR': 'Golpe Rápido', 'en-US': 'Rapid Strike' },
    origin: 'subclass',
    sourceId,
    minimumLevel: 15,
    effects: [
      informationalEffect(
        'trigger:attack-action;requires:advantage-against-target',
        'Exige usar a ação de Ataque e ter vantagem contra o alvo.',
        'Requires taking the Attack action and having advantage against the target.',
      ),
      informationalEffect(
        'exchange-advantage->additional-weapon-attack:same-target',
        'Troca a vantagem de uma jogada por um ataque com arma adicional contra o mesmo alvo.',
        'Trades advantage on one roll for an additional weapon attack against the same target.',
      ),
      informationalEffect(
        'maximum-once-per-turn',
        'Pode ser usado no máximo uma vez por turno.',
        'Can be used at most once per turn.',
      ),
    ],
  },
  {
    id: 'fighter-samurai-strength-before-death',
    names: { 'pt-BR': 'Força Diante da Morte', 'en-US': 'Strength Before Death' },
    origin: 'subclass',
    sourceId,
    minimumLevel: 18,
    effects: [
      informationalEffect(
        'trigger:damage-reduces-to-0-hp-without-instant-death',
        'Ativada quando dano reduz a 0 PV sem causar morte instantânea.',
        'Triggered when damage reduces the Fighter to 0 HP without instant death.',
      ),
      informationalEffect(
        'reaction',
        'Usa uma reação.',
        'Uses a reaction.',
      ),
      informationalEffect(
        'delay-unconscious;immediate-extra-turn:interrupt-current-turn',
        'Adia ficar inconsciente e concede imediatamente um turno extra que interrompe o turno atual.',
        'Delays unconsciousness and immediately grants an extra turn that interrupts the current turn.',
      ),
      informationalEffect(
        'extra-turn:remain-at-0-hp;damage-causes-death-save-failure;three-failures-can-kill',
        'No turno extra, permanece com 0 PV e dano ainda causa falhas de salvaguarda contra morte.',
        'During the extra turn, remains at 0 HP and damage still causes death saving throw failures.',
      ),
      informationalEffect(
        'extra-turn-end:if-0-hp->unconscious',
        'Ao fim do turno extra, fica inconsciente se ainda estiver com 0 PV.',
        'At the end of the extra turn, falls unconscious if still at 0 HP.',
      ),
    ],
  },
];
