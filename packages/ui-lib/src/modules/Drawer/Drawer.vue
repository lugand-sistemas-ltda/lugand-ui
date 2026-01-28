<script setup lang="ts">
import { computed, watch, onMounted, onUnmounted } from 'vue'
import { useDisclosure } from '@/shared/composables'
import type { DrawerPosition } from '@/shared/types'
import { Button } from '@/shared/components'

export interface DrawerProps {
    /** Controls the drawer open state (v-model) */
    modelValue?: boolean
    /** Position of the drawer */
    position?: DrawerPosition
    /** Size of the drawer (width for left/right, height for top/bottom) */
    size?: string | number
    /** Show backdrop overlay */
    backdrop?: boolean
    /** Close drawer when clicking on backdrop */
    closeOnOverlay?: boolean
    /** Close drawer when pressing ESC key */
    closeOnEsc?: boolean
    /** Disable scroll lock when drawer is open */
    disableScrollLock?: boolean
    /** Custom z-index */
    zIndex?: number
}

const props = withDefaults(defineProps<DrawerProps>(), {
    modelValue: false,
    position: 'right',
    size: '400px',
    backdrop: true,
    closeOnOverlay: true,
    closeOnEsc: true,
    disableScrollLock: false,
    zIndex: 1000
})

const emit = defineEmits<{
    'update:modelValue': [value: boolean]
    open: []
    close: []
    'after-open': []
    'after-close': []
}>()

// --- Disclosure Logic ---
const { isOpen, open, close } = useDisclosure({
    defaultOpen: props.modelValue,
    onOpen: () => {
        emit('update:modelValue', true)
        emit('open')
        if (!props.disableScrollLock) lockScroll()
        setTimeout(() => {
            focusFirstElement()
            emit('after-open')
        }, 300) // Wait for transition
    },
    onClose: () => {
        emit('update:modelValue', false)
        emit('close')
        if (!props.disableScrollLock) unlockScroll()
        setTimeout(() => {
            emit('after-close')
        }, 300)
    }
})

// Sync with v-model
watch(() => props.modelValue, (newVal) => {
    if (newVal !== isOpen.value) {
        newVal ? open() : close()
    }
})

// --- Scroll Lock ---
const lockScroll = () => {
    document.body.style.overflow = 'hidden'
}

const unlockScroll = () => {
    document.body.style.overflow = ''
}

// --- Focus Management ---
const focusFirstElement = () => {
    const drawerEl = document.querySelector('.drawer-content') as HTMLElement
    if (!drawerEl) return

    const focusable = drawerEl.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    if (focusable.length > 0 && focusable[0]) {
        focusable[0].focus()
    }
}

// --- Keyboard Handler ---
const handleEscKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && props.closeOnEsc && isOpen.value) {
        close()
    }
}

onMounted(() => {
    document.addEventListener('keydown', handleEscKey)
})

onUnmounted(() => {
    document.removeEventListener('keydown', handleEscKey)
    unlockScroll()
})

// --- Handlers ---
const handleOverlayClick = () => {
    if (props.closeOnOverlay) {
        close()
    }
}

// --- Computed Styles ---
const drawerStyle = computed(() => {
    const isHorizontal = props.position === 'left' || props.position === 'right'
    const size = typeof props.size === 'number' ? `${props.size}px` : props.size

    return {
        [isHorizontal ? 'width' : 'height']: size,
        zIndex: props.zIndex + 1
    }
})

const backdropStyle = computed(() => ({
    zIndex: props.zIndex
}))
</script>

<template>
    <Teleport to="body">
        <!-- Backdrop -->
        <Transition name="backdrop-fade">
            <div v-if="isOpen && backdrop" class="drawer-backdrop" :style="backdropStyle" @click="handleOverlayClick"
                aria-hidden="true" />
        </Transition>

        <!-- Drawer Panel -->
        <Transition :name="`drawer-slide-${position}`">
            <div v-if="isOpen" :class="['drawer-panel', `drawer-${position}`]" :style="drawerStyle" role="dialog"
                aria-modal="true">
                <div class="drawer-content">
                    <!-- Header -->
                    <div v-if="$slots.header" class="drawer-header">
                        <slot name="header" />
                        <Button variant="ghost" size="sm" class="drawer-close-btn" @click="close"
                            aria-label="Close drawer">
                            ✕
                        </Button>
                    </div>

                    <!-- Body -->
                    <div class="drawer-body">
                        <slot />
                    </div>

                    <!-- Footer -->
                    <div v-if="$slots.footer" class="drawer-footer">
                        <slot name="footer" />
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<style lang="scss" scoped>
// ============================================
// Backdrop
// ============================================
.drawer-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(2px);
}

// ============================================
// Drawer Panel
// ============================================
.drawer-panel {
    position: fixed;
    background: var(--color-bg-primary);
    box-shadow: var(--shadow-xl);
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

// Position variants
.drawer-left {
    top: 0;
    left: 0;
    bottom: 0;
}

.drawer-right {
    top: 0;
    right: 0;
    bottom: 0;
}

.drawer-top {
    top: 0;
    left: 0;
    right: 0;
}

.drawer-bottom {
    bottom: 0;
    left: 0;
    right: 0;
}

// ============================================
// Drawer Content
// ============================================
.drawer-content {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
}

.drawer-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--spacing-lg);
    border-bottom: 1px solid var(--color-border-base);
    flex-shrink: 0;
    gap: var(--spacing-md);
}

.drawer-body {
    flex: 1;
    padding: var(--spacing-lg);
    overflow-y: auto;
    overflow-x: hidden;
}

.drawer-footer {
    padding: var(--spacing-lg);
    border-top: 1px solid var(--color-border-base);
    flex-shrink: 0;
    display: flex;
    gap: var(--spacing-md);
    justify-content: flex-end;
}

// ============================================
// Transitions - Backdrop
// ============================================
.backdrop-fade-enter-active,
.backdrop-fade-leave-active {
    transition: opacity 0.3s ease;
}

.backdrop-fade-enter-from,
.backdrop-fade-leave-to {
    opacity: 0;
}

// ============================================
// Transitions - Drawer Slides
// ============================================

// Left
.drawer-slide-left-enter-active,
.drawer-slide-left-leave-active {
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.drawer-slide-left-enter-from,
.drawer-slide-left-leave-to {
    transform: translateX(-100%);
}

// Right
.drawer-slide-right-enter-active,
.drawer-slide-right-leave-active {
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.drawer-slide-right-enter-from,
.drawer-slide-right-leave-to {
    transform: translateX(100%);
}

// Top
.drawer-slide-top-enter-active,
.drawer-slide-top-leave-active {
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.drawer-slide-top-enter-from,
.drawer-slide-top-leave-to {
    transform: translateY(-100%);
}

// Bottom
.drawer-slide-bottom-enter-active,
.drawer-slide-bottom-leave-active {
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.drawer-slide-bottom-enter-from,
.drawer-slide-bottom-leave-to {
    transform: translateY(100%);
}
</style>
