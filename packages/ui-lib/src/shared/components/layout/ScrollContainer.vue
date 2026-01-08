<script setup lang="ts">
/**
 * ScrollContainer - Lista horizontal com scroll snap
 * Perfeito para: Produtos Recomendados, Stories, Categorias
 */
import { ref, onMounted, onUnmounted, watch } from 'vue'

interface Props {
    gap?: 'sm' | 'md' | 'lg' | 'xl'
    snap?: boolean // Se true, o scroll "imanta" nos itens
    showArrows?: boolean // Setas para desktop
    autoplay?: boolean // Rola automaticamente (Marquee effect)
    autoplaySpeed?: number // Pixels por frame
    pauseOnHover?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    gap: 'md',
    snap: true,
    showArrows: true,
    autoplay: false,
    autoplaySpeed: 1,
    pauseOnHover: true
})

const containerRef = ref<HTMLElement | null>(null)
let animationId: number | null = null
let accumulatedScroll = 0
let isHovered = false

function scroll(direction: 'left' | 'right') {
    if (!containerRef.value) return

    const scrollAmount = containerRef.value.clientWidth * 0.75 // Scrolla 75% da tela
    const currentScroll = containerRef.value.scrollLeft

    containerRef.value.scrollTo({
        left: direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount,
        behavior: 'smooth'
    })
}

// Lógica de Autoplay (Marquee)
const startAutoplay = () => {
    if (!props.autoplay || !containerRef.value) return

    const animate = () => {
        if (!containerRef.value) return

        if (!isHovered) {
            accumulatedScroll += props.autoplaySpeed

            if (accumulatedScroll >= 1) {
                const pixelsToScroll = Math.floor(accumulatedScroll)
                containerRef.value.scrollLeft += pixelsToScroll
                accumulatedScroll -= pixelsToScroll
            }

            // Loop infinito
            if (containerRef.value.scrollLeft + containerRef.value.clientWidth >= containerRef.value.scrollWidth - 1) {
                containerRef.value.scrollLeft = 0
            }
        }

        animationId = requestAnimationFrame(animate)
    }

    if (animationId) cancelAnimationFrame(animationId)
    animationId = requestAnimationFrame(animate)
}

const stopAutoplay = () => {
    if (animationId) {
        cancelAnimationFrame(animationId)
        animationId = null
    }
}

// Hooks
onMounted(() => {
    if (props.autoplay) startAutoplay()
})

onUnmounted(() => {
    stopAutoplay()
})

watch(() => props.autoplay, (newVal) => {
    if (newVal) startAutoplay()
    else stopAutoplay()
})

const onMouseEnter = () => {
    if (props.pauseOnHover) isHovered = true
}

const onMouseLeave = () => {
    if (props.pauseOnHover) isHovered = false
}
</script>

<template>
    <div class="scroll-wrapper" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave">
        <!-- Botão Esquerda (só aparece em Desktop se habilitado e sem autoplay) -->
        <button v-if="showArrows && !autoplay" class="nav-btn nav-prev" @click="scroll('left')"
            aria-label="Scroll left">
            &lsaquo;
        </button>

        <div ref="containerRef" class="scroll-container" :class="[
            `gap-${gap}`,
            { 'snap-active': snap && !autoplay }
        ]">
            <slot />
        </div>

        <!-- Botão Direita -->
        <button v-if="showArrows && !autoplay" class="nav-btn nav-next" @click="scroll('right')"
            aria-label="Scroll right">
            &rsaquo;
        </button>
    </div>
</template>

<style lang="scss" scoped>
.scroll-wrapper {
    position: relative;
    width: 100%;
    display: flex;
    align-items: center;

    // Em mobile, esconder setas (touch é melhor)
    @media (max-width: 768px) {
        .nav-btn {
            display: none;
        }
    }
}

.scroll-container {
    display: flex;
    overflow-x: auto;
    width: 100%;
    padding-bottom: var(--spacing-sm); // Espaço para scrollbar não colar

    // Esconder Scrollbar (Opcional - mas moderno)
    scrollbar-width: none; // Firefox

    &::-webkit-scrollbar {
        display: none;
    }

    // Chrome/Safari

    &.gap-sm {
        gap: var(--spacing-sm);
    }

    &.gap-md {
        gap: var(--spacing-md);
    }

    &.gap-lg {
        gap: var(--spacing-lg);
    }

    &.gap-xl {
        gap: var(--spacing-xl);
    }

    &.snap-active {
        scroll-snap-type: x mandatory;

        // Força filhos a terem snap
        :deep(> *) {
            scroll-snap-align: start;
            flex-shrink: 0; // Impede itens de encolher
        }
    }
}

.nav-btn {
    position: absolute;
    z-index: 2;
    background: var(--color-bg-primary);
    border: 1px solid var(--color-border-base);
    color: var(--color-text-primary);
    width: 40px;
    height: 40px;
    border-radius: 50%;
    box-shadow: var(--shadow-md);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    line-height: 1;
    opacity: 0.8;
    transition: all 0.2s;

    &:hover {
        opacity: 1;
        transform: scale(1.1);
        background: var(--color-bg-secondary);
    }

    &.nav-prev {
        left: -20px;
    }

    &.nav-next {
        right: -20px;
    }
}
</style>
