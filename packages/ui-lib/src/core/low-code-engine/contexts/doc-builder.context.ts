import { createEmptyTree } from '../composables/useSchemaTree'
import type { BuilderContext } from '../types/context.types'

function createDefaultDocSchema() {
  return createEmptyTree('doc', {
    name: 'New Document',
    description: 'Document created with Document Builder',
    tags: ['doc', 'document'],
    status: 'draft',
  })
}

export const docBuilderContext: BuilderContext = {
  type: 'doc',
  label: 'Document Builder',
  icon: '📄',
  description: 'Create documents, reports and printable PDFs with fixed-layout design',
  defaultSchema: createDefaultDocSchema,
  canvas: {
    canDrop: true,
    canReorder: true,
    canDelete: true,
    canDuplicate: true,
    canUseBreakpoints: false, // Docs use fixed-layout (A4/Letter), not responsive
    canWrap: false,
    lockedTypes: ['doc-root'],
    multiSelect: false,
  },
  palette: {
    searchPlaceholder: 'Search document components…',
    groups: [
      { id: 'document', label: 'Document', icon: '📄', categories: ['document'], order: 1 },
      { id: 'layout',   label: 'Layout',   icon: '▦',  categories: ['layout'],   order: 2 },
      { id: 'data',     label: 'Data',     icon: '📊', categories: ['data'],     order: 3 },
      { id: 'media',    label: 'Media',    icon: '🖼', categories: ['media'],    order: 4 },
    ],
  },
  extraToolbarActions: [
    { id: 'export-pdf',    label: 'Export PDF', icon: '📥', tooltip: 'Export document as PDF',            group: 'right' },
    { id: 'page-settings', label: 'Page Setup', icon: '⚙',  tooltip: 'Configure page size and margins',  group: 'right' },
  ],
  defaultTags: ['doc', 'document'],
}
