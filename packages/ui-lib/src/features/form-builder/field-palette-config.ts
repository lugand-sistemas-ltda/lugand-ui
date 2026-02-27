/**
 * field-palette-config.ts
 * 
 * Configuração dos tipos de campos disponíveis na palette do Form Builder.
 * Define ícones, templates padrão e propriedades editáveis para cada tipo.
 * 
 * @module features/form-builder
 * @created 2025-01-XX
 */

import type { FieldTypePalette } from './types'

/**
 * Palette padrão de campos
 */
export const FIELD_PALETTE: FieldTypePalette[] = [
  // ============================================
  // BASIC FIELDS
  // ============================================
  {
    type: 'text',
    label: 'Text Input',
    icon: '📝',
    category: 'basic',
    defaultField: {
      id: 'text_field',
      type: 'text',
      props: {
        label: 'Text Field',
        placeholder: 'Enter text...'
      }
    },

  },
  {
    type: 'email',
    label: 'Email',
    icon: '✉️',
    category: 'basic',
    defaultField: {
      id: 'email',
      type: 'email',
      props: {
        label: 'Email Address',
        placeholder: 'email@example.com',
        validation: {
          rules: [
            { type: 'required', message: 'Email is required' },
            { type: 'email', message: 'Invalid email format' }
          ]
        }
      }
    },

  },
  {
    type: 'password',
    label: 'Password',
    icon: '🔒',
    category: 'basic',
    defaultField: {
      id: 'password',
      type: 'password',
      props: {
        label: 'Password',
        placeholder: 'Enter password...',
        validation: {
          rules: [
            { type: 'required', message: 'Password is required' }
          ]
        }
      }
    },

  },
  {
    type: 'number',
    label: 'Number',
    icon: '🔢',
    category: 'basic',
    defaultField: {
      id: 'number',
      type: 'number',
      props: {
        label: 'Number',
        placeholder: '0'
      }
    },

  },
  {
    type: 'textarea',
    label: 'Textarea',
    icon: '📄',
    category: 'basic',
    defaultField: {
      id: 'textarea',
      type: 'textarea',
      props: {
        label: 'Description',
        placeholder: 'Enter description...',
        rows: 4
      }
    },

  },
  {
    type: 'tel',
    label: 'Phone',
    icon: '📞',
    category: 'basic',
    defaultField: {
      id: 'phone',
      type: 'tel',
      props: {
        label: 'Phone Number',
        placeholder: '(11) 99999-9999'
      }
    },

  },
  {
    type: 'url',
    label: 'URL',
    icon: '🔗',
    category: 'basic',
    defaultField: {
      id: 'url',
      type: 'url',
      props: {
        label: 'Website',
        placeholder: 'https://example.com'
      }
    },

  },

  // ============================================
  // SELECTION FIELDS
  // ============================================
  {
    type: 'select',
    label: 'Select',
    icon: '📋',
    category: 'selection',
    defaultField: {
      id: 'select',
      type: 'select',
      props: {
        label: 'Select Option',
        placeholder: 'Choose an option...',
        options: [
          { label: 'Option 1', value: '1' },
          { label: 'Option 2', value: '2' },
          { label: 'Option 3', value: '3' }
        ]
      }
    },

  },
  {
    type: 'radio',
    label: 'Radio Group',
    icon: '🔘',
    category: 'selection',
    defaultField: {
      id: 'radio',
      type: 'radio',
      props: {
        label: 'Choose One',
        options: [
          { label: 'Option 1', value: '1' },
          { label: 'Option 2', value: '2' },
          { label: 'Option 3', value: '3' }
        ]
      }
    },

  },
  {
    type: 'checkbox',
    label: 'Checkbox',
    icon: '☑️',
    category: 'selection',
    defaultField: {
      id: 'checkbox',
      type: 'checkbox',
      props: {
        label: 'I agree to terms and conditions'
      }
    },

  },
  {
    type: 'switch',
    label: 'Switch',
    icon: '🎚️',
    category: 'selection',
    defaultField: {
      id: 'switch',
      type: 'switch',
      props: {
        label: 'Enable notifications'
      }
    },

  },

  // ============================================
  // ADVANCED FIELDS
  // ============================================
  {
    type: 'date',
    label: 'Date',
    icon: '📅',
    category: 'advanced',
    defaultField: {
      id: 'date',
      type: 'date',
      props: {
        label: 'Date'
      }
    },

  },
  {
    type: 'time',
    label: 'Time',
    icon: '🕐',
    category: 'advanced',
    defaultField: {
      id: 'time',
      type: 'time',
      props: {
        label: 'Time'
      }
    },

  },
  {
    type: 'date',
    label: 'Date & Time',
    icon: '📆',
    category: 'advanced',
    defaultField: {
      id: 'datetime',
      type: 'date',
      props: {
        label: 'Date and Time'
      }
    },

  },
  {
    type: 'file',
    label: 'File Upload',
    icon: '📎',
    category: 'advanced',
    defaultField: {
      id: 'file',
      type: 'file',
      props: {
        label: 'Upload File'
      }
    },
    isPro: true
  },
  {
    type: 'color',
    label: 'Color Picker',
    icon: '🎨',
    category: 'advanced',
    defaultField: {
      id: 'color',
      type: 'color',
      props: {
        label: 'Choose Color',
        defaultValue: '#000000'
      }
    },

  },
  {
    type: 'range',
    label: 'Range Slider',
    icon: '🎚️',
    category: 'advanced',
    defaultField: {
      id: 'range',
      type: 'range',
      props: {
        label: 'Range',
        min: 0,
        max: 100,
        step: 1
      }
    },
    isPro: true
  },

  // ============================================
  // LAYOUT FIELDS
  // ============================================
  {
    type: 'hidden',
    label: 'Hidden Field',
    icon: '👁️',
    category: 'layout',
    defaultField: {
      id: 'hidden',
      type: 'hidden',
      props: {
        label: 'Hidden'
      }
    },

  }
]

/**
 * Busca palette item por tipo
 */
export function getPaletteItem(type: string): FieldTypePalette | undefined {
  return FIELD_PALETTE.find(item => item.type === type)
}

/**
 * Busca palette items por categoria
 */
export function getPaletteItemsByCategory(category: FieldTypePalette['category']): FieldTypePalette[] {
  return FIELD_PALETTE.filter(item => item.category === category)
}
