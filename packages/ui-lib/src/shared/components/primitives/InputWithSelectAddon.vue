<script setup lang="ts">
/**
 * InputWithSelectAddon - Input avançado com Select nos addons
 * Permite selects nos prefix/suffix além de ícones e texto
 */

export interface SelectOption {
    label: string
    value: string | number
}

interface Props {
    modelValue?: string | number
    type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url'
    placeholder?: string
    disabled?: boolean
    readonly?: boolean
    size?: 'sm' | 'md' | 'lg'
    error?: boolean
    errorMessage?: string
    label?: string
    hint?: string
    // Prefix Select Props
    prefixSelectOptions?: SelectOption[]
    prefixSelectValue?: string | number
    // Suffix Select Props
    suffixSelectOptions?: SelectOption[]
    suffixSelectValue?: string | number
}

withDefaults(defineProps<Props>(), {
    modelValue: '',
    type: 'text',
    disabled: false,
    readonly: false,
    size: 'md',
    error: false,
})

const emit = defineEmits<{
    'update:modelValue': [value: string | number]
    'update:prefixSelectValue': [value: string | number]
    'update:suffixSelectValue': [value: string | number]
}>()

const handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement
    emit('update:modelValue', target.value)
}

const handlePrefixSelectChange = (event: Event) => {
    const target = event.target as HTMLSelectElement
    emit('update:prefixSelectValue', target.value)
}

const handleSuffixSelectChange = (event: Event) => {
    const target = event.target as HTMLSelectElement
    emit('update:suffixSelectValue', target.value)
}
</script>

<template>
    <div
        :class="['input-select-addon-wrapper', `input-select-addon-wrapper--${size}`, { 'input-select-addon-wrapper--error': error }]">
        <label v-if="label" class="input-select-addon-wrapper__label">
            {{ label }}
        </label>

        <div :class="['input-select-addon-container', `input-select-addon-container--${size}`, {
            'input-select-addon-container--error': error,
            'input-select-addon-container--disabled': disabled
        }]">
            <!-- Prefix: Slot ou Select -->
            <div v-if="$slots.prefix || prefixSelectOptions" class="input-select-addon-container__prefix">
                <!-- Prefix Select -->
                <select v-if="prefixSelectOptions" class="addon-select" :value="prefixSelectValue" :disabled="disabled"
                    @change="handlePrefixSelectChange">
                    <option v-for="opt in prefixSelectOptions" :key="opt.value" :value="opt.value">
                        {{ opt.label }}
                    </option>
                </select>

                <!-- Prefix Slot (ícone, texto, etc) -->
                <slot v-else name="prefix"></slot>
            </div>

            <!-- Input Principal -->
            <input :class="['input-select-addon-container__input', `input-select-addon-container__input--${size}`]"
                :type="type" :value="modelValue" :placeholder="placeholder" :disabled="disabled" :readonly="readonly"
                @input="handleInput" />

            <!-- Suffix: Slot ou Select -->
            <div v-if="$slots.suffix || suffixSelectOptions" class="input-select-addon-container__suffix">
                <!-- Suffix Select -->
                <select v-if="suffixSelectOptions" class="addon-select" :value="suffixSelectValue" :disabled="disabled"
                    @change="handleSuffixSelectChange">
                    <option v-for="opt in suffixSelectOptions" :key="opt.value" :value="opt.value">
                        {{ opt.label }}
                    </option>
                </select>

                <!-- Suffix Slot (ícone, texto, etc) -->
                <slot v-else name="suffix"></slot>
            </div>
        </div>

        <span v-if="hint && !error" class="input-select-addon-wrapper__hint">
            {{ hint }}
        </span>

        <span v-if="error && errorMessage" class="input-select-addon-wrapper__error">
            {{ errorMessage }}
        </span>
    </div>
</template>

<style lang="scss">
/**
 * InputWithSelectAddon Styles
 */
