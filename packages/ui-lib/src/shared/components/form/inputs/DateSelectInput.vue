<script setup lang="ts">
/**
 * DateSelectInput
 * Seleção de data via listas (Selects)
 * Ideal para DOB, agendamentos simples, etc.
 */
import { ref, computed, watch } from 'vue'
import { Select } from '@/shared/components'

interface Props {
    modelValue: Date | null
    label?: string
    startYear?: number
    endYear?: number
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: null,
    startYear: 1900,
    endYear: new Date().getFullYear() + 10
})

const emit = defineEmits<{
    'update:modelValue': [value: Date | null]
}>()

// State
const day = ref<string>('')
const month = ref<string>('')
const year = ref<string>('')

// Options
const days = computed(() => Array.from({ length: 31 }, (_, i) => ({ label: String(i + 1).padStart(2, '0'), value: String(i + 1) })))
const months = computed(() => [
    { label: 'Janeiro', value: '1' },
    { label: 'Fevereiro', value: '2' },
    { label: 'Março', value: '3' },
    { label: 'Abril', value: '4' },
    { label: 'Maio', value: '5' },
    { label: 'Junho', value: '6' },
    { label: 'Julho', value: '7' },
    { label: 'Agosto', value: '8' },
    { label: 'Setembro', value: '9' },
    { label: 'Outubro', value: '10' },
    { label: 'Novembro', value: '11' },
    { label: 'Dezembro', value: '12' },
])

const years = computed(() => {
    const list = []
    for (let y = props.endYear; y >= props.startYear; y--) {
        list.push({ label: String(y), value: String(y) })
    }
    return list
})

// Max day validator check (e.g. Feb 31)
const adjustDay = () => {
    if (!day.value || !month.value || !year.value) return
    const d = parseInt(day.value)
    const m = parseInt(month.value)
    const y = parseInt(year.value)
    const date = new Date(y, m, 0) // Last day of month
    if (d > date.getDate()) {
        day.value = String(date.getDate())
    }
}

watch([day, month, year], () => {
    adjustDay()
    if (day.value && month.value && year.value) {
        emit('update:modelValue', new Date(parseInt(year.value), parseInt(month.value) - 1, parseInt(day.value)))
    } else {
        // emit('update:modelValue', null) // Only clear if strictly needed
    }
})

// Sync from Model
watch(() => props.modelValue, (val) => {
    if (val && !isNaN(val.getTime())) {
        day.value = String(val.getDate())
        month.value = String(val.getMonth() + 1)
        year.value = String(val.getFullYear())
    }
}, { immediate: true })

</script>

<template>
    <div class="date-select-input">
        <label v-if="label" class="label">{{ label }}</label>
        <div class="row">
            <div style="flex: 1.2;">
                <Select v-model="day" :options="days" placeholder="Day" />
            </div>
            <div style="flex: 2;">
                <Select v-model="month" :options="months" placeholder="Month" />
            </div>
            <div style="flex: 2;">
                <Select v-model="year" :options="years" placeholder="Year" />
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.date-select-input {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
}

.label {
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    color: var(--color-text-primary);
}

.row {
    display: flex;
    gap: var(--spacing-sm);
    width: 100%;
}
</style>
