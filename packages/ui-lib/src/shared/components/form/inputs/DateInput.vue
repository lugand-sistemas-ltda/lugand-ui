<script setup lang="ts">
/**
 * DateInput - Campo de Data/Hora especializado
 * 
 * Wrapper inteligente que usa MaskInput para forçar formato brasileiro (DD/MM/YYYY)
 * e internamente gerencia Date objects através do composable useDateInput
 * 
 * Características:
 * - Display: Sempre DD/MM/YYYY (formato BR)
 * - Model: Date object ou ISO string (configurável)
 * - Validação: Rejeita datas impossíveis (99/99/9999, 31/02/2024, etc)
 */
import { watch, computed } from 'vue'
import MaskInput from './MaskInput.vue'
import { useDateInput } from '@/shared/composables'
import type { DateInputType, DateOutputFormat } from '@/shared/composables'

interface Props {
    modelValue: Date | string | null
    type?: DateInputType
    label?: string
    error?: boolean
    errorMessage?: string
    disabled?: boolean
    outputFormat?: DateOutputFormat
}

const props = withDefaults(defineProps<Props>(), {
    type: 'date',
    modelValue: null,
    outputFormat: 'date'
})

const emit = defineEmits<{
    'update:modelValue': [value: Date | string | null]
}>()

// Composable centralizado para gerenciar lógica de data
const {
    displayValue,
    setFromBRFormat,
    setFromISO,
    setFromDate,
    outputValue,
    hasError,
    errorMessage: internalErrorMessage
} = useDateInput({
    type: props.type,
    outputFormat: props.outputFormat,
    initialValue: props.modelValue
})

// Computed: Usa erro interno se não houver erro externo via props
const computedError = computed(() => props.error || hasError.value)
const computedErrorMessage = computed(() => props.errorMessage || internalErrorMessage.value)

// Sincroniza mudanças externas do modelo (v-model do pai)
watch(() => props.modelValue, (newVal) => {
    if (!newVal) {
        setFromDate(null)
        return
    }

    if (newVal instanceof Date) {
        setFromDate(newVal)
    } else if (typeof newVal === 'string') {
        // Detecta se é ISO ou BR e parseia adequadamente
        if (newVal.includes('-')) {
            setFromISO(newVal)
        } else if (newVal.includes('/')) {
            setFromBRFormat(newVal)
        }
    }
})

// Emite mudanças do valor interno para o pai
watch(outputValue, (newVal) => {
    emit('update:modelValue', newVal)
})

// Handler unificado: recebe string do MaskInput e atualiza via composable
const handleInput = (val: string) => {
    if (!val) {
        setFromDate(null)
        return
    }

    // Strict Length Check: evita emissões parciais durante digitação
    let expectedLength: number
    if (props.type === 'datetime-local') {
        expectedLength = 16
    } else if (props.type === 'time') {
        expectedLength = 5
    } else {
        expectedLength = 10
    }

    if (val.length < expectedLength) {
        return
    }

    // Composable faz parsing e validação semântica automaticamente
    setFromBRFormat(val)
}
</script>

<template>
    <!-- Time Input (HH:mm) -->
    <MaskInput v-if="type === 'time'" :model-value="displayValue" mask="TIME" :label="label" :error="computedError"
        :error-message="computedErrorMessage" :disabled="disabled" placeholder="HH:mm" :emit-unmasked="false"
        @update:model-value="handleInput" />

    <!-- Date Input (DD/MM/YYYY) -->
    <MaskInput v-else-if="type === 'date'" :model-value="displayValue" mask="DATE_BR" :label="label"
        :error="computedError" :error-message="computedErrorMessage" :disabled="disabled" placeholder="DD/MM/YYYY"
        :emit-unmasked="false" @update:model-value="handleInput" />

    <!-- DateTime Input (DD/MM/YYYY HH:mm) -->
    <MaskInput v-else-if="type === 'datetime-local'" :model-value="displayValue" mask="DATETIME_BR" :label="label"
        :error="computedError" :error-message="computedErrorMessage" :disabled="disabled" placeholder="DD/MM/YYYY HH:mm"
        :emit-unmasked="false" @update:model-value="handleInput" />
</template>
