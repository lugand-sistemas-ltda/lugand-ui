import type { ThemeName } from '@/core/types/theme.types'

/**
 * Configuração de temas disponíveis
 * As cores estão definidas em SCSS (src/styles/themes/*.scss)
 * Aqui apenas listamos os temas disponíveis para type-safety
 */

export interface Theme {
    name: ThemeName
    displayName: string
}

/**
 * Tema Light - Claro e clean
 */
export const lightTheme: Theme = {
    name: 'light',
    displayName: 'Light',
}

/**
 * Tema Dark - Escuro e elegante
 */
export const darkTheme: Theme = {
    name: 'dark',
    displayName: 'Dark',
}

/**
 * Tema Ocean - Tons de azul e verde-água
 */
export const oceanTheme: Theme = {
    name: 'ocean',
    displayName: 'Ocean',
}

/**
 * Tema Forest - Tons de verde natureza
 */
export const forestTheme: Theme = {
    name: 'forest',
    displayName: 'Forest',
}

/**
 * Tema Dracula - Escuro e purpúreo
 */
export const draculaTheme: Theme = {
    name: 'dracula',
    displayName: 'Dracula',
}

/**
 * Tema Cyberpunk - High Contrast Neon
 */
export const cyberpunkTheme: Theme = {
    name: 'cyberpunk',
    displayName: 'Cyberpunk',
}

/**
 * Tema PCPR - Polícia Civil PR
 */
export const pcprTheme: Theme = {
    name: 'pcpr',
    displayName: 'PCPR Oficial',
}

/**
 * Tema Pretona - ROTAM Dark/Tactical
 */
export const pretonaTheme: Theme = {
    name: 'pretona',
    displayName: 'PMPR Tático',
}

/**
 * Tema Bombeiros - CBPR Oficial
 */
export const bombeirosTheme: Theme = {
    name: 'bombeiros',
    displayName: 'Bombeiros',
}

/**
 * Todos os temas disponíveis
 */
export const themes: Record<ThemeName, Theme> = {
    light: lightTheme,
    dark: darkTheme,
    ocean: oceanTheme,
    forest: forestTheme,
    dracula: draculaTheme,
    cyberpunk: cyberpunkTheme,
    pcpr: pcprTheme,
    pretona: pretonaTheme,
    bombeiros: bombeirosTheme,
} as const

/**
 * Array de temas para iteração
 */
export const themeList: Theme[] = Object.values(themes)

