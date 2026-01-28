<script setup lang="ts">
/**
 * NavLink - Link genérico para navegação
 * Usa router-link com estilos base reutilizáveis
 * 
 * NOTA: Requer vue-router instalado no projeto host
 */
import { computed, inject } from 'vue'

export interface Props {
  to: string
  exact?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  exact: false,
  disabled: false,
})

// Inject do router de forma segura (pode não existir)
const route = inject<any>('$route', null)

const isActive = computed(() => {
  if (props.disabled || !route) return false
  if (props.exact) return route.path === props.to
  return route.path.startsWith(props.to)
})
</script>

<template>
  <router-link v-if="!disabled" :to="to" :class="['nav-link', { 'nav-link--active': isActive }]">
    <slot />
  </router-link>
  <span v-else class="nav-link nav-link--disabled">
    <slot />
  </span>
</template>

<style lang="scss" scoped>
.nav-link {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
  color: var(--color-text-secondary);
  text-decoration: none;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  transition: all var(--transition-fast);
  cursor: pointer;
  white-space: nowrap;

  &:hover:not(&--disabled) {
    background: var(--color-bg-secondary);
    color: var(--color-text-primary);
  }

  &--active {
    background: var(--color-primary);
    color: var(--color-text-inverse);
    font-weight: var(--font-weight-semibold);

    &:hover {
      background: var(--color-primary-hover);
    }
  }

  &--disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
</style>
