/**
 * Type Mappings
 * 
 * Mapeamentos padrão de tipos TypeScript → FormField types.
 * 
 * @module features/schema-inference
 */

import type { FormField } from '@/features/form-renderer'
import type { TypeMappingRule } from './types'

/**
 * Mapeamentos padrão de tipo TypeScript → FieldType.
 * Ordenados por prioridade (maior prioridade primeiro).
 */
export const DEFAULT_TYPE_MAPPINGS: TypeMappingRule[] = [
  // Tipos de data/hora
  {
    pattern: /^Date$/i,
    fieldType: 'date',
    priority: 100
  },
  {
    pattern: /^(DateTime|Timestamp)$/i,
    fieldType: 'datetime',
    priority: 100
  },
  {
    pattern: /^Time$/i,
    fieldType: 'time',
    priority: 100
  },

  // Tipos numéricos
  {
    pattern: /^number$/i,
    fieldType: 'number',
    priority: 90
  },
  {
    pattern: /^(int|integer|float|double|decimal)$/i,
    fieldType: 'number',
    priority: 90
  },

  // Booleanos → checkbox
  {
    pattern: /^boolean$/i,
    fieldType: 'checkbox',
    priority: 90
  },

  // Strings especiais (baseado no nome)
  {
    pattern: /^string$/i,
    fieldType: 'email',
    priority: 85,
    condition: (prop) => /email/i.test(prop.name)
  },
  {
    pattern: /^string$/i,
    fieldType: 'password',
    priority: 85,
    condition: (prop) => /password|senha/i.test(prop.name)
  },
  {
    pattern: /^string$/i,
    fieldType: 'tel',
    priority: 85,
    condition: (prop) => /phone|telefone|tel|celular/i.test(prop.name)
  },
  {
    pattern: /^string$/i,
    fieldType: 'url',
    priority: 85,
    condition: (prop) => /url|website|site|link/i.test(prop.name)
  },
  {
    pattern: /^string$/i,
    fieldType: 'color',
    priority: 85,
    condition: (prop) => /color|cor/i.test(prop.name)
  },

  // Enums → select
  {
    pattern: /^enum$/i,
    fieldType: 'select',
    priority: 80
  },

  // Union de literais → select ou radio
  {
    pattern: /^union$/i,
    fieldType: 'select',
    priority: 75,
    condition: (prop) => {
      // Se tem poucos valores (<= 4), usa radio
      return !!(prop.possibleValues && prop.possibleValues.length > 4)
    }
  },
  {
    pattern: /^union$/i,
    fieldType: 'radio',
    priority: 75,
    condition: (prop) => {
      return !!(prop.possibleValues && prop.possibleValues.length <= 4)
    }
  },

  // Arrays → multiselect (se tiver possibleValues)
  {
    pattern: /^array$/i,
    fieldType: 'select',
    priority: 70,
    condition: (_prop) => {
      // TODO: detectar se array tem valores conhecidos
      return false
    }
  },

  // String padrão (fallback)
  {
    pattern: /^string$/i,
    fieldType: 'text',
    priority: 50
  },

  // Objetos complexos → ignorar ou usar JSON editor
  {
    pattern: /^object$/i,
    fieldType: 'textarea',
    priority: 40,
    condition: () => false // Ignorado por padrão
  }
]

/**
 * Obtém field type a partir de PropertyMetadata.
 * Aplica regras de mapeamento em ordem de prioridade.
 */
export function getFieldTypeFromProperty(
  prop: { type: string; name: string; possibleValues?: any[]; rawType: string },
  customMappings: TypeMappingRule[] = []
): { fieldType: FormField['type']; confidence: number } {
  // Merge custom mappings com defaults
  const allMappings = [
    ...customMappings,
    ...DEFAULT_TYPE_MAPPINGS
  ].sort((a, b) => (b.priority || 0) - (a.priority || 0))

  // Tenta cada regra
  for (const rule of allMappings) {
    const matches = typeof rule.pattern === 'string'
      ? prop.type === rule.pattern || prop.rawType === rule.pattern
      : rule.pattern.test(prop.type) || rule.pattern.test(prop.rawType)

    if (matches) {
      // Verifica condição adicional (se houver)
      if (rule.condition && !rule.condition(prop as any)) {
        continue
      }

      return {
        fieldType: rule.fieldType as FormField['type'],
        confidence: (rule.priority || 50) / 100
      }
    }
  }

  // Fallback: text
  return {
    fieldType: 'text' as FormField['type'],
    confidence: 0.3
  }
}

/**
 * Detecta tipo específico baseado no nome da propriedade.
 * Ex: "email" → email, "senha" → password
 */
export function detectFieldTypeFromName(name: string): string | null {
  const lowerName = name.toLowerCase()

  // Email
  if (/email|e-mail/i.test(lowerName)) {
    return 'email'
  }

  // Password
  if (/password|senha|pass/i.test(lowerName)) {
    return 'password'
  }

  // Telefone
  if (/phone|telefone|tel|celular|fone/i.test(lowerName)) {
    return 'tel'
  }

  // URL
  if (/url|website|site|link/i.test(lowerName)) {
    return 'url'
  }

  // Color
  if (/color|cor|colour/i.test(lowerName)) {
    return 'color'
  }

  // Date
  if (/date|data|birthday|nascimento/i.test(lowerName)) {
    return 'date'
  }

  // Time
  if (/time|hora|hour/i.test(lowerName)) {
    return 'time'
  }

  // Textarea (campos longos)
  if (/description|descricao|bio|comment|comentario|notes|observacoes|text/i.test(lowerName)) {
    return 'textarea'
  }

  // Range/Slider
  if (/age|idade|rating|nota|score|pontuacao/i.test(lowerName)) {
    return 'range'
  }

  return null
}
