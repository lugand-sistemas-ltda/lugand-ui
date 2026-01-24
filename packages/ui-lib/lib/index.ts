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

// Modal Module
export { Modal, useModal, useConfirmModal } from '../src/modules/modal'
export type { ModalSize, ModalVariant, ModalProps, ModalEmits } from '../src/modules/modal/components/types'

// Toast Module
export { ToastItem, ToastProvider, useToast } from '../src/modules/toast'
export type { ToastOptions, ToastType, ToastPosition, ToastAction } from '../src/modules/toast/components/types'

// Charts Module
export {
    BaseChart,
    ChartLegend,
    LineChart,
    BarChart,
    PieChart,
    AreaChart,
    ScatterChart,
    GraphChart,
    useChart
} from '../src/modules/charts'

export type {
    BaseChartProps,
    ChartOptions,
    ChartVariant,
    LegendPosition,
    LineChartData,
    BarChartData,
    PieChartData,
    AreaChartData,
    ScatterChartData,
    GraphChartData,
    Dataset,
    ChartEvents,
    ChartEventData,
    ExportFormat
} from '../src/modules/charts/types'

// Data Modules
export { default as DynamicForm } from '../src/modules/DynamicForm/DynamicForm.vue'
export type { FormField } from '../src/modules/DynamicForm/DynamicForm.vue'

export { default as DataTable } from '../src/modules/DataTable/DataTable.vue'
export type { DataTableProps, TableColumn } from '../src/modules/DataTable/types'

// Layout Modules
export { DefaultLayout, Navbar, NavItem, NavLink } from '../src/modules/layouts'

// AppShell Module
export { default as AppLayout } from '../src/modules/AppShell/AppLayout.vue'
export { default as AppHeader } from '../src/modules/AppShell/components/AppHeader.vue'
export { default as AppFooter } from '../src/modules/AppShell/components/AppFooter.vue'
export { default as ThemeSelector } from '../src/modules/AppShell/components/ThemeSelector.vue'

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
    BulkActionBar,

    // Display
    Icon,
    Avatar,
    Badge,
    Card,
    MediaCard,
    Skeleton,
    Tooltip,

    // Feedback
    Spinner,
    Alert,
    AlertDialog,

    // Layout
    ComponentShowcase,
    CodeBlock,
    GridContainer,
    ScrollContainer,

    // Navigation
    Pagination,

    // Forms
    Switch,
    Radio,
    RadioGroup,
} from '../src/shared/components/index'

// ============================================
// COMPOSABLES
// ============================================
export {
    // Theme & UI
    useTheme,

    // Loading
    useLoading,

    // Forms & Inputs
    useDateInput,

    // CRUD & Data Management
    useCrudStore,

    // Selection & Bulk Actions
    useSelection,
    useBulkActions,

    // Validation
    useValidation,
    required,
    minLength,
    maxLength,
    min,
    max,
    email,
    url,
    pattern,
    matches,
    oneOf,

    // Search
    useSearch,

    // Sorting
    useSorting,

    // Pagination
    usePagination,

    // Table State
    useTableState
} from '../src/shared/composables/index.ts'

export type {
    // Selection Types
    UseSelectionOptions,
    UseSelectionReturn,

    // Bulk Actions Types
    BulkActionVariant,
    BulkActionDefinition,
    BulkActionsState,
    UseBulkActionsOptions,
    UseBulkActionsReturn
} from '../src/shared/composables/index.ts'

// ============================================
// TYPES
// ============================================
export type { ThemeName } from '../src/core/types/theme.types.ts'
export type { Theme } from '../src/core/config/themes.config.ts'

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
