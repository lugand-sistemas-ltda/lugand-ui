/**
 * FASE 6 - Code Generator - Exemplo de Uso
 * 
 * Demonstra como usar o useCodeGenerator para gerar código
 * Vue SFC a partir de PageSchema JSON.
 */

import { useCodeGenerator } from '@lugand-sistemas-ltda/vue-ui-lib'
import type { PageSchema } from '@lugand-sistemas-ltda/vue-ui-lib'
import { createSchemaMetadata, createFlexLayout, createGridLayout } from '@/core/schema-system/types'

// ============================================
// EXEMPLO 1: Geração Básica
// ============================================

export async function exemploBasico() {
  // Schema de exemplo
  const schema: PageSchema = {
    id: 'products-page',
    type: 'page',
    metadata: createSchemaMetadata('Products Page', 'Página de listagem de produtos'),
    layout: createFlexLayout('column'),
    widgets: [
      {
        id: 'page-header',
        type: 'card',
        config: {
          title: 'Products',
          variant: 'elevated'
        }
      },
      {
        id: 'products-table',
        type: 'data-table',
        config: {
          columns: [
            { key: 'name', label: 'Name' },
            { key: 'price', label: 'Price' },
            { key: 'stock', label: 'Stock' }
          ],
          sortable: true,
          filterable: true,
          paginated: true
        }
      }
    ]
  }

  // Inicializa generator
  const generator = useCodeGenerator({
    typescript: true,
    includeComments: true,
    formatCode: true,
    scopedStyles: true
  })

  // Gera código
  const result = await generator.generate(schema)

  console.log('Código gerado:')
  console.log(result.content)
  console.log('\nEstatísticas:')
  console.log('- Linhas:', result.stats?.totalLines)
  console.log('- Componentes:', result.stats?.componentCount)
  console.log('- Tamanho:', result.stats?.estimatedSize, 'bytes')

  // Download do arquivo
  generator.downloadCode()
}

// ============================================
// EXEMPLO 2: Geração com Validação
// ============================================

export async function exemploComValidacao() {
  const schema: PageSchema = {
    id: 'dashboard',
    type: 'page',
    metadata: createSchemaMetadata('Dashboard', 'Admin dashboard'),
    layout: createGridLayout(4, 16),
    widgets: [
      {
        id: 'stat-1',
        type: 'card',
        config: {
          title: 'Total Sales',
          variant: 'primary',
          content: '$12,345'
        }
      },
      {
        id: 'stat-2',
        type: 'card',
        config: {
          title: 'Orders',
          variant: 'success',
          content: '856'
        }
      }
    ],
    dataSources: {
      salesData: {
        type: 'api',
        config: {
          endpoint: '/api/sales',
          method: 'GET'
        }
      }
    }
  }

  const generator = useCodeGenerator()

  // Valida antes de gerar
  const validation = generator.validateSchema(schema)

  if (!validation.isValid) {
    console.error('Schema inválido:', validation.errors)
    return
  }

  if (validation.warnings.length > 0) {
    console.warn('Avisos:', validation.warnings)
  }

  console.log('Análise do schema:')
  console.log('- Widgets únicos:', validation.analysis?.uniqueWidgets)
  console.log('- Total de widgets:', validation.analysis?.totalWidgets)
  console.log('- Tem data sources:', validation.analysis?.hasDataSources)
  console.log('- Componentes complexos:', validation.analysis?.complexComponents)

  // Gera código
  const result = await generator.generate(schema)
  console.log('Código gerado:', result.content.substring(0, 100) + '...')

  // Copia para clipboard
  await generator.copyToClipboard()
  console.log('Código copiado para clipboard!')
}

// ============================================
// EXEMPLO 3: Diferentes Formatos
// ============================================

