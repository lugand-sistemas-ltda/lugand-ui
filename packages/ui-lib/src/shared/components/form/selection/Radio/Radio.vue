<script setup lang="ts">
/**
 * Radio - Seleção única
 * Primitivo para formulários
 */
interface Props {
    modelValue?: any
    value: any
    label?: string
    disabled?: boolean
    name?: string
}

const props = withDefaults(defineProps<Props>(), {
    disabled: false,
})

const emit = defineEmits<{
    'update:modelValue': [value: any]
}>()

const handleChange = () => {
    if (props.disabled) return
    emit('update:modelValue', props.value)
}
</script>

<template>
    <label class="radio-wrapper"
        :class="{ 'radio-wrapper--disabled': disabled, 'radio-wrapper--checked': modelValue === value }">
        <input type="radio" class="radio-input" :name="name" :value="value" :checked="modelValue === value"
            :disabled="disabled" @change="handleChange" />
        <span class="radio-control"></span>
        <span v-if="label" class="radio-label">{{ label }}</span>
    </label>
</template>

<style lang="scss">
.radio-wrapper {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-sm);
    cursor: pointer;
    position: relative;

    &--disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
}

.radio-input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
}

.radio-control {
    width: var(--control-size);
    height: var(--control-size);
    border: 2px solid var(--control-border);
    border-radius: 50%;
    display: grid;
    place-items: center;
    transition: all var(--transition-fast);

    &::after {
        content: "";
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: var(--color-text-inverse);
        transform: scale(0);
        transition: transform var(--transition-fast);
    }
}

.radio-wrapper:hover .radio-control {
    border-color: var(--control-border-checked);
}

.radio-input:checked+.radio-control {
    background-color: var(--control-bg-checked);
    border-color: var(--control-bg-checked);

    &::after {
        transform: scale(1);
    }
}

.radio-label {
    font-size: var(--font-size-md);
    color: var(--color-text-primary);
}
</style>
