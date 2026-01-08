<script setup lang="ts">
/**
 * Tooltip Component
 * Wrapper simples que exibe um balão de texto ao passar o mouse.
 * CSS-only para performance e simplicidade.
 */
interface Props {
    text: string
    position?: 'top' | 'bottom' | 'left' | 'right'
}

withDefaults(defineProps<Props>(), {
    position: 'top'
})
</script>

<template>
    <div class="tooltip-wrapper">
        <slot />
        <span class="tooltip-bubble" :class="`tooltip--${position}`" role="tooltip">
            {{ text }}
        </span>
    </div>
</template>

<style lang="scss" scoped>
.tooltip-wrapper {
    position: relative;
    display: inline-flex;
    cursor: help; // Indicates interaction

    &:hover .tooltip-bubble {
        opacity: 1;
        visibility: visible;
        transform: translate(var(--tx), var(--ty));
    }
}

.tooltip-bubble {
    position: absolute;
    z-index: 1000; // Need global variable? var(--z-tooltip)
    background-color: var(--neutral-800, #333);
    color: var(--color-bg-primary, #fff);
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
    line-height: 1.2;
    border-radius: var(--radius-sm, 4px);
    white-space: nowrap;
    pointer-events: none;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.2s, transform 0.2s;
    box-shadow: var(--shadow-sm);

    // Position Logic
    &.tooltip--top {
        bottom: 100%;
        left: 50%;
        background-color: var(--neutral-900, #000);
        margin-bottom: 6px;
        --tx: -50%;
        --ty: 0;
        transform: translate(-50%, 4px); // Start state for animation
    }

    &.tooltip--bottom {
        top: 100%;
        left: 50%;
        background-color: var(--neutral-900, #000);
        margin-top: 6px;
        --tx: -50%;
        --ty: 0;
        transform: translate(-50%, -4px);
    }

    &.tooltip--left {
        right: 100%;
        top: 50%;
        background-color: var(--neutral-900, #000);
        margin-right: 6px;
        --tx: 0;
        --ty: -50%;
        transform: translate(4px, -50%);
    }

    &.tooltip--right {
        left: 100%;
        top: 50%;
        background-color: var(--neutral-900, #000);
        margin-left: 6px;
        --tx: 0;
        --ty: -50%;
        transform: translate(-4px, -50%);
    }

    // Seta do Tooltip (Pseudo-element)
    &::after {
        content: '';
        position: absolute;
        border-style: solid;
        border-width: 4px;

        // Default invisible borders
        border-color: transparent;
    }

    // Arrow logic
    &.tooltip--top::after {
        top: 100%;
        left: 50%;
        margin-left: -4px;
        border-top-color: var(--neutral-900, #000);
    }

    &.tooltip--bottom::after {
        bottom: 100%;
        left: 50%;
        margin-left: -4px;
        border-bottom-color: var(--neutral-900, #000);
    }

    &.tooltip--left::after {
        left: 100%;
        top: 50%;
        margin-top: -4px;
        border-left-color: var(--neutral-900, #000);
    }

    &.tooltip--right::after {
        right: 100%;
        top: 50%;
        margin-top: -4px;
        border-right-color: var(--neutral-900, #000);
    }
}
</style>