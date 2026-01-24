<script setup lang="ts">
/**
 * AlertDialog - Modal de confirmação/alerta
 * 
 * Dialog modal for confirming destructive actions or displaying important alerts.
 * Built on top of Modal component with pre-styled actions.
 * 
 * Features:
 * - 4 variants (info, success, warning, danger)
 * - Customizable title and message
 * - Confirm/Cancel actions
 * - Auto-focus on confirm button
 * - Keyboard support (Enter/Escape)
 * 
 * @example
 * ```vue
 * <AlertDialog
 *   :is-open="showDelete"
 *   variant="danger"
 *   title="Delete User?"
 *   message="This action cannot be undone."
 *   confirm-text="Delete"
 *   @confirm="handleDelete"
 *   @cancel="showDelete = false"
 * />
 * ```
 */

import { Modal } from '@/modules/modal'
import { Btn } from '@/shared/components'

defineOptions({
  inheritAttrs: false
})

interface Props {
  /** Controls dialog visibility */
  isOpen: boolean
  /** Dialog variant (affects confirm button style) */
  variant?: 'info' | 'success' | 'warning' | 'danger'
  /** Dialog title */
  title: string
  /** Dialog message/description */
  message?: string
  /** Confirm button text */
  confirmText?: string
  /** Cancel button text */
  cancelText?: string
  /** Show loading state on confirm button */
  loading?: boolean
  /** Disable confirm button */
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'info',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  loading: false,
  disabled: false
})

const emit = defineEmits<{
  confirm: []
  cancel: []
  close: []
}>()

// Map variant to button variant
const buttonVariants: Record<typeof props.variant, 'primary' | 'danger'> = {
  info: 'primary',
  success: 'primary',
  warning: 'primary',
  danger: 'danger'
}

const confirmButtonVariant = buttonVariants[props.variant]

function handleConfirm(): void {
  if (!props.disabled && !props.loading) {
    emit('confirm')
  }
}

function handleCancel(): void {
  emit('cancel')
  emit('close')
}

function handleClose(): void {
  emit('close')
}
</script>

<template>
  <Modal :is-open="isOpen" :title="title" size="sm" @close="handleClose">
    <!-- Message -->
    <div class="alert-dialog__message">
      <slot>
        {{ message }}
      </slot>
    </div>

    <!-- Actions -->
    <template #footer>
      <Btn variant="ghost" :disabled="loading" @click="handleCancel">
        {{ cancelText }}
      </Btn>
      <Btn :variant="confirmButtonVariant" :loading="loading" :disabled="disabled" @click="handleConfirm">
        {{ confirmText }}
      </Btn>
    </template>
  </Modal>
</template>

<style lang="scss" scoped>
.alert-dialog__message {
  padding: var(--spacing-md) 0;
  line-height: 1.6;
  color: var(--color-text-secondary);
}
</style>
