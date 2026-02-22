# 🎨 FASE 6 - Code Generator

**Status:** ✅ **COMPLETO** - Build: 360 módulos, 435.27 KB (102.10 KB gzip)

Gerador de código que transforma `PageSchema` JSON em arquivos `.vue` SFC production-ready.

---

## 📋 Visão Geral

O **Code Generator** é a última peça da plataforma low-code, permitindo exportar schemas JSON para código Vue nativo que pode ser editado e mantido pelos desenvolvedores.

**Fluxo completo da plataforma:**

```
FASE 4: Form Builder → Design form visualmente
    ↓
FASE 5: Page Builder → Design page visualmente
    ↓
FASE 6: Code Generator → Export to .vue files ✨
    ↓
Código production-ready!
```

---

## 🚀 Funcionalidades

### ✅ Geração de Código

- **Vue SFC**: Gera arquivos `.vue` completos (template + script + style)
- **TypeScript**: Suporte completo com tipos
- **Import Optimization**: Tree-shaking, dedupe, sorting
- **Multiple Formats**: Vue, TypeScript export, JSON

### ✅ Customização

- **Script Styles**: `setup`, `options`, `composition`
- **Style Languages**: `css`, `scss`, `sass`, `less`
- **Import Strategies**: `named`, `default`, `namespace`
- **Naming Conventions**: `PascalCase`, `kebab-case`, `camelCase`, `snake_case`

### ✅ Validação & Análise

- **Schema Validation**: Valida antes de gerar
- **Schema Analysis**: Estatísticas sobre widgets, data sources, handlers
- **Component Usage**: Análise de quais componentes são usados
- **Import Detection**: Detecta automaticamente imports necessários

### ✅ Operações em Lote

- **Batch Generation**: Gera múltiplos arquivos de uma vez
- **Router Config**: Gera configuração de rotas (opcional)
- **Barrel Exports**: Gera index.ts com exports (opcional)

### ✅ File Operations

- **Download**: Baixa arquivo gerado
- **Copy to Clipboard**: Copia código gerado
- **Save to File**: Salva em file system (VS Code API)

---

## 📦 Arquitetura

```
src/features/code-generator/
├── types.ts                       # 600+ linhas - Sistema completo de tipos
├── useCodeGenerator.ts            # 650+ linhas - Composable principal
├── templates/
│   ├── vue-sfc.template.ts       # Gerador de Vue SFC
│   └── import-generator.ts       # Gerador de imports otimizados
├── index.ts                      # Barrel exports
├── EXAMPLES.ts                   # 7 exemplos de uso
└── README.md                     # Esta documentação
```

---

## 🎯 Uso Básico

### 1. Geração Simples

```typescript
import { useCodeGenerator } from "@lugand-sistemas-ltda/vue-ui-lib";
import type { PageSchema } from "@lugand-sistemas-ltda/vue-ui-lib";

const schema: PageSchema = {
  id: "products-page",
  type: "page",
  metadata: {
    title: "Products Page",
    version: "1.0.0",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  layout: { type: "flex", responsive: {} },
  widgets: [
    {
      id: "products-table",
      type: "data-table",
      config: {
        columns: [
          { key: "name", label: "Name" },
          { key: "price", label: "Price" },
        ],
        sortable: true,
        paginated: true,
      },
    },
  ],
};

const generator = useCodeGenerator({
  typescript: true,
  includeComments: true,
  scopedStyles: true,
});

const result = await generator.generate(schema);

console.log(result.content);
// Output: Vue SFC completo

generator.downloadCode();
// Download: ProductsPage.vue
```

### 2. Com Validação

```typescript
const generator = useCodeGenerator();

// Valida schema antes
const validation = generator.validateSchema(schema);

if (!validation.isValid) {
  console.error("Erros:", validation.errors);
  return;
}

console.log("Análise:", validation.analysis);
// {
//   uniqueWidgets: ['data-table'],
//   totalWidgets: 1,
//   hasDataSources: false,
//   complexComponents: ['data-table']
// }

const result = await generator.generate(schema);
```

### 3. Diferentes Formatos

```typescript
const generator = useCodeGenerator();

// Vue SFC
generator.updateOptions({ format: "vue-sfc" });
const vue = await generator.generate(schema);

// TypeScript export
generator.updateOptions({ format: "typescript" });
const ts = await generator.generate(schema);

// JSON
generator.updateOptions({ format: "json" });
const json = await generator.generate(schema);
```

### 4. Batch Generation

