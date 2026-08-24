import type { SpellcastingDefinition, SubclassDefinition } from '../types';
import { fighterEldritchKnightFeatures } from '../features/fighter-eldritch-knight';

export const fighterEldritchKnightSpellcasting: SpellcastingDefinition = {
  ability: 'intelligence',
  preparationMode: 'known',
  startsAtLevel: 3,
  spellListId: 'wizard',
  slotRecovery: 'long-rest',
  allowedSchools: ['abjuration', 'evocation'],
  schoolRestrictionExceptionLevels: [8, 14, 20],
  initialUnrestrictedSpells: 1,
  knownSpellReplacementsPerLevel: 1,
  preserveUnrestrictedSchoolChoiceOnReplacement: true,
  knownSpellLevelLimit: 'available-spell-slots',
  saveDcFormula: '8 + proficiencyBonus + intelligenceModifier',
  attackModifierFormula: 'proficiencyBonus + intelligenceModifier',
  progression: {
    3: { level: 3, cantripsKnown: 2, spellsKnown: 3, spellSlots: { 1: 2 } },
    4: { level: 4, cantripsKnown: 2, spellsKnown: 4, spellSlots: { 1: 3 } },
    5: { level: 5, cantripsKnown: 2, spellsKnown: 4, spellSlots: { 1: 3 } },
    6: { level: 6, cantripsKnown: 2, spellsKnown: 4, spellSlots: { 1: 3 } },
    7: { level: 7, cantripsKnown: 2, spellsKnown: 5, spellSlots: { 1: 4, 2: 2 } },
    8: { level: 8, cantripsKnown: 2, spellsKnown: 6, spellSlots: { 1: 4, 2: 2 } },
    9: { level: 9, cantripsKnown: 2, spellsKnown: 6, spellSlots: { 1: 4, 2: 2 } },
    10: { level: 10, cantripsKnown: 3, spellsKnown: 7, spellSlots: { 1: 4, 2: 3 } },
    11: { level: 11, cantripsKnown: 3, spellsKnown: 8, spellSlots: { 1: 4, 2: 3 } },
    12: { level: 12, cantripsKnown: 3, spellsKnown: 8, spellSlots: { 1: 4, 2: 3 } },
    13: { level: 13, cantripsKnown: 3, spellsKnown: 9, spellSlots: { 1: 4, 2: 3, 3: 2 } },
    14: { level: 14, cantripsKnown: 3, spellsKnown: 10, spellSlots: { 1: 4, 2: 3, 3: 2 } },
    15: { level: 15, cantripsKnown: 3, spellsKnown: 10, spellSlots: { 1: 4, 2: 3, 3: 2 } },
    16: { level: 16, cantripsKnown: 3, spellsKnown: 11, spellSlots: { 1: 4, 2: 3, 3: 3 } },
    17: { level: 17, cantripsKnown: 3, spellsKnown: 11, spellSlots: { 1: 4, 2: 3, 3: 3 } },
    18: { level: 18, cantripsKnown: 3, spellsKnown: 11, spellSlots: { 1: 4, 2: 3, 3: 3 } },
    19: { level: 19, cantripsKnown: 3, spellsKnown: 12, spellSlots: { 1: 4, 2: 3, 3: 3, 4: 1 } },
    20: { level: 20, cantripsKnown: 3, spellsKnown: 13, spellSlots: { 1: 4, 2: 3, 3: 3, 4: 1 } },
  },
};

export const fighterEldritchKnightSubclass: SubclassDefinition = {
  id: 'fighter-eldritch-knight',
  classId: 'fighter',
  names: { 'pt-BR': 'Cavaleiro Arcano', 'en-US': 'Eldritch Knight' },
  source: { bookId: 'jvf-classes-subclasses-compendium' },
  tags: ['martial', 'spellcasting', 'wizard-magic', 'weapon-focused'],
  summary: {
    'pt-BR': 'Subclasse marcial que combina combate com armas e magia de mago baseada em Inteligência.',
    'en-US': 'A martial subclass combining weapon combat with Intelligence-based wizard spellcasting.',
  },
  featureIds: fighterEldritchKnightFeatures.map(({ id }) => id),
  spellcasting: fighterEldritchKnightSpellcasting,
};
