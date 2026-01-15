<script setup lang="ts">
/**
 * DateSegmentedInput
 * 
 * Inputs separados para Dia, Mês, Ano (e Hora/Min se necessário)
 * Resolve ambiguidade de parsing e permite UX mais clara para entrada manual
 * 
 * Validação integrada: campos ficam vermelhos quando combinação é inválida
 * Usa NumericTextInput para garantir que apenas números sejam aceitos
 */
import { ref, watch, computed } from 'vue'
import { isValidDate } from '@/core/utils/formatters'
import NumericTextInput from '../primitives/NumericTextInput.vue'

interface Props {
    modelValue: Date | null
    label?: string
    enableTime?: boolean
    disabled?: boolean
    error?: boolean
    errorMessage?: string
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: null,
    enableTime: false,
    error: false
})

const emit = defineEmits<{
    'update:modelValue': [value: Date | null]
}>()

// Campos individuais de entrada
const day = ref('')
const month = ref('')
const year = ref('')
const hour = ref('')
const minute = ref('')

// Estado de validação interna
const hasInternalError = ref(false)
const internalErrorMessage = ref('')

// Computed: erro combinado (interno + externo)
const computedError = computed(() => props.error || hasInternalError.value)
const computedErrorMessage = computed(() => props.errorMessage || internalErrorMessage.value)

// Sincroniza modelo externo -> campos
watch(() => props.modelValue, (val) => {
    if (val && !Number.isNaN(val.getTime())) {
        day.value = String(val.getDate()).padStart(2, '0')
        month.value = String(val.getMonth() + 1).padStart(2, '0')
        year.value = String(val.getFullYear())
        if (props.enableTime) {
            hour.value = String(val.getHours()).padStart(2, '0')
            minute.value = String(val.getMinutes()).padStart(2, '0')
        }
        hasInternalError.value = false
        internalErrorMessage.value = ''
    } else {
        day.value = ''
        month.value = ''
        year.value = ''
        hour.value = ''
        minute.value = ''
    }
}, { immediate: true })

// Verifica se campos estão completos
const areFieldsComplete = computed(() => {
    const hasDate = day.value.length > 0 && month.value.length > 0 && year.value.length >= 4
    if (props.enableTime) {
        return hasDate && hour.value.length > 0 && minute.value.length > 0
    }
    return hasDate
})

// Atualiza date quando campos mudam
const updateDate = () => {
    // Limpa erro se campos vazios
    if (!day.value && !month.value && !year.value) {
        hasInternalError.value = false
        internalErrorMessage.value = ''
        emit('update:modelValue', null)
        return
    }

    // Não valida enquanto está incompleto
    if (!areFieldsComplete.value) {
        hasInternalError.value = false
        internalErrorMessage.value = ''
        return
    }

    const d = Number.parseInt(day.value)
    const m = Number.parseInt(month.value)
    const y = Number.parseInt(year.value)
    const h = props.enableTime ? Number.parseInt(hour.value || '0') : 0
    const min = props.enableTime ? Number.parseInt(minute.value || '0') : 0

    // Validação semântica usando função centralizada
    if (!isValidDate(d, m, y, h, min)) {
        // Data inválida: marca erro
        hasInternalError.value = true
        internalErrorMessage.value = props.enableTime
            ? 'Data/hora inválida. Verifique os valores informados'
            : 'Data inválida. Verifique dia, mês e ano'
        emit('update:modelValue', null)
        return
    }

    // Data válida: limpa erro e emite
    hasInternalError.value = false
    internalErrorMessage.value = ''
    const newDate = new Date(y, m - 1, d, h, min, 0, 0)
    emit('update:modelValue', newDate)
}

// Handlers com validação de range
const handleDay = (v: string) => {
    const sanitized = v.slice(0, 2)
    const num = Number.parseInt(sanitized)

    // Permite 0-3 como primeiro dígito, mas limita range completo a 01-31
    if (sanitized.length === 2 && (num < 1 || num > 31)) {
        day.value = sanitized.slice(0, 1) // Mantém apenas primeiro dígito
        return
    }

    day.value = sanitized
    updateDate()
}

const handleMonth = (v: string) => {
    const sanitized = v.slice(0, 2)
    const num = Number.parseInt(sanitized)

    // Permite 0-1 como primeiro dígito, mas limita range completo a 01-12
    if (sanitized.length === 2 && (num < 1 || num > 12)) {
        month.value = sanitized.slice(0, 1) // Mantém apenas primeiro dígito
        return
    }

    month.value = sanitized
    updateDate()
}

