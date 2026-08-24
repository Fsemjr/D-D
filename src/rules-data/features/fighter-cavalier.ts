import type { FeatureDefinition, MechanicalEffect } from '../types';

const sourceId = 'fighter-cavalier';

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

export const fighterCavalierFeatures: FeatureDefinition[] = [
  {
    id: 'fighter-cavalier-bonus-proficiency',
    names: { 'pt-BR': 'Proficiência Adicional', 'en-US': 'Bonus Proficiency' },
    origin: 'subclass',
    sourceId,
    minimumLevel: 3,
  },
  {
    id: 'fighter-cavalier-born-to-the-saddle',
    names: { 'pt-BR': 'Nascido Para a Sela', 'en-US': 'Born to the Saddle' },
    origin: 'subclass',
    sourceId,
    minimumLevel: 3,
    effects: [
      informationalEffect(
        'advantage:saves-to-avoid-falling-from-mount',
        'Vantagem em salvaguardas para evitar cair da montaria.',
        'Advantage on saving throws to avoid falling from a mount.',
      ),
      informationalEffect(
        'fall-from-mount:land-on-feet:maximum-3m:not-incapacitated',
        'Pode aterrissar em pé ao cair até 3 metros da montaria se não estiver incapacitado.',
        'Can land on foot after falling up to 3 meters from a mount if not incapacitated.',
      ),
      informationalEffect(
        3,
        'Altura máxima da queda da montaria, em metros, para aterrissar em pé.',
        'Maximum mount fall height in meters for landing on foot.',
      ),
      informationalEffect(
        'mount-or-dismount-movement-cost:1.5m',
        'Montar ou desmontar custa 1,5 metro de movimento.',
        'Mounting or dismounting costs 1.5 meters of movement.',
      ),
      informationalEffect(
        1.5,
        'Custo de movimento para montar ou desmontar, em metros.',
        'Movement cost to mount or dismount, in meters.',
      ),
    ],
  },
  {
    id: 'fighter-cavalier-unwavering-mark',
    names: { 'pt-BR': 'Marca Inabalável', 'en-US': 'Unwavering Mark' },
    origin: 'subclass',
    sourceId,
    minimumLevel: 3,
    effects: [
      informationalEffect(
        'trigger:melee-weapon-hit->mark',
        'Um acerto com ataque corpo a corpo com arma pode marcar o alvo.',
        'A melee weapon attack hit can mark the target.',
      ),
      informationalEffect(
        'mark:until-end-of-next-turn;ends:incapacitated-or-dead-or-other-mark',
        'A marca dura até o fim do próximo turno e termina antecipadamente pelas condições indicadas.',
        'The mark lasts until the end of the next turn and can end early under the specified conditions.',
      ),
      informationalEffect(
        1.5,
        'Alcance da defesa da marca, em metros.',
        'Range of the mark defense, in meters.',
      ),
      informationalEffect(
        'marked-target-within-1.5m:disadvantage-attacks-against-others',
        'O alvo marcado próximo tem desvantagem em ataques contra outros alvos.',
        'A nearby marked target has disadvantage on attacks against other targets.',
      ),
      informationalEffect(
        'marked-target-damages-other->next-turn:bonus-action:melee-weapon-attack',
        'Dano contra outra criatura permite um ataque corpo a corpo com arma como ação bônus no próximo turno.',
        'Damage to another creature enables a bonus-action melee weapon attack on the next turn.',
      ),
      informationalEffect(
        'retaliatory-attack:advantage',
        'O ataque retaliatório tem vantagem.',
        'The retaliatory attack has advantage.',
      ),
      informationalEffect(
        'retaliatory-hit:extra-damage=fighterLevel/2',
        'Em acerto, o dano adicional equivale à metade do nível de Guerreiro.',
        'On a hit, extra damage equals half the Fighter level.',
      ),
    ],
  },
  {
    id: 'fighter-cavalier-warding-maneuver',
    names: { 'pt-BR': 'Manobra de Proteção', 'en-US': 'Warding Maneuver' },
    origin: 'subclass',
    sourceId,
    minimumLevel: 7,
    effects: [
      informationalEffect(
        'trigger:self-or-visible-creature-hit-by-attack',
        'Ativada quando o Guerreiro ou uma criatura visível é atingida.',
        'Triggered when the Fighter or a visible creature is hit.',
      ),
      informationalEffect(
        1.5,
        'Alcance máximo até o alvo protegido, em metros.',
        'Maximum range to the protected target, in meters.',
      ),
      informationalEffect(
        'requires:wielding-melee-weapon-or-shield',
        'Exige estar empunhando arma corpo a corpo ou escudo.',
        'Requires wielding a melee weapon or shield.',
      ),
      informationalEffect(
        'reaction',
        'Usa uma reação.',
        'Uses a reaction.',
      ),
      informationalEffect(
        '1d8',
        'Rola 1d8.',
        'Rolls 1d8.',
      ),
      informationalEffect(
        'add-roll-to-target-ac-against-triggering-attack',
        'Adiciona o resultado à CA contra o ataque que ativou a manobra.',
        'Adds the result to AC against the triggering attack.',
      ),
      informationalEffect(
        'if-attack-still-hits:resistance-to-attack-damage',
        'Se o ataque ainda acertar, concede resistência ao dano desse ataque.',
        'If the attack still hits, grants resistance to that attack damage.',
      ),
    ],
  },
  {
    id: 'fighter-cavalier-hold-the-line',
    names: { 'pt-BR': 'Mantenha a Formação', 'en-US': 'Hold the Line' },
    origin: 'subclass',
    sourceId,
    minimumLevel: 10,
    effects: [
      informationalEffect(
        1.5,
        'Movimento mínimo dentro do alcance que provoca ataque de oportunidade, em metros.',
        'Minimum movement within reach that provokes an opportunity attack, in meters.',
      ),
      informationalEffect(
        'movement-at-least-1.5m-within-reach->opportunity-attack',
        'Mover ao menos 1,5 metro ainda dentro do alcance provoca ataque de oportunidade.',
        'Moving at least 1.5 meters while still within reach provokes an opportunity attack.',
      ),
      informationalEffect(
        'opportunity-attack-hit->speed:0:until-end-of-current-turn',
        'Um acerto desse ataque reduz o deslocamento a zero até o fim do turno atual.',
        'A hit from that attack reduces speed to zero until the end of the current turn.',
      ),
    ],
  },
  {
    id: 'fighter-cavalier-ferocious-charger',
    names: { 'pt-BR': 'Investida Feroz', 'en-US': 'Ferocious Charger' },
    origin: 'subclass',
    sourceId,
    minimumLevel: 15,
    effects: [
      informationalEffect(
        3,
        'Movimento mínimo em linha reta antes do ataque, em metros.',
        'Minimum straight-line movement before the attack, in meters.',
      ),
      informationalEffect(
        'move-at-least-3m-straight-before-attack-hit',
        'Ativada após mover ao menos 3 metros em linha reta e acertar um ataque.',
        'Triggered after moving at least 3 meters in a straight line and hitting an attack.',
      ),
      {
        type: 'informational',
        ability: 'strength',
        savingThrowAbility: 'strength',
        value: '8 + proficiencyBonus + strengthModifier',
        note: {
          'pt-BR': 'CD da salvaguarda de Força.',
          'en-US': 'Strength saving throw DC.',
        },
      },
      informationalEffect(
        'failed-save:prone',
        'Em falha, o alvo fica caído.',
        'On a failure, the target falls prone.',
      ),
      informationalEffect(
        'maximum-once-per-turn',
        'Pode ser usada no máximo uma vez por turno.',
        'Can be used at most once per turn.',
      ),
    ],
  },
  {
    id: 'fighter-cavalier-vigilant-defender',
    names: { 'pt-BR': 'Defensor Vigilante', 'en-US': 'Vigilant Defender' },
    origin: 'subclass',
    sourceId,
    minimumLevel: 18,
    effects: [
      informationalEffect(
        'combat:special-reaction:once-per-other-creature-turn',
        'Em combate, concede uma reação especial uma vez no turno de cada outra criatura.',
        'In combat, grants one special reaction on each other creature turn.',
      ),
      informationalEffect(
        'special-reaction:opportunity-attack-only',
        'A reação especial serve apenas para ataques de oportunidade.',
        'The special reaction can only make opportunity attacks.',
      ),
      informationalEffect(
        'special-reaction:unavailable-on-own-turn',
        'A reação especial não pode ser usada no próprio turno.',
        "The special reaction cannot be used on the Fighter's own turn.",
      ),
      informationalEffect(
        'special-reaction:blocked-if-normal-reaction-used-this-turn',
        'Não pode ser usada no mesmo turno em que a reação normal foi usada.',
        'Cannot be used on the same turn as the normal reaction.',
      ),
    ],
  },
];
