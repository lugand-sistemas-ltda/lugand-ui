<script setup lang="ts">
/**
 * RadioGroup - Grupo de opções de seleção única
 */
interface Option {
    label: string
    value: any
    disabled?: boolean
}

interface Props {
    modelValue: any
    options: Option[]
    name?: string
    direction?: 'row' | 'column'
    disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    direction: 'column',
    disabled: false
})

const emit = defineEmits<{
    'update:modelValue': [value: any]
}>()

// Generate random name if not provided to group radios
const groupName = props.name || `radio-group-${Math.random().toString(36).substr(2, 9)}`
</script>

<template>
    <div class="radio-group" :class="[`radio-group--${direction}`]">
        <label v-for="option in options" :key="option.value" class="radio-wrapper" 
            :class="{ 'radio-wrapper--disabled': disabled || option.disabled, 'radio-wrapper--checked': modelValue === option.value }">
            
            <input 
                type="radio" 
                class="radio-input"
                :name="groupName"
                :value="option.value"
                :checked="modelValue === option.value"
                :disabled="disabled || option.disabled"
                @change="emit('update:modelValue', option.value)"
            />
            
            <span class="radio-control"></span>
            <span class="radio-label">{{ option.label }}</span>
        </label>
    </div>
</template>

<style lang="scss">
.radio-group {
    display: flex;
    gap: var(--spacing-md);

    &--column {
        flex-direction: column;
        gap: var(--spacing-sm);
    }

    &--row {
        flex-direction: row;
        flex-wrap: wrap;
    }
}
</style>
