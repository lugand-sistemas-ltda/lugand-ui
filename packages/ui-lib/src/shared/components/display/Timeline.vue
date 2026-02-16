<template>
    <div class="timeline" :class="[`timeline--${orientation}`, `timeline--${variant}`]">
        <slot></slot>
    </div>
</template>

<script setup lang="ts">
interface Props {
    /** Orientação do timeline */
    orientation?: 'vertical' | 'horizontal'
    /** Variante visual */
    variant?: 'default' | 'compact'
}

withDefaults(defineProps<Props>(), {
    orientation: 'vertical',
    variant: 'default',
})
</script>

<style scoped lang="scss">
.timeline {
    display: flex;
    position: relative;

    // ORIENTAÇÃO VERTICAL (padrão)
    &--vertical {
        flex-direction: column;
        gap: 0;
    }

    // ORIENTAÇÃO HORIZONTAL
    &--horizontal {
        flex-direction: row;
        gap: var(--spacing-xl);
        overflow-x: auto;
        padding: var(--spacing-md) 0;

        // Hide scrollbar but keep functionality
        scrollbar-width: thin;
        scrollbar-color: var(--color-border) transparent;

        &::-webkit-scrollbar {
            height: 6px;
        }

        &::-webkit-scrollbar-track {
            background: transparent;
        }

        &::-webkit-scrollbar-thumb {
            background: var(--color-border);
            border-radius: var(--radius-full);
        }
    }

    // VARIANTE COMPACT (espaçamento reduzido)
    &--compact {
        &.timeline--vertical {
            gap: 0;

            :deep(.timeline-item__content) {
                padding-bottom: var(--spacing-md);
            }
        }

        &.timeline--horizontal {
            gap: var(--spacing-md);
        }

        :deep(.timeline-item__dot) {
            width: 24px;
            height: 24px;
        }

        :deep(.timeline-item__icon) {
            font-size: 0.875rem;
        }
    }
}
</style>
