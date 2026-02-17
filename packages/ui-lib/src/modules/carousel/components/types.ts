/**
 * Carousel Types
 */

export type CarouselDirection = 'horizontal' | 'vertical'
export type CarouselEffect = 'slide' | 'fade'

export interface CarouselProps {
    /** Índice atual do slide (v-model) */
    modelValue?: number
    /** Auto-play habilitado */
    autoPlay?: boolean
    /** Intervalo do auto-play (ms) */
    interval?: number
    /** Loop infinito */
    loop?: boolean
    /** Habilita swipe/touch */
    swipeable?: boolean
    /** Pausa auto-play no hover */
    pauseOnHover?: boolean
    /** Direção do carousel */
    direction?: CarouselDirection
    /** Efeito de transição */
    effect?: CarouselEffect
    /** Duração da transição (ms) */
    transitionDuration?: number
}

export interface CarouselEmits {
    /** Atualiza o índice do slide */
    'update:modelValue': [index: number]
    /** Emitido quando o slide muda */
    'change': [index: number, previousIndex: number]
    /** Emitido quando o slide termina a transição */
    'afterChange': [index: number]
}

export interface CarouselSlotProps {
    /** Índice atual */
    current: number
    /** Total de slides */
    total: number
    /** Vai para o slide anterior */
    prev: () => void
    /** Vai para o próximo slide */
    next: () => void
    /** Vai para um slide específico */
    goTo: (index: number) => void
    /** Se está em auto-play */
    isPlaying: boolean
    /** Inicia auto-play */
    play: () => void
    /** Para auto-play */
    pause: () => void
}
