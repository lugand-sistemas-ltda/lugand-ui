<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@/shared/components'
import type { ToastInstance } from './types'
import { useToast } from '@/shared/composables/useToast'

const props = defineProps<{
    toast: ToastInstance
}>()

const { remove } = useToast()

const iconName = computed(() => {
    if (props.toast.icon) return props.toast.icon

    switch (props.toast.type) {
        case 'success': return 'circle_check'
        case 'warning': return 'warning'
        case 'error': return 'warning' // Using warning icon for error until we have specific alert icon
        case 'info': return 'info'
        default: return 'notifications'
    }
})

const iconColor = computed(() => {
    switch (props.toast.type) {
        case 'success': return 'var(--color-success)'
        case 'warning': return 'var(--color-warning)'
        case 'error': return 'var(--color-error)'
        case 'info': return 'var(--color-info)'
        default: return 'currentColor'
    }
})

function handleDismiss() {
    remove(props.toast.id)
}

function handleAction() {
    if (props.toast.action?.onClick) {
        props.toast.action.onClick()
    }
}
</script>

<template>
    <div class="lugand-toast" :class="[`type-${toast.type}`, { 'has-action': !!toast.action }, toast.className]"
        :style="toast.style" role="alert">
        <!-- Icon -->
        <div class="toast-icon">
            <Icon :name="iconName" type="ui" size="lg" :style="{ color: iconColor }" />
        </div>

        <!-- Content -->
        <div class="toast-content">
            <div v-if="toast.title" class="toast-title">{{ toast.title }}</div>
            <div v-if="toast.message" class="toast-message">{{ toast.message }}</div>
        </div>

        <!-- Action Button -->
        <button v-if="toast.action" class="toast-action-btn" @click.stop="handleAction">
            {{ toast.action.label }}
        </button>

        <!-- Close Button -->
        <button v-if="toast.dismissible" class="toast-close-btn" @click.stop="handleDismiss" aria-label="Close">
            <Icon name="close" type="ui" size="sm" />
        </button>
    </div>
</template>

<style lang="scss" scoped>
@use '@/styles/utils/mixins.scss' as *;

.lugand-toast {
    display: flex;
    align-items: flex-start;
    padding: var(--spacing-md);
    gap: var(--spacing-sm);
    min-width: 300px;
    max-width: 450px;
    background: var(--color-bg-primary);
    border-radius: var(--radius-md);
    @include elevate('md');
    border-left: 4px solid transparent;
    pointer-events: auto;
    transition: all 0.3s ease;

    // Types
    &.type-default {
        border-left-color: var(--color-border);
    }

    &.type-info {
        border-left-color: var(--color-info);
        background: rgba(#2196F3, 0.8);
    }

    &.type-success {
        border-left-color: var(--color-success);
        background: rgba(#4CAF50, 0.8);
    }

    &.type-warning {
        border-left-color: var(--color-warning);
        background: rgba(#FFC107, 0.8);
    }

    &.type-error {
        border-left-color: var(--color-error);
        background: rgba(#F44336, 0.8);
    }

    .toast-icon {
        flex-shrink: 0;
        background: var(--color-bg-primary);
        border-radius: 50%;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        @include elevate('sm');
    }

    .toast-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 6px;

        .toast-title {
            background: var(--color-bg-primary);
            padding: 2px 8px;
            border-radius: var(--radius-sm);
            width: fit-content;
            font-weight: var(--font-weight-bold);
            font-size: var(--font-size-sm);
            color: var(--color-text-primary);
            @include elevate('sm');
        }

        .toast-message {
            background: var(--color-bg-primary);
            padding: 4px 8px;
            border-radius: var(--radius-sm);
            width: fit-content;
            font-size: var(--font-size-sm);
            color: var(--color-text-secondary);
            line-height: 1.4;
            opacity: 0.95; // Levemente opaco mas legível
            @include elevate('sm');
        }
    }

    .toast-action-btn {
        background: var(--color-bg-primary); // Background contrast
        border: 1px solid var(--color-border);
        border-radius: var(--radius-sm);
        padding: 4px 8px;
        font-size: var(--font-size-xs);
        font-weight: var(--font-weight-bold);
        color: var(--color-text-primary);
        cursor: pointer;
        align-self: center;
        margin-left: var(--spacing-xs);
        white-space: nowrap;
        @include elevate('sm');

        &:hover {
            opacity: 0.9;
        }
    }

    .toast-close-btn {
        background: var(--color-bg-primary); // Contrast bubble
        border: none;
        color: var(--color-text-secondary);
        cursor: pointer;
        padding: 4px;
        margin: -4px -4px 0 0;
        border-radius: var(--radius-full);
        display: flex;
        align-items: center;
        justify-content: center;
        @include elevate('sm');

        &:hover {
            background-color: var(--color-bg-secondary);
            color: var(--color-text-primary);
        }
    }
}
</style>
