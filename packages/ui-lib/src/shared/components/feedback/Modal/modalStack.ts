/**
 * Modal Stack Manager
 * 
 * Gerencia z-index dinâmico para múltiplos modais abertos simultaneamente
 * Garante que o último modal aberto fique sempre por cima
 */

import { ref } from 'vue'

const BASE_Z_INDEX = 1000
const Z_INDEX_INCREMENT = 10

interface ModalInstance {
    id: symbol
    zIndex: number
}

// Stack global de modais abertos
const modalStack = ref<ModalInstance[]>([])

/**
 * Registra um novo modal no stack e retorna seu z-index
 */
export const registerModal = (): { id: symbol; zIndex: number } => {
    const id = Symbol('modal')
    const zIndex = BASE_Z_INDEX + (modalStack.value.length * Z_INDEX_INCREMENT)

    const instance: ModalInstance = { id, zIndex }
    modalStack.value.push(instance)

    return { id, zIndex }
}

/**
 * Remove um modal do stack
 */
export const unregisterModal = (id: symbol): void => {
    const index = modalStack.value.findIndex(m => m.id === id)
    if (index !== -1) {
        modalStack.value.splice(index, 1)
    }
}

/**
 * Retorna o z-index de um modal específico
 */
export const getModalZIndex = (id: symbol): number => {
    const modal = modalStack.value.find(m => m.id === id)
    return modal?.zIndex ?? BASE_Z_INDEX
}

/**
 * Retorna o número de modais abertos
 */
export const getModalCount = (): number => {
    return modalStack.value.length
}

/**
 * Limpa o stack (útil para testes)
 */
export const clearModalStack = (): void => {
    modalStack.value = []
}