const handleYear = (v: string) => {
    year.value = v.slice(0, 4)
    updateDate()
}

const handleHour = (v: string) => {
    const sanitized = v.slice(0, 2)
    const num = Number.parseInt(sanitized)

    // Permite 0-2 como primeiro dígito, mas limita range completo a 00-23
    if (sanitized.length === 2 && num > 23) {
        hour.value = sanitized.slice(0, 1) // Mantém apenas primeiro dígito
        return
    }

    hour.value = sanitized
    updateDate()
}

const handleMinute = (v: string) => {
    const sanitized = v.slice(0, 2)
    const num = Number.parseInt(sanitized)

    // Permite 0-5 como primeiro dígito, mas limita range completo a 00-59
    if (sanitized.length === 2 && num > 59) {
        minute.value = sanitized.slice(0, 1) // Mantém apenas primeiro dígito
        return
    }

    minute.value = sanitized
    updateDate()
}
</script>

<template>
    <div class="date-segmented">
        <label v-if="label" class="date-segmented__label">{{ label }}</label>

        <div class="date-segmented__wrapper" :class="{ 'date-segmented__wrapper--error': computedError }">
            <!-- Day -->
            <NumericTextInput :model-value="day" placeholder="DD" :disabled="disabled" :maxlength="2"
                @update:model-value="handleDay" />
            <span class="separator">/</span>

            <!-- Month -->
            <NumericTextInput :model-value="month" placeholder="MM" :disabled="disabled" :maxlength="2"
                @update:model-value="handleMonth" />
            <span class="separator">/</span>

            <!-- Year -->
            <NumericTextInput :model-value="year" placeholder="YYYY" :disabled="disabled" :maxlength="4"
                @update:model-value="handleYear" />

            <!-- Time (opcional) -->
            <template v-if="enableTime">
                <span class="separator separator--space">às</span>

                <NumericTextInput :model-value="hour" placeholder="HH" :disabled="disabled" :maxlength="2"
                    @update:model-value="handleHour" />
                <span class="separator">:</span>
                <NumericTextInput :model-value="minute" placeholder="mm" :disabled="disabled" :maxlength="2"
                    @update:model-value="handleMinute" />
            </template>
        </div>

        <!-- Mensagem de erro -->
        <span v-if="computedError && computedErrorMessage" class="date-segmented__error">
            {{ computedErrorMessage }}
        </span>
    </div>
</template>

<style lang="scss" scoped>
.date-segmented {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);

    &__label {
        font-size: var(--font-size-sm);
        font-weight: var(--font-weight-medium);
        color: var(--color-text-primary);
    }

    &__wrapper {
        display: flex;
        align-items: center;
        gap: var(--spacing-xs);
        padding: var(--spacing-xs);
        border: 1px solid var(--color-border-base);
        border-radius: var(--radius-md);
        background: var(--input-bg);
        width: fit-content;
        transition: all 0.2s ease;

        &:focus-within {
            border-color: var(--color-primary);
            box-shadow: 0 0 0 2px var(--color-primary-light);
        }

        &--error {
            border-color: var(--color-error);

            &:focus-within {
                border-color: var(--color-error);
                box-shadow: 0 0 0 2px var(--color-error-light);
            }
        }

        // Override NumericTextInput styles for inline display
        :deep(.numeric-input-wrapper) {
            width: auto;
            min-width: 0;
        }

        :deep(.numeric-input) {
            width: 32px; // Day, Month, Hour, Minute
            border: none;
            background: transparent;
            text-align: center;
            padding: 0;
            margin: 0;
            box-shadow: none !important;

            &:focus {
                outline: none;
                background: var(--color-bg-tertiary);
                border-radius: var(--radius-sm);
            }

            &:disabled {
                opacity: 0.6;
                cursor: not-allowed;
            }
        }

        // Year field is wider
        :deep(.numeric-input-wrapper:nth-child(5) .numeric-input) {
            width: 48px;
        }
    }

    &__error {
        font-size: var(--font-size-sm);
        color: var(--color-error);
        margin-top: var(--spacing-2xs);
    }
}

.separator {
    color: var(--color-text-tertiary);
    font-weight: bold;

    &--space {
        margin: 0 var(--spacing-xs);
        font-size: 0.8em;
        text-transform: uppercase;
    }
}
</style>
