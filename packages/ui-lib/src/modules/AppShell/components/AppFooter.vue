<script setup lang="ts">
/**
 * AppFooter - Footer genérico com slot para conteúdo customizável
 */
interface Props {
  sticky?: boolean
}

withDefaults(defineProps<Props>(), {
  sticky: false,
})
</script>

<template>
  <footer :class="['app-footer', { 'app-footer--sticky': sticky }]">
    <div class="app-footer__content">
      <slot />
    </div>
  </footer>
</template>

<style lang="scss" scoped>
.app-footer {
  background: var(--color-bg-primary);
  border-top: 1px solid var(--color-border-base);

  &--sticky {
    position: sticky;
    bottom: 0;
  }

  &__content {
    max-width: 1400px;
    margin: 0 auto;
    padding: var(--spacing-md) var(--spacing-xl);
    width: 100%;
    text-align: center;
    color: var(--color-text-secondary);
    font-size: var(--font-size-sm);
  }
}
</style>
