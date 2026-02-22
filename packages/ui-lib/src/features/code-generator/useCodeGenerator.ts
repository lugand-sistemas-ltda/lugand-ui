/**
 * FASE 6 - useCodeGenerator Composable
 * 
 * Composable principal para geração de código a partir de PageSchema.
 * Suporta Vue SFC, TypeScript, router config, batch operations.
 */

import { ref, computed } from 'vue'
import type { PageSchema } from '@/core/schema-system/types'
import type {
  CodeGeneratorOptions,
  GeneratedCode,
  GeneratorValidation,
  SchemaAnalysis,
  SaveFileOptions,
  SaveFileResult,
  BatchGenerateOperation,
  BatchGenerateResult,
  ImportDeclaration,
  ComponentUsage
} from './types'
import { generateVueSFC } from './templates/vue-sfc-generator'
import {
  generateImports,
  optimizeImports,
  sortImports
} from './templates/import-generator-utils'

// ============================================
// COMPOSABLE
// ============================================

export function useCodeGenerator(initialOptions?: Partial<CodeGeneratorOptions>) {
  // ============================================
  // STATE
  // ============================================

  const options = ref<CodeGeneratorOptions>({
    format: 'vue-sfc',
    scriptStyle: 'setup',
    styleLang: 'scss',
    importStrategy: 'named',
    packageName: '@lugand-sistemas-ltda/vue-ui-lib',
    namingConvention: 'PascalCase',
    typescript: true,
    includeComments: true,
    includeMetadata: false,
    formatCode: true,
    indentSize: 2,
    singleQuotes: true,
    scopedStyles: true,
    disableLinting: false,
    templateOnly: false,
    includeRouter: false,
    includeStore: false,
    componentPrefix: '',
    baseDir: './src/views',
    ...initialOptions
  })

  const generatedCode = ref<GeneratedCode | null>(null)
  const isGenerating = ref(false)
  const lastError = ref<string | null>(null)

  // ============================================
  // COMPUTED
  // ============================================

  const hasCode = computed(() => generatedCode.value !== null)

  const codePreview = computed(() => {
    if (!generatedCode.value) return ''
    return generatedCode.value.content.substring(0, 500) + '...'
  })

  const stats = computed(() => generatedCode.value?.stats)

  // ============================================
  // VALIDATION
  // ============================================

  /**
   * Valida schema antes de gerar código
   */
  function validateSchema(schema: PageSchema): GeneratorValidation {
    const errors: string[] = []
    const warnings: string[] = []
    const suggestions: string[] = []

    // Validação básica
    if (!schema.id) {
      errors.push('Schema must have an ID')
    }

    if (!schema.widgets || schema.widgets.length === 0) {
      warnings.push('Schema has no widgets - will generate empty page')
    }

    // Validação de widgets
    schema.widgets.forEach((widget, index) => {
      if (!widget.id) {
        errors.push(`Widget at index ${index} has no ID`)
      }

      if (!widget.type) {
        errors.push(`Widget ${widget.id || index} has no type`)
      }

      // Verifica se widget type é conhecido
      const knownTypes = [
        'container', 'grid', 'card', 'text', 'image', 'button',
        'data-table', 'form-renderer', 'form-builder',
        'tabs', 'breadcrumb', 'alert', 'badge'
      ]

      if (widget.type && !knownTypes.includes(widget.type)) {
        warnings.push(`Widget ${widget.id} has unknown type: ${widget.type}`)
      }
    })

    // Warnings sobre features complexas
    if (schema.dataSources) {
      const apiSources = Object.values(schema.dataSources).filter(ds => ds.type === 'api')
      if (apiSources.length > 0) {
        warnings.push('Schema uses API data sources - you need to implement API calls')
        suggestions.push('Consider using a composable like useApi() for data fetching')
      }
    }

    if (schema.eventHandlers && Object.keys(schema.eventHandlers).length > 0) {
      warnings.push('Schema has event handlers - you need to implement handler logic')
    }

    // Análise do schema
    const analysis = analyzeSchema(schema)

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions,
      analysis
    }
  }

  /**
   * Analisa schema e retorna estatísticas
   */
  function analyzeSchema(schema: PageSchema): SchemaAnalysis {
    const uniqueWidgets = Array.from(
      new Set(schema.widgets.map(w => w.type))
    )

    const complexComponents = uniqueWidgets.filter(type =>
      ['data-table', 'form-builder', 'chart', 'calendar'].includes(type)
    )

    return {
      uniqueWidgets,
      totalWidgets: schema.widgets.length,
      maxDepth: calculateMaxDepth(schema.widgets),
      hasDataSources: !!schema.dataSources && Object.keys(schema.dataSources).length > 0,
      hasEventHandlers: !!schema.eventHandlers && Object.keys(schema.eventHandlers).length > 0,
      hasValidation: !!schema.validation,
      hasPermissions: !!schema.permissions,
      hasCustomTheme: !!schema.theme,
      complexComponents,
      warnings: []
    }
  }

  /**
   * Calcula profundidade máxima de aninhamento
   */
  function calculateMaxDepth(_widgets: any[]): number {
    // Por enquanto, widgets são flat (não tem children)
    // Quando implementarmos children hierarchy, calcular recursivamente
    return 1
  }

  // ============================================
  // CODE GENERATION
  // ============================================

  /**
   * Gera código a partir de PageSchema
   */
  async function generate(schema: PageSchema): Promise<GeneratedCode> {
    isGenerating.value = true
    lastError.value = null

    try {
      // Validação
      const validation = validateSchema(schema)
      if (!validation.isValid) {
        throw new Error(`Schema validation failed: ${validation.errors.join(', ')}`)
      }

      // Gera código baseado no formato
      let content = ''
      let fileName = getFileName(schema)

      if (options.value.format === 'vue-sfc') {
        content = generateVueSFC(schema, options.value)
      } else if (options.value.format === 'typescript') {
        content = generateTypeScriptExport(schema)
      } else if (options.value.format === 'json') {
        content = JSON.stringify(schema, null, 2)
        fileName = fileName.replace(/\.(vue|ts|js)$/, '.json')
      }

      // Extrai informações adicionais
      const imports = extractImports(schema)
      const components = extractComponents(schema)

      // Calcula stats
      const lines = content.split('\n')
      const stats = {
        totalLines: lines.length,
        templateLines: countLinesBetween(content, '<template>', '</template>'),
        scriptLines: countLinesBetween(content, '<script', '</script>'),
        styleLines: countLinesBetween(content, '<style', '</style>'),
        componentCount: components.length,
        importCount: imports.length,
        estimatedSize: new Blob([content]).size
      }

      const result: GeneratedCode = {
        content,
        fileName,
        fileType: options.value.format,
        imports,
        components,
        warnings: validation.warnings,
        stats
      }

      generatedCode.value = result
      return result

    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      lastError.value = message
      throw error
    } finally {
      isGenerating.value = false
    }
  }

  /**
   * Gera export TypeScript
   */
  function generateTypeScriptExport(schema: PageSchema): string {
    const lines: string[] = []

    if (options.value.includeComments) {
      lines.push('/**')
      lines.push(` * ${schema.metadata.title || 'Page Schema'}`)
      if (schema.metadata.description) {
        lines.push(` * ${schema.metadata.description}`)
      }
      lines.push(` * Generated: ${new Date().toISOString()}`)
      lines.push(' */')
    }

    lines.push('')
    lines.push("import type { PageSchema } from '@lugand-sistemas-ltda/vue-ui-lib'")
    lines.push('')

    const schemaName = getSchemaConstName(schema)
    lines.push(`export const ${schemaName}: PageSchema = ${JSON.stringify(schema, null, 2)}`)

    return lines.join('\n')
  }

  /**
   * Extrai imports do schema
   */
  function extractImports(schema: PageSchema): ImportDeclaration[] {
    const imports = generateImports(schema, options.value)
    const optimized = optimizeImports(imports)
    return sortImports(optimized)
  }

  /**
   * Extrai componentes usados
   */
  function extractComponents(schema: PageSchema): ComponentUsage[] {
    const componentMap = new Map<string, ComponentUsage>()

    schema.widgets.forEach(widget => {
      const componentName = widgetTypeToComponentName(widget.type)

      if (componentMap.has(componentName)) {
        const usage = componentMap.get(componentName)!
        usage.count++
      } else {
        componentMap.set(componentName, {
          name: componentName,
          widgetType: widget.type,
          count: 1,
          props: Object.keys(widget.config || {}),
          events: [],
          slots: (widget as any).slot ? ['default'] : [],
          hasVModel: false,
          hasRefs: false
        })
      }
    })

    return Array.from(componentMap.values())
  }

  // ============================================
  // FILE OPERATIONS
  // ============================================

  /**
   * Salva código gerado em arquivo
   */
  async function saveToFile(saveOptions: SaveFileOptions): Promise<SaveFileResult> {
    if (!generatedCode.value) {
      return {
        success: false,
        error: 'No code generated yet. Call generate() first.'
      }
    }

    try {
      // TODO: Integrar com VS Code file system API
      // Por enquanto, retorna sucesso simulado
      const filePath = `${saveOptions.directory}/${saveOptions.fileName}`

      console.log('Saving to:', filePath)
      console.log('Content length:', saveOptions.content.length)

      return {
        success: true,
        filePath,
        fileSize: new Blob([saveOptions.content]).size
      }

    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      return {
        success: false,
        error: message
      }
    }
  }

  /**
   * Download do código como arquivo
   */
  function downloadCode(): void {
    if (!generatedCode.value) {
      throw new Error('No code to download')
    }

    const blob = new Blob([generatedCode.value.content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = generatedCode.value.fileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  /**
   * Copia código para clipboard
   */
  async function copyToClipboard(): Promise<void> {
    if (!generatedCode.value) {
      throw new Error('No code to copy')
    }

    await navigator.clipboard.writeText(generatedCode.value.content)
  }

  // ============================================
  // BATCH OPERATIONS
  // ============================================

  /**
   * Gera múltiplos arquivos de uma vez
   */
  async function batchGenerate(
    operation: BatchGenerateOperation
  ): Promise<BatchGenerateResult> {
    const startTime = Date.now()
    const results: BatchGenerateResult['files'] = []
    let totalSize = 0

    for (const schema of operation.schemas) {
      try {
        const code = await generate(schema)
        const fileName = getFileName(schema)

        results.push({
          fileName,
          success: true,
          filePath: `${operation.outputDir}/${fileName}`
        })

        totalSize += code.stats?.estimatedSize || 0

      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error'
        results.push({
          fileName: schema.metadata.title || 'unknown',
          success: false,
          error: message
        })
      }
    }

    const duration = Date.now() - startTime
    const successCount = results.filter(r => r.success).length
    const errorCount = results.filter(r => !r.success).length

    return {
      totalFiles: results.length,
      successCount,
      errorCount,
      files: results,
      duration,
      totalSize
    }
  }

  // ============================================
  // OPTIONS MANAGEMENT
  // ============================================

  /**
   * Atualiza opções de geração
   */
  function updateOptions(newOptions: Partial<CodeGeneratorOptions>): void {
    options.value = {
      ...options.value,
      ...newOptions
    }
  }

  /**
   * Reseta opções para padrão
   */
  function resetOptions(): void {
    options.value = {
      format: 'vue-sfc',
      scriptStyle: 'setup',
      styleLang: 'scss',
      importStrategy: 'named',
      packageName: '@lugand-sistemas-ltda/vue-ui-lib',
      namingConvention: 'PascalCase',
      typescript: true,
      includeComments: true,
      includeMetadata: false,
      formatCode: true,
      indentSize: 2,
      singleQuotes: true,
      scopedStyles: true,
      disableLinting: false,
      templateOnly: false,
      includeRouter: false,
      includeStore: false,
      componentPrefix: '',
      baseDir: './src/views'
    }
  }

  // ============================================
  // HELPER FUNCTIONS
  // ============================================

  /**
   * Gera nome de arquivo baseado no schema
   */
  function getFileName(schema: PageSchema): string {
    const baseName = schema.metadata.title || schema.id || 'generated-page'
    const formatted = formatFileName(baseName, options.value.namingConvention!)

    const extension = options.value.format === 'vue-sfc'
      ? '.vue'
      : options.value.format === 'typescript'
        ? '.ts'
        : '.js'

    const prefix = options.value.componentPrefix || ''
    return prefix + formatted + extension
  }

  /**
   * Formata nome de arquivo baseado em convenção
   */
  function formatFileName(name: string, convention: string): string {
    // Remove caracteres especiais
    const clean = name.replace(/[^a-zA-Z0-9\s-]/g, '')

    switch (convention) {
      case 'PascalCase':
        return clean.split(/[\s-]+/).map(word =>
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join('')

      case 'kebab-case':
        return clean.toLowerCase().replace(/[\s]+/g, '-')

      case 'camelCase':
        const words = clean.split(/[\s-]+/).filter(w => w.length > 0)
        if (words.length === 0) return clean
        return (words[0] || '').toLowerCase() + words.slice(1).map(w =>
          w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
        ).join('')

      case 'snake_case':
        return clean.toLowerCase().replace(/[\s-]+/g, '_')

      default:
        return clean
    }
  }

  /**
   * Gera nome de const para schema TypeScript
   */
  function getSchemaConstName(schema: PageSchema): string {
    const baseName = schema.metadata.title || schema.id || 'page'
    return formatFileName(baseName, 'camelCase') + 'Schema'
  }

  /**
   * Conta linhas entre delimitadores
   */
  function countLinesBetween(content: string, start: string, end: string): number {
    const startIndex = content.indexOf(start)
    const endIndex = content.indexOf(end, startIndex)

    if (startIndex === -1 || endIndex === -1) return 0

    const section = content.substring(startIndex, endIndex)
    return section.split('\n').length
  }

  /**
   * Converte widget type para component name
   */
  function widgetTypeToComponentName(type: string): string {
    return type
      .split('-')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join('')
  }

  // ============================================
  // RETURN
  // ============================================

  return {
    // State
    options,
    generatedCode,
    isGenerating,
    lastError,

    // Computed
    hasCode,
    codePreview,
    stats,

    // Validation
    validateSchema,
    analyzeSchema,

    // Generation
    generate,
    generateTypeScriptExport,
    batchGenerate,

    // File Operations
    saveToFile,
    downloadCode,
    copyToClipboard,

    // Options
    updateOptions,
    resetOptions,

    // Helpers
    getFileName,
    extractImports,
    extractComponents
  }
}
