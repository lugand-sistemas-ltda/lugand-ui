<script setup lang="ts">
/**
 * NavItem - Item de navegação colapsável/expansível
 * Componente genérico para menus hierárquicos
 */
import { ref } from 'vue'

export interface Props {
  label: string
  icon?: string
  collapsible?: boolean
  defaultExpanded?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  collapsible: true,
  defaultExpanded: false,
})

const isExpanded = ref(props.defaultExpanded)

const toggle = () => {
  if (props.collapsible) {
    isExpanded.value = !isExpanded.value
  }
}
</script>

<template>
  <div class="nav-item">
    <button
      :class="['nav-item__header', { 'nav-item__header--expanded': isExpanded }]"
      @click="toggle"
    >
      <span v-if="icon" class="nav-item__icon">{{ icon }}</span>
      <span class="nav-item__label">{{ label }}</span>
      <span v-if="collapsible" class="nav-item__arrow">
        {{ isExpanded ? '▼' : '▶' }}
      </span>
    </button>

    <div v-if="isExpanded" class="nav-item__children">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.nav-item {
  display: flex;
  flex-direction: column;
  width: 100%;

  &__header {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    padding: var(--spacing-xs) var(--spacing-sm);
    background: transparent;
    border: none;
    border-radius: var(--radius-sm);
    color: var(--color-text-primary);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-semibold);
    text-align: left;
    cursor: pointer;
    transition: all var(--transition-fast);
    width: 100%;

    &:hover {
      background: var(--color-bg-secondary);
    }

    &--expanded {
      color: var(--color-primary);
    }
  }

  &__icon {
    font-size: var(--font-size-base);
    line-height: 1;
  }

  &__label {
    flex: 1;
  }

  &__arrow {
    font-size: 10px;
    line-height: 1;
    transition: transform var(--transition-fast);
  }

  &__children {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-2xs);
    padding-left: var(--spacing-lg);
    margin-top: var(--spacing-2xs);
    animation: slideDown var(--transition-fast);
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
