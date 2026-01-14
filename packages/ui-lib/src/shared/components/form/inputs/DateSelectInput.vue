<script setup lang="ts">
/**
 * DateSelectInput
 * 
 * Seleção de data via dropdowns (Selects)
 * Ideal para DOB (data de nascimento), agendamentos simples
 * 
 * Usa validação centralizada para garantir datas válidas (ex: ajusta 31/Fev para 28/29)
 */
import { ref, computed, watch } from 'vue'
import { Select } from '@/shared/components'
import { isValidDate } from '@/core/utils/formatters'

interface Props {
    modelValue: Date | null
    label?: string
    startYear?: number
    endYear?: number
    disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: null,
    startYear: 1900,
    endYear: new Date().getFullYear() + 10,
    disabled: false
})

const emit = defineEmits<{
    'update:modelValue': [value: Date | null]
}>()

// Estado dos selects
const day = ref<string>('')
const month = ref<string>('')
const year = ref<string>('')

// Opções de dias (1-31)
const days = computed(() =>
    Array.from({ length: 31 }, (_, i) => ({
        label: String(i + 1).padStart(2, '0'),
        value: String(i + 1)
    }))
)

// Opções de meses (pt-BR)
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

// Opções de anos (decrescente: mais recente primeiro)
const years = computed(() => {
    const list = []
    for (let y = props.endYear; y >= props.startYear; y--) {
        list.push({ label: String(y), value: String(y) })
    }
    return list
})

// Ajusta dia se exceder máximo do mês (ex: 31/Fev -> 28 ou 29)
const adjustDay = () => {
    if (!day.value || !month.value || !year.value) return

    const d = Number.parseInt(day.value)
    const m = Number.parseInt(month.value)
    const y = Number.parseInt(year.value)

    // Valida se a data é possível
    if (!isValidDate(d, m, y)) {
        // Encontra o último dia válido do mês
        const lastDayOfMonth = new Date(y, m, 0).getDate()
        if (d > lastDayOfMonth) {
            day.value = String(lastDayOfMonth)
        }
    }
}

// Atualiza modelo quando qualquer campo muda
watch([day, month, year], () => {
    adjustDay()

    if (day.value && month.value && year.value) {
        const d = Number.parseInt(day.value)
        const m = Number.parseInt(month.value)
        const y = Number.parseInt(year.value)

        // Valida antes de emitir
        if (isValidDate(d, m, y)) {
            emit('update:modelValue', new Date(y, m - 1, d, 0, 0, 0, 0))
        }
    } else {
        emit('update:modelValue', null)
    }
})

// Sincroniza modelo externo -> campos
watch(() => props.modelValue, (val) => {
    if (val && !Number.isNaN(val.getTime())) {
        day.value = String(val.getDate())
        month.value = String(val.getMonth() + 1)
        year.value = String(val.getFullYear())
    } else {
        day.value = ''
        month.value = ''
        year.value = ''
    }
}, { immediate: true })
</script>

<template>
    <div class="date-select-input">
        <label v-if="label" class="label">{{ label }}</label>
        <div class="row">
            <div style="flex: 1.2;">
                <Select v-model="day" :options="days" placeholder="Dia" :disabled="disabled" />
            </div>
            <div style="flex: 2;">
                <Select v-model="month" :options="months" placeholder="Mês" :disabled="disabled" />
            </div>
            <div style="flex: 2;">
                <Select v-model="year" :options="years" placeholder="Ano" :disabled="disabled" />
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
