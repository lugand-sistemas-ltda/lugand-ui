<script setup lang="ts">
/**
 * InputWithAddon - Input com addon (ícone ou texto)
 * Permite adicionar elementos antes ou depois do input via slots
 */

interface Props {
    modelValue?: string | number
    type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'
    placeholder?: string
    disabled?: boolean
    readonly?: boolean
    size?: 'sm' | 'md' | 'lg'
    error?: boolean
    errorMessage?: string
    label?: string
    hint?: string
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
}>()

const handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement
    emit('update:modelValue', target.value)
}
</script>

<template>
    <div :class="['input-addon-wrapper', `input-addon-wrapper--${size}`, { 'input-addon-wrapper--error': error }]">
        <label v-if="label" class="input-addon-wrapper__label">
            {{ label }}
        </label>

        <div
            :class="['input-addon-container', `input-addon-container--${size}`, { 'input-addon-container--error': error, 'input-addon-container--disabled': disabled }]">
            <!-- Addon Esquerdo (Prefix) -->
            <div v-if="$slots.prefix" class="input-addon-container__prefix">
                <slot name="prefix"></slot>
            </div>

            <!-- Input Principal -->
            <input :class="['input-addon-container__input', `input-addon-container__input--${size}`]" :type="type"
                :value="modelValue" :placeholder="placeholder" :disabled="disabled" :readonly="readonly"
                @input="handleInput" />

            <!-- Addon Direito (Suffix) -->
            <div v-if="$slots.suffix" class="input-addon-container__suffix">
                <slot name="suffix"></slot>
            </div>
        </div>

        <span v-if="hint && !error" class="input-addon-wrapper__hint">
            {{ hint }}
        </span>

        <span v-if="error && errorMessage" class="input-addon-wrapper__error">
            {{ errorMessage }}
        </span>
    </div>
</template>

<style lang="scss">
/**
 * InputWithAddon Styles
 */
.input-addon-wrapper {
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
        .input-addon-wrapper__label {
            color: var(--color-error);
        }
    }
}

.input-addon-container {
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
        font-size: var(--font-size-sm);
        font-weight: 500;

        min-width: 40px;
        padding: 0 var(--spacing-md);

        // Border interna sutil
        border-right: 1px solid var(--color-border);

        // Remove border do suffix e adiciona no lado esquerdo
        &.input-addon-container__suffix {
            border-right: none;
            border-left: 1px solid var(--color-border);
        }
    }

    // Tamanhos específicos para addons
    &--sm {

        .input-addon-container__prefix,
        .input-addon-container__suffix {
            min-width: 36px;
            padding: 0 var(--spacing-sm);
            font-size: var(--font-size-xs);
        }
    }

    &--md {

        .input-addon-container__prefix,
        .input-addon-container__suffix {
            min-width: 40px;
            padding: 0 var(--spacing-md);
            font-size: var(--font-size-sm);
        }
    }

    &--lg {

        .input-addon-container__prefix,
        .input-addon-container__suffix {
            min-width: 48px;
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
        min-width: 0; // Permite shrink

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
