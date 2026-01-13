<script setup lang="ts">
/**
 * MaskInput - Campo com máscara
 * Suporta máscaras predefinidas (CPF, CNPJ, etc) ou personalizadas
 */
import { computed, ref, watch } from 'vue'
import { MASKS, applyMask, unmask } from '@/core/utils/formatters'
import Input from './Input.vue'

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

// Local display value
const displayValue = ref('')

// Watch model changes to update display
watch(() => props.modelValue, (newVal) => {
    // If model is unmasked (which is the goal), we masker it for display
    // If model is already masked, applyMask should handle it gracefully if we strip first
    // Usually we assume model comes in clean if emitUnmasked is true
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
    let clean = ''
    if (isAlphanumeric) {
        clean = newVal.replace(/[^a-zA-Z0-9]/g, '')
    } else {
        // Strict numeric masking if mask has only #
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
</script>

<template>
    <Input :model-value="displayValue" @update:model-value="handleInput" :label="label" :placeholder="placeholder"
        :error="error" :error-message="errorMessage" :disabled="disabled" :size="size" :hint="hint"
        :maxlength="maskPattern.length" />
</template>
