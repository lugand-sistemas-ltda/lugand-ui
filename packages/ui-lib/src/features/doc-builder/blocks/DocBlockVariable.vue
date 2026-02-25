<template>
  <span :class="['doc-block-variable', blockClass]" :style="blockStyle">
    {{ formattedValue }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { VariableBlockContent, BlockStyle, DocumentData } from '../core/types'

export interface DocBlockVariableProps {
  /** Conteúdo do bloco */
  content: VariableBlockContent
  
  /** Dados do documento */
  data: DocumentData
  
  /** Estilo do bloco */
  style?: BlockStyle
  
  /** Classe CSS adicional */
  className?: string
}

const props = withDefaults(defineProps<DocBlockVariableProps>(), {
  className: ''
})

/**
 * Valor formatado da variável
 */
const formattedValue = computed(() => {
  const value = props.data[props.content.variableName]
  
  // Se não existe, usar fallback
  if (value === undefined || value === null) {
    return props.content.fallback || ''
  }
  
  // Aplicar formato se especificado
  if (props.content.format) {
    return formatValue(value, props.content.format)
  }
  
  return String(value)
})

/**
 * Formatar valor baseado no formato especificado
 */
function formatValue(value: any, format: string): string {
  switch (format) {
    case 'currency':
      return formatCurrency(value)
    
    case 'date':
      return formatDate(value)
    
    case 'datetime':
      return formatDateTime(value)
    
    case 'time':
      return formatTime(value)
    
    case 'cpf':
      return formatCPF(value)
    
    case 'cnpj':
      return formatCNPJ(value)
    
    case 'phone':
      return formatPhone(value)
    
    case 'cep':
      return formatCEP(value)
    
    case 'uppercase':
      return String(value).toUpperCase()
    
    case 'lowercase':
      return String(value).toLowerCase()
    
    case 'capitalize':
      return capitalize(String(value))
    
    default:
      return String(value)
  }
}

function formatCurrency(value: any): string {
  const num = Number(value)
  if (isNaN(num)) return String(value)
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(num)
}

function formatDate(value: any): string {
  const date = new Date(value)
  if (isNaN(date.getTime())) return String(value)
  
  return new Intl.DateTimeFormat('pt-BR').format(date)
}

function formatDateTime(value: any): string {
  const date = new Date(value)
  if (isNaN(date.getTime())) return String(value)
  
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short'
  }).format(date)
}

function formatTime(value: any): string {
  const date = new Date(value)
  if (isNaN(date.getTime())) return String(value)
  
  return new Intl.DateTimeFormat('pt-BR', {
    timeStyle: 'short'
  }).format(date)
}

function formatCPF(value: any): string {
  const cpf = String(value).replace(/\D/g, '')
  if (cpf.length !== 11) return String(value)
  
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

function formatCNPJ(value: any): string {
  const cnpj = String(value).replace(/\D/g, '')
  if (cnpj.length !== 14) return String(value)
  
  return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
}

function formatPhone(value: any): string {
  const phone = String(value).replace(/\D/g, '')
  
  if (phone.length === 11) {
    return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  } else if (phone.length === 10) {
    return phone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
  }
  
  return String(value)
}

function formatCEP(value: any): string {
  const cep = String(value).replace(/\D/g, '')
  if (cep.length !== 8) return String(value)
  
  return cep.replace(/(\d{5})(\d{3})/, '$1-$2')
}

function capitalize(text: string): string {
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Classe CSS do bloco
 */
const blockClass = computed(() => {
  return [
    props.className,
    props.style?.align ? `text-${props.style.align}` : ''
  ].filter(Boolean).join(' ')
})

/**
 * Estilo inline do bloco
 */
const blockStyle = computed(() => {
  if (!props.style) return {}
  
  const style: Record<string, string> = {}
  
  if (props.style.fontSize) style.fontSize = `${props.style.fontSize}px`
  if (props.style.fontWeight) style.fontWeight = props.style.fontWeight
  if (props.style.fontStyle) style.fontStyle = props.style.fontStyle
  if (props.style.fontFamily) style.fontFamily = props.style.fontFamily
  if (props.style.color) style.color = props.style.color
  if (props.style.backgroundColor) style.backgroundColor = props.style.backgroundColor
  
  if (props.style.paddingTop) style.paddingTop = `${props.style.paddingTop}px`
  if (props.style.paddingRight) style.paddingRight = `${props.style.paddingRight}px`
  if (props.style.paddingBottom) style.paddingBottom = `${props.style.paddingBottom}px`
  if (props.style.paddingLeft) style.paddingLeft = `${props.style.paddingLeft}px`
  
  if (props.style.border) style.border = props.style.border
  if (props.style.borderRadius) style.borderRadius = `${props.style.borderRadius}px`
  
  return style
})
</script>

<style scoped lang="scss">
.doc-block-variable {
  display: inline;
  
  &.text-left {
    text-align: left;
  }
  
  &.text-center {
    text-align: center;
  }
  
  &.text-right {
    text-align: right;
  }
}
</style>
