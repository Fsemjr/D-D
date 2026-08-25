import type { FeatureDefinition, MechanicalEffect } from '../types';

const sourceId = 'fighter-banneret';

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

export const fighterBanneretFeatures: FeatureDefinition[] = [
  {
    id: 'fighter-banneret-rallying-cry',
    names: { 'pt-BR': 'Pranto da União', 'en-US': 'Rallying Cry' },
    origin: 'subclass',
    sourceId,
    minimumLevel: 3,
    effects: [
      {
        ...informationalEffect(
          'trigger:feature-use',
          'Ativada quando o Guerreiro usa Retomar o Fôlego.',
          'Triggered when the Fighter uses Second Wind.',
        ),
        triggerFeatureId: 'fighter-second-wind',
      },
      {
        type: 'informational',
        value: 'maximum-allied-target-count',
        progression: [{ level: 3, value: 3 }],
        note: {
          'pt-BR': 'Escolhe até três criaturas aliadas.',
          'en-US': 'Chooses up to three allied creatures.',
        },
      },
      informationalEffect(
        18,
        'Alcance até os aliados, em metros.',
        'Range to allied targets, in meters.',
      ),
      informationalEffect(
        'allies:must-see-and-hear-fighter',
        'Cada aliado precisa ver e ouvir o Guerreiro.',
        'Each ally must see and hear the Fighter.',
      ),
      {
        type: 'flat-hp',
        value: 'fighterLevel',
        note: {
          'pt-BR': 'Cada aliado recupera PV iguais ao nível de Guerreiro.',
          'en-US': 'Each ally regains HP equal to the Fighter level.',
        },
      },
    ],
  },
  {
    id: 'fighter-banneret-royal-envoy',
    names: { 'pt-BR': 'Enviado Real', 'en-US': 'Royal Envoy' },
    origin: 'subclass',
    sourceId,
    minimumLevel: 7,
    effects: [
      {
        type: 'skill-proficiency',
        proficiencyId: 'persuasion',
      },
      {
        type: 'expertise',
        proficiencyId: 'persuasion',
        value: 2,
        note: {
          'pt-BR': 'Dobra o bônus de proficiência em testes que usam Persuasão.',
          'en-US': 'Doubles the proficiency bonus on checks that use Persuasion.',
        },
      },
    ],
  },
  {
    id: 'fighter-banneret-inspiring-surge',
    names: { 'pt-BR': 'Onda Inspiradora', 'en-US': 'Inspiring Surge' },
    origin: 'subclass',
    sourceId,
    minimumLevel: 10,
    effects: [
      {
        ...informationalEffect(
          'trigger:feature-use',
          'Ativada quando o Guerreiro usa Surto de Ação.',
          'Triggered when the Fighter uses Action Surge.',
        ),
        triggerFeatureId: 'fighter-action-surge',
      },
      {
        type: 'informational',
        value: 'maximum-allied-target-count',
        progression: [
          { level: 10, value: 1 },
          { level: 17, value: 2 },
        ],
        note: {
          'pt-BR': 'Quantidade máxima de aliados escolhidos.',
          'en-US': 'Maximum number of allied targets.',
        },
      },
      informationalEffect(
        18,
        'Alcance até os aliados, em metros.',
        'Range to allied targets, in meters.',
      ),
      informationalEffect(
        'allies:must-see-and-hear-fighter',
        'Cada aliado precisa ver e ouvir o Guerreiro.',
        'Each ally must see and hear the Fighter.',
      ),
      informationalEffect(
        'ally-reaction:melee-or-ranged-attack',
        'Cada aliado escolhido pode usar a própria reação para fazer um ataque corpo a corpo ou à distância.',
        'Each chosen ally can use its own reaction to make a melee or ranged attack.',
      ),
    ],
  },
  {
    id: 'fighter-banneret-bulwark',
    names: { 'pt-BR': 'Bastião', 'en-US': 'Bulwark' },
    origin: 'subclass',
    sourceId,
    minimumLevel: 15,
    effects: [
      {
        ...informationalEffect(
          'trigger:feature-use-to-reroll-saving-throw',
          'Ativada ao usar Indomado para refazer uma salvaguarda permitida.',
          'Triggered by using Indomitable to reroll an allowed saving throw.',
        ),
        triggerFeatureId: 'fighter-indomitable',
        abilityOptions: ['intelligence', 'wisdom', 'charisma'],
      },
      informationalEffect(
        'requires:fighter-not-incapacitated',
        'O Guerreiro não pode estar incapacitado.',
        'The Fighter must not be incapacitated.',
      ),
      informationalEffect(
        'allied-target-count:1',
        'Escolhe um aliado.',
        'Chooses one ally.',
      ),
      informationalEffect(
        18,
        'Alcance até o aliado, em metros.',
        'Range to the allied target, in meters.',
      ),
      informationalEffect(
        'ally:failed-save-against-same-effect;must-see-and-hear-fighter',
        'O aliado deve ter falhado contra o mesmo efeito e precisa ver e ouvir o Guerreiro.',
        'The ally must have failed against the same effect and must see and hear the Fighter.',
      ),
      informationalEffect(
        'ally-reroll-saving-throw:must-use-new-result',
        'O aliado refaz a salvaguarda e deve usar o novo resultado.',
        'The ally rerolls the saving throw and must use the new result.',
      ),
    ],
  },
];
