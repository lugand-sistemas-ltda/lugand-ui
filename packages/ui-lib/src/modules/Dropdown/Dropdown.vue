<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, provide, nextTick } from 'vue'
import type { DropdownPlacement, DropdownTrigger, DropdownVariant, DropdownContext } from './types'

export interface DropdownProps {
    modelValue?: boolean
    placement?: DropdownPlacement
    trigger?: DropdownTrigger
    variant?: DropdownVariant
    disabled?: boolean
    closeOnClickOutside?: boolean
    closeOnItemClick?: boolean
    offset?: number
    arrow?: boolean
    maxWidth?: string
    maxHeight?: string
}

const props = withDefaults(defineProps<DropdownProps>(), {
    modelValue: false,
    placement: 'bottom-start',
    trigger: 'click',
    variant: 'default',
    disabled: false,
    closeOnClickOutside: true,
    closeOnItemClick: true,
    offset: 8,
    arrow: false,
    maxWidth: '320px',
    maxHeight: '400px'
})

const emit = defineEmits<{
    'update:modelValue': [value: boolean]
    'open': []
    'close': []
}>()

// Refs
const triggerRef = ref<HTMLElement>()
const dropdownRef = ref<HTMLElement>()
const isOpen = ref(props.modelValue)

// Sincroniza com v-model
watch(() => props.modelValue, (newValue) => {
    isOpen.value = newValue
})

watch(isOpen, (newValue) => {
    emit('update:modelValue', newValue)
    if (newValue) {
        emit('open')
        nextTick(() => {
            updatePosition()
        })
    } else {
        emit('close')
    }
})

// Métodos de controle
const open = () => {
    if (!props.disabled) {
        isOpen.value = true
    }
}

const close = () => {
    isOpen.value = false
}

const toggle = () => {
    if (isOpen.value) {
        close()
    } else {
        open()
    }
}

// Context para DropdownItem
const dropdownContext: DropdownContext = {
    isOpen,
    close
}
provide('dropdown-context', dropdownContext)

// Posicionamento dinâmico
const dropdownStyle = ref<Record<string, string>>({})

const updatePosition = () => {
    if (!triggerRef.value || !dropdownRef.value) return

    const triggerRect = triggerRef.value.getBoundingClientRect()
    const dropdownRect = dropdownRef.value.getBoundingClientRect()
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    let top = 0
    let left = 0

    // Calcula posição baseada no placement
    switch (props.placement) {
        case 'top':
            top = triggerRect.top - dropdownRect.height - props.offset
            left = triggerRect.left + (triggerRect.width - dropdownRect.width) / 2
            break
        case 'top-start':
            top = triggerRect.top - dropdownRect.height - props.offset
            left = triggerRect.left
            break
        case 'top-end':
            top = triggerRect.top - dropdownRect.height - props.offset
            left = triggerRect.right - dropdownRect.width
            break
        case 'bottom':
            top = triggerRect.bottom + props.offset
            left = triggerRect.left + (triggerRect.width - dropdownRect.width) / 2
            break
        case 'bottom-start':
            top = triggerRect.bottom + props.offset
            left = triggerRect.left
            break
        case 'bottom-end':
            top = triggerRect.bottom + props.offset
            left = triggerRect.right - dropdownRect.width
            break
        case 'left':
            top = triggerRect.top + (triggerRect.height - dropdownRect.height) / 2
            left = triggerRect.left - dropdownRect.width - props.offset
            break
        case 'left-start':
            top = triggerRect.top
            left = triggerRect.left - dropdownRect.width - props.offset
            break
        case 'left-end':
            top = triggerRect.bottom - dropdownRect.height
            left = triggerRect.left - dropdownRect.width - props.offset
            break
        case 'right':
            top = triggerRect.top + (triggerRect.height - dropdownRect.height) / 2
            left = triggerRect.right + props.offset
            break
        case 'right-start':
            top = triggerRect.top
            left = triggerRect.right + props.offset
            break
        case 'right-end':
            top = triggerRect.bottom - dropdownRect.height
            left = triggerRect.right + props.offset
            break
    }

    // Ajusta se sair da viewport
    if (left < 0) left = 8
    if (left + dropdownRect.width > viewportWidth) {
        left = viewportWidth - dropdownRect.width - 8
    }
    if (top < 0) top = 8
    if (top + dropdownRect.height > viewportHeight) {
        top = viewportHeight - dropdownRect.height - 8
    }

    dropdownStyle.value = {
        top: `${top}px`,
        left: `${left}px`,
        maxWidth: props.maxWidth,
        maxHeight: props.maxHeight
    }
}

