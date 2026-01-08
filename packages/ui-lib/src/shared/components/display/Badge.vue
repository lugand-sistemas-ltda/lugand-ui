<script setup lang="ts">
/**
 * Badge Component
 * Usado para status, labels, contadores e categorias.
 */
interface Props {
    // Conteúdo textual (se não usar slot)
    label?: string | number

    // Variações de estilo
    variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'neutral'

    // Tipo de aparência
    type?: 'filled' | 'outline' | 'ghost' | 'soft'

    // Formato
    rounded?: 'sm' | 'md' | 'lg' | 'pill' | 'circle'

    // Tamanho
    size?: 'sm' | 'md' | 'lg'

    // Modo Dot (apenas uma bolinha, sem texto)
    dot?: boolean
}

withDefaults(defineProps<Props>(), {
    variant: 'primary',
    type: 'filled',
    rounded: 'pill',
    size: 'md',
    dot: false
})
</script>

<template>
    <span class="badge" :class="[
        `badge--${variant}`,
        `badge--${type}`,
        `badge--rounded-${rounded}`,
        `badge--size-${size}`,
        { 'badge--dot': dot }
    ]">
        <slot>{{ label }}</slot>
    </span>
</template>

<style lang="scss" scoped>
.badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-weight: var(--font-weight-semibold);
    white-space: nowrap;
    vertical-align: middle;
    line-height: 1;
    transition: all var(--transition-base); // var(--transition-base) is correct? Check variables.scss

    // --- SIZES ---
    &--size-sm {
        font-size: 0.625rem;
        padding: 0.125rem 0.375rem;
        height: 16px;
    }

    &--size-md {
        font-size: 0.75rem;
        padding: 0.25rem 0.5rem;
        height: 22px;
    }

    &--size-lg {
        font-size: 0.875rem;
        padding: 0.35rem 0.75rem;
        height: 28px;
    }

    // --- ROUNDED ---
    &--rounded-sm {
        border-radius: var(--radius-sm);
    }

    &--rounded-md {
        border-radius: var(--radius-md);
    }

    &--rounded-lg {
        border-radius: var(--radius-lg);
    }

    &--rounded-pill {
        border-radius: var(--radius-full);
    }

    &--rounded-circle {
        border-radius: 50%;
        padding: 0;
        width: 24px;
        height: 24px;
    }

    // Fixed size for circle?

    // --- VARIANTS & TYPES ---

    // Helper mixin for variants
    @mixin badge-variant($bg, $text, $border: $bg) {
        &.badge--filled {
            background-color: $bg;
            color: white; // Most filled badges need white text. If light color, needs dark text.
            border: 1px solid $bg;
        }

        &.badge--outline {
            background-color: transparent;
            color: $text;
            border: 1px solid $border;
        }

        &.badge--ghost {
            background-color: transparent;
            color: $text;
            border: 1px solid transparent;
        }

        &.badge--soft {
            background-color: rgba($bg, 0.15); // Opacidade
            color: $text; // ou $bg darken
            border: 1px solid transparent;
        }
    }

    // Warning/Info/Success/Error colors usually in variables CSS too, assuming we have them or derived variables.
    // Assuming --color-primary, --color-success etc exists. 
    // If not, I should use literal colors or check theme config. 
    // I will assume standard semantic colors exist or I will define safe fallbacks.

    &--primary {
        @include badge-variant(var(--color-primary, #3b82f6), var(--color-primary, #3b82f6));

        &.badge--filled {
            color: white;
        }
    }

    &--secondary {
        @include badge-variant(var(--color-secondary, #64748b), var(--color-secondary, #64748b));
    }

    &--success {
        @include badge-variant(var(--color-success, #10b981), var(--color-success, #10b981));
    }

    &--warning {
        @include badge-variant(var(--color-warning, #f59e0b), var(--color-warning, #f59e0b));

        &.badge--filled {
            color: #fff;
        }

        // Warning might need black text? keeping white for consistency with requested 'badge--warning'
    }

    &--error {
        @include badge-variant(var(--color-error, #ef4444), var(--color-error, #ef4444));
    }

    &--info {
        @include badge-variant(var(--color-info, #0ea5e9), var(--color-info, #0ea5e9));
    }

    &--neutral {
        @include badge-variant(var(--color-text-secondary, #9ca3af), var(--color-text-secondary, #9ca3af));
    }

    // --- DOT MODE ---
    &--dot {
        width: 8px;
        height: 8px;
        padding: 0;
        border-radius: 50%;

        &.badge--size-sm {
            width: 6px;
            height: 6px;
        }

        &.badge--size-lg {
            width: 10px;
            height: 10px;
        }

        // Empty content by default
        &:empty {
            display: inline-block;
        }
    }
}
</style>