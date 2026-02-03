<script setup lang="ts">
import { computed, inject, onMounted, onUnmounted, h, useSlots } from 'vue'
import type { Slots } from 'vue'
import type { AccordionContext } from './types'
import { ACCORDION_INJECTION_KEY } from './types'

export interface AccordionItemProps {
    id: string | number
    title: string
    icon?: string
    disabled?: boolean
}

const props = withDefaults(defineProps<AccordionItemProps>(), {
    disabled: false
})

const accordionContext = inject<AccordionContext>(ACCORDION_INJECTION_KEY)
if (!accordionContext) {
    throw new Error('AccordionItem must be used within an Accordion component')
}

const slots: Slots = useSlots()

// Estados computados
const isOpen = computed(() => accordionContext.isOpen(props.id))
const isDisabled = computed(() => props.disabled || accordionContext.disabled.value)

// Classes computadas
const headerClasses = computed(() => [
    'accordion-header',
    {
        'accordion-header--open': isOpen.value,
        'accordion-header--disabled': isDisabled.value
    }
])

const contentClasses = computed(() => [
    'accordion-content',
    {
        'accordion-content--open': isOpen.value
    }
])

const iconClasses = computed(() => [
    'accordion-icon',
    {
        'accordion-icon--open': isOpen.value
    }
])

// Handler
const handleClick = () => {
    if (!isDisabled.value) {
        accordionContext.toggle(props.id)
    }
}

// Registro usando Slot Collection Pattern
onMounted(() => {
    accordionContext.registerAccordionItem({
        id: props.id,
        title: props.title,
        icon: props.icon,
        disabled: props.disabled || false,
        order: Date.now(), // Usa timestamp para garantir ordem

        // Render function para o header
        renderHeader: () => h('button', {
            class: headerClasses.value,
            onClick: handleClick,
            'aria-expanded': isOpen.value,
            'aria-controls': `accordion-content-${props.id}`,
            disabled: isDisabled.value,
            type: 'button'
        }, [
            // Icon (se fornecido)
            props.icon ? h('span', { class: 'accordion-header-icon' }, props.icon) : null,

            // Title
            h('span', { class: 'accordion-header-title' }, props.title),

            // Chevron icon
            h('span', { class: iconClasses.value }, '▼')
        ].filter(Boolean)),

        // Render function para o content
        renderContent: () => h('div', {
            id: `accordion-content-${props.id}`,
            class: contentClasses.value,
            role: 'region',
            'aria-labelledby': `accordion-header-${props.id}`
        }, [
            h('div', { class: 'accordion-content-inner' }, slots.default?.())
        ])
    })
})

onUnmounted(() => {
    accordionContext.unregisterAccordionItem(props.id)
})
</script>

<template>
    <!-- Componente sem renderização direta - tudo via render functions -->
</template>

<style lang="scss">
.accordion-header {
    width: 100%;
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-md);

    background: transparent;
    border: none;

    color: var(--color-text-primary);
    font-size: inherit;
    font-weight: var(--font-weight-medium);
    text-align: left;

    cursor: pointer;
    transition: all var(--transition-fast);

    &:hover:not(&--disabled) {
        background: var(--color-bg-secondary);
    }

    &:focus-visible {
        outline: 2px solid var(--color-primary);
        outline-offset: -2px;
    }

    &--open {
        color: var(--color-primary);
        font-weight: var(--font-weight-semibold);
    }

    &--disabled {
        cursor: not-allowed;
        opacity: 0.5;
    }
}

.accordion-header-icon {
    font-size: 1.25em;
    flex-shrink: 0;
}

.accordion-header-title {
    flex: 1;
}

.accordion-icon {
    font-size: 0.75em;
    flex-shrink: 0;
    transition: transform var(--transition-base);

    &--open {
        transform: rotate(180deg);
    }
}

.accordion-content {
    overflow: hidden;
    max-height: 0;
    opacity: 0;
    transition: all var(--transition-base);

    &--open {
        max-height: 2000px; // Valor alto para animação
        opacity: 1;
    }
}

.accordion-content-inner {
    padding: var(--spacing-md);
    padding-top: 0;
    color: var(--color-text-secondary);
    line-height: var(--line-height-relaxed);
}
</style>
