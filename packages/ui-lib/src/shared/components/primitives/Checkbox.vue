<script setup lang="ts">
/**
 * Checkbox - Primitivo para seleção booleana
 */
interface Props {
    modelValue: boolean
    label?: string
    disabled?: boolean
    error?: boolean
    errorMessage?: string
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: false,
    disabled: false,
    error: false,
})

const emit = defineEmits<{
    'update:modelValue': [value: boolean]
}>()

const toggle = () => {
    if (props.disabled) return
    emit('update:modelValue', !props.modelValue)
}
</script>

<template>
    <div class="checkbox-wrapper" :class="{ 'checkbox-wrapper--disabled': disabled, 'checkbox-wrapper--error': error }">
        <div class="checkbox" @click="toggle" role="checkbox" :aria-checked="modelValue" :tabindex="disabled ? -1 : 0"
            @keydown.space.prevent="toggle">
            <div class="checkbox__box">
                <svg v-if="modelValue" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"
                    class="checkbox__icon">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            </div>
            <span v-if="label" class="checkbox__label">{{ label }}</span>
        </div>
        <span v-if="error && errorMessage" class="checkbox-wrapper__error">{{ errorMessage }}</span>
    </div>
</template>

<style lang="scss">
.checkbox-wrapper {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);

    &--disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    &__error {
        font-size: var(--font-size-xs);
        color: var(--color-error);
    }
}

.checkbox {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    cursor: pointer;
    user-select: none;

    &__box {
        width: 1.25rem;
        height: 1.25rem;
        border: 2px solid var(--color-border-base);
        border-radius: var(--radius-sm);
        background: var(--color-bg-primary);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all var(--transition-fast);
        color: var(--color-bg-primary); // Icon color when checked
    }

    &__icon {
        width: 0.8rem;
        height: 0.8rem;
    }

    &__label {
        font-size: var(--font-size-sm);
        color: var(--color-text-primary);
    }

    // States
    &:hover .checkbox__box {
        border-color: var(--color-primary);
    }

    &:focus-visible {
        outline: none;

        .checkbox__box {
            box-shadow: 0 0 0 3px var(--color-primary-faded);
            border-color: var(--color-primary);
        }
    }

    &[aria-checked="true"] .checkbox__box {
        background: var(--color-primary);
        border-color: var(--color-primary);
    }
}

.checkbox-wrapper--error {
    .checkbox__box {
        border-color: var(--color-error);
    }

    .checkbox__label {
        color: var(--color-error);
    }
}
</style>
