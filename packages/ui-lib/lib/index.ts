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
    Input,
    Textarea,
    Checkbox,
    Select,
    Scrollable,

    // Navigation
    NavLink,
    NavItem,
    Navbar,

    // Display
    Icon,
    Avatar,
    Badge,
    Card,
    MediaCard,
    Skeleton,
    Tooltip,

    // Feedback
    ToastProvider,
    ToastItem,

    // Layout
    ComponentShowcase,
    CodeBlock,
    GridContainer,
    ScrollContainer
} from '../src/shared/components/index'

// ============================================
// COMPOSABLES
// ============================================
export {
    useTheme,
    useToast
} from '../src/shared/composables/index.ts'

// ============================================
// TYPES
// ============================================
export type { ThemeName } from '../src/core/types/theme.types.ts'
export type { Theme } from '../src/core/config/themes.config.ts'
export type { ToastOptions, ToastType, ToastPosition, ToastAction } from '../src/shared/components/feedback/Toast/types.ts'

// ============================================
// CONFIGS & CONSTANTS
// ============================================
export { themes, themeList } from '../src/core/config/themes.config.ts'
export { UI_ICONS, type UiIconName } from '../src/core/constants/ui-icons.ts'
export { BRANDS, type BrandName } from '../src/core/constants/brands.ts'
export {
    EMOJI_MAP as EMOJIS,
    type EmojiName,
    SMILEYS_PEOPLE,
    ANIMALS_NATURE,
    FOOD_DRINK,
    ACTIVITIES,
    TRAVEL_PLACES,
    OBJECTS,
    SYMBOLS,
    FLAGS
} from '../src/core/constants/emojis.ts'

// ============================================
// VERSION
// ============================================
export const version = '0.1.0'
