import type { FeatureDefinition, MechanicalEffect } from '../types';

const sourceId = 'fighter-echo-knight';

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

export const fighterEchoKnightFeatures: FeatureDefinition[] = [
  {
    id: 'fighter-echo-knight-manifest-echo',
    names: { 'pt-BR': 'Manifestar Eco', 'en-US': 'Manifest Echo' },
    origin: 'subclass',
    sourceId,
    minimumLevel: 3,
    effects: [
      informationalEffect('bonus-action:manifest-echo', 'Manifesta o eco como ação bônus.', 'Manifests the echo as a bonus action.'),
      informationalEffect('create:visible-unoccupied-space-within-4.5m', 'Cria em espaço desocupado visível a até 4,5 metros.', 'Creates it in a visible unoccupied space within 4.5 meters.'),
      informationalEffect('echo-ac:14+proficiencyBonus', 'A CA do eco é 14 + bônus de proficiência.', 'The echo AC is 14 + proficiency bonus.'),
      informationalEffect('echo-hp:1', 'O eco possui 1 PV.', 'The echo has 1 HP.'),
      informationalEffect('echo-condition-immunity:all', 'O eco é imune a todas as condições.', 'The echo is immune to all conditions.'),
      informationalEffect('echo-saving-throws:use-fighter-bonuses', 'Usa os bônus de salvaguarda do Guerreiro.', 'Uses the Fighter saving throw bonuses.'),
      informationalEffect('echo-size:same-as-fighter;occupies-own-space', 'Tem o mesmo tamanho do Guerreiro e ocupa espaço próprio.', 'Has the Fighter size and occupies its own space.'),
      informationalEffect('fighter-turn:mental-command;move-up-to-9m;no-action', 'No turno do Guerreiro, move até 9 metros por comando mental sem ação.', 'On the Fighter turn, moves up to 9 meters by mental command without an action.'),
      informationalEffect('end-of-turn-distance-over-9m->echo-destroyed', 'É destruído se terminar o turno a mais de 9 metros do Guerreiro.', 'Is destroyed if it ends the turn more than 9 meters from the Fighter.'),
      informationalEffect('ends:destroyed-or-bonus-action-dismiss-or-replaced-or-fighter-incapacitated', 'Termina ao ser destruído, dispensado, substituído ou se o Guerreiro ficar incapacitado.', 'Ends when destroyed, dismissed, replaced, or when the Fighter is incapacitated.'),
      informationalEffect('bonus-action:teleport-swap-with-echo;movement-cost:4.5m;distance-independent', 'Troca de posição por teleporte como ação bônus, custando 4,5 metros de movimento.', 'Teleports to swap positions as a bonus action at a cost of 4.5 meters of movement.'),
      informationalEffect('attack-action:each-attack-origin:fighter-or-echo', 'Cada ataque da ação de Ataque pode originar do Guerreiro ou do eco.', 'Each Attack action attack can originate from the Fighter or the echo.'),
      informationalEffect('visible-creature-within-1.5m-of-echo-moves-at-least-1.5m-away->fighter-reaction:opportunity-attack-from-echo-space', 'Movimento para longe do eco pode provocar ataque de oportunidade pela reação do Guerreiro, originado no eco.', 'Movement away from the echo can trigger the Fighter reaction for an opportunity attack from the echo space.'),
    ],
  },
  {
    id: 'fighter-echo-knight-unleash-incarnation',
    names: { 'pt-BR': 'Desencadear Encarnação', 'en-US': 'Unleash Incarnation' },
    origin: 'subclass',
    sourceId,
    minimumLevel: 3,
    effects: [informationalEffect(
      'trigger:attack-action->additional-melee-attack-from-echo-space',
      'Ao usar a ação de Ataque, realiza um ataque corpo a corpo adicional a partir do eco.',
      'When taking the Attack action, makes an additional melee attack from the echo space.',
    )],
  },
  {
    id: 'fighter-echo-knight-echo-avatar',
    names: { 'pt-BR': 'Possuir Eco', 'en-US': 'Echo Avatar' },
    origin: 'subclass',
    sourceId,
    minimumLevel: 7,
    effects: [
      informationalEffect('action:transfer-consciousness-to-echo', 'Usa uma ação para transferir a consciência ao eco.', 'Uses an action to transfer consciousness to the echo.'),
      informationalEffect('duration:maximum-10-minutes', 'Dura no máximo 10 minutos.', 'Lasts up to 10 minutes.'),
      informationalEffect('see-and-hear-through-echo;fighter:blinded-and-deafened', 'Vê e ouve pelo eco enquanto fica cego e surdo.', 'Sees and hears through the echo while blinded and deafened.'),
      informationalEffect('maximum-echo-distance:300m', 'A distância máxima do eco aumenta para 300 metros.', 'The maximum echo distance increases to 300 meters.'),
      informationalEffect('end:any-time:no-action', 'Pode encerrar a qualquer momento sem ação.', 'Can end at any time without an action.'),
    ],
  },
  {
    id: 'fighter-echo-knight-shadow-martyr',
    names: { 'pt-BR': 'Mártir das Sombras', 'en-US': 'Shadow Martyr' },
    origin: 'subclass',
    sourceId,
    minimumLevel: 10,
    effects: [
      informationalEffect('trigger:before-attack-roll-against-other-visible-creature', 'Ativada antes da jogada de ataque contra outra criatura visível.', 'Triggered before an attack roll against another visible creature.'),
      informationalEffect('reaction', 'Usa uma reação.', 'Uses a reaction.'),
      informationalEffect('teleport-echo:visible-unoccupied-space-within-1.5m-of-target', 'Teleporta o eco para espaço desocupado visível a até 1,5 metro do alvo.', 'Teleports the echo to a visible unoccupied space within 1.5 meters of the target.'),
      informationalEffect('redirect-attack-to-echo-before-attack-roll', 'Redireciona o ataque ao eco antes da jogada.', 'Redirects the attack to the echo before the roll.'),
    ],
  },
  {
    id: 'fighter-echo-knight-reclaim-potential',
    names: { 'pt-BR': 'Reivindicar o Potencial', 'en-US': 'Reclaim Potential' },
    origin: 'subclass',
    sourceId,
    minimumLevel: 15,
    effects: [
      informationalEffect('trigger:echo-destroyed-by-damage', 'Ativada quando um eco é destruído ao receber dano.', 'Triggered when an echo is destroyed by damage.'),
      {
        type: 'temporary-hp',
        ability: 'constitution',
        condition: 'fighter-has-no-temporary-hp',
        value: '2d6 + constitutionModifier',
      },
    ],
  },
  {
    id: 'fighter-echo-knight-legion-of-one',
    names: { 'pt-BR': 'Exército de um Homem Só', 'en-US': 'Legion of One' },
    origin: 'subclass',
    sourceId,
    minimumLevel: 18,
    effects: [
      informationalEffect('bonus-action:manifest-up-to-2-simultaneous-echoes', 'Manifestar Eco pode criar dois ecos simultâneos como ação bônus.', 'Manifest Echo can create two simultaneous echoes as a bonus action.'),
      informationalEffect('manifest-third-echo->destroy-both-existing-echoes', 'Tentar criar um terceiro eco destrói os dois existentes.', 'Attempting to create a third echo destroys both existing echoes.'),
      informationalEffect('capabilities-from-either-echo-space', 'Capacidades originadas de um eco podem originar do outro.', 'Capabilities originating from one echo can originate from the other.'),
      informationalEffect('initiative-with-zero-resource->recover:1', 'Ao rolar iniciativa sem usos de Desencadear Encarnação, recupera um uso.', 'When rolling initiative with no Unleash Incarnation uses, recovers one use.'),
    ],
  },
];
