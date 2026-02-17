/**
 * Carousel Module
 * 
 * Componente de slides/carrossel com auto-play, swipe, keyboard navigation
 */

export { default as Carousel } from './components/Carousel.vue'
export { default as CarouselSlide } from './components/CarouselSlide.vue'
export { useCarousel } from './composables/useCarousel'
export type {
    CarouselProps,
    CarouselEmits,
    CarouselSlotProps,
    CarouselDirection,
    CarouselEffect
} from './components/types'
