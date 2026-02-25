<template>
  <div :class="['doc-block-qrcode', blockClass]" :style="blockStyle">
    <LgQRCode
      v-if="qrData"
      :value="qrData"
      :size="content.size || 150"
      :error-correction-level="content.errorCorrectionLevel || 'M'"
    />
    <div v-else class="qrcode-placeholder">
      <span>QR Code</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import LgQRCode from '@/components/qrcode/LgQRCode.vue'
import type { QRCodeBlockContent, BlockStyle, DocumentData } from '../core/types'

export interface DocBlockQRCodeProps {
  /** Conteúdo do bloco */
  content: QRCodeBlockContent
  
  /** Dados do documento */
  data: DocumentData
  
  /** Estilo do bloco */
  style?: BlockStyle
  
  /** Classe CSS adicional */
  className?: string
}

const props = withDefaults(defineProps<DocBlockQRCodeProps>(), {
  className: ''
})

/**
 * Dados do QR Code (com interpolação de variáveis)
 */
const qrData = computed(() => {
  if (!props.content.data) return ''
  
  return replaceVariables(props.content.data, props.data)
})

/**
 * Substituir variáveis no formato {{var}}
 */
function replaceVariables(text: string, data: DocumentData): string {
  return text.replace(/\{\{(\w+)\}\}/g, (_, varName) => {
    const value = data[varName]
    return value !== undefined && value !== null ? String(value) : ''
  })
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
  
  if (props.style.marginTop) style.marginTop = `${props.style.marginTop}px`
  if (props.style.marginRight) style.marginRight = `${props.style.marginRight}px`
  if (props.style.marginBottom) style.marginBottom = `${props.style.marginBottom}px`
  if (props.style.marginLeft) style.marginLeft = `${props.style.marginLeft}px`
  
  if (props.style.paddingTop) style.paddingTop = `${props.style.paddingTop}px`
  if (props.style.paddingRight) style.paddingRight = `${props.style.paddingRight}px`
  if (props.style.paddingBottom) style.paddingBottom = `${props.style.paddingBottom}px`
  if (props.style.paddingLeft) style.paddingLeft = `${props.style.paddingLeft}px`
  
  if (props.style.backgroundColor) style.backgroundColor = props.style.backgroundColor
  if (props.style.border) style.border = props.style.border
  if (props.style.borderRadius) style.borderRadius = `${props.style.borderRadius}px`
  
  return style
})
</script>

<style scoped lang="scss">
.doc-block-qrcode {
  display: inline-block;
  
  &.text-left {
    text-align: left;
  }
  
  &.text-center {
    text-align: center;
  }
  
  &.text-right {
    text-align: right;
  }
  
  .qrcode-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 150px;
    height: 150px;
    border: 2px dashed var(--theme-border);
    background-color: var(--theme-muted);
    color: var(--theme-muted-foreground);
    font-size: 14px;
  }
}
</style>
