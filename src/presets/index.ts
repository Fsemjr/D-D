import type { AbilityScores, CharacterPreset, Spell } from '../types';
import { standardRuleSet } from '../rules/ruleSets';

const purchased: AbilityScores = {
  strength: 15,
  dexterity: 14,
  constitution: 13,
  intelligence: 12,
  wisdom: 10,
  charisma: 8,
};

const spell = (id: string, name: string, level: number): Spell => ({ id, name, level, prepared: true });

interface PresetOptions {
  id: string; title: string; role: string; classId: string; speciesId: string;
  abilities: AbilityScores; armorClass: number; weapon: string; damageDice: string;
  spells?: Spell[]; skills?: string[]; expertise?: string[];
}

const make = (options: PresetOptions): CharacterPreset => ({
  id: options.id,
  title: options.title,
  role: options.role,
  summary: `Um ${options.role.toLowerCase()} de nível 5, pronto para entrar em cena.`,
  character: {
    name: options.title,
    playerName: '',
    classId: options.classId,
    subclass: '',
    speciesId: options.speciesId,
    level: 5,
    purchasedAbilities: { ...purchased },
    abilities: options.abilities,
    proficientSkills: options.skills ?? ['perception', 'athletics'],
    expertiseSkills: options.expertise ?? [],
    attacks: [{
      id: 'main', name: options.weapon, damageDice: options.damageDice,
      ability: ['rogue', 'ranger', 'monk'].includes(options.classId) ? 'dexterity' : 'strength',
      proficient: true,
    }],
    equipment: [
      { id: 'pack', name: 'Mochila de aventureiro', quantity: 1 },
      { id: 'armor', name: 'Armadura e suprimentos', quantity: 1 },
    ],
    spells: options.spells ?? [],
    features: ['Arquétipo de nível 5', 'Ataques e recursos de classe'],
    notes: 'Ajuste escolhas de subclasse e recursos conforme os livros permitidos pela mesa.',
    ruleSet: standardRuleSet,
    hpMode: 'average',
    armorClass: options.armorClass,
  },
});

const final = (changes: Partial<AbilityScores>): AbilityScores => ({ ...purchased, ...changes });

export const presets: CharacterPreset[] = [
  make({ id: 'tank', title: 'Brom Escudo-de-Ferro', role: 'Guerreiro tanque', classId: 'fighter', speciesId: 'dwarf', abilities: final({ strength: 17, constitution: 15 }), armorClass: 18, weapon: 'Espada longa', damageDice: '1d8' }),
  make({ id: 'barbarian', title: 'Kaela Presa Rubra', role: 'Bárbaro de força', classId: 'barbarian', speciesId: 'human', abilities: final({ strength: 17, constitution: 14 }), armorClass: 15, weapon: 'Machado grande', damageDice: '1d12' }),
  make({ id: 'rogue', title: 'Nim Passo-Leve', role: 'Ladino furtivo', classId: 'rogue', speciesId: 'halfling', abilities: final({ dexterity: 16 }), armorClass: 15, weapon: 'Rapieira', damageDice: '1d8', skills: ['stealth', 'perception', 'acrobatics'], expertise: ['stealth'] }),
  make({ id: 'wizard', title: 'Elara das Cinzas', role: 'Mago ofensivo', classId: 'wizard', speciesId: 'elf', abilities: final({ intelligence: 16 }), armorClass: 13, weapon: 'Bordão', damageDice: '1d6', spells: [spell('fire-bolt', 'Raio de Fogo', 0), spell('magic-missile', 'Mísseis Mágicos', 1), spell('fireball', 'Bola de Fogo', 3)] }),
  make({ id: 'cleric', title: 'Irmã Maelis', role: 'Clérigo suporte', classId: 'cleric', speciesId: 'human', abilities: final({ wisdom: 16 }), armorClass: 18, weapon: 'Maça', damageDice: '1d6', spells: [spell('guidance', 'Orientação', 0), spell('cure-wounds', 'Curar Ferimentos', 1), spell('healing-word', 'Palavra Curativa', 1)] }),
  make({ id: 'paladin', title: 'Sir Aldren', role: 'Paladino guardião', classId: 'paladin', speciesId: 'dragonborn', abilities: final({ strength: 17, charisma: 10 }), armorClass: 18, weapon: 'Espada longa', damageDice: '1d8', spells: [spell('bless', 'Benção', 1), spell('cure-wounds-paladin', 'Curar Ferimentos', 1)] }),
  make({ id: 'ranger', title: 'Lyra Vento-Norte', role: 'Ranger batedora', classId: 'ranger', speciesId: 'elf', abilities: final({ dexterity: 16, wisdom: 12 }), armorClass: 16, weapon: 'Arco longo', damageDice: '1d8', spells: [spell('hunters-mark', 'Marca do Caçador', 1), spell('cure-wounds-ranger', 'Curar Ferimentos', 1)] }),
  make({ id: 'bard', title: 'Téo Cordas-de-Prata', role: 'Bardo versátil', classId: 'bard', speciesId: 'tiefling', abilities: final({ charisma: 16 }), armorClass: 15, weapon: 'Rapieira', damageDice: '1d8', spells: [spell('mockery', 'Zombaria Viciosa', 0), spell('healing-word-bard', 'Palavra Curativa', 1), spell('dissonant-whispers', 'Sussurros Dissonantes', 1)] }),
  make({ id: 'monk', title: 'Shen da Água Serena', role: 'Monge ágil', classId: 'monk', speciesId: 'human', abilities: final({ dexterity: 16, wisdom: 12 }), armorClass: 16, weapon: 'Bastão', damageDice: '1d6' }),
  make({ id: 'warlock', title: 'Vesper Noctis', role: 'Bruxo ocultista', classId: 'warlock', speciesId: 'tiefling', abilities: final({ charisma: 16 }), armorClass: 14, weapon: 'Adaga', damageDice: '1d4', spells: [spell('eldritch-blast', 'Rajada Mística', 0), spell('armor-agathys', 'Armadura de Agathys', 1), spell('hellish-rebuke', 'Repreensão Infernal', 1)] }),
];
