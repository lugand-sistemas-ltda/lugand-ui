<script setup lang="ts">
/**
 * MaskInput - Campo com máscara
 * Suporta máscaras predefinidas (CPF, CNPJ, etc) ou personalizadas
 * 
 * Usa NumericTextInput para máscaras numéricas (garantindo type="text")
 * Usa Input genérico para máscaras alfanuméricas
 */
import { computed, ref, watch } from 'vue'
import { MASKS, applyMask, unmask } from '@/core/utils/formatters'
import Input from './Input.vue'
import NumericTextInput from '../primitives/NumericTextInput.vue'

interface Props {
    modelValue: string
    mask: keyof typeof MASKS | string
    emitUnmasked?: boolean
    label?: string
    placeholder?: string
    error?: boolean
    errorMessage?: string
    disabled?: boolean
    size?: 'sm' | 'md' | 'lg'
    hint?: string
}

const props = withDefaults(defineProps<Props>(), {
    emitUnmasked: true,
})

const emit = defineEmits<{
    'update:modelValue': [value: string]
}>()

// Determine the mask pattern
const maskPattern = computed(() => {
    return (MASKS as any)[props.mask] || props.mask
})

// Detecta se é máscara numérica (não contém 'A')
const isNumericMask = computed(() => !maskPattern.value.includes('A'))

// Caracteres permitidos para NumericTextInput (inclui separadores de máscara)
const allowedChars = computed(() => {
    if (isNumericMask.value) {
        return '0-9/:.-' // Números + separadores comuns de datas/documentos
    }
    return '0-9a-zA-Z' // Alfanumérico
})

// Local display value
const displayValue = ref('')

// Watch model changes to update display
watch(() => props.modelValue, (newVal) => {
    if (newVal === undefined || newVal === null) {
        displayValue.value = ''
        return
    }

    // Always strip before re-masking to ensure consistency
    const clean = unmask(String(newVal))
    displayValue.value = applyMask(clean, maskPattern.value)
}, { immediate: true })

const handleInput = (val: string | number) => {
    const newVal = String(val)

    // Determine strict numeric or alphanumeric based on ACTUAL pattern
    const isAlphanumeric = maskPattern.value.includes('A')

    // Clean input respecting the mask type
    // SECURITY: Remove all non-allowed characters to prevent injection attacks
    let clean = ''
    if (isAlphanumeric) {
        // Allow letters and numbers only (no symbols, no SQL, no scripts)
        clean = newVal.replace(/[^a-zA-Z0-9]/g, '')
    } else {
        // Strict numeric masking: ONLY digits (prevents 'aaa', '////', 'drop db', etc)
        clean = newVal.replace(/\D/g, '')
    }

    // Apply mask to limit length
    const masked = applyMask(clean, maskPattern.value)

    // Force update display value to prevent extra chars
    displayValue.value = masked

    // Emit correct value
    if (props.emitUnmasked) {
        emit('update:modelValue', clean)
    } else {
        emit('update:modelValue', masked)
    }
}

// Computed: Atributos de segurança para inputs numéricos (date, time, etc)
const inputSecurityAttrs = computed(() => {
    return {
        type: 'text' as const
    }
})

</script>

<template>
    <!-- Usa NumericTextInput para máscaras numéricas (datas, CPF, etc) -->
    <NumericTextInput v-if="isNumericMask" :model-value="displayValue" :label="label" :placeholder="placeholder"
        :error="error" :error-message="errorMessage" :disabled="disabled" :size="size" :hint="hint"
        :maxlength="maskPattern.length" :allowed-chars="allowedChars" @update:model-value="handleInput" />

    <!-- Usa Input genérico para máscaras alfanuméricas (placas, etc) -->
    <Input v-else v-bind="inputSecurityAttrs" :model-value="displayValue" :label="label" :placeholder="placeholder"
        :error="error" :error-message="errorMessage" :disabled="disabled" :size="size" :hint="hint"
        :maxlength="maskPattern.length" @update:model-value="handleInput" />
</template>
