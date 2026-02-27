/**
 * @file FASE 5 - Widget Palette Configuration
 * @description Configuração dos widgets disponíveis para drag-drop
 * 
 * Define todos os widgets que podem ser adicionados às páginas
 */

import type { WidgetTypePalette } from './types'

/**
 * Paleta completa de widgets
 */
export const WIDGET_PALETTE: WidgetTypePalette[] = [
  // ============================================
  // LAYOUT WIDGETS
  // ============================================
  {
    type: 'container',
    label: 'Container',
    icon: '📦',
    category: 'layout',
    description: 'Container genérico para agrupar widgets',
    defaultWidget: {
      type: 'container',
      config: {
        padding: 'md',
        gap: 'md'
      }
    },
    editableProps: [
      {
        name: 'padding',
        label: 'Padding',
        inputType: 'select',
        options: [
          { label: 'None', value: 'none' },
          { label: 'Small', value: 'sm' },
          { label: 'Medium', value: 'md' },
          { label: 'Large', value: 'lg' },
          { label: 'Extra Large', value: 'xl' }
        ]
      },
      {
        name: 'gap',
        label: 'Gap',
        inputType: 'select',
        options: [
          { label: 'None', value: 'none' },
          { label: 'Small', value: 'sm' },
          { label: 'Medium', value: 'md' },
          { label: 'Large', value: 'lg' }
        ]
      }
    ]
  },

  {
    type: 'grid',
    label: 'Grid',
    icon: '▦',
    category: 'layout',
    description: 'Grid responsivo com colunas',
    defaultWidget: {
      type: 'grid',
      config: {
        columns: 2,
        gap: 'md',
        responsive: true
      },
    },
    editableProps: [
      {
        name: 'columns',
        label: 'Columns',
        inputType: 'number',
        helpText: 'Number of columns (1-12)'
      },
      {
        name: 'gap',
        label: 'Gap',
        inputType: 'select',
        options: [
          { label: 'Small', value: 'sm' },
          { label: 'Medium', value: 'md' },
          { label: 'Large', value: 'lg' }
        ]
      },
      {
        name: 'responsive',
        label: 'Responsive',
        inputType: 'boolean'
      }
    ]
  },

  {
    type: 'section',
    label: 'Section',
    icon: '📄',
    category: 'layout',
    description: 'Seção com título e conteúdo',
    defaultWidget: {
      type: 'section',
      config: {
        title: 'Section Title',
        collapsible: false
      },
    },
    editableProps: [
      {
        name: 'title',
        label: 'Title',
        inputType: 'text',
        required: true
      },
      {
        name: 'collapsible',
        label: 'Collapsible',
        inputType: 'boolean'
      }
    ]
  },

  // ============================================
  // CONTENT WIDGETS
  // ============================================

  {
    type: 'text',
    label: 'Text',
    icon: '📝',
    category: 'content',
    description: 'Texto estático ou dinâmico',
    defaultWidget: {
      type: 'text',
      config: {
        content: 'Text content',
        variant: 'body',
        align: 'left'
      }
    },
    editableProps: [
      {
        name: 'content',
        label: 'Content',
        inputType: 'text',
        required: true
      },
      {
        name: 'variant',
        label: 'Variant',
        inputType: 'select',
        options: [
          { label: 'Heading 1', value: 'h1' },
          { label: 'Heading 2', value: 'h2' },
          { label: 'Heading 3', value: 'h3' },
          { label: 'Body', value: 'body' },
          { label: 'Caption', value: 'caption' }
        ]
      },
      {
        name: 'align',
        label: 'Alignment',
        inputType: 'select',
        options: [
          { label: 'Left', value: 'left' },
          { label: 'Center', value: 'center' },
          { label: 'Right', value: 'right' }
        ]
      }
    ]
  },

  {
    type: 'image',
    label: 'Image',
    icon: '🖼️',
    category: 'content',
    description: 'Imagem com alt text',
    defaultWidget: {
      type: 'image',
      config: {
        src: 'https://via.placeholder.com/400x300',
        alt: 'Image',
        fit: 'cover'
      }
    },
    editableProps: [
      {
        name: 'src',
        label: 'Source URL',
        inputType: 'text',
        required: true
      },
      {
        name: 'alt',
        label: 'Alt Text',
        inputType: 'text',
        required: true
      },
      {
        name: 'fit',
        label: 'Object Fit',
        inputType: 'select',
        options: [
          { label: 'Cover', value: 'cover' },
          { label: 'Contain', value: 'contain' },
          { label: 'Fill', value: 'fill' }
        ]
      }
    ]
  },

  // ============================================
  // DATA WIDGETS
  // ============================================

  {
    type: 'datatable',
    label: 'Data Table',
    icon: '📊',
    category: 'data',
    description: 'Tabela de dados com sort/filter',
    defaultWidget: {
      type: 'datatable',
      config: {
        dataSource: 'users',
        columns: [],
        sortable: true,
        filterable: true,
        paginated: true,
        pageSize: 10
      }
    },
    editableProps: [
      {
        name: 'dataSource',
        label: 'Data Source',
        inputType: 'text',
        required: true,
        helpText: 'Nome da fonte de dados'
      },
      {
        name: 'sortable',
        label: 'Sortable',
        inputType: 'boolean'
      },
      {
        name: 'filterable',
        label: 'Filterable',
        inputType: 'boolean'
      },
      {
        name: 'paginated',
        label: 'Paginated',
        inputType: 'boolean'
      },
      {
        name: 'pageSize',
        label: 'Page Size',
        inputType: 'number'
      }
    ]
  },

  {
    type: 'card',
    label: 'Card',
    icon: '🏏',
    category: 'data',
    description: 'Card com header/body/footer',
    defaultWidget: {
      type: 'card',
      config: {
        title: 'Card Title',
        variant: 'default',
        elevated: true
      },
    },
    editableProps: [
      {
        name: 'title',
        label: 'Title',
        inputType: 'text'
      },
      {
        name: 'variant',
        label: 'Variant',
        inputType: 'select',
        options: [
          { label: 'Default', value: 'default' },
          { label: 'Outlined', value: 'outlined' },
          { label: 'Filled', value: 'filled' }
        ]
      },
      {
        name: 'elevated',
        label: 'Elevated',
        inputType: 'boolean'
      }
    ]
  },

  // ============================================
  // FORMS
  // ============================================

  {
    type: 'formrenderer',
    label: 'Form',
    icon: '📋',
    category: 'form',
    description: 'Form dinâmico (FASE 2)',
    defaultWidget: {
      type: 'formrenderer',
      config: {
        schema: {
          id: 'form-1',
          fields: []
        }
      }
    },
    editableProps: [
      {
        name: 'schema',
        label: 'Form Schema',
        inputType: 'json',
        required: true,
        helpText: 'JSON do FormSchema (FASE 2)'
      }
    ]
  },

  {
    type: 'formbuilder',
    label: 'Form Builder',
    icon: '🏯️',
    category: 'form',
    description: 'Editor visual de forms (FASE 4)',
    isPro: true,
    defaultWidget: {
      type: 'formbuilder',
      config: {
        initialMode: 'design'
      }
    },
    editableProps: [
      {
        name: 'initialMode',
        label: 'Initial Mode',
        inputType: 'select',
        options: [
          { label: 'Design', value: 'design' },
          { label: 'Preview', value: 'preview' },
          { label: 'Code', value: 'code' }
        ]
      }
    ]
  },

  // ============================================
  // NAVIGATION
  // ============================================

  {
    type: 'tabs',
    label: 'Tabs',
    icon: '📑',
    category: 'navigation',
    description: 'Navegação por abas',
    defaultWidget: {
      type: 'tabs',
      config: {
        items: [
          { label: 'Tab 1', value: 'tab1' },
          { label: 'Tab 2', value: 'tab2' }
        ]
      },
    },
    editableProps: [
      {
        name: 'items',
        label: 'Tab Items',
        inputType: 'json',
        required: true
      }
    ]
  },

  {
    type: 'breadcrumb',
    label: 'Breadcrumb',
    icon: '🍞',
    category: 'navigation',
    description: 'Navegação hierárquica',
    defaultWidget: {
      type: 'breadcrumb',
      config: {
        items: [
          { label: 'Home', to: '/' },
          { label: 'Current', to: '#' }
        ]
      }
    },
    editableProps: [
      {
        name: 'items',
        label: 'Items',
        inputType: 'json',
        required: true
      }
    ]
  },

  // ============================================
  // FEEDBACK
  // ============================================

  {
    type: 'alert',
    label: 'Alert',
    icon: '⚠️',
    category: 'feedback',
    description: 'Mensagem de alerta',
    defaultWidget: {
      type: 'alert',
      config: {
        title: 'Alert Title',
        variant: 'info',
        dismissible: true
      }
    },
    editableProps: [
      {
        name: 'title',
        label: 'Title',
        inputType: 'text',
        required: true
      },
      {
        name: 'variant',
        label: 'Variant',
        inputType: 'select',
        options: [
          { label: 'Info', value: 'info' },
          { label: 'Success', value: 'success' },
          { label: 'Warning', value: 'warning' },
          { label: 'Error', value: 'error' }
        ]
      },
      {
        name: 'dismissible',
        label: 'Dismissible',
        inputType: 'boolean'
      }
    ]
  },

  {
    type: 'badge',
    label: 'Badge',
    icon: '🏷️',
    category: 'feedback',
    description: 'Badge de status/contagem',
    defaultWidget: {
      type: 'badge',
      config: {
        text: 'Badge',
        variant: 'primary'
      }
    },
    editableProps: [
      {
        name: 'text',
        label: 'Text',
        inputType: 'text',
        required: true
      },
      {
        name: 'variant',
        label: 'Variant',
        inputType: 'select',
        options: [
          { label: 'Primary', value: 'primary' },
          { label: 'Secondary', value: 'secondary' },
          { label: 'Success', value: 'success' },
          { label: 'Warning', value: 'warning' },
          { label: 'Error', value: 'error' }
        ]
      }
    ]
  }
]

/**
 * Obtém item da paleta por tipo
 */
export function getPaletteItem(type: string): WidgetTypePalette | undefined {
  return WIDGET_PALETTE.find(item => item.type === type)
}

/**
 * Obtém itens da paleta por categoria
 */
export function getPaletteItemsByCategory(category: string): WidgetTypePalette[] {
  if (category === 'all') return WIDGET_PALETTE
  return WIDGET_PALETTE.filter(item => item.category === category)
}

/**
 * Categorias disponíveis
 */
export const WIDGET_CATEGORIES = [
  { id: 'all', label: 'All Widgets', icon: '🔍' },
  { id: 'layout', label: 'Layout', icon: '📐' },
  { id: 'content', label: 'Content', icon: '📝' },
  { id: 'data', label: 'Data', icon: '📊' },
  { id: 'form', label: 'Forms', icon: '📋' },
  { id: 'navigation', label: 'Navigation', icon: '🧭' },
  { id: 'feedback', label: 'Feedback', icon: '💬' },
  { id: 'custom', label: 'Custom', icon: '🎨' }
] as const
