# Arquitetura de `rules-data`

## Objetivo

`rules-data` é a camada destinada a representar regras de jogo como dados tipados, localizáveis e validados. Ela deve permitir cadastrar classes, ancestralidades, características e magias sem acoplar esse conteúdo à interface ou à forma como um personagem é salvo.

O foco do banco é armazenar dados mecânicos estruturados: IDs, níveis, bônus, proficiências, progressões, referências e efeitos. Textos extensos dos livros não devem ser copiados para o banco. Quando uma explicação curta for necessária, ela deve descrever apenas o necessário para apresentar ou aplicar a mecânica.

## Limites da camada

Há três responsabilidades separadas:

- **UI:** apresenta opções, coleta escolhas e traduz dados para a experiência do usuário.
- **`Character` atual:** representa a ficha criada e continua sendo o formato usado por cálculos, presets, storage e PDF.
- **`rules-data`:** descreve o catálogo de regras disponível, sem guardar o estado de uma ficha específica.

O aplicativo atual continua lendo classes e espécies de `src/data/gameData.ts`. A camada `rules-data` ainda não está conectada à interface e não substitui `Character`. A migração será incremental, mantendo o comportamento existente até que cada consumidor seja adaptado explicitamente.

## Identidade e localização

Todo registro possui um `id` estável, em formato técnico e independente do idioma. IDs são usados em referências como `classId`, `featureIds`, `traitIds`, `subclassIds` e `spellIds`; portanto, não devem mudar quando um nome traduzido mudar.

Nomes visíveis usam `LocalizedName`, que exige as duas localidades suportadas:

```ts
{
  'pt-BR': 'Nome em português',
  'en-US': 'English name',
}
```

Textos localizados nunca devem ser usados como chave ou relacionamento entre registros.

## Tipos principais

### Classes e progressão

`ClassDefinition` representa os dados gerais de uma classe: nome, dado de vida, atributos principais, salvaguardas, proficiências, escolhas de perícia, subclasses, progressão e, quando aplicável, conjuração.

`ClassLevelDefinition` representa um nível específico. Ele contém o nível, o bônus de proficiência, os IDs das features recebidas e escolhas opcionais. Classes conjuradoras também podem declarar espaços de magia, truques conhecidos, magias conhecidas ou uma fórmula de preparação.

A progressão usa níveis inteiros de 1 a 20. O tipo é parcial para permitir o cadastro incremental, mas toda entrada existente deve estar nesse intervalo e seu campo `level` deve corresponder à chave da progressão. Uma definição pronta para uso como catálogo completo deve descrever todos os níveis aplicáveis.

`SubclassDefinition` pertence a uma classe por meio de `classId` e referencia suas mecânicas com `featureIds`. Magias próprias da subclasse podem ser referenciadas futuramente por `spellIds`.

`FeatureDefinition` descreve uma característica de classe ou subclasse. `origin` identifica sua origem e `sourceId` aponta para a classe, subclasse, ancestralidade, sub-raça ou linhagem responsável. `minimumLevel` informa o nível em que a feature é desbloqueada.

### Ancestralidades

`AncestryDefinition` descreve tipo de criatura, tamanho, deslocamento, idiomas, regra de atributos, traits e sub-raças disponíveis.

`SubraceDefinition` pertence a uma ancestralidade por meio de `ancestryId`. Ela pode acrescentar sua própria regra de atributos e seus próprios traits sem duplicar a definição principal.

`LineageDefinition` representa uma linhagem independente. Sua estrutura inclui tipo de criatura, tamanho, deslocamento, idiomas, regra de atributos e traits, mas não exige vínculo com uma ancestralidade.

`TraitDefinition` descreve uma característica de ancestralidade, sub-raça ou linhagem. Assim como features, traits podem usar `minimumLevel` para indicar desbloqueio por nível. Um trait sem `minimumLevel` está disponível desde a concessão da origem; quando o campo existir, ele deve usar um nível válido entre 1 e 20.

`AbilityScoreRule` representa como bônus de atributo são concedidos. As variantes atuais são:

- `fixed`: bônus associados diretamente a atributos específicos;
- `flexible-2-1`: um bônus de +2 e outro de +1;
- `flexible-1-1-1`: três bônus de +1;
- `none`: nenhum bônus de atributo.

### Magias e efeitos

`SpellDefinition` representa uma magia por ID, nomes localizados, nível de 0 a 9, escola, marcadores de ritual e concentração e IDs das classes que podem acessá-la.

`MechanicalEffect` é a unidade estruturada de uma mecânica. Seu `type` identifica efeitos como bônus de atributo, proficiência, idioma, resistência, deslocamento, pontos de vida, magia concedida ou arma natural. Os demais campos carregam somente os parâmetros pertinentes ao tipo, como atributo, valor, dano, proficiência ou magia referenciada. `informational` deve ser reservado a uma informação mecânica que ainda não possa ser representada por outro tipo.

## Desbloqueios por nível

Features e traits reutilizáveis são cadastrados separadamente e referenciados por ID. Quando uma mecânica só passa a valer em determinado nível, seu registro usa `minimumLevel`. Para classes, o ID também deve aparecer em `featureIds` do `ClassLevelDefinition` correspondente, deixando explícito em qual ponto da progressão ele é concedido.

## Como ampliar o catálogo

### Adicionar uma classe

1. Defina IDs estáveis para a classe, suas features e suas subclasses.
2. Cadastre as `FeatureDefinition` necessárias no módulo de features.
3. Crie a `ClassDefinition` no módulo de classes, começando pelo nível 1 e preenchendo a progressão de 1 a 20 conforme os dados forem revisados.
4. Cadastre cada `SubclassDefinition` e relacione seus IDs em `subclassIds`.
5. Para uma classe conjuradora, informe `spellcasting` e os dados de magia de cada nível aplicável.
6. Exporte os registros pelo `index.ts` do módulo e cubra referências, níveis e casos especiais com testes.

### Adicionar uma ancestralidade

1. Escolha um ID estável e nomes em `pt-BR` e `en-US`.
2. Cadastre os `TraitDefinition` necessários no módulo de features.
3. Crie a `AncestryDefinition` com tipo, tamanho, deslocamento, idiomas, regra de atributos e `traitIds`.
4. Preencha `subraceIds` apenas quando existirem sub-raças separadas.
5. Exporte o registro pelo módulo de ancestralidades e adicione testes de validação.

### Adicionar uma sub-raça

1. Escolha um ID estável e use `ancestryId` para apontar para a ancestralidade principal.
2. Cadastre somente os traits e bônus próprios da sub-raça, sem duplicar dados herdados.
3. Inclua o ID em `subraceIds` da ancestralidade correspondente.
4. Exporte e teste as duas pontas do relacionamento.

### Registrar magias futuramente

Cada magia deverá ser cadastrada como `SpellDefinition` no módulo de magias, com ID estável, nomes localizados e dados mecânicos estruturados. O nível deve estar entre 0 e 9, e `classIds` deve referenciar somente classes existentes. Features, subclasses ou ancestralidades que concedam uma magia devem apontar para seu ID por `spellId` ou `spellIds`, evitando duplicação. A descrição integral publicada nos livros não deve ser armazenada.

## Validação

`validation.ts` fornece predicados para níveis de classe, níveis de magia, regras de atributo e definições mínimas de classe e ancestralidade. Esses helpers verificam dados em runtime; a tipagem TypeScript continua sendo a primeira linha de consistência durante o desenvolvimento.
