<script setup lang="ts">
/**
 * Avatar Component
 * Exibe imagem de perfil, iniciais ou ícone padrão.
 */
import { computed } from 'vue'

interface Props {
    src?: string
    alt?: string
    name?: string
    size?: 'sm' | 'md' | 'lg' | 'xl'
    variant?: 'circle' | 'square' | 'rounded'
    status?: 'online' | 'offline' | 'busy' | 'away'
}

const props = withDefaults(defineProps<Props>(), {
    variant: 'circle',
    size: 'md',
})

// Calcula iniciais se imagem falhar ou não existir
const initials = computed(() => {
    if (!props.name) return '?'
    const parts = props.name.trim().split(' ').filter(p => p.length > 0)

    const first = parts[0]
    if (!first) return '?'

    if (parts.length === 1) return first.substring(0, 2).toUpperCase()

    const last = parts[parts.length - 1]
    return (first.charAt(0) + (last ? last.charAt(0) : '')).toUpperCase()
})
</script>

<template>
    <div class="avatar" :class="[`avatar--${size}`, `avatar--${variant}`]">
        <!-- Imagem -->
        <img v-if="src" :src="src" :alt="alt || name" class="avatar__image" />

        <!-- Fallback: Iniciais -->
        <span v-else class="avatar__initials">{{ initials }}</span>

        <!-- Status Indicator -->
        <span v-if="status" class="avatar__status" :class="`avatar__status--${status}`"></span>
    </div>
</template>

<style lang="scss" scoped>
.avatar {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background-color: var(--color-bg-tertiary, #cbd5e1);
    color: var(--color-text-secondary, #475569);
    font-weight: 600;
    user-select: none;

    // Variants
    &--circle {
        border-radius: 50%;
    }

    &--square {
        border-radius: 0;
    }

    &--rounded {
        border-radius: var(--radius-md, 8px);
    }

    // Sizes
    &--sm {
        width: 32px;
        height: 32px;
        font-size: 0.75rem;
    }

    &--md {
        width: 40px;
        height: 40px;
        font-size: 0.875rem;
    }

    &--lg {
        width: 56px;
        height: 56px;
        font-size: 1.125rem;
    }

    &--xl {
        width: 72px;
        height: 72px;
        font-size: 1.5rem;
    }

    &__image {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    &__status {
        position: absolute;
        bottom: 0;
        right: 0;
        width: 25%; // Proporcional
        height: 25%;
        border-radius: 50%;
        border: 2px solid var(--color-bg-primary, white);

        &--online {
            background-color: var(--color-success, #10b981);
        }

        &--offline {
            background-color: var(--color-text-secondary, #94a3b8);
        }

        &--busy {
            background-color: var(--color-error, #ef4444);
        }

        &--away {
            background-color: var(--color-warning, #f59e0b);
        }
    }
}
</style>