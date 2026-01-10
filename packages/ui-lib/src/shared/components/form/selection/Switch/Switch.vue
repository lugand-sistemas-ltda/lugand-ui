<script setup lang="ts">
/**
 * Switch - Interruptor de alternância
 * Primitivo para formulários (boolean)
 */
interface Props {
    modelValue: boolean
    label?: string
    disabled?: boolean
    color?: 'success' | 'primary' | 'warning'
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: false,
    disabled: false,
    color: 'success'
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
    <div class="switch-wrapper" :class="{ 'switch-wrapper--disabled': disabled }" @click="toggle">
        <label v-if="label" class="switch-label">
            {{ label }}
        </label>
        
        <div class="switch" :class="{ 'switch--checked': modelValue, [`switch--${color}`]: color }">
            <div class="switch__handle"></div>
        </div>
    </div>
</template>

<style lang="scss">
.switch-wrapper {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-sm);
    cursor: pointer;
    user-select: none;

    &--disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
}

.switch-label {
    font-size: var(--font-size-sm);
    color: var(--color-text-primary);
    cursor: inherit;
}

.switch {
    width: 44px;
    height: 24px;
    background-color: var(--switch-bg);
    border-radius: var(--radius-full);
    position: relative;
    transition: background-color var(--transition-fast);

    &__handle {
        width: 20px;
        height: 20px;
        background-color: var(--switch-handle);
        border-radius: 50%;
        position: absolute;
        top: 2px;
        left: 2px;
        transition: transform var(--transition-fast), box-shadow var(--transition-fast);
        box-shadow: 0 1px 3px rgba(0,0,0,0.3);
    }

    &--checked {
        background-color: var(--switch-bg-checked);

        .switch__handle {
            transform: translateX(20px);
        }
    }
    
    // Color variants
    &--primary {
        &.switch--checked {
            background-color: var(--color-primary);
        }
    }
    
    &--warning {
        &.switch--checked {
            background-color: var(--color-warning);
        }
    }
}
</style>
