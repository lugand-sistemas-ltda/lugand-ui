<template>
  <component
    :is="`h${content.level}`"
    :class="['doc-block-heading', blockClass]"
    :style="blockStyle"
  >
    {{ content.text }}
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { HeadingBlockContent, BlockStyle } from '../core/types'

export interface DocBlockHeadingProps {
  /** Conteúdo do bloco */
  content: HeadingBlockContent
  
  /** Estilo do bloco */
  style?: BlockStyle
  
  /** Classe CSS adicional */
  className?: string
}

const props = withDefaults(defineProps<DocBlockHeadingProps>(), {
  className: ''
})

/**
 * Classe CSS do bloco
 */
const blockClass = computed(() => {
  return [
    props.className,
    `heading-level-${props.content.level}`,
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
.doc-block-heading {
  margin: 0;
  padding: 0;
  
  &.heading-level-1 {
    font-size: 2em;
    font-weight: bold;
  }
  
  &.heading-level-2 {
    font-size: 1.5em;
    font-weight: bold;
  }
  
  &.heading-level-3 {
    font-size: 1.17em;
    font-weight: bold;
  }
  
  &.heading-level-4 {
    font-size: 1em;
    font-weight: bold;
  }
  
  &.heading-level-5 {
    font-size: 0.83em;
    font-weight: bold;
  }
  
  &.heading-level-6 {
    font-size: 0.67em;
    font-weight: bold;
  }
  
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
