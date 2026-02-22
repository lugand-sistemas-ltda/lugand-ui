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
      name: 'text_field',
      label: 'Text Field',
      type: 'text',
      placeholder: 'Enter text...'
    },
    editableProps: ['name', 'label', 'placeholder', 'required', 'disabled', 'readonly', 'maxLength']
  },
  {
    type: 'email',
    label: 'Email',
    icon: '✉️',
    category: 'basic',
    defaultField: {
      name: 'email',
      label: 'Email Address',
      type: 'email',
      placeholder: 'email@example.com',
      validation: [
        { type: 'required', message: 'Email is required' },
        { type: 'email', message: 'Invalid email format' }
      ]
    },
    editableProps: ['name', 'label', 'placeholder', 'required']
  },
  {
    type: 'password',
    label: 'Password',
    icon: '🔒',
    category: 'basic',
    defaultField: {
      name: 'password',
      label: 'Password',
      type: 'password',
      placeholder: 'Enter password...',
      validation: [
        { type: 'required', message: 'Password is required' },
        { type: 'minLength', value: 8, message: 'Min 8 characters' }
      ]
    },
    editableProps: ['name', 'label', 'placeholder', 'required', 'minLength', 'maxLength']
  },
  {
    type: 'number',
    label: 'Number',
    icon: '🔢',
    category: 'basic',
    defaultField: {
      name: 'number',
      label: 'Number',
      type: 'number',
      placeholder: '0'
    },
    editableProps: ['name', 'label', 'placeholder', 'required', 'min', 'max', 'step']
  },
  {
    type: 'textarea',
    label: 'Textarea',
    icon: '📄',
    category: 'basic',
    defaultField: {
      name: 'textarea',
      label: 'Description',
      type: 'textarea',
      placeholder: 'Enter description...',
      rows: 4
    },
    editableProps: ['name', 'label', 'placeholder', 'required', 'rows', 'maxLength']
  },
  {
    type: 'tel',
    label: 'Phone',
    icon: '📞',
    category: 'basic',
    defaultField: {
      name: 'phone',
      label: 'Phone Number',
      type: 'tel',
      placeholder: '(11) 99999-9999'
    },
    editableProps: ['name', 'label', 'placeholder', 'required']
  },
  {
    type: 'url',
    label: 'URL',
    icon: '🔗',
    category: 'basic',
    defaultField: {
      name: 'url',
      label: 'Website',
      type: 'url',
      placeholder: 'https://example.com'
    },
    editableProps: ['name', 'label', 'placeholder', 'required']
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
      name: 'select',
      label: 'Select Option',
      type: 'select',
      placeholder: 'Choose an option...',
      options: [
        { label: 'Option 1', value: '1' },
        { label: 'Option 2', value: '2' },
        { label: 'Option 3', value: '3' }
      ]
    },
    editableProps: ['name', 'label', 'placeholder', 'required', 'options', 'multiple']
  },
  {
    type: 'radio',
    label: 'Radio Group',
    icon: '🔘',
    category: 'selection',
    defaultField: {
      name: 'radio',
      label: 'Choose One',
      type: 'radio',
      options: [
        { label: 'Option 1', value: '1' },
        { label: 'Option 2', value: '2' },
        { label: 'Option 3', value: '3' }
      ]
    },
    editableProps: ['name', 'label', 'required', 'options']
  },
  {
    type: 'checkbox',
    label: 'Checkbox',
    icon: '☑️',
    category: 'selection',
    defaultField: {
      name: 'checkbox',
      label: 'I agree to terms and conditions',
      type: 'checkbox'
    },
    editableProps: ['name', 'label', 'required']
  },
  {
    type: 'switch',
    label: 'Switch',
    icon: '🎚️',
    category: 'selection',
    defaultField: {
      name: 'switch',
      label: 'Enable notifications',
      type: 'switch'
    },
    editableProps: ['name', 'label']
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
      name: 'date',
      label: 'Date',
      type: 'date'
    },
    editableProps: ['name', 'label', 'required', 'min', 'max']
  },
  {
    type: 'time',
    label: 'Time',
    icon: '🕐',
    category: 'advanced',
    defaultField: {
      name: 'time',
      label: 'Time',
      type: 'time'
    },
    editableProps: ['name', 'label', 'required']
  },
  {
    type: 'date',
    label: 'Date & Time',
    icon: '📆',
    category: 'advanced',
    defaultField: {
      name: 'datetime',
      label: 'Date and Time',
      type: 'date'
    },
    editableProps: ['name', 'label', 'required']
  },
  {
    type: 'file',
    label: 'File Upload',
    icon: '📎',
    category: 'advanced',
    defaultField: {
      name: 'file',
      label: 'Upload File',
      type: 'file'
    },
    editableProps: ['name', 'label', 'required', 'accept', 'multiple'],
    isPro: true
  },
  {
    type: 'color',
    label: 'Color Picker',
    icon: '🎨',
    category: 'advanced',
    defaultField: {
      name: 'color',
      label: 'Choose Color',
      type: 'color',
      defaultValue: '#000000'
    },
    editableProps: ['name', 'label', 'required']
  },
  {
    type: 'range',
    label: 'Range Slider',
    icon: '🎚️',
    category: 'advanced',
    defaultField: {
      name: 'range',
      label: 'Range',
      type: 'range',
      min: 0,
      max: 100,
      step: 1
    },
    editableProps: ['name', 'label', 'required', 'min', 'max', 'step'],
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
      name: 'hidden',
      label: 'Hidden',
      type: 'hidden'
    },
    editableProps: ['name', 'defaultValue']
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
