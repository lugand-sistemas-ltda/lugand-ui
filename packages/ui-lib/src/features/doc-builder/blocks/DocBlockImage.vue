<template>
  <div :class="['doc-block-image', blockClass]" :style="blockStyle">
    <img
      v-if="content.src"
      :src="imageSrc"
      :alt="content.alt || 'Document element'"
      :style="imageStyle"
      @error="onImageError"
    />
    <div v-else class="image-placeholder">
      <span>Imagem</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ImageBlockContent, BlockStyle, DocumentData } from '../core/types'

export interface DocBlockImageProps {
  /** Conteúdo do bloco */
  content: ImageBlockContent
  
  /** Dados do documento */
  data: DocumentData
  
  /** Estilo do bloco */
  style?: BlockStyle
  
  /** Classe CSS adicional */
  className?: string
}

const props = withDefaults(defineProps<DocBlockImageProps>(), {
  className: ''
})

const imageError = ref(false)

/**
 * Src da imagem (com interpolação de variáveis)
 */
const imageSrc = computed(() => {
  if (!props.content.src || imageError.value) return ''
  
  return replaceVariables(props.content.src, props.data)
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
 * Handler para erro de carregamento de imagem
 */
function onImageError() {
  imageError.value = true
}

/**
 * Estilo da imagem
 */
const imageStyle = computed(() => {
  const style: Record<string, string> = {}
  
  if (props.content.width) {
    style.width = typeof props.content.width === 'number'
      ? `${props.content.width}px`
      : props.content.width
  }
  
  if (props.content.height) {
    style.height = typeof props.content.height === 'number'
      ? `${props.content.height}px`
      : props.content.height
  }
  
  if (props.content.fit) {
    style.objectFit = props.content.fit
  }
  
  return style
})

/**
 * Classe CSS do bloco
 */
const blockClass = computed(() => {
  return [
    props.className,
    props.style?.align ? `text-${props.style.align}` : '',
    imageError.value ? 'image-error' : ''
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
.doc-block-image {
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
  
  img {
    max-width: 100%;
    height: auto;
    display: block;
  }
  
  .image-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 200px;
    height: 150px;
    border: 2px dashed var(--theme-border);
    background-color: var(--theme-muted);
    color: var(--theme-muted-foreground);
    font-size: 14px;
  }
  
  &.image-error {
    .image-placeholder {
      background-color: var(--theme-destructive);
      color: var(--theme-destructive-foreground);
    }
  }
}
</style>
