<script setup lang="ts">
/**
 * Carousel - Componente de slides/carrossel
 * 
 * Features:
 * - Auto-play com intervalo configurável
 * - Loop infinito
 * - Swipe/Touch support
 * - Keyboard navigation (←/→)
 * - Pause on hover
 * - Transições suaves
 * - Slots customizáveis para navegação e indicators
 * - Scoped slots expõem métodos (prev, next, goTo)
 * - v-model para índice atual
 * - Zero dependências externas
 */
import { ref, computed, provide, watch, onMounted, onBeforeUnmount } from 'vue'
import { useCarousel } from '../composables/useCarousel'
import { Button } from '@/shared/components'

// Props & Emits (inline para evitar problemas com TypeScript resolution)
interface Props {
    modelValue?: number
    autoPlay?: boolean
    interval?: number
    loop?: boolean
    swipeable?: boolean
    pauseOnHover?: boolean
    direction?: 'horizontal' | 'vertical'
    effect?: 'slide' | 'fade'
    transitionDuration?: number
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: 0,
    autoPlay: false,
    interval: 3000,
    loop: true,
    swipeable: true,
    pauseOnHover: true,
    direction: 'horizontal',
    effect: 'slide',
    transitionDuration: 300
})

const emit = defineEmits<{
    'update:modelValue': [index: number]
    'change': [index: number, previousIndex: number]
    'afterChange': [index: number]
}>()

// State
const carouselRef = ref<HTMLElement>()
const trackRef = ref<HTMLElement>()
const slidesCount = ref(0)
const touchStartX = ref(0)
const touchStartY = ref(0)
const touchEndX = ref(0)
const touchEndY = ref(0)
const isDragging = ref(false)

// Composable
const carousel = useCarousel({
    totalSlides: slidesCount, // Passa o ref, não o .value
    initialIndex: props.modelValue,
    autoPlay: props.autoPlay,
    interval: props.interval,
    loop: props.loop,
    onChange: (index, previousIndex) => {
        emit('update:modelValue', index)
        emit('change', index, previousIndex)

        setTimeout(() => {
            emit('afterChange', index)
        }, props.transitionDuration)
    }
})

// Computed
const translateValue = computed(() => {
    const offset = carousel.currentIndex.value * -100
    return props.direction === 'horizontal'
        ? `translateX(${offset}%)`
        : `translateY(${offset}%)`
})

const transitionStyle = computed(() => {
    if (isDragging.value) return 'none'

    return props.effect === 'fade'
        ? `opacity ${props.transitionDuration}ms ease-in-out`
        : `transform ${props.transitionDuration}ms ease-in-out`
})

// Slot props para expor métodos e estado
interface SlotProps {
    current: number
    total: number
    prev: () => void
    next: () => void
    goTo: (index: number) => void
    isPlaying: boolean
    play: () => void
    pause: () => void
}

const slotProps = computed<SlotProps>(() => ({
    current: carousel.currentIndex.value,
    total: slidesCount.value,
    prev: carousel.prev,
    next: carousel.next,
    goTo: carousel.goTo,
    isPlaying: carousel.isPlaying.value,
    play: carousel.play,
    pause: carousel.pause
}))

// Provide para CarouselSlide
provide('carousel', {
    registerSlide: () => {
        const index = slidesCount.value
        slidesCount.value++
        return index
    },
    unregisterSlide: (_index: number) => {
        slidesCount.value--
    },
    currentIndex: () => carousel.currentIndex.value
})

// Watch v-model externo
watch(() => props.modelValue, (newIndex) => {
    if (newIndex !== carousel.currentIndex.value) {
        carousel.goTo(newIndex)
    }
})

// Watch slides count para atualizar composable
watch(slidesCount, (newCount) => {
    if (carousel.currentIndex.value >= newCount) {
        carousel.goTo(Math.max(0, newCount - 1))
    }
})

// Swipe/Touch support com eventos passivos
function handleTouchStart(e: TouchEvent) {
    if (!props.swipeable || !e.touches[0]) return

    touchStartX.value = e.touches[0].clientX
    touchStartY.value = e.touches[0].clientY
    isDragging.value = true

    if (props.pauseOnHover) {
        carousel.pause()
    }
}

