<script setup lang="ts">
/**
 * DateSegmentedInput
 * Inputs separados para Dia, Mês, Ano (e Hora/Min se necessário)
 * Resolve ambiguidade de parsing e permite UX mais clara
 */
import { ref, watch } from 'vue'
// removed import
// import { GridContainer, Input } from '@/shared/components'

interface Props {
    modelValue: Date | null
    label?: string
    enableTime?: boolean
    disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: null,
    enableTime: false
})

const emit = defineEmits<{
    'update:modelValue': [value: Date | null]
}>()

// Internal stats
const day = ref('')
const month = ref('')
const year = ref('')
const hour = ref('')
const minute = ref('')

// Initialize from Model
watch(() => props.modelValue, (val) => {
    if (val && !isNaN(val.getTime())) {
        day.value = String(val.getDate()).padStart(2, '0')
        month.value = String(val.getMonth() + 1).padStart(2, '0')
        year.value = String(val.getFullYear())
        if (props.enableTime) {
            hour.value = String(val.getHours()).padStart(2, '0')
            minute.value = String(val.getMinutes()).padStart(2, '0')
        }
    } else {
        // Only clear if null passed explicitly to avoid wiping during typing? 
        // Actually this component is controlled. If parent sets null, we wipe.
        day.value = ''
        month.value = ''
        year.value = ''
        hour.value = ''
        minute.value = ''
    }
}, { immediate: true })

const updateDate = () => {
    // Validate Basic
    const d = parseInt(day.value)
    const m = parseInt(month.value)
    const y = parseInt(year.value)

    if (!day.value || !month.value || !year.value) return
    // Wait for full inputs? or Construct what we have?
    // Better to wait for valid segments

    // Basic constraints
    if (d < 1 || d > 31) return
    if (m < 1 || m > 12) return
    if (y < 1000) return // Force 4 digits?

    const timeH = props.enableTime ? parseInt(hour.value || '0') : 0
    const timeM = props.enableTime ? parseInt(minute.value || '0') : 0

    // Construct Date safely using atomic setFullYear(y, m, d) to avoid wrapping issues
    // Start with Epoch (1970) to avoid 0-99 year inference of Date constructor
    const newDate = new Date(0)

    // Set Year, Month (0-based), Day all at once
    newDate.setFullYear(y, m - 1, d)
    newDate.setHours(timeH, timeM, 0, 0)

    // Check if date is valid (e.g. 31 Feb -> resulting month would be March)
    if (newDate.getMonth() !== m - 1 || newDate.getDate() !== d) {
        // Invalid day for month
        return
    }

    emit('update:modelValue', newDate)
}

// Helpers for input limiting
const handleDay = (v: string) => { day.value = v.slice(0, 2); updateDate() }
const handleMonth = (v: string) => { month.value = v.slice(0, 2); updateDate() }
const handleYear = (v: string) => { year.value = v.slice(0, 4); updateDate() }
const handleHour = (v: string) => { hour.value = v.slice(0, 2); updateDate() }
const handleMinute = (v: string) => { minute.value = v.slice(0, 2); updateDate() }

</script>

<template>
    <div class="date-segmented">
        <label v-if="label" class="date-segmented__label">{{ label }}</label>

        <div class="date-segmented__wrapper">
            <!-- Day -->
            <div class="segment segment--sm">
                <input v-model="day" @input="(e: any) => handleDay(e.target.value)" placeholder="DD"
                    class="segment-input" type="number" />
            </div>
            <span class="separator">/</span>

            <!-- Month -->
            <div class="segment segment--sm">
                <input v-model="month" @input="(e: any) => handleMonth(e.target.value)" placeholder="MM"
                    class="segment-input" type="number" />
            </div>
            <span class="separator">/</span>

            <!-- Year -->
            <div class="segment segment--lg">
                <input v-model="year" @input="(e: any) => handleYear(e.target.value)" placeholder="YYYY"
                    class="segment-input" type="number" />
            </div>

            <!-- Time Separator if enabled -->
            <template v-if="enableTime">
                <span class="separator separator--space">at</span>

                <div class="segment segment--sm">
                    <input v-model="hour" @input="(e: any) => handleHour(e.target.value)" placeholder="HH"
                        class="segment-input" type="number" />
                </div>
                <span class="separator">:</span>
                <div class="segment segment--sm">
                    <input v-model="minute" @input="(e: any) => handleMinute(e.target.value)" placeholder="MM"
                        class="segment-input" type="number" />
                </div>
            </template>
        </div>
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

        &:focus-within {
            border-color: var(--color-primary);
            box-shadow: 0 0 0 2px var(--color-primary-light);
        }
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

.segment {
    position: relative;

    &--sm {
        width: 32px;
    }

    &--lg {
        width: 48px;
    }
}

.segment-input {
    width: 100%;
    border: none;
    background: transparent;
    text-align: center;
    font-size: var(--font-size-md);
    color: var(--color-text-primary);
    padding: 0;
    margin: 0;

    &:focus {
        outline: none;
        background: var(--color-bg-tertiary);
        border-radius: var(--radius-sm);
    }

    // Hide number spinners
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    -moz-appearance: textfield;
}
</style>
