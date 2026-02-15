<script setup lang="ts">
/**
 * Alert - Componente de alerta/notificação inline
 * 
 * Displays contextual feedback messages for user actions.
 * Can be informational, warning, error, or success messages.
 * 
 * Features:
 * - 4 variants (info, success, warning, error)
 * - Optional icon (auto or custom)
 * - Dismissible option
 * - Title + description structure
 * - Slot for custom content
 * 
 * @example
 * ```vue
 * <Alert variant="success" title="Success!" dismissible>
 *   Your changes have been saved.
 * </Alert>
 * ```
 */

interface Props {
  /** Alert variant defining color and icon */
  variant?: 'info' | 'success' | 'warning' | 'error'
  /** Optional title (bold text) */
  title?: string
  /** Show/hide icon */
  showIcon?: boolean
  /** Custom icon (overrides default variant icon) */
  icon?: string
  /** Can be dismissed by user */
  dismissible?: boolean
  /** Border style */
  bordered?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'info',
  showIcon: true,
  dismissible: false,
  bordered: false
})

const emit = defineEmits<{
  dismiss: []
}>()

// Default icons per variant
const defaultIcons: Record<typeof props.variant, string> = {
  info: 'ℹ️',
  success: '✅',
  warning: '⚠️',
  error: '❌'
}

const displayIcon = props.icon || defaultIcons[props.variant]

function handleDismiss(): void {
  emit('dismiss')
}
</script>

<template>
  <div class="alert" :class="[
    `alert--${variant}`,
    { 'alert--bordered': bordered }
  ]" role="alert">
    <!-- Icon -->
    <div v-if="showIcon" class="alert__icon">
      {{ displayIcon }}
    </div>

    <!-- Content -->
    <div class="alert__content">
      <div v-if="title" class="alert__title">
        {{ title }}
      </div>
      <div class="alert__message">
        <slot />
      </div>
    </div>

    <!-- Dismiss Button -->
    <button v-if="dismissible" class="alert__dismiss" type="button" aria-label="Dismiss alert" @click="handleDismiss">
      ✕
    </button>
  </div>
</template>

<style lang="scss" scoped>
.alert {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  line-height: 1.5;

  // Variants - usando variáveis CSS dos temas
  &--info {
    background: var(--color-info-bg);
    color: var(--color-info-text);
  }

  &--success {
    background: var(--color-success-bg);
    color: var(--color-success-text);
  }

  &--warning {
    background: var(--color-warning-bg);
    color: var(--color-warning-text);
  }

  &--error {
    background: var(--color-error-bg);
    color: var(--color-error-text);
  }

  &--bordered {
    border-width: 1px;
    border-style: solid;

    &.alert--info {
      border-color: var(--color-info-border);
    }

    &.alert--success {
      border-color: var(--color-success-border);
    }

    &.alert--warning {
      border-color: var(--color-warning-border);
    }

    &.alert--error {
      border-color: var(--color-error-border);
    }
  }

  &__icon {
    font-size: var(--font-size-lg);
    flex-shrink: 0;
  }

  &__content {
    flex: 1;
    min-width: 0;
  }

  &__title {
    font-weight: 600;
    margin-bottom: var(--spacing-xs);
  }

  &__message {
    color: inherit;
  }

  &__dismiss {
    flex-shrink: 0;
    background: none;
    border: none;
    padding: 0;
    margin: 0;
    cursor: pointer;
    font-size: var(--font-size-lg);
    line-height: 1;
    opacity: 0.5;
    transition: opacity var(--transition-base);
    color: inherit;

    &:hover {
      opacity: 1;
    }

    &:focus {
      outline: 2px solid currentColor;
      outline-offset: 2px;
      opacity: 1;
    }
  }
}
</style>
