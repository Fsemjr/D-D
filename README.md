# Forja de Heróis

Aplicação web local para criar rapidamente personagens de D&D 5e, especialmente personagens de nível 5 para one-shots. O editor guiado calcula regras derivadas, mantém uma ficha visual independente e exporta um PDF imprimível.

## Stack

React 19, TypeScript, Vite, CSS responsivo, LocalStorage, jsPDF, Vitest e ESLint. Não há backend, conta, telemetria ou sincronização remota.

## Recursos

- Criação guiada em oito etapas e **Criação Rápida** a partir de dez arquétipos jogáveis.
- Níveis 1–20; atributos, proficiência, iniciativa, perícias, salvaguardas, ataques, dano e PV calculados por um motor de regras isolado.
- Point Buy padrão de 27 pontos e uma configuração Custom extensível.
- Escolhas explícitas de subclasse, perícias, armas, equipamento e magias.
- Retrato PNG/JPEG/WEBP (até 3 MB), ficha reutilizável e PDF multipágina.
- Biblioteca local com edição, duplicação, exclusão e exportação.

## Instalação e comandos

Requer Node.js 20 ou mais recente.

```bash
npm install
npm run dev       # http://localhost:5173
npm run test
npm run lint
npm run build
npm run preview   # conferir o build localmente
```

## Estrutura

```text
src/
├── components/   # ficha visual reutilizável
├── data/         # classes, espécies e perícias
├── i18n/         # catálogo inicial pt-BR
├── pdf/          # representação Character -> PDF
├── presets/      # arquétipos estruturados
├── rules/        # motor puro, RuleSets e testes
├── storage/      # persistência local
├── types/        # contratos de domínio TypeScript
└── App.tsx       # navegação e editor guiado
```

O fluxo de dados é `Editor → Character → CharacterSheet/PDF`; o gerador de PDF não lê o DOM do formulário.

## Adicionando um preset

Adicione um `CharacterPreset` ao array em `src/presets/index.ts`. Preencha todos os campos de `character`; a grade é gerada a partir dos dados e não precisa ser alterada. Em uma expansão maior, esse módulo pode ser dividido em JSONs validados durante o build.

## Adicionando um RuleSet

Implemente um objeto `RuleSet` em `src/rules/ruleSets.ts` com identificador, nome, total de pontos, mínimo/máximo, tabela de custos e limite de nível. Depois exponha a opção no seletor do editor. A validação e o custo usam apenas o contrato, não conhecem regras específicas.

## Decisões técnicas

- **LocalStorage:** simples e adequado à primeira versão; retratos em Data URL tornam o limite do navegador uma restrição real. Uma migração futura pode usar IndexedDB.
- **Regras puras:** nenhum cálculo depende de React, facilitando testes e futuras versões de regras.
- **PV:** usa dado máximo no 1º nível e média arredondada para cima nos demais; pode ser substituído manualmente. Rolagem foi deixada fora do escopo.
- **CA:** é informada pelo jogador, pois proficiências, armaduras, escudos e efeitos exigem escolhas e exceções que não devem ser inferidas silenciosamente.
- **Conteúdo de regras:** subclasses, talentos e listas integrais de magias não estão embutidos; a mesa registra as escolhas em campos livres, evitando alegar cobertura de compêndio completo.
- **Custom:** permite editar orçamento, mínimo, máximo, tabela de custos e limite de nível; configurações inconsistentes bloqueiam o avanço e o salvamento.

## Limitações e próximos passos

O navegador não sincroniza personagens entre dispositivos; limpar os dados do site remove a biblioteca. O PDF usa uma composição própria e não replica a ficha oficial. Próximos passos naturais são IndexedDB, importação/exportação JSON, acessibilidade auditada, testes de interface e módulos opcionais de subclasses/talentos licenciados.

## Modelo de atributos

`purchasedAbilities` guarda somente os valores pagos pelo Point Buy e é o único conjunto validado contra o `RuleSet`. `abilities` guarda os valores finais usados nos cálculos da ficha, depois de bônus de espécie/background, ASI ou talentos. Essa separação permite que um atributo final ultrapasse 15 sem invalidar a compra original.