.input-select-addon-wrapper {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);

    &__label {
        font-size: var(--font-size-sm);
        font-weight: var(--font-weight-medium);
        color: var(--color-text-primary);
    }

    &__hint {
        font-size: var(--font-size-xs);
        color: var(--color-text-secondary);
    }

    &__error {
        font-size: var(--font-size-xs);
        color: var(--color-error);
    }

    &--error {
        .input-select-addon-wrapper__label {
            color: var(--color-error);
        }
    }
}

.input-select-addon-container {
    display: flex;
    align-items: stretch;
    width: 100%;

    background: var(--input-bg);
    border: 1px solid var(--input-border);
    border-radius: var(--input-radius);

    transition: all var(--transition-fast);
    overflow: hidden;

    &:hover:not(&--disabled) {
        border-color: var(--input-border-hover);
    }

    &:focus-within {
        outline: 2px solid var(--input-border-focus);
        outline-offset: 0;
        border-color: var(--input-border-focus);
    }

    &--error {
        border-color: var(--color-error);

        &:focus-within {
            outline-color: var(--color-error);
            border-color: var(--color-error);
        }
    }

    &--disabled {
        opacity: 0.5;
        cursor: not-allowed;
        background: var(--input-bg-disabled);
    }

    // Addons (Prefix e Suffix)
    &__prefix,
    &__suffix {
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--color-bg-secondary);
        color: var(--color-text-secondary);
        user-select: none;
        flex-shrink: 0;

        border-right: 1px solid var(--color-border);

        &.input-select-addon-container__suffix {
            border-right: none;
            border-left: 1px solid var(--color-border);
        }
    }

    // Select dentro do addon
    .addon-select {
        border: none;
        outline: none;
        background: transparent;
        color: var(--color-text-primary);
        font-family: inherit;
        font-weight: 500;
        cursor: pointer;
        padding: 0 var(--spacing-md);
        min-width: 80px;

        &:focus {
            background: var(--color-bg-tertiary);
        }

        &:disabled {
            cursor: not-allowed;
            opacity: 0.5;
        }

        option {
            background: var(--color-bg-primary);
            color: var(--color-text-primary);
        }
    }

    // Tamanhos específicos
    &--sm {
        .addon-select {
            font-size: var(--font-size-xs);
            padding: 0 var(--spacing-sm);
            min-width: 70px;
        }

        .input-select-addon-container__prefix,
        .input-select-addon-container__suffix {
            padding: 0 var(--spacing-sm);
            font-size: var(--font-size-xs);
        }
    }

    &--md {
        .addon-select {
            font-size: var(--font-size-sm);
            padding: 0 var(--spacing-md);
            min-width: 80px;
        }

        .input-select-addon-container__prefix,
        .input-select-addon-container__suffix {
            padding: 0 var(--spacing-md);
            font-size: var(--font-size-sm);
        }
    }

    &--lg {
        .addon-select {
            font-size: var(--font-size-base);
            padding: 0 var(--spacing-lg);
            min-width: 100px;
        }

        .input-select-addon-container__prefix,
        .input-select-addon-container__suffix {
            padding: 0 var(--spacing-lg);
            font-size: var(--font-size-base);
        }
    }

    // Input interno
    &__input {
        flex: 1;
        border: none;
        outline: none;
        background: transparent;
        color: var(--input-text);
        font-family: inherit;
        font-weight: var(--font-weight-normal);
        min-width: 0;

        &::placeholder {
            color: var(--input-placeholder);
        }

        &:disabled {
            cursor: not-allowed;
        }

        // Sizes
        &--sm {
            padding: var(--spacing-xs) var(--spacing-sm);
            font-size: var(--font-size-sm);
            height: 32px;
        }

        &--md {
            padding: var(--spacing-sm) var(--spacing-md);
            font-size: var(--font-size-base);
            height: 40px;
        }

        &--lg {
            padding: var(--spacing-md) var(--spacing-lg);
            font-size: var(--font-size-lg);
            height: 48px;
        }
    }
}
</style>
