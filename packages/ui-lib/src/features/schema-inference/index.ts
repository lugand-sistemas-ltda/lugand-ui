/**
 * schema-inference/index.ts
 * 
 * API pública do sistema de inferência automática de schemas.
 * Função principal: inferSchemaFromDTO() - recebe código TypeScript,
 * retorna FormSchema completo pronto para usar com FormRenderer.
 * 
 * @module features/schema-inference
 * @created 2025-01-XX
 */

import type { FormSchema } from '../form-renderer/types'
import type {
  DTOMetadata,
  InferenceConfig,
  InferenceResult,
  InferenceContext,
  InferenceHook,
  ComplexPropertyStrategy
} from './types'

import { analyzeTypeScriptCode, analyzeVueFile, findDTOByName } from './dto-analyzer'
import { inferFormFields } from './field-inferrer'
import { inferAdvancedValidations } from './validation-inferrer'

// Types re-exportados para conveniência em módulos externos (não usados internamente)
// import type { AnalysisResult } from './dto-analyzer'
// import type { InferredFieldResult } from './field-inferrer'

/**
 * Configuração padrão de inferência
 */
const DEFAULT_CONFIG: InferenceConfig = {
  generateLabels: true,
  generatePlaceholders: true,
  generateValidations: true,
  ignoreFields: []
}

// Estratégia padrão para propriedades complexas (pode ser usado em features futuras)
// @ts-expect-error - Preparado para quando suportarmos estratégias diferentes
const DEFAULT_COMPLEX_STRATEGY: ComplexPropertyStrategy = 'flatten'

/**
 * Infere FormSchema completo a partir de código TypeScript
 * 
 * Esta é a função principal do sistema de inferência.
 * Recebe código TypeScript (interface, type ou class) e retorna
 * um FormSchema pronto para usar com FormRenderer.
 * 
 * @param sourceCode - Código TypeScript contendo DTOs
 * @param dtoName - Nome do DTO a usar (se múltiplos no código)
 * @param config - Configuração de inferência
 * @param hooks - Hooks de customização
 * @returns Resultado completo com schema, metadata, warnings
 * 
 * @example
 * const code = `
 *   interface User {
 *     / ** @minLength 3 * /
 *     name: string
 *     email: string
 *     age?: number
 *   }
 * `
 * 
 * const result = inferSchemaFromDTO(code, 'User')
 * // result.schema = {
 * //   fields: [
 * //     { name: 'name', label: 'Name', type: 'text', required: true, validations: [...] },
 * //     { name: 'email', label: 'Email', type: 'email', required: true, validations: [...] },
 * //     { name: 'age', label: 'Age', type: 'number', required: false }
 * //   ]
 * // }
 * 
 * // Usar com FormRenderer:
 * <FormRenderer :schema="result.schema" @submit="handleSubmit" />
 */
export function inferSchemaFromDTO(
  sourceCode: string,
  dtoName: string,
  config: Partial<InferenceConfig> = {},
  hooks?: InferenceHook
): InferenceResult {
  const warnings: Array<{ property: string; message: string }> = []
  const fullConfig: InferenceConfig = { ...DEFAULT_CONFIG, ...config }

  // 1. Analisar código TypeScript → DTOMetadata
  const analysis = analyzeTypeScriptCode(sourceCode)

  if (analysis.errors.length > 0) {
    warnings.push(...analysis.errors.map(err => ({ property: 'analysis', message: err })))
  }
  if (analysis.warnings.length > 0) {
    warnings.push(...analysis.warnings.map(warn => ({ property: 'analysis', message: warn })))
  }

  // 2. Encontrar DTO específico
  const dto = findDTOByName(analysis.dtos, dtoName)

  if (!dto) {
    throw new Error(
      `DTO "${dtoName}" não encontrado. DTOs disponíveis: ${analysis.dtos.map(d => d.name).join(', ')}`
    )
  }

  // 3. Hook afterAnalyze
  let processedDTO = dto
  if (hooks?.afterAnalyze) {
    processedDTO = hooks.afterAnalyze(dto)
  }

  // 4. Criar contexto de inferência
  const context: InferenceContext = {
    dto: processedDTO,
    config: fullConfig,
    depth: 0,
    maxDepth: 3,
    complexStrategy: 'flatten',
    path: []
  }

  // 5. Inferir fields
  const inferredFields = inferFormFields(processedDTO.properties, context)

  // 6. Aplicar validações avançadas (JSDoc tags, convenções)
  if (fullConfig.generateValidations) {
    for (const result of inferredFields) {
      const advancedValidations = inferAdvancedValidations(
        result.sourceProperty,
        fullConfig
      )

      // Merge com validações já inferidas
      if (result.field.validation) {
        result.field.validation.push(...advancedValidations)
      } else {
        result.field.validation = advancedValidations
      }
    }
  }

  // 7. Construir FormSchema (gerar ID automático)
  const schema: FormSchema = {
    id: `form-${processedDTO.name.toLowerCase()}-${Date.now()}`,
    fields: inferredFields.map(r => r.field),
    ...(dto.description && { description: dto.description })
  }

  // 8. Hook beforeReturn
  let finalSchema = schema
  if (hooks?.beforeReturn) {
    const tempResult: InferenceResult = {
      schema,
      metadata: processedDTO,
      warnings: [],
      confidence: 0,
      ignoredFields: fullConfig.ignoreFields || []
    }
    const modifiedResult = hooks.beforeReturn(tempResult)
    finalSchema = modifiedResult.schema
  }

  // 9. Calcular confiança geral (média das confianças dos campos)
  const avgConfidence = inferredFields.length > 0
    ? inferredFields.reduce((sum, r) => sum + r.confidence, 0) / inferredFields.length
    : 0

  // 10. Coletar warnings dos campos
  inferredFields.forEach(r => {
    warnings.push(...r.warnings.map(w => ({ property: r.field.name, message: w })))
  })

  return {
    schema: finalSchema,
    metadata: processedDTO,
    warnings,
    confidence: avgConfidence,
    ignoredFields: fullConfig.ignoreFields || []
  }
}

