<script setup lang="ts">
/**
 * Modal - Janela de diálogo modal genérica
 * 
 * Features:
 * - Overlay com blur
 * - Teleport para body
 * - Lock de scroll automático
 * - Animações suaves
 * - Acessibilidade (ESC, focus trap, ARIA)
 * - Slots flexíveis (header, body, footer)
 * - Variantes e tamanhos
 */
import { ref, watch, onMounted, onBeforeUnmount, nextTick, computed } from 'vue'
import { Btn, Icon } from '@/shared/components'
import type { ModalSize, ModalVariant } from './types'
import { registerModal, unregisterModal, getModalZIndex } from './modalStack'

interface Props {
    modelValue?: boolean
    title?: string
    size?: ModalSize
    variant?: ModalVariant
    closable?: boolean
    closeOnOverlay?: boolean
    closeOnEsc?: boolean
    persistent?: boolean
    showHeader?: boolean
    showFooter?: boolean
    loading?: boolean
    fullscreen?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: false,
    size: 'md',
    variant: 'default',
    closable: true,
    closeOnOverlay: true,
    closeOnEsc: true,
    persistent: false,
    showHeader: true,
    showFooter: true,
    loading: false,
    fullscreen: false
})

const emit = defineEmits<{
    'update:modelValue': [value: boolean]
    'open': []
    'close': []
    'confirm': []
    'cancel': []
}>()

// State
const isOpen = ref(props.modelValue)
const modalRef = ref<HTMLElement | null>(null)
const modalId = ref<symbol | null>(null)
const dynamicZIndex = ref<number>(1000)

// Computed z-index - usa o dinamico do stack
const computedZIndex = computed(() => {
    if (modalId.value) {
        return getModalZIndex(modalId.value) || dynamicZIndex.value
    }
    return dynamicZIndex.value
})

// Controle de abertura/fechamento
const open = () => {
    isOpen.value = true
    emit('update:modelValue', true)
    emit('open')
    lockScroll()
    nextTick(() => {
        focusFirstElement()
    })
}

// Close interno - respeitando persistent e loading
const close = () => {
    if (props.persistent || props.loading) return

    isOpen.value = false
    emit('update:modelValue', false)
    emit('close')
    unlockScroll()
}

// Force close - usado pelos botões, ignora persistent
const forceClose = () => {
    isOpen.value = false
    emit('update:modelValue', false)
    emit('close')
    unlockScroll()
}

const handleOverlayClick = () => {
    if (props.closeOnOverlay && !props.persistent) {
        close()
    }
}

const handleEscKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && props.closeOnEsc && isOpen.value) {
        close()
    }
}

const handleConfirm = () => {
    emit('confirm')
    // Modals não-persistent fecham automaticamente no confirm
    // Modals persistent só fecham se o parent mudar o v-model
    if (!props.persistent && !props.loading) {
        forceClose()
    }
}

const handleCancel = () => {
    emit('cancel')
    // Fecha automaticamente no cancel (comportamento padrão para todos)
    if (!props.loading) {
        forceClose()
    }
}

// Lock de scroll (previne scroll do body)
const lockScroll = () => {
    document.body.style.overflow = 'hidden'
    document.body.style.paddingRight = `${getScrollbarWidth()}px`
}

const unlockScroll = () => {
    document.body.style.overflow = ''
    document.body.style.paddingRight = ''
}

const getScrollbarWidth = () => {
    return window.innerWidth - document.documentElement.clientWidth
}

// Focus trap (acessibilidade)
const focusFirstElement = () => {
    if (!modalRef.value) return

    const focusable = modalRef.value.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )

    if (focusable.length > 0 && focusable[0]) {
        focusable[0].focus()
    }
}

// Watchers
watch(() => props.modelValue, (newVal) => {
    if (newVal) {
        open()
    } else {
        // Quando o parent muda o v-model para false, sempre fecha (usa forceClose)
        // Isso permite que persistent e loading fechem via v-model
        forceClose()
    }
})

// Lifecycle
onMounted(() => {
    window.addEventListener('keydown', handleEscKey)

    // Registra o modal no stack e obtém seu z-index
    const registration = registerModal()
    modalId.value = registration.id
    dynamicZIndex.value = registration.zIndex

    if (props.modelValue) {
        open()
    }
})

onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleEscKey)
    unlockScroll()

    // Remove o modal do stack
    if (modalId.value) {
        unregisterModal(modalId.value)
    }
})
</script>

