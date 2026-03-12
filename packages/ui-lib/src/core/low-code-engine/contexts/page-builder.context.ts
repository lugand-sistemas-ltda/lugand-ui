import { createEmptyTree } from '../composables/useSchemaTree'
import type { BuilderContext } from '../types/context.types'

function createDefaultPageSchema() {
  return createEmptyTree('page', {
    name: 'New Page',
    description: 'Page created with Page Builder',
    tags: ['page'],
    status: 'draft',
  })
}

export const pageBuilderContext: BuilderContext = {
  type: 'page',
  label: 'Page Builder',
  icon: '🖥',
  description: 'Create full pages, dashboards and layouts with responsive breakpoints',
  defaultSchema: createDefaultPageSchema,
  canvas: {
    canDrop: true,
    canReorder: true,
    canDelete: true,
    canDuplicate: true,
    canUseBreakpoints: true, // Pages ARE responsive
    canWrap: true,
    lockedTypes: ['page-root'],
    multiSelect: false,
  },
  palette: {
    searchPlaceholder: 'Search page components…',
    groups: [
      { id: 'layout',        label: 'Layout',     icon: '▦',  categories: ['layout'],        order: 1 },
      { id: 'primitives',    label: 'Elements',   icon: '🔤', categories: ['primitives'],    order: 2 },
      { id: 'data',          label: 'Data',       icon: '📊', categories: ['data'],          order: 3 },
      { id: 'navigation',    label: 'Navigation', icon: '🧭', categories: ['navigation'],    order: 4 },
      { id: 'feedback',      label: 'Feedback',   icon: '💬', categories: ['feedback'],      order: 5 },
      { id: 'media',         label: 'Media',      icon: '🖼', categories: ['media'],         order: 6 },
      { id: 'visualization', label: 'Charts',     icon: '📈', categories: ['visualization'], order: 7 },
    ],
  },
  extraToolbarActions: [
    { id: 'export-html',    label: 'Export HTML', icon: '</>', tooltip: 'Export page as HTML',        group: 'right' },
    { id: 'preview-mobile', label: 'Mobile',      icon: '📱', tooltip: 'Preview on mobile viewport', group: 'center' },
  ],
  defaultTags: ['page'],
}
