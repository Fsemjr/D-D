import type {
  AbilityFormulaDefinition,
  FeatureDefinition,
  MechanicalEffect,
} from '../types';

const sourceId = 'rogue-assassin';
const source = { bookId: 'jvf-classes-subclasses-compendium' };

function informationalEffect(
  value: MechanicalEffect['value'],
  ptBR: string,
  enUS: string,
): MechanicalEffect {
  return { type: 'informational', value, note: { 'pt-BR': ptBR, 'en-US': enUS } };
}

export const rogueAssassinDeathStrikeSaveDc: AbilityFormulaDefinition = {
  base: 8,
  proficiencyBonusMultiplier: 1,
  abilityModifier: 'dexterity',
};

export const rogueAssassinFeatures: FeatureDefinition[] = [
  {
    id: 'rogue-assassin-bonus-proficiencies',
    names: { 'pt-BR': 'Proficiência Adicional', 'en-US': 'Bonus Proficiencies' },
    origin: 'subclass',
    sourceId,
    source,
    minimumLevel: 3,
    effects: [
      { type: 'tool-proficiency', proficiencyId: 'disguise-kit' },
      { type: 'tool-proficiency', proficiencyId: 'poisoners-kit' },
    ],
  },
  {
    id: 'rogue-assassin-assassinate',
    names: { 'pt-BR': 'Assassinar', 'en-US': 'Assassinate' },
    origin: 'subclass',
    sourceId,
    source,
    minimumLevel: 3,
    effects: [
      {
        type: 'roll-modifier',
        rollTypes: ['attack-roll'],
        condition: 'target-has-not-taken-turn-in-current-combat',
        value: 'advantage',
      },
      {
        type: 'roll-modifier',
        trigger: { event: 'attack-hit', conditions: ['target-surprised'] },
        rollTypes: ['attack-roll'],
        condition: 'target-surprised',
        automaticCriticalHit: true,
        value: 'critical-hit',
      },
    ],
  },
  {
    id: 'rogue-assassin-infiltration-expertise',
    names: { 'pt-BR': 'Especialização em Infiltração', 'en-US': 'Infiltration Expertise' },
    origin: 'subclass',
    sourceId,
    source,
    minimumLevel: 9,
    preparation: { value: 7, unit: 'day' },
    cost: { amount: 25, currency: 'gp' },
    effects: [
      informationalEffect('fabricated-identity', 'Cria uma identidade falsa.', 'Creates a false identity.'),
      informationalEffect('identity-has-history', 'A identidade possui uma história.', 'The identity has a history.'),
      informationalEffect('identity-has-profession', 'A identidade possui uma profissão.', 'The identity has a profession.'),
      informationalEffect('identity-has-affiliations', 'A identidade possui afiliações.', 'The identity has affiliations.'),
      informationalEffect('cannot-be-existing-real-person', 'A identidade não pode pertencer a uma pessoa real existente.', 'The identity cannot belong to an existing real person.'),
      informationalEffect('believed-until-evident-reason-to-suspect', 'Outros acreditam na identidade até terem uma razão evidente para suspeitar.', 'Others believe the identity until given an evident reason to suspect it.'),
    ],
  },
  {
    id: 'rogue-assassin-impostor',
    names: { 'pt-BR': 'Impostor', 'en-US': 'Impostor' },
    origin: 'subclass',
    sourceId,
    source,
    minimumLevel: 13,
    preparation: { value: 3, unit: 'hour' },
    effects: [
      informationalEffect('mimic-speech-after-listening', 'Imita a fala após ouvi-la.', 'Mimics speech after listening to it.'),
      informationalEffect('mimic-writing-after-examining', 'Imita a escrita após examiná-la.', 'Mimics writing after examining it.'),
      informationalEffect('mimic-behavior-after-observing-mannerisms', 'Imita o comportamento após observar os maneirismos.', 'Mimics behavior after observing mannerisms.'),
      informationalEffect('indistinguishable-to-casual-observer', 'A imitação é indistinguível para um observador casual.', 'The imitation is indistinguishable to a casual observer.'),
      {
        type: 'roll-modifier',
        ability: 'charisma',
        proficiencyId: 'deception',
        rollTypes: ['ability-check'],
        condition: 'identity-challenged-by-suspicious-creature',
        value: 'advantage',
      },
    ],
  },
  {
    id: 'rogue-assassin-death-strike',
    names: { 'pt-BR': 'Golpe Letal', 'en-US': 'Death Strike' },
    origin: 'subclass',
    sourceId,
    source,
    minimumLevel: 17,
    trigger: { event: 'attack-hit', conditions: ['target-surprised'] },
    target: { kind: 'creature', conditions: ['surprised'] },
    save: {
      ability: 'constitution',
      dc: rogueAssassinDeathStrikeSaveDc,
      onFailure: [{ type: 'damage', damageMultiplier: 2 }],
    },
  },
];