export async function exemploDiferentesFormatos() {
  const schema: PageSchema = {
    id: 'form-page',
    type: 'page',
    metadata: createSchemaMetadata('Contact Form', 'Formulário de contato'),
    layout: createFlexLayout('column'),
    widgets: [
      {
        id: 'contact-form',
        type: 'form-renderer',
        config: {
          submitText: 'Send Message',
          resetText: 'Clear'
        }
      }
    ]
  }

  const generator = useCodeGenerator()

  // 1. Formato Vue SFC
  generator.updateOptions({ format: 'vue-sfc' })
  const vueSFC = await generator.generate(schema)
  console.log('Vue SFC:\n', vueSFC.content)

  // 2. Formato TypeScript
  generator.updateOptions({ format: 'typescript' })
  const typescript = await generator.generate(schema)
  console.log('\nTypeScript:\n', typescript.content)

  // 3. Formato JSON
  generator.updateOptions({ format: 'json' })
  const json = await generator.generate(schema)
  console.log('\nJSON:\n', json.content)
}

// ============================================
// EXEMPLO 4: Batch Generation
// ============================================

export async function exemploBatchGeneration() {
  const schemas: PageSchema[] = [
    {
      id: 'home',
      type: 'page',
      metadata: createSchemaMetadata('Home'),
      layout: createFlexLayout('column'),
      widgets: []
    },
    {
      id: 'about',
      type: 'page',
      metadata: createSchemaMetadata('About'),
      layout: createFlexLayout('column'),
      widgets: []
    },
    {
      id: 'contact',
      type: 'page',
      metadata: createSchemaMetadata('Contact'),
      layout: createFlexLayout('column'),
      widgets: []
    }
  ]

  const generator = useCodeGenerator({
    typescript: true,
    namingConvention: 'PascalCase'
  })

  // Gera múltiplos arquivos
  const result = await generator.batchGenerate({
    schemas,
    options: generator.options.value,
    outputDir: './src/views/generated',
    generateRouterIndex: true,
    generateBarrelExport: true
  })

  console.log('Batch generation completa:')
  console.log('- Total de arquivos:', result.totalFiles)
  console.log('- Sucesso:', result.successCount)
  console.log('- Erros:', result.errorCount)
  console.log('- Tempo:', result.duration, 'ms')
  console.log('- Tamanho total:', result.totalSize, 'bytes')

  result.files.forEach(file => {
    if (file.success) {
      console.log(`✅ ${file.fileName} → ${file.filePath}`)
    } else {
      console.log(`❌ ${file.fileName} → ${file.error}`)
    }
  })
}

// ============================================
// EXEMPLO 5: Customização de Imports
// ============================================

export async function exemploCustomImports() {
  const schema: PageSchema = {
    id: 'custom-page',
    type: 'page',
    metadata: createSchemaMetadata('Custom Page'),
    layout: createFlexLayout('column'),
    widgets: [
      {
        id: 'btn-1',
        type: 'button',
        config: {
          text: 'Click Me',
          variant: 'primary'
        }
      }
    ]
  }

  // Named imports (tree-shakeable)
  const generator1 = useCodeGenerator({
    importStrategy: 'named',
    packageName: '@my-company/ui-lib'
  })
  const result1 = await generator1.generate(schema)
  console.log('Named imports:\n', result1.content)

  // Default imports (mais verboso)
  const generator2 = useCodeGenerator({
    importStrategy: 'default',
    packageName: '@my-company/ui-lib'
  })
  const result2 = await generator2.generate(schema)
  console.log('\nDefault imports:\n', result2.content)

  // Namespace import
  const generator3 = useCodeGenerator({
    importStrategy: 'namespace',
    packageName: '@my-company/ui-lib'
  })
  const result3 = await generator3.generate(schema)
  console.log('\nNamespace import:\n', result3.content)
}

// ============================================
// EXEMPLO 6: Análise de Imports e Componentes
// ============================================

