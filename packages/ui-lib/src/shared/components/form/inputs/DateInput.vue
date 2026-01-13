<script setup lang="ts">
/**
 * DateInput - Campo de Data/Hora especializado
 * Wrapper em torno do input nativo date/datetime-local/time
 * Normaliza a saída como Date object ou String ISO
 */
import { computed } from 'vue'
import Input from './Input.vue'
import MaskInput from './MaskInput.vue'

interface Props {
    modelValue: Date | string | null
    type?: 'date' | 'datetime-local' | 'time'
    label?: string
    error?: boolean
    errorMessage?: string
    disabled?: boolean
    min?: string
    max?: string
    outputFormat?: 'date-object' | 'iso-string'
}

const props = withDefaults(defineProps<Props>(), {
    type: 'date',
    modelValue: null,
    outputFormat: 'date-object'
})

const emit = defineEmits<{
    'update:modelValue': [value: Date | string | null]
}>()

// Convert Model -> Input String
const inputValue = computed(() => {
    if (!props.modelValue) return ''

    let date: Date
    if (typeof props.modelValue === 'string') {
        // Fix for simple ISO date strings (YYYY-MM-DD) being parsed as UTC
        // This prevents "previous day" issues due to timezone offsets when displaying local date
        if (/^\d{4}-\d{2}-\d{2}$/.test(props.modelValue)) {
            const [y, m, d] = props.modelValue.split('-').map(Number)
            date = new Date(y || 0, (m || 1) - 1, d || 1) // Defaults to avoid TS errors
        } else {
            date = new Date(props.modelValue)
        }
    } else {
        date = props.modelValue
    }

    if (isNaN(date.getTime())) return ''

    // Format for input value: YYYY-MM-DD or YYYY-MM-DDTHH:mm or HH:mm
    if (props.type === 'time') {
        return date.toTimeString().slice(0, 5)
    }

    // For date and datetime-local, we need YYYY-MM-DD
    // Using local time components to match input behavior
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    if (props.type === 'date') {
        return `${year}-${month}-${day}`
    }

    if (props.type === 'datetime-local') {
        const hours = String(date.getHours()).padStart(2, '0')
        const mins = String(date.getMinutes()).padStart(2, '0')
        return `${year}-${month}-${day}T${hours}:${mins}`
    }

    return ''
})

const handleTimeInput = (val: string) => {
    // val comes as 'HH:MM' from MaskInput
    if (!val || val.length !== 5) {
        emit('update:modelValue', null)
        return
    }

    // Ensure we have both parts
    const parts = val.split(':')
    if (parts.length < 2) return

    let h = parseInt(parts[0] || '0', 10)
    let m = parseInt(parts[1] || '0', 10)

    // Validate Hours/Minutes
    if (isNaN(h)) h = 0
    if (isNaN(m)) m = 0

    if (h > 23) h = 23
    if (m > 59) m = 59

    const date = new Date()
    date.setHours(h, m, 0, 0)

    if (props.outputFormat === 'iso-string') {
        emit('update:modelValue', date.toISOString())
    } else {
        emit('update:modelValue', date)
    }
}

const handleInput = (val: string | number) => {
    const valueStr = String(val) // '2023-01-01' or '2023-01-01T12:00'

    if (!valueStr) {
        emit('update:modelValue', null)
        return
    }

    // Parse Input String -> Date
    let date: Date
    if (props.type === 'time') {
        const parts = valueStr.split(':').map(Number)
        const h = parts[0] || 0
        const m = parts[1] || 0
        date = new Date()
        date.setHours(h, m, 0, 0)
    } else {
        // Date constructor handles 'YYYY-MM-DD' as UTC usually, but 'YYYY-MM-DDT...' as local
        // To be consistent with input (which is local), we construct manually
        if (props.type === 'date') {
            const parts = valueStr.split('-').map(Number)
            const y = parts[0] || 0
            const m = parts[1] || 1
            const d = parts[2] || 1
            date = new Date(y, m - 1, d)
        } else {
            // datetime-local '2023-01-01T12:00'
            date = new Date(valueStr)
        }
    }

    if (props.outputFormat === 'iso-string') {
        emit('update:modelValue', date.toISOString())
    } else {
        emit('update:modelValue', date)
    }
}
</script>

<template>
    <!-- Use Masked Input for Time to enforce 24h format globally -->
    <MaskInput v-if="type === 'time'" :model-value="inputValue" mask="TIME" :label="label" :error="error"
        :error-message="errorMessage" :disabled="disabled" placeholder="HH:mm" @update:model-value="handleTimeInput" />

    <!-- Native for Date / DateTime -->
    <Input v-else :type="type" :model-value="inputValue" @update:model-value="handleInput" :label="label" :error="error"
        :error-message="errorMessage" :disabled="disabled" :min="min" :max="max" />
</template>