```typescript
const schemas: PageSchema[] = [
  { id: 'home', ... },
  { id: 'about', ... },
  { id: 'contact', ... }
]

const result = await generator.batchGenerate({
  schemas,
  options: generator.options.value,
  outputDir: './src/views/generated',
  generateRouterIndex: true
})

console.log(`Gerados ${result.successCount} de ${result.totalFiles} arquivos`)
```

---

## ⚙️ Opções de Configuração

```typescript
interface CodeGeneratorOptions {
  // Formato
  format: "vue-sfc" | "typescript" | "javascript" | "json";

  // Vue SFC
  scriptStyle?: "setup" | "options" | "composition";
  styleLang?: "css" | "scss" | "sass" | "less";
  scopedStyles?: boolean;

  // Imports
  importStrategy?: "named" | "default" | "namespace";
  packageName?: string;

  // Naming
  namingConvention?: "PascalCase" | "kebab-case" | "camelCase" | "snake_case";
  componentPrefix?: string;

  // Code Style
  typescript?: boolean;
  includeComments?: boolean;
  includeMetadata?: boolean;
  formatCode?: boolean;
  indentSize?: number;
  singleQuotes?: boolean;

  // Features
  templateOnly?: boolean;
  includeRouter?: boolean;
  includeStore?: boolean;

  // Paths
  baseDir?: string;
}
```

**Defaults:**

```typescript
{
  format: 'vue-sfc',
  scriptStyle: 'setup',
  styleLang: 'scss',
  importStrategy: 'named',
  packageName: '@lugand-sistemas-ltda/vue-ui-lib',
  namingConvention: 'PascalCase',
  typescript: true,
  includeComments: true,
  formatCode: true,
  indentSize: 2,
  singleQuotes: true,
  scopedStyles: true
}
```

---

## 📤 Código Gerado - Exemplo

**Input (PageSchema):**

```json
{
  "id": "products-page",
  "metadata": { "title": "Products Page" },
  "widgets": [
    {
      "id": "products-card",
      "type": "card",
      "config": { "title": "Products", "variant": "elevated" }
    },
    {
      "id": "products-table",
      "type": "data-table",
      "config": {
        "columns": [
          { "key": "name", "label": "Name" },
          { "key": "price", "label": "Price" }
        ],
        "sortable": true
      }
    }
  ]
}
```

**Output (Vue SFC):**

```vue
<!--
  Products Page
  Generated: 2026-02-21T10:30:00.000Z
  Version: 1.0.0
-->
<template>
  <div class="products-page-container">
    <Card title="Products" variant="elevated" />
    <DataTable :columns="columns" sortable />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { Card, DataTable } from "@lugand-sistemas-ltda/vue-ui-lib";

// State
const columns = ref([
  { key: "name", label: "Name" },
  { key: "price", label: "Price" },
]);
</script>

<style lang="scss" scoped>
.products-page-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}
</style>
```

---

## 🔧 API Completa

### Composable `useCodeGenerator()`

```typescript
const {
  // State
  options,           // Ref<CodeGeneratorOptions>
  generatedCode,     // Ref<GeneratedCode | null>
  isGenerating,      // Ref<boolean>
  lastError,         // Ref<string | null>

  // Computed
  hasCode,           // ComputedRef<boolean>
  codePreview,       // ComputedRef<string>
  stats,             // ComputedRef<CodeStats | undefined>

  // Validation
  validateSchema,    // (schema: PageSchema) => GeneratorValidation
  analyzeSchema,     // (schema: PageSchema) => SchemaAnalysis

  // Generation
  generate,          // (schema: PageSchema) => Promise<GeneratedCode>
  batchGenerate,     // (operation: BatchGenerateOperation) => Promise<BatchGenerateResult>

  // File Operations
  saveToFile,        // (options: SaveFileOptions) => Promise<SaveFileResult>
  downloadCode,      // () => void
  copyToClipboard,   // () => Promise<void>

  // Options
  updateOptions,     // (options: Partial<CodeGeneratorOptions>) => void
  resetOptions,      // () => void

  // Helpers
  getFileName,       // (schema: PageSchema) => string
  extractImports,    // (schema: PageSchema) => ImportDeclaration[]
  extractComponents  // (schema: PageSchema) => ComponentUsage[]

} = useCodeGenerator(initialOptions?)
```

### Tipos Principais

