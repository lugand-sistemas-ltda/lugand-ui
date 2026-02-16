<script setup lang="ts">
import { computed, ref } from 'vue'

/**
 * Rating - Sistema de avaliação com estrelas/ícones
 * 
 * Componente de rating interativo ou read-only com suporte a half-stars,
 * ícones customizados e contador de avaliações.
 * 
 * @example
 * ```vue
 * <!-- Básico (read-only) -->
 * <Rating :model-value="4.5" />
 * 
 * <!-- Interativo -->
 * <Rating v-model="rating" />
 * 
 * <!-- Com contador -->
 * <Rating :model-value="4.2" :count="156" show-count />
 * 
 * <!-- Custom icons -->
 * <Rating v-model="rating" icon="❤️" />
 * <Rating v-model="rating" icon="👍" />
 * 
 * <!-- Sizes -->
 * <Rating :model-value="5" size="sm" />
 * <Rating :model-value="5" size="lg" />
 * 
 * <!-- Half stars -->
 * <Rating v-model="rating" allow-half />
 * ```
 */

interface Props {
    /** Valor do rating (0-max) */
    modelValue?: number
    /** Número máximo de estrelas */
    max?: number
    /** Tamanho */
    size?: 'sm' | 'md' | 'lg' | 'xl'
    /** Ícone a usar */
    icon?: string
    /** Cor do ícone ativo */
    color?: string
    /** Permite meio valores (0.5, 1.5, etc) */
    allowHalf?: boolean
    /** Read-only (não interativo) */
    readonly?: boolean
    /** Desabilitado */
    disabled?: boolean
    /** Número de avaliações */
    count?: number
    /** Exibir contador */
    showCount?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: 0,
    max: 5,
    size: 'md',
    icon: '⭐',
    color: '#fbbf24',
    allowHalf: false,
    readonly: false,
    disabled: false,
    showCount: false
})

const emit = defineEmits<{
    'update:modelValue': [value: number]
    'change': [value: number]
}>()

const hoveredValue = ref<number | null>(null)

// Valor efetivo para exibição
const displayValue = computed(() => {
    if (hoveredValue.value !== null && !props.readonly && !props.disabled) {
        return hoveredValue.value
    }
    return props.modelValue
})

// Classes do container
const containerClasses = computed(() => [
    'rating',
    `rating--${props.size}`,
    {
        'rating--readonly': props.readonly,
        'rating--disabled': props.disabled,
        'rating--interactive': !props.readonly && !props.disabled
    }
])

// Verificar se uma estrela está cheia, meio cheia ou vazia
function getStarState(index: number): 'full' | 'half' | 'empty' {
    const value = displayValue.value
    if (value >= index) return 'full'
    if (props.allowHalf && value >= index - 0.5) return 'half'
    return 'empty'
}

// Handlers
function handleClick(index: number) {
    if (props.readonly || props.disabled) return
    emit('update:modelValue', index)
    emit('change', index)
}

function handleMouseMove(index: number, event: MouseEvent) {
    if (props.readonly || props.disabled) return

    if (props.allowHalf) {
        const target = event.currentTarget as HTMLElement
        const rect = target.getBoundingClientRect()
        const percent = (event.clientX - rect.left) / rect.width
        hoveredValue.value = percent < 0.5 ? index - 0.5 : index
    } else {
        hoveredValue.value = index
    }
}

function handleMouseLeave() {
    hoveredValue.value = null
}

// Formatar contador
function formatCount(count: number): string {
    if (count >= 1000) {
        return `${(count / 1000).toFixed(1)}k`
    }
    return count.toString()
}
</script>

<template>
    <div class="rating-wrapper">
        <div :class="containerClasses" @mouseleave="handleMouseLeave">
            <button v-for="i in max" :key="i" type="button" class="rating__star"
                :class="[`rating__star--${getStarState(i)}`]" :disabled="readonly || disabled" @click="handleClick(i)"
                @mousemove="handleMouseMove(i, $event)">
                <span class="rating__icon" :style="{ color: getStarState(i) !== 'empty' ? color : undefined }">
                    {{ icon }}
                </span>
                <!-- Half overlay -->
                <span v-if="getStarState(i) === 'half'" class="rating__icon rating__icon--half"
                    :style="{ color: color }">
                    {{ icon }}
                </span>
            </button>
        </div>

        <!-- Contador de avaliações -->
        <span v-if="showCount && count !== undefined" class="rating__count">
            ({{ formatCount(count) }})
        </span>
    </div>
</template>

<style lang="scss" scoped>
.rating-wrapper {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-xs);
}

.rating {
    display: inline-flex;
    gap: 2px;
    align-items: center;

    // Sizes
    &--sm {
        font-size: 1rem;
        gap: 1px;
    }

    &--md {
        font-size: 1.25rem;
        gap: 2px;
    }

    &--lg {
        font-size: 1.75rem;
        gap: 3px;
    }

    &--xl {
        font-size: 2.5rem;
        gap: 4px;
    }

    // States
    &--interactive {
        .rating__star {
            cursor: pointer;
            transition: transform 0.1s ease;

            &:hover {
                transform: scale(1.15);
            }

            &:active {
                transform: scale(1.05);
            }
        }
    }

    &--readonly {
        .rating__star {
            cursor: default;
        }
    }

    &--disabled {
        opacity: 0.5;

        .rating__star {
            cursor: not-allowed;
        }
    }
}

.rating__star {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    border: none;
    background: none;
    font-size: inherit;
    line-height: 1;

    &:focus-visible {
        outline: 2px solid var(--color-primary);
        outline-offset: 2px;
        border-radius: 2px;
    }

    // Estados
    &--empty {
        .rating__icon {
            color: var(--color-border);
            opacity: 0.5;
        }
    }
}

.rating__icon {
    display: block;
    user-select: none;
    pointer-events: none;
    transition: color 0.2s ease;

    // Half star overlay
    &--half {
        position: absolute;
        top: 0;
        left: 0;
        width: 50%;
        overflow: hidden;
    }
}

.rating__count {
    font-size: 0.875rem;
    color: var(--color-text-secondary);
    font-weight: 500;
    white-space: nowrap;
}
</style>
