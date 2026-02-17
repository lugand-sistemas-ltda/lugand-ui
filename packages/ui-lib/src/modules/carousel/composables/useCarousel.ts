import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import type { MaybeRef } from 'vue'

export interface UseCarouselOptions {
    /** Total de slides (pode ser ref ou número) */
    totalSlides: MaybeRef<number>
    /** Índice inicial */
    initialIndex?: number
    /** Auto-play habilitado */
    autoPlay?: boolean
    /** Intervalo do auto-play (ms) */
    interval?: number
    /** Loop infinito */
    loop?: boolean
    /** Callback quando muda de slide */
    onChange?: (index: number, previousIndex: number) => void
}

export function useCarousel(options: UseCarouselOptions) {
    const {
        totalSlides: totalSlidesOption,
        initialIndex = 0,
        autoPlay = false,
        interval = 3000,
        loop = true,
        onChange
    } = options

    // Normaliza totalSlides para sempre ser um ref
    const totalSlides = computed(() => {
        return typeof totalSlidesOption === 'number'
            ? totalSlidesOption
            : totalSlidesOption.value
    })

    // State
    const currentIndex = ref(initialIndex)
    const previousIndex = ref(initialIndex)
    const isPlaying = ref(autoPlay)
    const isTransitioning = ref(false)
    let autoPlayTimer: ReturnType<typeof setInterval> | null = null

    // Computed
    const isFirstSlide = computed(() => currentIndex.value === 0)
    const isLastSlide = computed(() => currentIndex.value === totalSlides.value - 1)
    const canGoNext = computed(() => loop || !isLastSlide.value)
    const canGoPrev = computed(() => loop || !isFirstSlide.value)

    // Methods
    function next() {
        if (!canGoNext.value) return

        previousIndex.value = currentIndex.value

        if (isLastSlide.value && loop) {
            currentIndex.value = 0
        } else if (!isLastSlide.value) {
            currentIndex.value++
        }

        triggerChange()
    }

    function prev() {
        if (!canGoPrev.value) return

        previousIndex.value = currentIndex.value

        if (isFirstSlide.value && loop) {
            currentIndex.value = totalSlides.value - 1
        } else if (!isFirstSlide.value) {
            currentIndex.value--
        }

        triggerChange()
    }

    function goTo(index: number) {
        if (index < 0 || index >= totalSlides.value || index === currentIndex.value) return

        previousIndex.value = currentIndex.value
        currentIndex.value = index
        triggerChange()
    }

    function triggerChange() {
        isTransitioning.value = true
        onChange?.(currentIndex.value, previousIndex.value)

        // Reset transitioning state after animation
        setTimeout(() => {
            isTransitioning.value = false
        }, 300)
    }

    function play() {
        if (isPlaying.value || !autoPlay) return
        isPlaying.value = true
        startAutoPlay()
    }

    function pause() {
        isPlaying.value = false
        stopAutoPlay()
    }

    function startAutoPlay() {
        if (!autoPlay || autoPlayTimer) return

        autoPlayTimer = setInterval(() => {
            if (isPlaying.value) {
                next()
            }
        }, interval)
    }

    function stopAutoPlay() {
        if (autoPlayTimer) {
            clearInterval(autoPlayTimer)
            autoPlayTimer = null
        }
    }

    // Lifecycle
    onMounted(() => {
        if (autoPlay && isPlaying.value) {
            startAutoPlay()
        }
    })

    onUnmounted(() => {
        stopAutoPlay()
    })

    // Watch para mudanças no total de slides
    watch(totalSlides, (newTotal) => {
        if (currentIndex.value >= newTotal) {
            currentIndex.value = Math.max(0, newTotal - 1)
        }
    })

    return {
        // State
        currentIndex,
        previousIndex,
        isPlaying,
        isTransitioning,

        // Computed
        isFirstSlide,
        isLastSlide,
        canGoNext,
        canGoPrev,

        // Methods
        next,
        prev,
        goTo,
        play,
        pause
    }
}
