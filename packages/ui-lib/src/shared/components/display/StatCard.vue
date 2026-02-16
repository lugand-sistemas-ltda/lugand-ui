<template>
    <Card :padding="size === 'sm' ? 'md' : 'lg'" :variant="cardVariant" class="stat-card"
        :class="[`stat-card--${variant}`, `stat-card--${size}`]">
        <!-- Icon -->
        <div v-if="icon || $slots.icon" class="stat-card__icon">
            <slot name="icon">
                <span class="stat-card__icon-default">{{ icon }}</span>
            </slot>
        </div>

        <!-- Content -->
        <div class="stat-card__content">
            <!-- Label -->
            <div class="stat-card__label">
                <slot name="label">{{ label }}</slot>
            </div>

            <!-- Value -->
            <div class="stat-card__value">
                <slot name="value">{{ formattedValue }}</slot>
            </div>

            <!-- Description -->
            <div v-if="description || $slots.description" class="stat-card__description">
                <slot name="description">{{ description }}</slot>
            </div>

            <!-- Trend -->
            <div v-if="trend && trendValue !== undefined" class="stat-card__trend"
                :class="`stat-card__trend--${trend}`">
                <span class="stat-card__trend-icon">
                    {{ trendIcon }}
                </span>
                <span class="stat-card__trend-value">{{ trendValue }}</span>
                <span v-if="trendLabel" class="stat-card__trend-label">{{ trendLabel }}</span>
            </div>
        </div>

        <!-- Actions slot -->
        <div v-if="$slots.actions" class="stat-card__actions">
            <slot name="actions"></slot>
        </div>
    </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Card from './Card.vue'

interface Props {
    /** Valor principal do statístico */
    value: string | number
    /** Rótulo descritivo */
    label: string
    /** Ícone (emoji ou componente) */
    icon?: string
    /** Descrição adicional opcional */
    description?: string
    /** Variante visual (afeta cor do ícone e card) */
    variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info'
    /** Tendência do valor */
    trend?: 'up' | 'down' | 'neutral'
    /** Valor da tendência (ex: "+12%", "-5%", "15") */
    trendValue?: string | number
    /** Label da tendência (ex: "vs. mês anterior") */
    trendLabel?: string
    /** Tamanho do card */
    size?: 'sm' | 'md' | 'lg'
    /** Força variante do Card */
    cardVariant?: 'default' | 'outline' | 'ghost' | 'flat'
}

const props = withDefaults(defineProps<Props>(), {
    variant: 'default',
    size: 'md',
    cardVariant: 'default',
})

/** Formata o valor com separadores de milhar se for número */
const formattedValue = computed(() => {
    if (typeof props.value === 'number') {
        return props.value.toLocaleString('pt-BR')
    }
    return props.value
})

/** Ícone da tendência baseado na direção */
const trendIcon = computed(() => {
    switch (props.trend) {
        case 'up':
            return '↑'
        case 'down':
            return '↓'
        case 'neutral':
            return '→'
        default:
            return ''
    }
})
</script>

<style scoped lang="scss">
.stat-card {
    display: flex;
    gap: var(--spacing-md);
    align-items: flex-start;

    &__icon {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 48px;
        height: 48px;
        border-radius: var(--radius-md);
        background: var(--color-bg-tertiary);
        color: var(--color-text-primary);
        font-size: 1.5rem;
        transition: all var(--transition-normal);
    }

    &__icon-default {
        display: block;
    }

    &__content {
        flex: 1;
        min-width: 0;
    }

    &__label {
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--color-text-secondary);
        margin-bottom: var(--spacing-xs);
    }

    &__value {
        font-size: 2rem;
        font-weight: 700;
        color: var(--color-text-primary);
        line-height: 1.2;
        margin-bottom: var(--spacing-xs);
    }

    &__description {
        font-size: 0.8125rem;
        color: var(--color-text-tertiary);
        margin-bottom: var(--spacing-xs);
    }

    &__trend {
        display: inline-flex;
        align-items: center;
        gap: var(--spacing-xs);
        font-size: 0.8125rem;
        font-weight: 600;
        padding: var(--spacing-xs) var(--spacing-sm);
        border-radius: var(--radius-sm);
        background: var(--color-bg-tertiary);

        &-icon {
            font-size: 1rem;
        }

        &-value {
            font-weight: 700;
        }

        &-label {
            color: var(--color-text-secondary);
            font-weight: 400;
        }

        &--up {
            color: var(--color-success);
            background: var(--color-success-bg);
        }

        &--down {
            color: var(--color-error);
            background: var(--color-error-bg);
        }

        &--neutral {
            color: var(--color-text-secondary);
        }
    }

    &__actions {
        flex-shrink: 0;
        display: flex;
        gap: var(--spacing-xs);
        align-items: flex-start;
    }

    // VARIANTES (cor do ícone)
    &--primary &__icon {
        background: var(--color-primary-bg);
        color: var(--color-primary);
    }

    &--success &__icon {
        background: var(--color-success-bg);
        color: var(--color-success);
    }

    &--warning &__icon {
        background: var(--color-warning-bg);
        color: var(--color-warning);
    }

    &--error &__icon {
        background: var(--color-error-bg);
        color: var(--color-error);
    }

    &--info &__icon {
        background: var(--color-info-bg);
        color: var(--color-info);
    }

    // TAMANHOS
    &--sm {
        .stat-card__icon {
            width: 40px;
            height: 40px;
            font-size: 1.25rem;
        }

        .stat-card__value {
            font-size: 1.5rem;
        }

        .stat-card__label {
            font-size: 0.8125rem;
        }
    }

    &--lg {
        .stat-card__icon {
            width: 56px;
            height: 56px;
            font-size: 1.75rem;
        }

        .stat-card__value {
            font-size: 2.5rem;
        }

        .stat-card__label {
            font-size: 1rem;
        }
    }

    // RESPONSIVIDADE
    @media (max-width: 640px) {
        &__value {
            font-size: 1.75rem;
        }

        &--lg .stat-card__value {
            font-size: 2rem;
        }
    }
}
</style>