/**
 * Infere FormSchema de arquivo .vue
 * 
 * @param vueContent - Conteúdo completo do arquivo .vue
 * @param dtoName - Nome do DTO a usar
 * @param config - Configuração
 * @param hooks - Hooks
 * @returns Resultado de inferência
 */
export function inferSchemaFromVue(
  vueContent: string,
  dtoName: string,
  config: Partial<InferenceConfig> = {},
  hooks?: InferenceHook
): InferenceResult {
  const warnings: string[] = []

  // Analisar .vue → extrair <script>
  const analysis = analyzeVueFile(vueContent)

  if (analysis.errors.length > 0) {
    warnings.push(...analysis.errors)
  }

  const dto = findDTOByName(analysis.dtos, dtoName)

  if (!dto) {
    throw new Error(
      `DTO "${dtoName}" não encontrado no arquivo .vue`
    )
  }

  // Delegar para inferSchemaFromDTO
  // (reconstruir sourceCode apenas com o DTO encontrado)
  const simplifiedCode = reconstructDTOCode(dto)

  return inferSchemaFromDTO(simplifiedCode, dtoName, config, hooks)
}

/**
 * Reconstrói código TypeScript de um DTOMetadata
 */
function reconstructDTOCode(dto: DTOMetadata): string {
  let code = ''

  if (dto.kind === 'interface') {
    code += `interface ${dto.name} {\n`
  } else if (dto.kind === 'type') {
    code += `type ${dto.name} = {\n`
  } else {
    code += `class ${dto.name} {\n`
  }

  for (const prop of dto.properties) {
    if (prop.description) {
      code += `  /** ${prop.description} */\n`
    }
    code += `  ${prop.name}${prop.optional ? '?' : ''}: ${prop.type}\n`
  }

  code += '}\n'

  return code
}

/**
 * Wrapper simplificado: infere schema diretamente de DTO inline
 * 
 * @param dto - DTOMetadata já analisado
 * @param config - Configuração
 * @param hooks - Hooks
 * @returns Schema inferido
 * 
 * @example
 * const dto: DTOMetadata = {
 *   name: 'Product',
 *   kind: 'interface',
 *   properties: [
 *     { name: 'name', type: 'string', optional: false },
 *     { name: 'price', type: 'number', optional: false }
 *   ]
 * }
 * 
 * const schema = inferSchemaFromMetadata(dto)
 */
export function inferSchemaFromMetadata(
  dto: DTOMetadata,
  config: Partial<InferenceConfig> = {},
  hooks?: InferenceHook
): FormSchema {
  const fullConfig: InferenceConfig = { ...DEFAULT_CONFIG, ...config }

  const context: InferenceContext = {
    dto,
    config: fullConfig,
    depth: 0,
    maxDepth: 3,
    complexStrategy: 'flatten',
    path: []
  }

  const inferredFields = inferFormFields(dto.properties, context)

  // Aplicar validações avançadas
  if (fullConfig.generateValidations) {
    for (const result of inferredFields) {
      const advancedValidations = inferAdvancedValidations(
        result.sourceProperty,
        fullConfig
      )

      if (result.field.validation) {
        result.field.validation.push(...advancedValidations)
      } else {
        result.field.validation = advancedValidations
      }
    }
  }

  const schema: FormSchema = {
    id: `form-${dto.name.toLowerCase()}-${Date.now()}`,
    fields: inferredFields.map(r => r.field),
    ...(dto.description && { description: dto.description })
  }

  // Hook beforeReturn (usado para modificar resultado final)
  if (hooks?.beforeReturn) {
    const result: InferenceResult = {
      schema,
      metadata: dto,
      warnings: [],
      confidence: 1.0,
      ignoredFields: fullConfig.ignoreFields || []
    }
    return hooks.beforeReturn(result).schema
  }

  return schema
}

/**
 * Utilitário: lista todos DTOs disponíveis em código
 * 
 * @param sourceCode - Código TypeScript
 * @returns Array de nomes de DTOs encontrados
 */
export function listAvailableDTOs(sourceCode: string): string[] {
  const analysis = analyzeTypeScriptCode(sourceCode)
  return analysis.dtos.map(dto => dto.name)
}

// Re-exports
export * from './types'
export * from './type-mappings'
export * from './field-inferrer'
export * from './validation-inferrer'
export * from './dto-analyzer'
