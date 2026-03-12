/**
 * Low-Code Engine - Main Entry Point
 *
 * Motor unificado para criação de interfaces low-code.
 * Builders (FormBuilder, PageBuilder, DocBuilder) são contextos deste motor.
 *
 * SPRINT: 0 — Contratos TypeScript (sem implementação)
 * Implementação começa no Sprint 1 (useSchemaTree.ts).
 *
 * @module core/low-code-engine
 */

// Tipos — o único export do Sprint 0
export * from './types'

// Sprint 1: useSchemaTree composable
export * from './composables/useSchemaTree'

// Sprint 2: Unified registry
export * from './registry/unified-registry'

// Sprint 3: Canvas Vue components — importar diretamente por path
// import NodeRenderer from '@/core/low-code-engine/components/NodeRenderer.vue'
// import DropZone from '@/core/low-code-engine/components/DropZone.vue'

// Sprint 4: Drag-drop composable + chave de inject
export * from './composables/useDragDrop'

// Sprint 7: Builder contexts (form / page / doc)
export * from './contexts'

// Sprint 8: DataSource composable + injection key
export * from './composables/useDataSource'

// ============================================================
// MIGRATION GUIDE — Mapeamento antigo → novo
// ============================================================
//
// ANTIGO                              → NOVO
// ------------------------------------------------------------------
// BaseSchema<TItem>.items[]           → SchemaTree.root.children[]
// BaseSchemaItem                      → SchemaNode
// WidgetSchema / WidgetDefinition     → ComponentDefinition
// widget-registry.ts + component-registry.ts → unified-registry.ts (Sprint 2)
// useSchemaBuilder.ts                 → useSchemaTree.ts (Sprint 1)
// FormBuilderView.vue (independente)  → LowCodeEngine + BuilderContext type:'form'
// PageBuilderView.vue (independente)  → LowCodeEngine + BuilderContext type:'page'
// DocBuilderView.vue  (independente)  → LowCodeEngine + BuilderContext type:'doc'
// DataSourceConfig (widget-system)    → RestApiConfig + DataSource (datasource.types)
// EditableProp (component-registry)   → PropDefinition (component.types)
//
// ARQUIVOS A DEPRECAR (aguardar validação dos contratos):
// - src/core/widget-system/ (inteiro)
// - src/core/component-registry/ (inteiro)
// - src/core/schema-builder/useSchemaBuilder.ts
// - src/features/page-builder/types.ts
// - src/features/form-builder/types.ts
// - src/features/doc-builder/types.ts
//
// ARQUIVOS A MANTER:
// - src/core/schema-builder/history.ts (bom, reutilizável)
// - src/core/schema-builder/validators.ts (adaptar para SchemaNode)
// - src/core/schema-builder/serializers.ts (adaptar para SchemaTree)
// ============================================================
