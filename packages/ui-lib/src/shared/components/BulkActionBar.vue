<script setup lang="ts" generic="T">
import { computed } from 'vue'
import type { BulkActionDefinition } from '@/shared/composables'
import Btn from './primitives/Btn.vue'
import Icon from './display/Icon.vue'

export interface BulkActionBarProps<T = any> {
    /** Registered bulk actions to display */
    actions: BulkActionDefinition<T>[]
    /** Current selection */
    selection: T[]
    /** Whether any action is currently executing */
    loading?: boolean
    /** Disable all actions */
    disabled?: boolean
}

const props = withDefaults(defineProps<BulkActionBarProps<T>>(), {
    loading: false,
    disabled: false
})

const emit = defineEmits<{
    execute: [actionId: string]
}>()

/**
 * Get available actions based on current selection
 */
const availableActions = computed(() => {
    const selectionCount = props.selection.length

    return props.actions.filter((action) => {
        // Check minSelection
        if (action.minSelection && selectionCount < action.minSelection) {
            return false
        }

        // Check maxSelection
        if (action.maxSelection && selectionCount > action.maxSelection) {
            return false
        }

        // Check custom disabled condition
        if (typeof action.disabled === 'function' && action.disabled(props.selection)) {
            return false
        }

        return true
    })
})

/**
 * Handle action click
 */
function handleActionClick(actionId: string): void {
    emit('execute', actionId)
}

/**
 * Map bulk action variant to Btn variant
 */
function mapVariant(variant?: string): 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline' {
    if (variant === 'warning' || variant === 'success') return 'outline'
    if (variant === 'primary' || variant === 'danger' || variant === 'ghost') return variant
    return 'outline'
}
</script>

<template>
    <div class="bulk-action-bar" v-if="availableActions.length > 0">
        <div class="bulk-action-bar__info">
            <span class="bulk-action-bar__count">
                {{ selection.length }} selected
            </span>
        </div>

        <div class="bulk-action-bar__actions">
            <Btn v-for="action in availableActions" :key="action.id" :variant="mapVariant(action.variant)" size="sm"
                :disabled="loading || disabled" @click="handleActionClick(action.id)">
                <Icon v-if="action.icon" :name="action.icon" type="ui" size="sm" class="bulk-action-bar__icon" />
                {{ action.label }}
            </Btn>
        </div>
    </div>
</template>

<style scoped>
.bulk-action-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-md);
    padding: var(--spacing-sm) var(--spacing-md);
    background-color: var(--color-surface-secondary);
    border-radius: var(--radius-md);
    border: 1px solid var(--color-border);
}

.bulk-action-bar__info {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
}

.bulk-action-bar__count {
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-semibold);
    color: var(--color-text-primary);
}

.bulk-action-bar__actions {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
}

.bulk-action-bar__icon {
    display: inline-flex;
    align-items: center;
    margin-right: var(--spacing-xs);
    width: 16px;
    height: 16px;
}
</style>
