/**
 * Exports de composables compartilhados
 */

// Theme & UI
export { useTheme } from './useTheme'

// Disclosure (open/close state management)
export { useDisclosure, useDisclosureGroup, useControlledDisclosure } from './useDisclosure'
export type { UseDisclosureOptions, UseDisclosureReturn } from './useDisclosure'

// Tabs (navigation state management)
export { useTabs } from './useTabs'
export type { UseTabsOptions, UseTabsReturn, TabOrientation, TabVariant } from './useTabs'

// Forms & Inputs
export { useDateInput } from './useDateInput'
export type { UseDateInputOptions, UseDateInputReturn, DateInputType, DateOutputFormat } from './useDateInput'

// Loading
export { useLoading } from './useLoading'
export type { UseLoadingOptions, UseLoadingReturn } from './useLoading'

// CRUD & Data Management
export { useCrudStore } from './useCrudStore'
export type { CrudEntity, CrudStoreOptions } from './useCrudStore'

// Validation
export {
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
  oneOf
} from './useValidation'
export type { ValidationRule, ValidationRules, ValidationErrors } from './useValidation'

// Search
export { useSearch } from './useSearch'
export type { SearchOptions } from './useSearch'

// Sorting
export { useSorting } from './useSorting'
export type { SortDirection, SortingOptions } from './useSorting'

// Pagination
export { usePagination } from './usePagination'
export type { PaginationOptions } from './usePagination'

// Table State (combines search + sort + pagination)
export { useTableState } from './useTableState'
export type { TableStateOptions } from './useTableState'

// Selection & Bulk Actions
export { useSelection } from './useSelection'
export type { UseSelectionOptions, UseSelectionReturn } from './useSelection'

export { useBulkActions } from './useBulkActions'
export type {
  BulkActionVariant,
  BulkActionDefinition,
  BulkActionsState,
  UseBulkActionsOptions,
  UseBulkActionsReturn
} from './useBulkActions'

