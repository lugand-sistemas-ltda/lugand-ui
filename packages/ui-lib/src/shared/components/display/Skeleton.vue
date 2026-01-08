<script setup lang="ts">
/**
 * Skeleton Component
 * Placeholder animado para estados de loading.
 */
interface Props {
    width?: string
    height?: string
    variant?: 'rect' | 'circle' | 'text'
    animation?: 'pulse' | 'wave' | 'none'
    borderRadius?: string
}

withDefaults(defineProps<Props>(), {
    width: '100%',
    height: '1rem',
    variant: 'text',
    animation: 'pulse',
})
</script>

<template>
    <div class="skeleton" :class="[`skeleton--${variant}`, `skeleton--${animation}`]" :style="{
        width,
        height: variant === 'text' ? 'auto' : height,
        minHeight: variant === 'text' ? height : undefined,
        borderRadius
    }"></div>
</template>

<style lang="scss" scoped>
.skeleton {
    background-color: var(--color-bg-tertiary, #e2e8f0);
    display: block; // Changed from inline-block to block often better, but inline-block is safer for text.

    // Animation Pulse
    &--pulse {
        animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    // Animation Wave (Shimmer)
    &--wave {
        position: relative;
        overflow: hidden;

        &::after {
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            transform: translateX(-100%);
            background-image: linear-gradient(90deg,
                    rgba(255, 255, 255, 0) 0,
                    rgba(255, 255, 255, 0.2) 20%,
                    rgba(255, 255, 255, 0.5) 60%,
                    rgba(255, 255, 255, 0));
            animation: wave 2s infinite;
        }
    }

    // Variants
    &--text {
        border-radius: var(--radius-sm, 4px);
        margin-bottom: 0.5rem;

        &:last-child {
            margin-bottom: 0;
        }
    }

    &--rect {
        border-radius: var(--radius-md, 8px);
    }

    &--circle {
        border-radius: 50%;
    }
}

@keyframes pulse {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: .5;
    }
}

@keyframes wave {
    100% {
        transform: translateX(100%);
    }
}
</style>