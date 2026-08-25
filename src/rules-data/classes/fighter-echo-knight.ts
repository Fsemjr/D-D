import type { ResourceDefinition, SubclassDefinition } from '../types';
import { fighterEchoKnightFeatures } from '../features/fighter-echo-knight';

export const fighterEchoKnightUnleashIncarnationUses: ResourceDefinition = {
  id: 'fighter-echo-knight-unleash-incarnation-uses',
  names: { 'pt-BR': 'Usos de Desencadear Encarnação', 'en-US': 'Unleash Incarnation Uses' },
  recovery: 'long-rest',
  progression: [{
    level: 3,
    maximum: { type: 'ability-modifier', ability: 'constitution', minimum: 1 },
  }],
};

export const fighterEchoKnightShadowMartyrUses: ResourceDefinition = {
  id: 'fighter-echo-knight-shadow-martyr-uses',
  names: { 'pt-BR': 'Usos de Mártir das Sombras', 'en-US': 'Shadow Martyr Uses' },
  recovery: 'short-or-long-rest',
  progression: [{ level: 10, maximum: 1 }],
};

export const fighterEchoKnightReclaimPotentialUses: ResourceDefinition = {
  id: 'fighter-echo-knight-reclaim-potential-uses',
  names: { 'pt-BR': 'Usos de Reivindicar o Potencial', 'en-US': 'Reclaim Potential Uses' },
  recovery: 'long-rest',
  progression: [{
    level: 15,
    maximum: { type: 'ability-modifier', ability: 'constitution', minimum: 1 },
  }],
};

export const fighterEchoKnightSubclass: SubclassDefinition = {
  id: 'fighter-echo-knight',
  classId: 'fighter',
  names: { 'pt-BR': 'Cavaleiro do Eco', 'en-US': 'Echo Knight' },
  source: { bookId: 'jvf-classes-subclasses-compendium' },
  tags: [
    'martial',
    'teleportation',
    'battlefield-control',
    'echo',
    'positioning',
    'tactical',
  ],
  summary: {
    'pt-BR': 'Combatente tático que manifesta ecos para controlar posições, atacar e teleportar pelo campo de batalha.',
    'en-US': 'A tactical combatant who manifests echoes to control positions, attack, and teleport across the battlefield.',
  },
  featureIds: fighterEchoKnightFeatures.map(({ id }) => id),
  resources: [
    fighterEchoKnightUnleashIncarnationUses,
    fighterEchoKnightShadowMartyrUses,
    fighterEchoKnightReclaimPotentialUses,
  ],
};
