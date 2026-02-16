<template>
    <div class="timeline-item" :class="[
        `timeline-item--${status}`,
        `timeline-item--${orientation}`,
        { 'timeline-item--clickable': clickable }
    ]" @click="handleClick">
        <!-- Dot/Icon -->
        <div class="timeline-item__dot">
            <slot name="icon">
                <span v-if="icon" class="timeline-item__icon">{{ icon }}</span>
                <div v-else class="timeline-item__dot-default"></div>
            </slot>
        </div>

        <!-- Line connector -->
        <div v-if="!isLast" class="timeline-item__line"></div>

        <!-- Content -->
        <div class="timeline-item__content">
            <!-- Header -->
            <div class="timeline-item__header">
                <h4 v-if="title || $slots.title" class="timeline-item__title">
                    <slot name="title">{{ title }}</slot>
                </h4>
                <span v-if="timestamp || $slots.timestamp" class="timeline-item__timestamp">
                    <slot name="timestamp">{{ timestamp }}</slot>
                </span>
            </div>

            <!-- Description -->
            <div v-if="description || $slots.description" class="timeline-item__description">
                <slot name="description">{{ description }}</slot>
            </div>

            <!-- Default slot for custom content -->
            <div v-if="$slots.default" class="timeline-item__body">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
interface Props {
    /** Título do evento */
    title?: string
    /** Descrição do evento */
    description?: string
    /** Timestamp formatado */
    timestamp?: string
    /** Ícone (emoji ou componente) */
    icon?: string
    /** Status do evento */
    status?: 'completed' | 'current' | 'pending' | 'error' | 'warning'
    /** É o último item? (remove linha conectora) */
    isLast?: boolean
    /** Orientação herdada do Timeline pai */
    orientation?: 'vertical' | 'horizontal'
    /** Item clicável? */
    clickable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    status: 'completed',
    isLast: false,
    orientation: 'vertical',
    clickable: false,
})

const emit = defineEmits<{
    click: []
}>()

const handleClick = () => {
    if (props.clickable) {
        emit('click')
    }
}
</script>

<style scoped lang="scss">
.timeline-item {
    position: relative;
    display: flex;
    gap: var(--spacing-md);

    &__dot {
        flex-shrink: 0;
        position: relative;
        z-index: 1;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        background: var(--color-bg-secondary);
        border: 2px solid var(--color-border);
        transition: all var(--transition-normal);
    }

    &__dot-default {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: var(--color-text-tertiary);
        transition: background var(--transition-normal);
    }

    &__icon {
        font-size: 1rem;
        display: block;
    }

    &__line {
        position: absolute;
        background: var(--color-border);
        transition: background var(--transition-normal);
    }

    &__content {
        flex: 1;
        padding-bottom: var(--spacing-xl);
        min-width: 0;
    }

    &__header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: var(--spacing-md);
        margin-bottom: var(--spacing-xs);
    }

    &__title {
        margin: 0;
        font-size: 1rem;
        font-weight: 600;
        color: var(--color-text-primary);
    }

    &__timestamp {
        font-size: 0.8125rem;
        color: var(--color-text-tertiary);
        white-space: nowrap;
    }

    &__description {
        font-size: 0.875rem;
        color: var(--color-text-secondary);
        margin-bottom: var(--spacing-sm);
        line-height: 1.5;
    }

    &__body {
        margin-top: var(--spacing-sm);
    }

    // ORIENTAÇÃO VERTICAL (padrão)
    &--vertical {
        flex-direction: row;

        .timeline-item__line {
            left: 15px;
            top: 32px;
            bottom: calc(var(--spacing-xl) * -1);
            width: 2px;
        }

        .timeline-item__content {
            padding-bottom: var(--spacing-xl);
        }
    }

    // ORIENTAÇÃO HORIZONTAL
    &--horizontal {
        flex-direction: column;
        align-items: center;
        text-align: center;
        min-width: 200px;

        .timeline-item__line {
            top: 15px;
            left: 32px;
            right: -100%;
            height: 2px;
        }

        .timeline-item__header {
            flex-direction: column;
            align-items: center;
            gap: var(--spacing-xs);
        }

        .timeline-item__content {
            padding-bottom: 0;
        }
    }

    // STATUS: COMPLETED
    &--completed {
        .timeline-item__dot {
            background: var(--color-success-bg);
            border-color: var(--color-success);
        }

        .timeline-item__dot-default {
            background: var(--color-success);
        }

        .timeline-item__line {
            background: var(--color-success);
        }
    }

    // STATUS: CURRENT
    &--current {
        .timeline-item__dot {
            background: var(--color-primary-bg);
            border-color: var(--color-primary);
            box-shadow: 0 0 0 4px var(--color-primary-bg);
        }

        .timeline-item__dot-default {
            background: var(--color-primary);
        }

        .timeline-item__title {
            color: var(--color-primary);
            font-weight: 700;
        }
    }

    // STATUS: PENDING
    &--pending {
        .timeline-item__dot {
            background: var(--color-bg-secondary);
            border-color: var(--color-border);
        }

        .timeline-item__dot-default {
            background: var(--color-text-tertiary);
        }

        .timeline-item__title,
        .timeline-item__description {
            opacity: 0.6;
        }
    }

    // STATUS: ERROR
    &--error {
        .timeline-item__dot {
            background: var(--color-error-bg);
            border-color: var(--color-error);
        }

        .timeline-item__dot-default {
            background: var(--color-error);
        }

        .timeline-item__title {
            color: var(--color-error);
        }
    }

    // STATUS: WARNING
    &--warning {
        .timeline-item__dot {
            background: var(--color-warning-bg);
            border-color: var(--color-warning);
        }

        .timeline-item__dot-default {
            background: var(--color-warning);
        }

        .timeline-item__title {
            color: var(--color-warning);
        }
    }

    // CLICKABLE
    &--clickable {
        cursor: pointer;

        &:hover {
            .timeline-item__dot {
                transform: scale(1.1);
            }

            .timeline-item__title {
                color: var(--color-primary);
            }
        }
    }

    // ÚLTIMO ITEM (sem linha)
    &:last-child {
        .timeline-item__content {
            padding-bottom: 0;
        }
    }
}
</style>
