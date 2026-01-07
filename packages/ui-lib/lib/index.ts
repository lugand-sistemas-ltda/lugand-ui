/**
 * Vue UI Library - Entry Point Principal
 * 
 * Este é o ponto de entrada da biblioteca quando instalada via npm.
 * Exporta todos os componentes, composables, tipos e configurações.
 * 
 * @packageDocumentation
 */

// Importar estilos globais (serão extraídos para dist/style.css)
import './styles.scss'

// ============================================
// MODULES - Componentes Complexos e Modulares
// ============================================
export { default as DynamicForm } from '@/modules/DynamicForm/DynamicForm.vue'
export type { FormField } from '@/modules/DynamicForm/DynamicForm.vue'

export { default as DataTable } from '@/modules/DataTable/DataTable.vue'
export type { DataTableProps, TableColumn } from '@/modules/DataTable/types'

export { default as AppLayout } from '@/modules/AppShell/AppLayout.vue'
export { default as AppHeader } from '@/modules/AppShell/components/AppHeader.vue'
export { default as AppFooter } from '@/modules/AppShell/components/AppFooter.vue'
export { default as ThemeSelector } from '@/modules/AppShell/components/ThemeSelector.vue'

// ============================================
// SHARED - Componentes Atômicos e Utilitários
// ============================================
export {
    // Primitives
    Btn,
    BtnToggle,
    // Input, // Exportado individualmente abaixo
    // Textarea, // Exportado individualmente abaixo
    // Checkbox, // Exportado individualmente abaixo
    // Select, // Exportado individualmente abaixo
    // Scrollable, // Exportado individualmente abaixo

    // Form
    // DynamicForm, // Exportado individualmente abaixo

    // Navigation
    // NavLink, // Exportado individualmente abaixo
    // NavItem, // Exportado individualmente abaixo
    // Navbar, // Exportado individualmente abaixo

    // Layout
    // AppHeader, // Exportado individualmente abaixo
    // AppFooter, // Exportado individualmente abaixo
    // AppLayout, // Exportado individualmente abaixo
    // ThemeSwitcher, // Exportado individualmente abaixo
    // ComponentShowcase, // Exportado individualmente abaixo
    // CodeBlock, // Exportado individualmente abaixo
} from '../src/shared/components/index'

export { default as Input } from '../src/shared/components/primitives/Input.vue'
export { default as Textarea } from '../src/shared/components/primitives/Textarea.vue'
export { default as Checkbox } from '../src/shared/components/primitives/Checkbox.vue'
export { default as Select } from '../src/shared/components/primitives/Select.vue'
export { default as Scrollable } from '../src/shared/components/primitives/Scrollable.vue'

// ============================================
// SHARED - Navigation
// ============================================
export { default as NavLink } from '../src/shared/components/navigation/NavLink.vue'
export { default as NavItem } from '../src/shared/components/navigation/NavItem.vue'
export { default as Navbar } from '../src/shared/components/navigation/Navbar.vue'

// ============================================
// SHARED - Layout & Utils
// ============================================
export { default as ComponentShowcase } from '../src/shared/components/layout/ComponentShowcase.vue'
export { default as CodeBlock } from '../src/shared/components/layout/CodeBlock.vue'

// ============================================
// COMPOSABLES
// ============================================
export { useTheme } from '../src/shared/composables/useTheme.ts'

// ============================================
// TYPES
// ============================================
export type { ThemeName } from '../src/core/types/theme.types.ts'
export type { Theme } from '../src/core/config/themes.config.ts'

// ============================================
// CONFIGS
// ============================================
export { themes, themeList } from '../src/core/config/themes.config.ts'

// ============================================
// VERSION
// ============================================
export const version = '0.1.0'
