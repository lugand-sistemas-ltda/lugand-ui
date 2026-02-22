/**
 * FASE 6 - Code Generator
 * Barrel export para feature de geração de código
 */

// ============================================
// COMPOSABLE
// ============================================
export { useCodeGenerator } from './useCodeGenerator'

// ============================================
// TEMPLATES
// ============================================
export {
  generateVueSFC,
  generateTemplate,
  generateScript,
  generateStyle
} from './templates/vue-sfc-generator'

export {
  generateImports,
  renderImport,
  renderImports,
  optimizeImports,
  sortImports
} from './templates/import-generator-utils'

// ============================================
// TYPES
// ============================================
export type {
  CodeFormat,
  ScriptStyle,
  StyleLang,
  ImportStrategy,
  NamingConvention,
  CodeGeneratorOptions,
  CodeTemplate,
  TemplateContext,
  TemplateHelpers,
  ImportDeclaration,
  ComponentUsage,
  DataSourceInfo,
  EventHandlerInfo,
  GeneratedCode,
  GeneratedFile,
  CodeStats,
  RouterGeneratorOptions,
  GeneratedRoute,
  StoreGeneratorOptions,
  GeneratedStore,
  SchemaAnalysis,
  GeneratorValidation,
  SaveFileOptions,
  SaveFileResult,
  BatchGenerateOperation,
  BatchGenerateResult
} from './types'
