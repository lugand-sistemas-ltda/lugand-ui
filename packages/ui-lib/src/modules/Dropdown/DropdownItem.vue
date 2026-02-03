<script setup lang="ts">
import { inject, computed } from 'vue'
import type { DropdownContext } from './types'

export interface DropdownItemProps {
    icon?: string
    label?: string
    disabled?: boolean
    divider?: boolean
    danger?: boolean
}

const props = withDefaults(defineProps<DropdownItemProps>(), {
    disabled: false,
    divider: false,
    danger: false
})

const emit = defineEmits<{
    click: [event: MouseEvent]
}>()

const dropdownContext = inject<DropdownContext>('dropdown-context')

const handleClick = (event: MouseEvent) => {
    if (props.disabled || props.divider) return

    emit('click', event)

    // Fecha o dropdown após o click (se configurado)
    dropdownContext?.close()
}

const itemClasses = computed(() => [
    'dropdown-item',
    {
        'dropdown-item--disabled': props.disabled,
        'dropdown-item--divider': props.divider,
        'dropdown-item--danger': props.danger
    }
])
</script>

<template>
    <div v-if="divider" class="dropdown-divider" />
    <button v-else :class="itemClasses" :disabled="disabled" @click="handleClick">
        <span v-if="icon" class="dropdown-item-icon">{{ icon }}</span>
        <span v-if="label" class="dropdown-item-label">{{ label }}</span>
        <slot />
    </button>
</template>

<style lang="scss">
.dropdown-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    width: 100%;

    padding: var(--spacing-sm) var(--spacing-md);
    border: none;
    border-radius: var(--radius-sm);

    background: transparent;
    color: var(--color-text-primary);

    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    text-align: left;

    cursor: pointer;
    transition: all var(--transition-fast);

    &:hover:not(&--disabled) {
        background: var(--color-bg-secondary);
    }

    &:active:not(&--disabled) {
        transform: scale(0.98);
    }

    &:focus-visible {
        outline: 2px solid var(--color-primary);
        outline-offset: -2px;
    }

    &--disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    &--danger {
        color: var(--color-danger);

        &:hover:not(.dropdown-item--disabled) {
            background: var(--color-danger-light);
        }
    }
}

.dropdown-item-icon {
    font-size: 1.2em;
    flex-shrink: 0;
}

.dropdown-item-label {
    flex: 1;
}

.dropdown-divider {
    height: 1px;
    margin: var(--spacing-xs) 0;
    background: var(--color-border-primary);
}
</style>