function handleTouchMove(e: TouchEvent) {
    if (!props.swipeable || !isDragging.value || !e.touches[0]) return

    touchEndX.value = e.touches[0].clientX
    touchEndY.value = e.touches[0].clientY
}

function handleTouchEnd() {
    if (!props.swipeable || !isDragging.value) return

    const diffX = touchStartX.value - touchEndX.value
    const diffY = touchStartY.value - touchEndY.value
    const threshold = 50

    if (props.direction === 'horizontal') {
        if (Math.abs(diffX) > threshold) {
            if (diffX > 0) {
                carousel.next()
            } else {
                carousel.prev()
            }
        }
    } else {
        if (Math.abs(diffY) > threshold) {
            if (diffY > 0) {
                carousel.next()
            } else {
                carousel.prev()
            }
        }
    }

    isDragging.value = false

    if (props.autoPlay && props.pauseOnHover) {
        carousel.play()
    }
}

// Keyboard navigation
function handleKeydown(e: KeyboardEvent) {
    if (props.direction === 'horizontal') {
        if (e.key === 'ArrowLeft') {
            e.preventDefault()
            carousel.prev()
        } else if (e.key === 'ArrowRight') {
            e.preventDefault()
            carousel.next()
        }
    } else {
        if (e.key === 'ArrowUp') {
            e.preventDefault()
            carousel.prev()
        } else if (e.key === 'ArrowDown') {
            e.preventDefault()
            carousel.next()
        }
    }
}

// Pause on hover
function handleMouseEnter() {
    if (props.pauseOnHover && props.autoPlay) {
        carousel.pause()
    }
}

function handleMouseLeave() {
    if (props.pauseOnHover && props.autoPlay) {
        carousel.play()
    }
}

// Lifecycle
onMounted(() => {
    if (carouselRef.value) {
        carouselRef.value.addEventListener('keydown', handleKeydown)
    }

    // Touch events com passive para melhor performance
    if (trackRef.value && props.swipeable) {
        trackRef.value.addEventListener('touchstart', handleTouchStart as EventListener, { passive: true })
        trackRef.value.addEventListener('touchmove', handleTouchMove as EventListener, { passive: true })
        trackRef.value.addEventListener('touchend', handleTouchEnd as EventListener, { passive: true })
    }
})

onBeforeUnmount(() => {
    if (carouselRef.value) {
        carouselRef.value.removeEventListener('keydown', handleKeydown)
    }

    if (trackRef.value) {
        trackRef.value.removeEventListener('touchstart', handleTouchStart as EventListener)
        trackRef.value.removeEventListener('touchmove', handleTouchMove as EventListener)
        trackRef.value.removeEventListener('touchend', handleTouchEnd as EventListener)
    }
})
</script>

<template>
    <div ref="carouselRef" class="carousel" :class="[
        `carousel--${direction}`,
        `carousel--${effect}`,
        { 'carousel--dragging': isDragging }
    ]" tabindex="0" role="region" aria-roledescription="carousel"
        :aria-label="`Carousel com ${slidesCount} slides`" @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave">
        <!-- Slides Track -->
        <div ref="trackRef" class="carousel__track" :style="{
            transform: effect === 'slide' ? translateValue : undefined,
            transition: transitionStyle
        }">
            <slot name="slides">
                <!-- Fallback: Default slot -->
                <slot />
            </slot>
        </div>

        <!-- Navigation -->
        <slot name="navigation" v-bind="slotProps">
            <!-- Default Navigation (usa nossos Buttons) -->
            <div class="carousel__navigation">
                <Button v-if="carousel.canGoPrev.value" variant="ghost" size="sm"
                    class="carousel__nav-btn carousel__nav-btn--prev" :aria-label="`Ir para slide anterior`"
                    @click="carousel.prev">
                    {{ direction === 'horizontal' ? '◀' : '▲' }}
                </Button>

                <Button v-if="carousel.canGoNext.value" variant="ghost" size="sm"
                    class="carousel__nav-btn carousel__nav-btn--next" :aria-label="`Ir para próximo slide`"
                    @click="carousel.next">
                    {{ direction === 'horizontal' ? '▶' : '▼' }}
                </Button>
            </div>
        </slot>

        <!-- Indicators -->
        <slot name="indicators" v-bind="slotProps">
            <!-- Default Dots -->
            <div class="carousel__indicators" role="tablist">
                <button v-for="i in slidesCount" :key="i" class="carousel__indicator"
                    :class="{ 'carousel__indicator--active': carousel.currentIndex.value === i - 1 }" role="tab"
                    :aria-label="`Ir para slide ${i}`" :aria-selected="carousel.currentIndex.value === i - 1"
                    @click="carousel.goTo(i - 1)" />
            </div>
        </slot>
    </div>
