import type { FeatureDefinition, MechanicalEffect } from '../types';

const sourceId = 'fighter-eldritch-knight';

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

export const fighterEldritchKnightFeatures: FeatureDefinition[] = [
  {
    id: 'fighter-eldritch-knight-spellcasting',
    names: { 'pt-BR': 'Conjuração', 'en-US': 'Spellcasting' },
    origin: 'subclass',
    sourceId,
    minimumLevel: 3,
    effects: [
      {
        ...informationalEffect(
          '8 + proficiencyBonus + intelligenceModifier',
          'CD para evitar as magias.',
          'Spell save DC.',
        ),
        ability: 'intelligence',
      },
      {
        ...informationalEffect(
          'proficiencyBonus + intelligenceModifier',
          'Modificador de ataque mágico.',
          'Spell attack modifier.',
        ),
        ability: 'intelligence',
      },
    ],
  },
  {
    id: 'fighter-eldritch-knight-weapon-bond',
    names: { 'pt-BR': 'Vínculo com Arma', 'en-US': 'Weapon Bond' },
    origin: 'subclass',
    sourceId,
    minimumLevel: 3,
    effects: [
      informationalEffect(
        60,
        'O ritual de vínculo dura 60 minutos.',
        'The bonding ritual takes 60 minutes.',
      ),
      informationalEffect(
        'ritual-during-short-rest',
        'O ritual pode ocorrer durante um descanso curto.',
        'The ritual can occur during a short rest.',
      ),
      informationalEffect(
        2,
        'Máximo de duas armas vinculadas.',
        'A maximum of two weapons can be bonded.',
      ),
      informationalEffect(
        'immune-to-disarm-while-not-incapacitated',
        'Uma arma vinculada não pode ser removida por desarme enquanto o usuário não estiver incapacitado.',
        'A bonded weapon cannot be disarmed while its wielder is not incapacitated.',
      ),
      informationalEffect(
        'summon-bonded-weapon-bonus-action',
        'Uma arma vinculada pode ser invocada para a mão como ação bônus.',
        'A bonded weapon can be summoned to hand as a bonus action.',
      ),
      informationalEffect(
        'same-plane',
        'A invocação funciona quando a arma está no mesmo plano de existência.',
        'The summoning works while the weapon is on the same plane of existence.',
      ),
    ],
  },
  {
    id: 'fighter-eldritch-knight-war-magic',
    names: { 'pt-BR': 'Magia de Guerra', 'en-US': 'War Magic' },
    origin: 'subclass',
    sourceId,
    minimumLevel: 7,
    effects: [informationalEffect(
      'action:cast-cantrip->bonus-action:weapon-attack',
      'Após conjurar um truque com a ação, permite um ataque com arma como ação bônus.',
      'After casting a cantrip with the action, allows one weapon attack as a bonus action.',
    )],
  },
  {
    id: 'fighter-eldritch-knight-eldritch-strike',
    names: { 'pt-BR': 'Golpe Místico', 'en-US': 'Eldritch Strike' },
    origin: 'subclass',
    sourceId,
    minimumLevel: 10,
    effects: [informationalEffect(
      'weapon-attack-hit->disadvantage-next-save-against-own-spell:until-end-of-next-turn',
      'Um alvo atingido por ataque com arma tem desvantagem na próxima salvaguarda contra uma magia do atacante até o fim do próximo turno dele.',
      "A target hit by a weapon attack has disadvantage on its next save against the attacker's spell until the end of the attacker's next turn.",
    )],
  },
  {
    id: 'fighter-eldritch-knight-arcane-charge',
    names: { 'pt-BR': 'Investida Arcana', 'en-US': 'Arcane Charge' },
    origin: 'subclass',
    sourceId,
    minimumLevel: 15,
    effects: [informationalEffect(
      9,
      'Ao usar Surto de Ação, teleporta até 9 metros.',
      'When using Action Surge, teleports up to 9 meters.',
    ), informationalEffect(
      'visible-unoccupied-space:before-or-after-additional-action',
      'O destino deve ser um espaço desocupado visível, alcançado antes ou depois da ação adicional.',
      'The destination must be a visible unoccupied space, reached before or after the additional action.',
    )],
  },
  {
    id: 'fighter-eldritch-knight-improved-war-magic',
    names: {
      'pt-BR': 'Magia de Guerra Aprimorada',
      'en-US': 'Improved War Magic',
    },
    origin: 'subclass',
    sourceId,
    minimumLevel: 18,
    effects: [informationalEffect(
      'action:cast-spell->bonus-action:weapon-attack',
      'Após conjurar uma magia com a ação, permite um ataque com arma como ação bônus.',
      'After casting a spell with the action, allows one weapon attack as a bonus action.',
    )],
  },
];
