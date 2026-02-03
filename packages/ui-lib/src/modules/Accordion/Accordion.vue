<script setup lang="ts">
import { computed, provide, ref } from 'vue'
import type { AccordionVariant, AccordionSize, AccordionContext, RegisteredAccordionItem } from './types'
import { ACCORDION_INJECTION_KEY } from './types'

export interface AccordionProps {
    modelValue?: (string | number)[]
    variant?: AccordionVariant
    size?: AccordionSize
    multiple?: boolean
    collapsible?: boolean
    disabled?: boolean
}

const props = withDefaults(defineProps<AccordionProps>(), {
    modelValue: () => [],
    variant: 'default',
    size: 'md',
    multiple: false,
    collapsible: true,
    disabled: false
})

const emit = defineEmits<{
    'update:modelValue': [value: (string | number)[]]
    'change': [value: (string | number)[]]
}>()

// Estado interno
const activeItems = ref<(string | number)[]>([...props.modelValue])
const registeredItems = ref<RegisteredAccordionItem[]>([])

// Sincroniza com v-model
const syncActiveItems = (newValue: (string | number)[]) => {
    activeItems.value = newValue
    emit('update:modelValue', newValue)
    emit('change', newValue)
}

// Métodos de controle
const isOpen = (itemId: string | number): boolean => {
    return activeItems.value.includes(itemId)
}

const toggle = (itemId: string | number) => {
    if (props.disabled) return

    const isCurrentlyOpen = isOpen(itemId)

    if (props.multiple) {
        // Modo múltiplo: permite vários abertos
        if (isCurrentlyOpen) {
            if (props.collapsible || activeItems.value.length > 1) {
                syncActiveItems(activeItems.value.filter(id => id !== itemId))
            }
        } else {
            syncActiveItems([...activeItems.value, itemId])
        }
    } else if (isCurrentlyOpen && props.collapsible) {
        // Modo single: fecha se collapsible
        syncActiveItems([])
    } else if (!isCurrentlyOpen) {
        // Modo single: abre o item
        syncActiveItems([itemId])
    }
}

const open = (itemId: string | number) => {
    if (props.disabled || isOpen(itemId)) return

    if (props.multiple) {
        syncActiveItems([...activeItems.value, itemId])
    } else {
        syncActiveItems([itemId])
    }
}

const close = (itemId: string | number) => {
    if (props.disabled || !isOpen(itemId)) return

    if (props.collapsible || activeItems.value.length > 1) {
        syncActiveItems(activeItems.value.filter(id => id !== itemId))
    }
}

// Registro de items (Slot Collection Pattern)
const registerAccordionItem = (item: RegisteredAccordionItem) => {
    registeredItems.value.push(item)
    registeredItems.value.sort((a, b) => a.order - b.order)
}

const unregisterAccordionItem = (itemId: string | number) => {
    registeredItems.value = registeredItems.value.filter(item => item.id !== itemId)
}

// Provide context para children
const accordionContext: AccordionContext = {
    activeItems,
    disabled: computed(() => props.disabled),
    variant: props.variant,
    size: props.size,
    multiple: props.multiple,
    collapsible: props.collapsible,
    toggle,
    open,
    close,
    isOpen,
    registerAccordionItem,
    unregisterAccordionItem,
    registeredItems
}

provide(ACCORDION_INJECTION_KEY, accordionContext)

// Classes computadas
const accordionClasses = computed(() => [
    'accordion',
    `accordion--${props.variant}`,
    `accordion--${props.size}`,
    {
        'accordion--disabled': props.disabled,
        'accordion--multiple': props.multiple
    }
])
</script>

<template>
    <div :class="accordionClasses">
        <!-- Renderiza headers e contents usando Slot Collection Pattern -->
        <div v-for="item in registeredItems" :key="item.id" class="accordion-item">
            <component :is="item.renderHeader" />
            <component :is="item.renderContent" />
        </div>

        <!-- Slot invisível para permitir que children se registrem -->
        <div style="display: none;">
            <slot />
        </div>
    </div>
</template>

<style lang="scss">
.accordion {
    width: 100%;
    display: flex;
    flex-direction: column;

    // Variantes
    &--default {
        gap: 0;

        .accordion-item {
            border-bottom: 1px solid var(--color-border-primary);

            &:last-child {
                border-bottom: none;
            }
        }
    }

    &--bordered {
        border: 1px solid var(--color-border-primary);
        border-radius: var(--radius-md);
        overflow: hidden;

        .accordion-item {
            border-bottom: 1px solid var(--color-border-primary);

            &:last-child {
                border-bottom: none;
            }
        }
    }

    &--separated {
        gap: var(--spacing-sm);

        .accordion-item {
            border: 1px solid var(--color-border-primary);
            border-radius: var(--radius-md);
            overflow: hidden;
        }
    }

    &--filled {
        gap: var(--spacing-sm);

        .accordion-item {
            background: var(--color-bg-secondary);
            border-radius: var(--radius-md);
            overflow: hidden;
        }
    }

    // Sizes
    &--sm {
        font-size: var(--font-size-sm);
    }

    &--md {
        font-size: var(--font-size-md);
    }

    &--lg {
        font-size: var(--font-size-lg);
    }

    // Estados
    &--disabled {
        opacity: 0.6;
        pointer-events: none;
    }
}

.accordion-item {
    transition: all var(--transition-base);
}
</style>
