import { ref, watch, onMounted } from 'vue'
import type { ThemeName } from '@/core/types/theme.types'

const THEME_STORAGE_KEY = 'app-theme'

// Estado global compartilhado (singleton)
const currentTheme = ref<ThemeName>('light')
let isInitialized = false

/**
 * Aplica o tema no DOM
 */
const applyTheme = (theme: ThemeName) => {
    document.documentElement.dataset.theme = theme
}

/**
 * Salva o tema no localStorage
 */
const saveTheme = (theme: ThemeName) => {
    localStorage.setItem(THEME_STORAGE_KEY, theme)
}

/**
 * Carrega o tema do localStorage
 */
const loadTheme = (): ThemeName => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY)
    return (saved as ThemeName) || 'light'
}

/**
 * Composable para gerenciar temas (singleton)
 * Inicializado uma vez em App.vue, consumido em qualquer componente
 * 
 * @example
 * // Em App.vue (inicializa)
 * useTheme()
 * 
 * @example
 * // Em qualquer componente (consome)
 * const { currentTheme, setTheme } = useTheme()
 */
export function useTheme() {
    /**
     * Altera o tema atual
     */
    const setTheme = (theme: ThemeName) => {
        currentTheme.value = theme
        applyTheme(theme)
        saveTheme(theme)
    }

    /**
     * Alterna entre light e dark
     */
    const toggleDarkMode = () => {
        setTheme(currentTheme.value === 'dark' ? 'light' : 'dark')
    }

    // Inicializa apenas uma vez (na primeira chamada = App.vue)
    if (!isInitialized) {
        isInitialized = true

        // Watch para mudanças no tema
        watch(currentTheme, (newTheme) => {
            applyTheme(newTheme)
            saveTheme(newTheme)
        })

        // Carrega tema salvo ao montar
        onMounted(() => {
            const savedTheme = loadTheme()
            currentTheme.value = savedTheme
            applyTheme(savedTheme)
        })
    }

    return {
        currentTheme,
        setTheme,
        toggleDarkMode,
    }
}