// Event handlers baseados no trigger
const handleTriggerClick = () => {
    if (props.trigger === 'click') {
        toggle()
    }
}

const handleTriggerMouseEnter = () => {
    if (props.trigger === 'hover') {
        open()
    }
}

const handleTriggerMouseLeave = () => {
    if (props.trigger === 'hover') {
        // Delay para permitir mover mouse para o dropdown
        setTimeout(() => {
            if (!dropdownRef.value?.matches(':hover')) {
                close()
            }
        }, 100)
    }
}

const handleDropdownMouseLeave = () => {
    if (props.trigger === 'hover') {
        close()
    }
}

// Click outside
const handleClickOutside = (event: MouseEvent) => {
    if (!props.closeOnClickOutside || !isOpen.value) return

    const target = event.target as Node
    if (
        triggerRef.value?.contains(target) ||
        dropdownRef.value?.contains(target)
    ) {
        return
    }

    close()
}

// Lifecycle
onMounted(() => {
    document.addEventListener('click', handleClickOutside)
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
    window.removeEventListener('resize', updatePosition)
    window.removeEventListener('scroll', updatePosition, true)
})

// Classes computadas
const dropdownClasses = computed(() => [
    'dropdown-content',
    `dropdown-content--${props.variant}`,
    {
        'dropdown-content--open': isOpen.value,
        'dropdown-content--with-arrow': props.arrow
    }
])

// Expõe métodos para controle manual
defineExpose({
    open,
    close,
    toggle,
    isOpen
})
</script>

<template>
    <div class="dropdown">
        <!-- Trigger slot -->
        <div ref="triggerRef" class="dropdown-trigger" @click="handleTriggerClick" @mouseenter="handleTriggerMouseEnter"
            @mouseleave="handleTriggerMouseLeave">
            <slot name="trigger" :isOpen="isOpen" :toggle="toggle" />
        </div>

        <!-- Dropdown content (Teleport to body) -->
        <Teleport to="body">
            <Transition name="dropdown-fade">
                <div v-if="isOpen" ref="dropdownRef" :class="dropdownClasses" :style="dropdownStyle"
                    @mouseleave="handleDropdownMouseLeave">
                    <div v-if="arrow" class="dropdown-arrow" />
                    <div class="dropdown-content-inner">
                        <slot :close="close" :isOpen="isOpen" />
                    </div>
                </div>
            </Transition>
        </Teleport>
    </div>
</template>

<style lang="scss">
.dropdown {
    display: inline-block;
}

.dropdown-trigger {
    display: inline-block;
    cursor: pointer;
}

.dropdown-content {
    position: fixed;
    z-index: 9999;

    background: var(--color-bg-elevated);
    border: 1px solid var(--color-border-primary);
    border-radius: var(--radius-md);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1), 0 8px 32px rgba(0, 0, 0, 0.08);

    overflow: auto;

    &--default {
        padding: var(--spacing-xs);
    }

    &--menu {
        padding: var(--spacing-xs);
        min-width: 180px;
    }

    &--card {
        padding: var(--spacing-md);
        min-width: 240px;
    }

    &--minimal {
        padding: var(--spacing-xs);
        border: none;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }
}

.dropdown-content-inner {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

// Transições
.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
    transition: opacity 0.15s ease, transform 0.15s ease;
}

.dropdown-fade-enter-from {
    opacity: 0;
    transform: translateY(-4px);
}

.dropdown-fade-leave-to {
    opacity: 0;
    transform: translateY(-4px);
}
</style>
