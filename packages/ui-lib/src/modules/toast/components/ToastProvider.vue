<script setup lang="ts">
import { useToast } from '../composables/useToast'
import ToastItem from './ToastItem.vue'
import type { ToastPosition } from './types'

const { getToastsByPosition } = useToast()

const positions: ToastPosition[] = [
    'top-left',
    'top-center',
    'top-right',
    'bottom-left',
    'bottom-center',
    'bottom-right'
]
</script>

<template>
    <div class="toast-provider">
        <div v-for="pos in positions" :key="pos" :class="['toast-container', `pos-${pos}`]">
            <TransitionGroup :name="pos.includes('top') ? 'toast-slide-top' : 'toast-slide-bottom'">
                <ToastItem v-for="toast in getToastsByPosition(pos)" :key="toast.id" :toast="toast" />
            </TransitionGroup>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.toast-provider {
    pointer-events: none; // Allow clicking through the full screen overlay
    z-index: 9999;
}

.toast-container {
    position: fixed;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 16px;
    max-height: 100vh;
    overflow: hidden;
    pointer-events: none; // Individual toasts will create pointer events

    // Horizontal Alignment
    &.pos-top-left,
    &.pos-bottom-left {
        left: 0;
        align-items: flex-start;
    }

    &.pos-top-center,
    &.pos-bottom-center {
        left: 50%;
        transform: translateX(-50%);
        align-items: center;
    }

    &.pos-top-right,
    &.pos-bottom-right {
        right: 0;
        align-items: flex-end;
    }

    // Vertical Alignment & Direction
    &.pos-top-left,
    &.pos-top-center,
    &.pos-top-right {
        top: 64px; // Navbar/Header height offset
        // Using reverse or column depends on list order logic. 
        // We push new items to end of array.
        // top: [1, 2, 3] -> 1 (oldest) at top, 3 (newest) at bottom? 
        // Standard notification (like macOS): Newest at top.
        // So we should reverse column? 
        // Let's stick to simple column for now as per previous logic, but add top offset.
        flex-direction: column;
    }

    &.pos-bottom-left,
    &.pos-bottom-center,
    &.pos-bottom-right {
        bottom: 0;
        // For bottom, we want stack growing UP.
        // [1, 2, 3] -> 1 is oldest. 3 is newest.
        // We want 1 at bottom, 2 above it, 3 above that? Or strict stack?
        // Usually newest appears at bottom edge.
        flex-direction: column-reverse;
    }
}

// Transitions
// Top
.toast-slide-top-enter-active,
.toast-slide-top-leave-active,
.toast-slide-bottom-enter-active,
.toast-slide-bottom-leave-active {
    transition: all 0.3s ease;
}

.toast-slide-top-enter-from,
.toast-slide-top-leave-to {
    opacity: 0;
    transform: translateY(-20px);
}

// Bottom
.toast-slide-bottom-enter-from,
.toast-slide-bottom-leave-to {
    opacity: 0;
    transform: translateY(20px);
}
</style>
