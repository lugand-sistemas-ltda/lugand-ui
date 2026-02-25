<template>
  <div :class="['doc-block-text', blockClass]" :style="blockStyle">
    <component
      :is="getTextComponent()"
      v-if="content.format === 'markdown'"
      v-html="renderedMarkdown"
    />
    <component
      :is="getTextComponent()"
      v-else-if="content.format === 'html'"
      v-html="content.text"
    />
    <component
      :is="getTextComponent()"
      v-else
      v-text="content.text"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { TextBlockContent, BlockStyle } from '../core/types'

export interface DocBlockTextProps {
  /** Conteúdo do bloco */
  content: TextBlockContent
  
  /** Estilo do bloco */
  style?: BlockStyle
  
  /** Classe CSS adicional */
  className?: string
}

const props = withDefaults(defineProps<DocBlockTextProps>(), {
  className: ''
})

/**
 * Renderizar markdown simples (básico)
 * Para produção, considere usar uma biblioteca como marked
 */
const renderedMarkdown = computed(() => {
  if (props.content.format !== 'markdown') return ''
  
  let html = props.content.text
  
  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  
  // Italic
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>')
  
  // Links
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')
  
  // Line breaks
  html = html.replace(/\n/g, '<br>')
  
  return html
})

/**
 * Determinar componente HTML baseado no estilo
 */
function getTextComponent(): string {
  return 'p'
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
  if (props.style.lineHeight) style.lineHeight = String(props.style.lineHeight)
  
  if (props.style.marginTop) style.marginTop = `${props.style.marginTop}px`
  if (props.style.marginRight) style.marginRight = `${props.style.marginRight}px`
  if (props.style.marginBottom) style.marginBottom = `${props.style.marginBottom}px`
  if (props.style.marginLeft) style.marginLeft = `${props.style.marginLeft}px`
  
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
.doc-block-text {
  word-wrap: break-word;
  white-space: pre-wrap;
  
  &.text-left {
    text-align: left;
  }
  
  &.text-center {
    text-align: center;
  }
  
  &.text-right {
    text-align: right;
  }
  
  &.text-justify {
    text-align: justify;
  }
}
</style>
