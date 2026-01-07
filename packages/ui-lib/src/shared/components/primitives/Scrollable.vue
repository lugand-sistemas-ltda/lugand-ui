<script setup lang="ts">
/**
 * Scrollable - Wrapper genérico com scrollbar customizado
 * Estiliza scrollbar de forma consistente em todo o app
 */
interface Props {
  maxHeight?: string
  direction?: 'vertical' | 'horizontal' | 'both'
}

withDefaults(defineProps<Props>(), {
  maxHeight: '100%',
  direction: 'vertical',
})
</script>

<template>
  <div
    :class="['scrollable', `scrollable--${direction}`]"
    :style="{ maxHeight }"
  >
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.scrollable {
  overflow: hidden;

  &--vertical {
    overflow-y: auto;
  }

  &--horizontal {
    overflow-x: auto;
  }

  &--both {
    overflow: auto;
  }

  // Scrollbar customizado (webkit browsers)
  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: var(--color-bg-secondary);
    border-radius: var(--radius-full);
  }

  &::-webkit-scrollbar-thumb {
    background: var(--color-border-dark);
    border-radius: var(--radius-full);
    transition: background var(--transition-fast);

    &:hover {
      background: var(--color-primary);
    }
  }

  // Scrollbar customizado (Firefox)
  scrollbar-width: thin;
  scrollbar-color: var(--color-border-dark) var(--color-bg-secondary);
}
</style>
