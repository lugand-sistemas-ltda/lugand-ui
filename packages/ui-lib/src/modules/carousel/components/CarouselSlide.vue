<script setup lang="ts">
/**
 * CarouselSlide - Slide individual do carousel
 * 
 * Wrapper simples que aceita qualquer conteúdo via slot.
 * Registra-se automaticamente no Carousel pai.
 */
import { inject, onMounted, onBeforeUnmount, computed, ref } from 'vue'

const carousel = inject<{
    registerSlide: () => number
    unregisterSlide: (index: number) => void
    currentIndex: () => number
} | null>('carousel', null)

const slideIndex = ref<number>(-1)

// Auto-registro no carousel pai
onMounted(() => {
    if (carousel) {
        slideIndex.value = carousel.registerSlide()
    }
})

onBeforeUnmount(() => {
    if (carousel && slideIndex.value !== -1) {
        carousel.unregisterSlide(slideIndex.value)
    }
})

const isActive = computed(() => {
    return carousel ? carousel.currentIndex() === slideIndex.value : false
})
</script>

<template>
    <div class="carousel-slide" :class="{ 'carousel-slide--active': isActive }">
        <slot />
    </div>
</template>

<style lang="scss" scoped>
.carousel-slide {
    flex: 0 0 100%;
    width: 100%;
    min-height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;

    // Previne seleção de imagem durante swipe
    img {
        pointer-events: none;
        user-select: none;
        -webkit-user-drag: none;
    }

    // Para efeito fade
    .carousel--fade & {
        opacity: 0;
        position: absolute;
        top: 0;
        left: 0;

        &--active {
            opacity: 1;
            position: relative;
        }
    }
}
</style>
