<script setup lang="ts">
import { Input, Select, Checkbox, Btn } from '@/shared/components'

/**
 * Definição do Schema do Formulário
 */
export interface FormField {
    name: string
    label?: string
    type: 'text' | 'email' | 'password' | 'number' | 'select' | 'checkbox' | 'textarea'
    placeholder?: string
    options?: { label: string; value: string | number }[] // Para selects
    cols?: 1 | 2 | 3 // Grid system simples (1 = full width)
    required?: boolean
}

interface Props {
    schema: FormField[]
    modelValue: Record<string, any>
    submitLabel?: string
    loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    submitLabel: 'Submit',
    loading: false,
})

const emit = defineEmits<{
    'update:modelValue': [value: Record<string, any>]
    'submit': [value: Record<string, any>]
}>()

// Proxy para atualizar o modelValue
const updateField = (field: string, value: any) => {
    const newModel = { ...props.modelValue, [field]: value }
    emit('update:modelValue', newModel)
}

// Mapeamento de tipos para componentes
const getComponent = (type: string) => {
    switch (type) {
        case 'select': return Select
        case 'checkbox': return Checkbox
        // case 'textarea': return Textarea // TODO: Importar Textarea se necessário
        default: return Input
    }
}

const handleSubmit = () => {
    emit('submit', props.modelValue)
}
</script>

<template>
    <form @submit.prevent="handleSubmit" class="dynamic-form">
        <div class="dynamic-form__grid">
            <div v-for="field in schema" :key="field.name" class="dynamic-form__item"
                :style="{ gridColumn: `span ${field.cols || 1}` }">
                <!-- Renderização Dinâmica -->
                <component :is="getComponent(field.type)" :model-value="modelValue[field.name]"
                    @update:model-value="(val: any) => updateField(field.name, val)" v-bind="{
                        label: field.label,
                        placeholder: field.placeholder,
                        type: field.type === 'password' || field.type === 'email' || field.type === 'number' ? field.type : undefined,
                        options: field.options,
                        error: false // TODO: Implementar validação
                    }" />
            </div>
        </div>

        <div class="dynamic-form__actions">
            <slot name="actions">
                <Btn type="submit" variant="primary" :disabled="loading">
                    {{ submitLabel }}
                </Btn>
            </slot>
        </div>
    </form>
</template>

<style lang="scss">
.dynamic-form {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);

    &__grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: var(--spacing-md);

        @media (min-width: 768px) {
            grid-template-columns: repeat(2, 1fr);
        }
    }

    /* &__item {
        // Default span is 1 column. 
        // If cols=2, it spans 2 columns (full width in 2-col grid)
    } */

    &__actions {
        display: flex;
        justify-content: flex-end;
        gap: var(--spacing-md);
    }
}
</style>
