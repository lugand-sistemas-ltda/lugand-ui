<script setup lang="ts">
/**
 * Card - Container genérico com estilos base
 * Fundamental para construir cards mais complexos
 */
interface Props {
    variant?: 'default' | 'outline' | 'ghost' | 'flat'
    padding?: 'none' | 'sm' | 'md' | 'lg'
    hoverable?: boolean
    clickable?: boolean
    active?: boolean
}

withDefaults(defineProps<Props>(), {
    variant: 'default',
    padding: 'md',
    hoverable: false,
    clickable: false,
    active: false
})

const emit = defineEmits<{
    click: [e: MouseEvent]
}>()

const handleClick = (e: MouseEvent) => {
    emit('click', e)
}
</script>

<template>
    <div class="card" :class="[
        `card--${variant}`,
        `card--padding-${padding}`,
        {
            'card--hoverable': hoverable || clickable,
            'card--clickable': clickable,
            'card--active': active
        }
    ]" @click="handleClick">
        <slot />
    </div>
</template>

<style lang="scss" scoped>
.card {
    background-color: var(--color-surface);
    border-radius: var(--radius-md);
    color: var(--color-text-primary);
    transition: all 0.2s ease;
    overflow: hidden;
    position: relative;

    // Variantes
    &--default {
        background-color: var(--color-bg-secondary);
        border: 1px solid var(--color-border-base);
        box-shadow: var(--shadow-sm);
    }

    &--outline {
        background-color: transparent;
        border: 1px solid var(--color-border-base);
        box-shadow: none;
    }

    &--ghost {
        background-color: transparent;
        border: 1px solid transparent;
        box-shadow: none;
    }

    &--flat {
        background-color: var(--color-bg-tertiary);
        border: 1px solid transparent;
        box-shadow: none;
    }

    // Paddings
    &--padding-none {
        padding: 0;
    }

    &--padding-sm {
        padding: var(--spacing-sm);
    }

    &--padding-md {
        padding: var(--spacing-md);
    }

    &--padding-lg {
        padding: var(--spacing-lg);
    }

    // Estados Interativos
    &--hoverable:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-md);
        border-color: var(--color-primary-light);
    }

    &--clickable {
        cursor: pointer;
        user-select: none;

        &:active {
            transform: translateY(0);
            box-shadow: var(--shadow-sm);
        }
    }

    &--active {
        border-color: var(--color-primary);
        box-shadow: 0 0 0 2px var(--color-primary-dim);
    }
}
</style>
