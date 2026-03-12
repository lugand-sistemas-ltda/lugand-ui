/**
 * Low-Code Engine — Form Builder Context (Sprint 7)
 *
 * Configura o motor LowCodeEngine para funcionar como um Form Builder:
 * - Paleta focada em campos de formulário, layout e feedback
 * - Canvas com drag/drop e reordenação habilitados
 * - Schema padrão com um nó 'form-root' não-deletável
 * - Sem suporte a breakpoints por padrão (forms raramente são responsivos)
 *
 * USO:
 * ```vue
 * <LowCodeEngine :context="formBuilderContext" v-model="schema" @save="save" />
 * ```
 *
 * USO COM SOBRESCRITA:
 * ```typescript
 * import { formBuilderContext } from '@/core/low-code-engine/contexts'
 *
 * const myContext = {
 *   ...formBuilderContext,
 *   palette: {
 *     ...formBuilderContext.palette,
 *     groups: [
 *       ...formBuilderContext.palette.groups,
 *       { id: 'custom', label: 'Custom Fields', icon: '🔧', categories: ['custom'], order: 99 }
 *     ]
 *   }
 * }
 * ```
 *
 * @module core/low-code-engine/contexts/form-builder
 */

import { createEmptyTree } from '../composables/useSchemaTree'
import type { BuilderContext } from '../types/context.types'

// ============================================================
// DEFAULT SCHEMA
// ============================================================

function createDefaultFormSchema() {
  return createEmptyTree('form', {
    name: 'New Form',
    description: 'Dynamic form created with Form Builder',
    tags: ['form'],
    status: 'draft',
  })
}

// ============================================================
// FORM BUILDER CONTEXT
// ============================================================

export const formBuilderContext: BuilderContext = {
  // --- Identidade ---
  type: 'form',
  label: 'Form Builder',
  icon: '📝',
  description: 'Create dynamic forms with validation, fields and layout',

  // --- Schema padrão ---
  defaultSchema: createDefaultFormSchema,

  // --- Canvas ---
  canvas: {
    canDrop: true,
    canReorder: true,
    canDelete: true,
    canDuplicate: true,
    canUseBreakpoints: false,   // Forms são geralmente layout linear
    canWrap: true,
    lockedTypes: ['form-root'], // O root do formulário não pode ser deletado
    multiSelect: false,
  },

  // --- Paleta ---
  palette: {
    searchPlaceholder: 'Search form components…',
    groups: [
      {
        id: 'form-fields',
        label: 'Form Fields',
        icon: '✏️',
        categories: ['form'],
        order: 1,
      },
      {
        id: 'layout',
        label: 'Layout',
        icon: '▦',
        categories: ['layout'],
        order: 2,
      },
      {
        id: 'feedback',
        label: 'Feedback',
        icon: '💬',
        categories: ['feedback'],
        order: 3,
      },
      {
        id: 'primitives',
        label: 'Elements',
        icon: '🔤',
        categories: ['primitives'],
        order: 4,
      },
    ],
  },

  // --- Toolbar extras ---
  extraToolbarActions: [
    {
      id: 'validate-schema',
      label: 'Validate',
      icon: '✓',
      tooltip: 'Validate form schema',
      group: 'right',
    },
    {
      id: 'export-json',
      label: 'Export JSON',
      icon: '{}',
      tooltip: 'Export schema as JSON',
      group: 'right',
    },
  ],

  defaultTags: ['form'],
}
