/**
 * Schema Bridge para Form Builder
 * 
 * Adapta FormSchema (form-renderer) para BaseSchema (schema-builder)
 * Permite usar useSchemaBuilder no form-builder mantendo compatibilidade.
 */

import type { BaseSchema, BaseSchemaItem } from '@/core/schema-builder'
import type { FormSchema, FormField } from '../form-renderer/types'

/**
 * FormField adaptado para BaseSchemaItem
 */
export interface FormFieldItem extends BaseSchemaItem {
  type: string // FieldType
  label?: string
  props: {
    placeholder?: string
    defaultValue?: any
    required?: boolean
    disabled?: boolean
    readonly?: boolean
    helpText?: string
    validation?: any[]
    options?: any[]
    min?: number
    max?: number
    step?: number
    accept?: string
    multiple?: boolean
    rows?: number
    cols?: number
    columnWidth?: number
    meta?: Record<string, any>
  }
}

/**
 * Metadata específica do Form Builder
 */
export interface FormBuilderMetadata {
  title?: string
  description?: string
  columns?: number
  gap?: string
  validateOnInput?: boolean
  validateOnBlur?: boolean
  validateOnSubmit?: boolean
  showInlineErrors?: boolean
  submitText?: string
  cancelText?: string
  showReset?: boolean
  action?: string
  method?: 'POST' | 'PUT' | 'PATCH'
}

/**
 * Schema do Form Builder (estende BaseSchema)
 */
export interface FormBuilderSchema extends BaseSchema<FormFieldItem, FormBuilderMetadata> {
  // Herda: id, name, version, metadata, items, createdAt, updatedAt
}

/**
 * Converte FormSchema (form-renderer) para FormBuilderSchema
 */
export function formSchemaToBuilder(formSchema: FormSchema): FormBuilderSchema {
  return {
    id: formSchema.id,
    name: formSchema.title || 'Untitled Form',
    version: '1.0.0',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    metadata: {
      title: formSchema.title,
      description: formSchema.description,
      columns: formSchema.columns,
      gap: formSchema.gap,
      validateOnInput: formSchema.validateOnInput,
      validateOnBlur: formSchema.validateOnBlur,
      validateOnSubmit: formSchema.validateOnSubmit,
      showInlineErrors: formSchema.showInlineErrors,
      submitText: formSchema.submitText,
      cancelText: formSchema.cancelText,
      showReset: formSchema.showReset,
      action: formSchema.action,
      method: formSchema.method
    },
    items: formSchema.fields.map(fieldToItem)
  }
}

/**
 * Converte FormBuilderSchema para FormSchema (form-renderer)
 */
export function builderToFormSchema(builderSchema: FormBuilderSchema): FormSchema {
  return {
    id: builderSchema.id,
    title: builderSchema.metadata.title,
    description: builderSchema.metadata.description,
    fields: builderSchema.items.map(itemToField),
    columns: builderSchema.metadata.columns,
    gap: builderSchema.metadata.gap,
    validateOnInput: builderSchema.metadata.validateOnInput,
    validateOnBlur: builderSchema.metadata.validateOnBlur,
    validateOnSubmit: builderSchema.metadata.validateOnSubmit,
    showInlineErrors: builderSchema.metadata.showInlineErrors,
    submitText: builderSchema.metadata.submitText,
    cancelText: builderSchema.metadata.cancelText,
    showReset: builderSchema.metadata.showReset,
    action: builderSchema.metadata.action,
    method: builderSchema.metadata.method
  }
}

/**
 * Converte FormField para FormFieldItem
 */
function fieldToItem(field: FormField): FormFieldItem {
  return {
    id: field.name,
    type: field.type,
    label: field.label,
    props: {
      placeholder: field.placeholder,
      defaultValue: field.defaultValue,
      required: field.required,
      disabled: field.disabled,
      readonly: field.readonly,
      helpText: field.helpText,
      validation: field.validation,
      options: field.options,
      min: field.min,
      max: field.max,
      step: field.step,
      accept: field.accept,
      multiple: field.multiple,
      rows: field.rows,
      meta: field.meta
    }
  }
}

/**
 * Converte FormFieldItem para FormField
 */
function itemToField(item: FormFieldItem): FormField {
  return {
    name: item.id,
    type: item.type as any,
    label: item.label || '',
    placeholder: item.props.placeholder,
    defaultValue: item.props.defaultValue,
    required: item.props.required,
    disabled: item.props.disabled,
    readonly: item.props.readonly,
    helpText: item.props.helpText,
    validation: item.props.validation,
    options: item.props.options,
    min: item.props.min,
    max: item.props.max,
    step: item.props.step,
    accept: item.props.accept,
    multiple: item.props.multiple,
    rows: item.props.rows,
    meta: item.props.meta
  }
}