<template>
    <Teleport to="body">
        <Transition name="modal-fade">
            <div v-if="isOpen" class="modal-overlay" :style="{ zIndex: computedZIndex }"
                @click.self="handleOverlayClick">
                <Transition name="modal-scale">
                    <div v-if="isOpen" ref="modalRef" class="modal" :class="[
                        `modal--${size}`,
                        `modal--${variant}`,
                        { 'modal--fullscreen': fullscreen, 'modal--loading': loading }
                    ]" role="dialog" aria-modal="true" :aria-labelledby="title ? 'modal-title' : undefined"
                        @click.stop>
                        <!-- Header -->
                        <header v-if="showHeader || $slots.header" class="modal__header">
                            <slot name="header">
                                <h2 v-if="title" id="modal-title" class="modal__title">
                                    {{ title }}
                                </h2>
                            </slot>

                            <button v-if="closable && !persistent" class="modal__close" type="button"
                                aria-label="Fechar modal" @click="close">
                                <Icon name="x" />
                            </button>
                        </header>

                        <!-- Body -->
                        <div class="modal__body">
                            <slot />
                        </div>

                        <!-- Footer -->
                        <footer v-if="showFooter || $slots.footer" class="modal__footer">
                            <slot name="footer">
                                <Btn variant="ghost" :disabled="loading" @click="handleCancel">
                                    Cancelar
                                </Btn>
                                <Btn :variant="variant === 'danger' ? 'danger' : 'primary'" :loading="loading"
                                    @click="handleConfirm">
                                    Confirmar
                                </Btn>
                            </slot>
                        </footer>
                    </div>
                </Transition>
            </div>
        </Transition>
    </Teleport>
</template>

<style lang="scss" scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-lg);
    overflow-y: auto;

    @media (max-width: 768px) {
        padding: var(--spacing-md);
    }
}

.modal {
    background: var(--color-bg-primary);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-2xl);
    border: 1px solid var(--color-border-base);
    display: flex;
    flex-direction: column;
    max-height: 90vh;
    width: 100%;
    position: relative;

    // Sizes
    &--sm {
        max-width: 400px;
    }

    &--md {
        max-width: 600px;
    }

    &--lg {
        max-width: 800px;
    }

    &--xl {
        max-width: 1200px;
    }

    &--full {
        max-width: 100%;
    }

    &--fullscreen {
        max-width: 100%;
        max-height: 100vh;
        height: 100vh;
        border-radius: 0;
    }

    // Variants (border accent)
    &--danger {
        border-top: 3px solid var(--color-error);
    }

    &--success {
        border-top: 3px solid var(--color-success);
    }

    &--warning {
        border-top: 3px solid var(--color-warning);
    }

    &--loading {
        pointer-events: none;
        opacity: 0.8;
    }
}

.modal__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--spacing-lg);
    border-bottom: 1px solid var(--color-border-base);
    flex-shrink: 0;

    @media (max-width: 768px) {
        padding: var(--spacing-md);
    }
}

.modal__title {
    font-size: var(--font-size-xl);
    font-weight: 600;
    color: var(--color-text-primary);
    margin: 0;
}

.modal__close {
    background: transparent;
    border: none;
    color: var(--color-text-secondary);
    cursor: pointer;
    padding: var(--spacing-xs);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-sm);
    transition: all 0.2s;
    margin-left: var(--spacing-md);

    &:hover {
        background: var(--color-bg-tertiary);
        color: var(--color-text-primary);
    }

    &:active {
        transform: scale(0.95);
    }
}

.modal__body {
    padding: var(--spacing-lg);
    overflow-y: auto;
    overflow-x: hidden; // Previne scroll horizontal
    flex: 1;
    color: var(--color-text-primary);
    word-wrap: break-word; // Quebra palavras longas
    word-break: break-word; // Compatibilidade adicional

    @media (max-width: 768px) {
        padding: var(--spacing-md);
    }
}

.modal__footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: var(--spacing-sm);
    padding: var(--spacing-lg);
    border-top: 1px solid var(--color-border-base);
    flex-shrink: 0;

    @media (max-width: 768px) {
        padding: var(--spacing-md);
    }
}

// Animations
.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
    opacity: 0;
}

.modal-scale-enter-active,
.modal-scale-leave-active {
    transition: all 0.3s ease;
}

.modal-scale-enter-from,
.modal-scale-leave-to {
    opacity: 0;
    transform: scale(0.9);
}
</style>
