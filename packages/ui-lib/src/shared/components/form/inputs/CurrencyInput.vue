<script setup lang="ts">
/**
 * CurrencyInput - Campo Monetário
 * Formata valores numéricos para moeda (BRL padrão)
 */
import { ref, watch } from 'vue'
import { formatCurrency } from '@/core/utils/formatters'
import Input from './Input.vue'

interface Props {
    modelValue: number
    currency?: string
    locale?: string
    label?: string
    placeholder?: string
    error?: boolean
    errorMessage?: string
    disabled?: boolean
    size?: 'sm' | 'md' | 'lg'
    hint?: string
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: 0,
    currency: 'BRL',
    locale: 'pt-BR',
})

const emit = defineEmits<{
    'update:modelValue': [value: number]
}>()

const displayValue = ref('')

// Format function helper
const format = (val: number) => {
    return formatCurrency(val, props.locale, props.currency)
}

watch(() => props.modelValue, (newVal) => {
    displayValue.value = format(newVal)
}, { immediate: true })

const handleInput = (val: string | number) => {
    // Value comes as string from Input usually
    const strVal = String(val)

    // Remove non-digits (prevent letters/symbols)
    const digits = strVal.replace(/\D/g, '')

    // Treat as cents (e.g. 1 -> 0.01)
    const numberValue = parseInt(digits || '0', 10) / 100

    // Emit number
    emit('update:modelValue', numberValue)

    // Force display update to ensure formatting (e.g. 10 -> 10,00)
    displayValue.value = format(numberValue)
}
</script>

<template>
    <Input :model-value="displayValue" @update:model-value="handleInput" :label="label" :placeholder="placeholder"
        :error="error" :error-message="errorMessage" :disabled="disabled" :size="size" :hint="hint" />
</template>
