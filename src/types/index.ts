export type AbilityKey =
  | 'strength'
  | 'dexterity'
  | 'constitution'
  | 'intelligence'
  | 'wisdom'
  | 'charisma';

export type AbilityScores = Record<AbilityKey, number>;

export interface CharacterClass {
  id: string;
  name: string;
  hitDie: number;
  savingThrows: AbilityKey[];
  spellcastingAbility?: AbilityKey;
}

export interface Species {
  id: string;
  name: string;
  speed: number;
  traits: string[];
}

export interface Skill { id: string; name: string; ability: AbilityKey }
export interface Weapon {
  id: string;
  name: string;
  damageDice: string;
  ability: AbilityKey;
  proficient: boolean;
  properties?: string;
}
export interface Attack extends Weapon {
  attackBonusOverride?: number;
  damageBonusOverride?: number;
}
export interface Equipment { id: string; name: string; quantity: number }
export interface Spell {
  id: string;
  name: string;
  level: number;
  school?: string;
  prepared?: boolean;
}
export interface RuleSet {
  id: string;
  name: string;
  totalPoints: number;
  minimumAbility: number;
  maximumAbility: number;
  costTable: Record<number, number>;
  levelLimit: number;
  custom?: boolean;
}

export interface Character {
  id: string;
  name: string;
  playerName: string;
  classId: string;
  subclass: string;
  speciesId: string;
  level: number;
  /** Valores usados exclusivamente para validar o Point Buy. */
  purchasedAbilities: AbilityScores;
  /** Valores finais: Point Buy + bônus de espécie/background/ASI. */
  abilities: AbilityScores;
  proficientSkills: string[];
  expertiseSkills: string[];
  attacks: Attack[];
  equipment: Equipment[];
  spells: Spell[];
  features: string[];
  notes: string;
  portrait?: string;
  ruleSet: RuleSet;
  hpMode: 'average' | 'manual';
  manualHp?: number;
  armorClass: number;
  createdAt: string;
  updatedAt: string;
}

export interface CharacterPreset {
  id: string;
  title: string;
  role: string;
  summary: string;
  character: Omit<Character, 'id' | 'createdAt' | 'updatedAt'>;
}