```typescript
// Código gerado
interface GeneratedCode {
  content: string;
  fileName: string;
  fileType: CodeFormat;
  imports: ImportDeclaration[];
  components: ComponentUsage[];
  warnings?: string[];
  stats?: CodeStats;
}

// Estatísticas
interface CodeStats {
  totalLines: number;
  templateLines?: number;
  scriptLines?: number;
  styleLines?: number;
  componentCount: number;
  importCount: number;
  estimatedSize: number;
}

// Validação
interface GeneratorValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
  analysis?: SchemaAnalysis;
}

// Análise
interface SchemaAnalysis {
  uniqueWidgets: string[];
  totalWidgets: number;
  maxDepth: number;
  hasDataSources: boolean;
  hasEventHandlers: boolean;
  hasValidation: boolean;
  hasPermissions: boolean;
  hasCustomTheme: boolean;
  complexComponents: string[];
  warnings: string[];
}
```

---

## 🎨 Estratégias de Import

### Named Imports (Recomendado - Tree-shakeable)

```typescript
import { Card, DataTable, Button } from "@lugand-sistemas-ltda/vue-ui-lib";
```

### Default Imports

```typescript
import Card from "@lugand-sistemas-ltda/vue-ui-lib/components/Card";
import DataTable from "@lugand-sistemas-ltda/vue-ui-lib/components/DataTable";
import Button from "@lugand-sistemas-ltda/vue-ui-lib/components/Button";
```

### Namespace Import

```typescript
import * as UI from '@lugand-sistemas-ltda/vue-ui-lib'

<UI.Card />
<UI.DataTable />
```

---

## 📝 Convenções de Naming

| Convenção    | Exemplo Output      |
| ------------ | ------------------- |
| `PascalCase` | `ProductsPage.vue`  |
| `kebab-case` | `products-page.vue` |
| `camelCase`  | `productsPage.vue`  |
| `snake_case` | `products_page.vue` |

---

## 🎯 Use Cases

### 1. **Prototipagem Rápida**

Designer usa Page Builder → Export to Vue → Developer refina código

### 2. **Geração de Boilerplate**

Gera estrutura inicial de páginas → Developer adiciona lógica de negócio

### 3. **Documentação como Código**

PageSchema serve como "schema de contrato" → Código gerado sempre em sync

### 4. **Multi-tenant Apps**

Schemas por cliente → Gera apps customizadas automaticamente

### 5. **Design System Migration**

Schemas antigos → Regenera código com novos componentes

---

## ⚠️ Limitações Atuais

1. **Widgets Flat**: Por enquanto, widgets são flat (sem children hierarchy)
2. **Event Handlers**: Gera placeholders, developer precisa implementar
3. **Data Sources**: Gera estrutura, mas API calls precisam ser implementadas
4. **Complex Layouts**: Layouts complexos podem precisar refinamento manual
5. **File System**: Save to file ainda não integrado com VS Code API

---

## 🔮 Roadmap

- [ ] Suporte a children hierarchy (widgets aninhados)
- [ ] Geração de event handlers automática (baseado em actions)
- [ ] Integração com VS Code file system API
- [ ] Geração de Pinia stores para data sources
- [ ] Geração de router config automática
- [ ] Geração de testes unitários (Vitest)
- [ ] Prettier integration para formatação
- [ ] ESLint integration para linting
- [ ] Template customizáveis (plugins)

---

## 📚 Exemplos Adicionais

Veja [`EXAMPLES.ts`](./EXAMPLES.ts) para 7 exemplos completos:

1. ✅ Geração Básica
2. ✅ Geração com Validação
3. ✅ Diferentes Formatos (Vue/TS/JSON)
4. ✅ Batch Generation
5. ✅ Customização de Imports
6. ✅ Análise de Imports e Componentes
7. ✅ Convenções de Naming

---

## 🎉 Conclusão

A **FASE 6 - Code Generator** completa a plataforma low-code, permitindo o ciclo completo:

```
Design Visualmente → Export para Código → Desenvolva Normalmente
```

**Benefícios:**

- ✅ **Zero Vendor Lock-in**: Código gerado é Vue puro
- ✅ **Developer-Friendly**: TypeScript, tree-shakeable imports
- ✅ **Production-Ready**: Código otimizado e formatado
- ✅ **Flexível**: Customize tudo (naming, imports, styles)
- ✅ **Escalável**: Batch operations para múltiplos schemas

---

**Próximos Passos:**

1. Criar exemplos práticos (`/low-code`, `/form-builder`, `/page-builder`)
2. Implementar `PageRenderer` para preview mode
3. Corrigir warnings TypeScript `.d.ts`
4. Documentação completa da plataforma

---

**Última Atualização:** 21/02/2026  
**Status:** ✅ Production Ready  
**Build:** 360 módulos, 435.27 KB (102.10 KB gzip)
