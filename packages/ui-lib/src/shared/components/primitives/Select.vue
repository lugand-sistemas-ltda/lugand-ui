<script setup lang="ts">
/**
 * Select - Primitivo para seleção de opções
 */
interface Option {
    label: string
    value: string | number
}

interface Props {
    modelValue: string | number
    options: Option[]
    label?: string
    placeholder?: string
    disabled?: boolean
    error?: boolean
    errorMessage?: string
}

withDefaults(defineProps<Props>(), {
    modelValue: '',
    options: () => [],
    placeholder: 'Select an option',
    disabled: false,
    error: false,
})

const emit = defineEmits<{
    'update:modelValue': [value: string | number]
}>()

const handleChange = (event: Event) => {
    const target = event.target as HTMLSelectElement
    emit('update:modelValue', target.value)
}
</script>

<template>
    <div class="select-wrapper" :class="{ 'select-wrapper--error': error, 'select-wrapper--disabled': disabled }">
        <label v-if="label" class="select-wrapper__label">{{ label }}</label>

        <div class="select-container">
            <select class="select" :value="modelValue" :disabled="disabled" @change="handleChange">
                <option value="" disabled selected>{{ placeholder }}</option>
                <option v-for="opt in options" :key="opt.value" :value="opt.value">
                    {{ opt.label }}
                </option>
            </select>
            <div class="select-arrow">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            </div>
        </div>

        <span v-if="error && errorMessage" class="select-wrapper__error">{{ errorMessage }}</span>
    </div>
</template>

<style lang="scss">
.select-wrapper {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
    width: 100%;

    &__label {
        font-size: var(--font-size-sm);
        font-weight: var(--font-weight-medium);
        color: var(--color-text-secondary);
    }

    &__error {
        font-size: var(--font-size-xs);
        color: var(--color-error);
    }

    &--error {
        .select-wrapper__label {
            color: var(--color-error);
        }

        .select {
            border-color: var(--color-error);
        }
    }
}

.select-container {
    position: relative;
    width: 100%;
}

.select {
    width: 100%;
    appearance: none;
    background: var(--color-bg-primary);
    border: 1px solid var(--color-border-base);
    border-radius: var(--radius-md);
    padding: var(--spacing-sm) var(--spacing-md);
    padding-right: 2.5rem; // Space for arrow
    color: var(--color-text-primary);
    font-family: inherit;
    font-size: var(--font-size-md);
    transition: all var(--transition-fast);
    cursor: pointer;

    &:focus {
        outline: none;
        border-color: var(--color-primary);
        box-shadow: 0 0 0 3px var(--color-primary-faded);
    }

    &:disabled {
        background: var(--color-bg-secondary);
        cursor: not-allowed;
        opacity: 0.7;
    }

    option {
        background-color: var(--color-bg-primary);
        color: var(--color-text-primary);
    }
}

.select-arrow {
    position: absolute;
    right: var(--spacing-sm);
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    color: var(--color-text-tertiary);
}
</style>