export async function exemploAnalise() {
  const schema: PageSchema = {
    id: 'complex-page',
    type: 'page',
    metadata: createSchemaMetadata('Complex Page'),
    layout: createGridLayout(12, 16),
    widgets: [
      { id: 'card-1', type: 'card', config: {} },
      { id: 'card-2', type: 'card', config: {} },
      { id: 'table-1', type: 'data-table', config: {} },
      { id: 'form-1', type: 'form-renderer', config: {} },
      { id: 'btn-1', type: 'button', config: {} },
      { id: 'btn-2', type: 'button', config: {} }
    ]
  }

  const generator = useCodeGenerator()

  // Extrai imports
  const imports = generator.extractImports(schema)
  console.log('Imports necessários:')
  imports.forEach(imp => {
    console.log(`- ${imp.source}:`, imp.named?.join(', '))
  })

  // Extrai componentes
  const components = generator.extractComponents(schema)
  console.log('\nComponentes usados:')
  components.forEach(comp => {
    console.log(`- ${comp.name} (${comp.widgetType}): usado ${comp.count}x`)
    console.log(`  Props:`, comp.props.join(', '))
  })

  // Análise completa
  const analysis = generator.analyzeSchema(schema)
  console.log('\nAnálise completa:')
  console.log(JSON.stringify(analysis, null, 2))
}

// ============================================
// EXEMPLO 7: Convenções de Naming
// ============================================

export async function exemploNamingConventions() {
  const schema: PageSchema = {
    id: 'my-awesome-page',
    type: 'page',
    metadata: createSchemaMetadata('My Awesome Page'),
    layout: createFlexLayout('column'),
    widgets: []
  }

  const generator = useCodeGenerator()

  // PascalCase
  generator.updateOptions({ namingConvention: 'PascalCase' })
  console.log('PascalCase:', generator.getFileName(schema))
  // Output: MyAwesomePage.vue

  // kebab-case
  generator.updateOptions({ namingConvention: 'kebab-case' })
  console.log('kebab-case:', generator.getFileName(schema))
  // Output: my-awesome-page.vue

  // camelCase
  generator.updateOptions({ namingConvention: 'camelCase' })
  console.log('camelCase:', generator.getFileName(schema))
  // Output: myAwesomePage.vue

  // snake_case
  generator.updateOptions({ namingConvention: 'snake_case' })
  console.log('snake_case:', generator.getFileName(schema))
  // Output: my_awesome_page.vue
}

// ============================================
// USO NO COMPONENTE VUE
// ============================================

/*
<template>
  <div class="code-generator-demo">
    <h2>Code Generator Demo</h2>

    <button @click="generateCode">
      Generate Vue SFC
    </button>

    <button @click="downloadFile" :disabled="!hasCode">
      Download File
    </button>

    <button @click="copyCode" :disabled="!hasCode">
      Copy to Clipboard
    </button>

    <div v-if="isGenerating" class="loading">
      Generating code...
    </div>

    <div v-if="generatedCode" class="result">
      <h3>Generated Code:</h3>
      <pre><code>{{ generatedCode.content }}</code></pre>

      <div class="stats">
        <p>Lines: {{ stats?.totalLines }}</p>
        <p>Components: {{ stats?.componentCount }}</p>
        <p>Size: {{ stats?.estimatedSize }} bytes</p>
      </div>
    </div>

    <div v-if="lastError" class="error">
      Error: {{ lastError }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCodeGenerator } from '@lugand-sistemas-ltda/vue-ui-lib'
import type { PageSchema } from '@lugand-sistemas-ltda/vue-ui-lib'

const mySchema: PageSchema = {
  id: 'demo-page',
  type: 'page',
  metadata: {
    title: 'Demo Page',
    version: '1.0.0',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  layout: { type: 'flex', responsive: {} },
  widgets: [
    {
      id: 'welcome-card',
      type: 'card',
      config: {
        title: 'Welcome',
        variant: 'primary'
      },
      slot: 'Hello World!'
    }
  ]
}

const {
  generatedCode,
  isGenerating,
  lastError,
  hasCode,
  stats,
  generate,
  downloadCode,
  copyToClipboard
} = useCodeGenerator({
  typescript: true,
  includeComments: true
})

async function generateCode() {
  await generate(mySchema)
}

async function downloadFile() {
  downloadCode()
}

async function copyCode() {
  await copyToClipboard()
  alert('Code copied to clipboard!')
}
</script>
*/
