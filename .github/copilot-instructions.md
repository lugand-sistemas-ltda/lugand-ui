# Lugand UI — Princípios Fundamentais

Este arquivo define a lei fundamental da Lugand UI. Todo agente, todo colaborador,
toda instância de AI que trabalhe neste repositório deve conhecer e respeitar estes
princípios. Eles não são sugestões — são a constituição do produto.

---

## O que é a Lugand UI

Uma biblioteca de componentes e engines low-code para Vue 3 + TypeScript, projetada
para padronizar interfaces de sistemas de missão crítica em escala. Serve desde
pequenos projetos bootstrap até ecossistemas enterprise com dezenas de aplicações
simultâneas — como sistemas de governo, fábricas de software e plataformas críticas.

A lib é publicada como `@lugand-sistemas-ltda/vue-ui-lib` (MIT). O produto real não é
apenas os componentes — é a capacidade de um time adotar uma única lib e cobrir: 
formulários, tabelas, gráficos, documentos, assinaturas, temas e low-code, sem
dependências conflitantes entre si.

---

## Os 11 Princípios

### Princípios Imutáveis
> Mudar estes princípios significa refundar a lib. Nunca são violados.

**P1 — Missão**
A lib existe para padronizar a camada de interface de sistemas de missão crítica em
escala. Não resolve regras de negócio. Não tem opinião sobre domínio. Fornece a
infraestrutura visual e interativa sobre a qual qualquer sistema pode ser construído.

**P3 — JSON como fronteira de dados**
A lib não tem opinião sobre origem ou destino dos dados. Recebe JSON estruturado,
entrega JSON estruturado. A ponte entre APIs externas e os componentes é
responsabilidade do consumidor — ou dos adapters que ele escolhe instalar.

**P7 — Contratos, não implementações**
A lib define interfaces e comportamentos esperados. Nunca define como o consumidor
deve implementar sua lógica de negócio, nem impõe bibliotecas de terceiros para
funcionalidades que variam por contexto (PDF, autenticação, persistência, etc.).
Esses pontos são sempre cobertos por adapters com interface definida pelo core.

---

### Princípios Estáveis
> Mudam apenas com grandes decisões arquiteturais deliberadas.

**P2 — Autoconsistência**
Todo componente complexo é construído exclusivamente sobre primitivos e composables
da própria lib. Se algo não pode ser construído com o que a lib oferece, é uma
lacuna a ser preenchida — não uma exceção justificada.

**P4 — Uma solução por problema**
Para cada padrão recorrente existe exatamente uma implementação na lib. Um composable
de busca, um de validação, um de paginação. Quando um padrão superior emerge, o
anterior é refatorado — nunca duplicado em paralelo.

**P8 — SDK Mode vs Runtime Mode**
Engines existem em dois modos com contratos distintos:
- SDK Mode: o desenvolvedor usa para construir e configurar sistemas
- Runtime Mode: o usuário final usa o sistema construído

`FormBuilder` produz schemas. `FormRenderer` os executa. São complementares, nunca
sobrepostos. O usuário final nunca vê o SDK Mode.

**P11 — Cobertura horizontal como valor**
A lib é projetada para ser adotada como ecossistema único. A cobertura horizontal
(formulários + tabelas + gráficos + documentos + assinaturas) em nível adequado vale
mais para o decisor do que excelência vertical em uma única categoria. Qualidade
suficiente em toda a cadeia supera qualidade excepcional em um ponto isolado.
Promessas formais só são feitas sobre o escopo declarado de cada versão.

---

### Princípios Evolutivos
> Mudam conforme padrões melhores são descobertos. Refatoração é obrigatória.

**P5 — Temas em camadas**
O sistema de temas opera em três camadas independentes e ordenadas:
1. Tokens de design (CSS variables) — substituíveis pelo consumidor
2. Temas pré-construídos (dark, dracula, etc.) — selecionáveis
3. Classes de override do consumidor — sempre possíveis sem quebrar comportamento

**P6 — Modularidade por capacidade**
A instalação é intencional e progressiva. Nenhum pacote carrega código de outro sem
dependência declarada explícita. Estrutura de pacotes planejada:
```
@lugand/ui              → primitivos + temas + composables base
@lugand/ui-modules      → DataTable, Modal, Charts, Tabs...
@lugand/ui-engines      → FormBuilder, PageBuilder, DocBuilder
@lugand/ui-locale-br    → validações brasileiras (CPF, CNPJ, datas BR)
@lugand/ui-pdf          → adapter oficial (atualmente jspdf)
```

**P9 — Simplicidade como destino**
Complexidade temporária é aceitável durante exploração de padrões. Quando um padrão
superior é identificado, simplificação é obrigatória. A lib nunca cresce em
superfície sem reduzir em complexidade proporcional em algum ponto.

**P10 — Inferência como ponte**
A lib fornece um sistema de type-registry onde o consumidor declara a estrutura dos
dados de sua aplicação. A partir dessa declaração, os engines em SDK Mode oferecem
binding visual tipo-seguro, sem geração de código manual. O Runtime Mode executa o
resultado sem conhecimento da estrutura original.

---

## Estrutura do repositório

```
packages/
  ui-lib/
    lib/              → entry point da lib publicada (dist)
    src/
      core/           → SchemaBuilder, WidgetSystem, ComponentRegistry, Adapters
      features/       → FormBuilder, PageBuilder, DocBuilder, FormRenderer,
                        CodeGenerator, SchemaInference
      modules/        → DataTable, Modal, Charts, Tabs, Toast, Carousel...
      shared/         → primitivos atômicos + composables + tipos compartilhados
      styles/         → tokens, temas, utilitários CSS
  test-ui-lib/        → aplicação interna de desenvolvimento e validação
```

---

## Versionamento e promessas

- `v0.x.x` — desenvolvimento ativo, sem promessas formais, refatorações livres
- `v1.0.0` — primeiro lançamento público com escopo declarado e garantido
- `v1.x.x` — features incrementais, zero breaking changes
- `vX.x.x-lts` — versões de suporte de longo prazo para contratos enterprise

Breaking changes só ocorrem em versões major e são acompanhadas de guia de migração.
