import type { FeatureDefinition, MechanicalEffect } from '../types';

const sourceId = 'rogue-arcane-trickster';
const source = { bookId: 'jvf-classes-subclasses-compendium' };

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

export const rogueArcaneTricksterFeatures: FeatureDefinition[] = [
  {
    id: 'rogue-arcane-trickster-spellcasting',
    names: { 'pt-BR': 'Conjuração', 'en-US': 'Spellcasting' },
    origin: 'subclass',
    sourceId,
    source,
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
    id: 'rogue-arcane-trickster-mage-hand-legerdemain',
    names: {
      'pt-BR': 'Mãos Mágicas Malabaristas',
      'en-US': 'Mage Hand Legerdemain',
    },
    origin: 'subclass',
    sourceId,
    source,
    minimumLevel: 3,
    trigger: { event: 'spell-cast', sourceId: 'mage-hand' },
    effects: [
      {
        ...informationalEffect(
          'may-be-invisible',
          'A mão espectral pode ficar invisível.',
          'The spectral hand can be invisible.',
        ),
        spellId: 'mage-hand',
      },
      {
        ...informationalEffect(
          'remote-object-interaction',
          'Permite guardar ou recuperar objetos de recipientes vestidos ou carregados por outra criatura.',
          'Allows stashing or retrieving objects from containers worn or carried by another creature.',
        ),
        spellId: 'mage-hand',
        actionOptions: [
          'stash-held-object-in-container-worn-or-carried-by-another-creature',
          'retrieve-object-from-container-worn-or-carried-by-another-creature',
        ],
      },
      {
        ...informationalEffect(
          'remote-thieves-tools',
          'Permite usar ferramentas de ladrão à distância para abrir fechaduras ou desarmar armadilhas.',
          "Allows remote use of thieves' tools to open locks or disarm traps.",
        ),
        spellId: 'mage-hand',
        proficiencyId: 'thieves-tools',
        actionOptions: ['open-lock', 'disarm-trap'],
      },
      {
        ...informationalEffect(
          'unnoticed-on-successful-contested-check',
          'As tarefas podem passar despercebidas ao vencer o teste resistido.',
          'The tasks can go unnoticed after winning the contested check.',
        ),
        spellId: 'mage-hand',
        contestedCheck: {
          actor: { ability: 'dexterity', proficiencyId: 'sleight-of-hand' },
          opponent: { ability: 'wisdom', proficiencyId: 'perception' },
        },
      },
      {
        ...informationalEffect(
          'bonus-action-control-mage-hand',
          'A ação bônus da Ação Ardilosa pode controlar mãos mágicas.',
          "Cunning Action's bonus action can control mage hand.",
        ),
        activation: 'bonus-action',
        spellId: 'mage-hand',
        triggerFeatureId: 'rogue-cunning-action',
      },
    ],
  },
  {
    id: 'rogue-arcane-trickster-magical-ambush',
    names: { 'pt-BR': 'Emboscada Mágica', 'en-US': 'Magical Ambush' },
    origin: 'subclass',
    sourceId,
    source,
    minimumLevel: 9,
    trigger: {
      event: 'spell-cast',
      conditions: ['caster-hidden-from-target', 'spell-targets-creature'],
    },
    duration: { type: 'until-end-of-current-turn' },
    effects: [{
      type: 'roll-modifier',
      rollTypes: ['saving-throw'],
      condition: 'target-save-against-triggering-spell',
      value: 'disadvantage',
    }],
  },
  {
    id: 'rogue-arcane-trickster-versatile-trickster',
    names: { 'pt-BR': 'Trapaceiro Versátil', 'en-US': 'Versatile Trickster' },
    origin: 'subclass',
    sourceId,
    source,
    minimumLevel: 13,
    activation: 'bonus-action',
    range: { value: 1.5, unit: 'meter' },
    rangeOriginId: 'mage-hand',
    target: { kind: 'creature', count: 1 },
    duration: { type: 'until-end-of-current-turn' },
    effects: [{
      type: 'roll-modifier',
      spellId: 'mage-hand',
      rollTypes: ['attack-roll'],
      condition: 'attacks-against-selected-target',
      value: 'advantage',
    }],
  },
  {
    id: 'rogue-arcane-trickster-spell-thief',
    names: { 'pt-BR': 'Ladrão de Magia', 'en-US': 'Spell Thief' },
    origin: 'subclass',
    sourceId,
    source,
    minimumLevel: 17,
    activation: 'reaction',
    trigger: {
      event: 'after-spell-cast',
      conditions: ['rogue-is-target-or-included-in-area-of-effect'],
    },
    target: { kind: 'self' },
    usage: { freeUses: 1, recovery: 'long-rest' },
    save: {
      abilitySource: 'caster-spellcasting-ability',
      roller: 'triggering-creature',
      dc: {
        type: 'reference',
        referenceId: 'rogue-arcane-trickster-spellcasting',
        property: 'spell-save-dc',
      },
      onFailure: [
        {
          type: 'spell-effect-negation',
          condition: 'triggering-spell-effect-on-rogue',
        },
        {
          type: 'temporary-spell-knowledge',
          condition: 'triggering-spell-eligible-for-theft',
          spellLevelMinimum: 1,
          spellLevelMaximum: 'available-spell-slots',
          spellListRestriction: 'none',
          duration: { type: 'hours', value: 8 },
          usesOwnSpellSlots: true,
          originalCasterLockout: true,
        },
      ],
    },
  },
];
