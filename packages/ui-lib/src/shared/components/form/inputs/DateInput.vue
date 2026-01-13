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

    if (Number.isNaN(date.getTime())) return ''

    // Format for input value: YYYY-MM-DD or YYYY-MM-DDTHH:mm or HH:mm
    if (props.type === 'time') {
        const h = String(date.getHours()).padStart(2, '0')
        const m = String(date.getMinutes()).padStart(2, '0')
        return `${h}:${m}`
    }

    // For date and datetime-local
    // Using local time components to match input behavior
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    // If using MaskInput (DATE_BR), return DD/MM/YYYY
    if (props.type === 'date') {
        return `${day}/${month}/${year}`
    }

    // If using MaskInput (DATE_TIME_BR), return DD/MM/YYYY HH:mm
    if (props.type === 'datetime-local') {
        const hours = String(date.getHours()).padStart(2, '0')
        const mins = String(date.getMinutes()).padStart(2, '0')
        return `${day}/${month}/${year} ${hours}:${mins}`
    }

    return ''
})

const validateDateComponents = (d: number, m: number, y: number, h = 0, min = 0): boolean => {
    // Basic range checks
    if (m < 1 || m > 12) return false
    if (d < 1 || d > 31) return false
    if (h < 0 || h > 23) return false
    if (min < 0 || min > 59) return false

    // Strict JS Date check (handles leap years and month lengths)
    // Month is 0-indexed for Date constructor
    const date = new Date(y, m - 1, d, h, min)

    // If JS rolled over the month/day (e.g. 31/02 -> 03/03), it's invalid
    if (date.getFullYear() !== y || date.getMonth() !== (m - 1) || date.getDate() !== d) {
        return false
    }

    return true
}

const handleMaskDateInput = (val: string) => {
    // Expect 'DD/MM/YYYY' or 'DD/MM/YYYY HH:mm'
    if (!val) {
        emit('update:modelValue', null)
        return
    }

    const isDateTime = props.type === 'datetime-local'

    // Strict Length Check to avoid partial updates (e.g. typing "3" -> "03/01/1900")
    // Date: 10 chars (DD/MM/YYYY)
    // DateTime: 16 chars (DD/MM/YYYY HH:mm)
    if (isDateTime) {
        if (val.length < 16) return
    } else if (val.length < 10) {
        return
    }

    let finalDate: Date
    let d: number, m: number, y: number, h: number = 0, min: number = 0

    if (isDateTime) {
        // Parse 'DD/MM/YYYY HH:mm'
        const parts = val.split(' ')
        if (parts.length < 2) return

        const datePart = parts[0] || ''
        const timePart = parts[1] || ''

        const dateComps = datePart.split('/').map(Number);
        const timeComps = timePart.split(':').map(Number);

        d = dateComps[0] || 0
        m = dateComps[1] || 0
        y = dateComps[2] || 0
        h = timeComps[0] || 0
        min = timeComps[1] || 0
    } else {
        // Parse 'DD/MM/YYYY'
        const dateComps = val.split('/').map(Number);
        d = dateComps[0] || 0
        m = dateComps[1] || 0
        y = dateComps[2] || 0
    }

    // SEMANTIC VALIDATION
    if (!validateDateComponents(d, m, y, h, min)) {
        // Invalid date entered (99/99/9999 or 31/02/2026) -> Emit null to clear model
        emit('update:modelValue', null)
        return
    }

    // Month is 0-indexed in Date constructor
    finalDate = new Date(y, m - 1, d, h, min)

    // Basic validity check
    if (Number.isNaN(finalDate.getTime())) return

    emit('update:modelValue', props.outputFormat === 'iso-string' ? finalDate.toISOString() : finalDate)
}

const handleTimeInput = (val: string) => {
    // val comes as 'HH:MM' from MaskInput
    if (!val || val.length !== 5) {
        emit('update:modelValue', null)
        return
    }

    // Ensure we have both parts
    const parts = val.split(':')
    if (parts.length < 2) return

    let h = Number.parseInt(parts[0] || '0', 10)
    let m = Number.parseInt(parts[1] || '0', 10)

    // Validate Hours/Minutes
    if (Number.isNaN(h)) h = 0
    if (Number.isNaN(m)) m = 0

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
    } else if (props.type === 'date') {
        const parts = valueStr.split('-').map(Number)
        const y = parts[0] || 0
        const m = parts[1] || 1
        const d = parts[2] || 1
        date = new Date(y, m - 1, d)
    } else {
        // datetime-local '2023-01-01T12:00'
        date = new Date(valueStr)
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
        :error-message="errorMessage" :disabled="disabled" placeholder="HH:mm" :emit-unmasked="false"
        @update:model-value="handleTimeInput" />

    <!-- User Masked Input for Date (DD/MM/YYYY) to enforce format -->
    <MaskInput v-else-if="type === 'date'" :model-value="inputValue" mask="DATE_BR" :label="label" :error="error"
        :error-message="errorMessage" :disabled="disabled" placeholder="DD/MM/YYYY" :emit-unmasked="false"
        @update:model-value="handleMaskDateInput" />

    <!-- User Masked Input for DateTime (DD/MM/YYYY HH:mm) -->
    <MaskInput v-else-if="type === 'datetime-local'" :model-value="inputValue" mask="DATETIME_BR" :label="label"
        :error="error" :error-message="errorMessage" :disabled="disabled" placeholder="DD/MM/YYYY HH:mm"
        :emit-unmasked="false" @update:model-value="handleMaskDateInput" />

    <!-- Fallback to native (should not happen with current types) -->
    <Input v-else :type="type" :model-value="inputValue" @update:model-value="handleInput" :label="label" :error="error"
        :error-message="errorMessage" :disabled="disabled" :min="min" :max="max" />
</template>
