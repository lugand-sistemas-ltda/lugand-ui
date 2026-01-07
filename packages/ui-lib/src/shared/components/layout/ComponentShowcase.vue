<script setup lang="ts">
/**
 * ComponentShowcase - Container genérico para apresentar componentes
 * Usado nas views de UI para demonstrar funcionalidades
 */
interface Props {
    title: string
    description?: string
}

defineProps<Props>()
</script>

<template>
    <div class="component-showcase">
        <div class="component-showcase__header">
            <h3 class="component-showcase__title">{{ title }}</h3>
            <p v-if="description" class="component-showcase__description">{{ description }}</p>
        </div>

        <div class="component-showcase__preview">
            <slot name="preview" />
        </div>

        <div v-if="$slots.code" class="component-showcase__code">
            <slot name="code" />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.component-showcase {
    background: var(--color-bg-secondary);
    border: 1px solid var(--color-border-base);
    border-radius: var(--radius-lg);
    overflow: hidden;
    margin-bottom: var(--spacing-xl);

    &__header {
        padding: var(--spacing-lg);
        border-bottom: 1px solid var(--color-border-base);
    }

    &__title {
        font-size: var(--font-size-lg);
        font-weight: var(--font-weight-semibold);
        color: var(--color-text-primary);
        margin: 0 0 var(--spacing-xs) 0;
    }

    &__description {
        font-size: var(--font-size-sm);
        color: var(--color-text-secondary);
        margin: 0;
    }

    &__preview {
        padding: var(--spacing-xl);
        background: var(--color-bg-primary);

        // Permite flex/grid layout no preview
        display: flex;
        flex-wrap: wrap;
        gap: var(--spacing-md);
        align-items: center;
    }

    &__code {
        border-top: 1px solid var(--color-border-base);
    }

    // Responsivo
    @media (max-width: 767px) {
        &__header {
            padding: var(--spacing-md);
        }

        &__preview {
            padding: var(--spacing-lg);
        }

        &__title {
            font-size: var(--font-size-base);
        }
    }
}
</style>
