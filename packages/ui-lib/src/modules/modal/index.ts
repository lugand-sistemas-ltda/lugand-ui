/**
 * Modal Module
 * Sistema completo de modais com gerenciamento de stack
 */

export { default as Modal } from './components/Modal.vue'
export * from './components/types'
export * from './components/modalStack'
export { useModal, useConfirmModal } from './composables/useModal'