</template>

<style lang="scss" scoped>
.carousel {
    position: relative;
    width: 100%;
    overflow: hidden;
    outline: none;

    &:focus-visible {
        outline: 2px solid var(--color-primary);
        outline-offset: 2px;
    }

    // Horizontal
    &--horizontal {
        .carousel__track {
            display: flex;
            flex-direction: row;
        }
    }

    // Vertical
    &--vertical {
        height: 400px; // Default height for vertical

        .carousel__track {
            display: flex;
            flex-direction: column;
            height: 100%;
        }

        .carousel__navigation {
            flex-direction: column;
            top: 50%;
            left: var(--spacing-md);
            transform: translateY(-50%);
        }

        .carousel__indicators {
            flex-direction: column;
            right: var(--spacing-md);
            bottom: auto;
            top: 50%;
            transform: translateY(-50%);
        }
    }

    // Fade effect
    &--fade {
        .carousel__track {
            display: block;
            position: relative;
        }

        :deep(.carousel-slide) {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0;
            transition: opacity var(--transition-duration, 300ms) ease-in-out;

            &:first-child {
                position: relative;
            }
        }

        // Slides serão controlados via classes no CarouselSlide
    }

    // Dragging state
    &--dragging {
        cursor: grabbing;

        .carousel__track {
            transition: none !important;
        }
    }
}

.carousel__track {
    width: 100%;
    will-change: transform;
    cursor: grab;

    &:active {
        cursor: grabbing;
    }
}

.carousel__navigation {
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    transform: translateY(-50%);
    display: flex;
    justify-content: space-between;
    padding: 0 var(--spacing-md);
    pointer-events: none;
    z-index: 10;
}

.carousel__nav-btn {
    pointer-events: auto;
    background: rgba(255, 255, 255, 0.9) !important;
    backdrop-filter: blur(8px);
    box-shadow: var(--shadow-md);
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
    transition: all 0.2s;

    &:hover {
        background: rgba(255, 255, 255, 1) !important;
        transform: scale(1.1);
    }

    &:active {
        transform: scale(0.95);
    }

    &--prev {
        margin-right: auto;
    }

    &--next {
        margin-left: auto;
    }
}

.carousel__indicators {
    position: absolute;
    bottom: var(--spacing-md);
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: var(--spacing-xs);
    z-index: 10;
}

.carousel__indicator {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 0.8);
    background: rgba(255, 255, 255, 0.3);
    cursor: pointer;
    transition: all 0.3s;
    padding: 0;

    &:hover {
        background: rgba(255, 255, 255, 0.6);
        transform: scale(1.2);
    }

    &--active {
        background: rgba(255, 255, 255, 1);
        width: 24px;
        border-radius: 5px;
    }

    &:focus-visible {
        outline: 2px solid var(--color-primary);
        outline-offset: 2px;
    }
}

// Responsive
@media (max-width: 768px) {
    .carousel__nav-btn {
        width: 32px;
        height: 32px;
        font-size: 1rem;
    }

    .carousel__navigation {
        padding: 0 var(--spacing-sm);
    }

    .carousel__indicators {
        bottom: var(--spacing-sm);
    }

    .carousel__indicator {
        width: 8px;
        height: 8px;

        &--active {
            width: 20px;
        }
    }
}
</style>
