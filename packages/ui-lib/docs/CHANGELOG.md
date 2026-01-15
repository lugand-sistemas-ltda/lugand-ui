# 📝 Changelog

All notable changes to the Lugand UI Library.

---

## [0.2.0] - 2026-01-15

### 🎉 Added

**Hybrid Input Architecture**

- `NumericTextInput.vue` - New primitive that guarantees `type="text"` with numeric validation
- Conditional rendering in `MaskInput` (numeric masks → NumericTextInput, alphanumeric → Input)
- Range validation in `DateSegmentedInput` (HH: 00-23, mm: 00-59, DD: 01-31, MM: 01-12)

**Security Improvements**

- ✅ Date inputs now block letters completely (no browser quirks)
- ✅ Range validation prevents invalid time values (99:99 → blocked)
- ✅ Visual feedback on invalid input (immediate removal)
- ✅ Mobile-friendly with `inputmode="numeric"`

### 🔧 Changed

**MaskInput.vue**

- Now detects mask type (numeric vs alphanumeric)
- Uses `NumericTextInput` for CPF, CNPJ, Phone, Date masks
- Uses `Input.vue` for alphanumeric masks (vehicle plates)

**DateSegmentedInput.vue**

- Replaced native `<input>` with `NumericTextInput` components
- Added range validation handlers
- Improved error messaging

### 🐛 Fixed

- **DateInput** accepting letters temporarily (type="date" browser behavior)
- **DateSegmentedInput** accepting invalid hour/minute values (HH: 99, mm: 99)
- **Date validation** now works correctly across all date input types

### 📚 Documentation

- Reorganized documentation into `/docs` folder
- Created comprehensive guides:
  - `README.md` - Overview and quick start
  - `ARCHITECTURE.md` - Project structure and patterns
  - `COMPONENTS.md` - Complete component API reference
  - `THEMES.md` - Theming system guide
- Removed outdated/temporary documentation files

---

## [0.1.0] - 2025-12-XX

### 🎉 Initial Release

**Core Components**

- `Btn`, `Input`, `Textarea`, `Select`
- `Checkbox`, `Switch`, `Radio`, `RadioGroup`
- `Card`, `Badge`, `Avatar`, `MediaCard`
- `GridContainer`, `ScrollContainer`
- `Toast`, `Modal`
- `Tabs`, `Breadcrumbs`

**Form Components**

- `DateInput`, `DateSegmentedInput`, `DateSelectInput`
- `CurrencyInput`, `MaskInput`

**Theming System**

- 10 pre-built themes (default, dark, ocean, forest, cyberpunk, dracula, bombeiros, pcpr, pretona, viatura)
- `useTheme()` composable for dynamic theme switching
- CSS variables for customization

**Modules**

- `AppShell` - Application layout system
- `DataTable` - Sortable, filterable table
- `DynamicForm` - Schema-based form builder

**Infrastructure**

- Vue 3 + TypeScript + Vite
- SCSS with design tokens
- Composition API throughout
- Tree-shakeable exports

---

## Semantic Versioning

This project follows [Semantic Versioning](https://semver.org/):

- **MAJOR** version for incompatible API changes
- **MINOR** version for new functionality (backward-compatible)
- **PATCH** version for bug fixes (backward-compatible)

---

## Migration Guides

### 0.1.x → 0.2.0

**No breaking changes.** All components remain backward-compatible.

**Enhancements:**

- Date inputs now have better security (automatic)
- DateSegmentedInput has range validation (automatic)
- MaskInput uses specialized primitives (automatic)

**Optional Updates:**

- If using custom date inputs, consider migrating to `NumericTextInput` for consistency
- Review any custom mask patterns for compatibility

---

## Roadmap

### 0.3.0 (Planned)

- [ ] Accessibility audit (WCAG 2.1 AA compliance)
- [ ] Unit tests (Vitest)
- [ ] E2E tests (Playwright)
- [ ] Internationalization (i18n)
- [ ] More form components (ColorInput, FileInput, RichTextInput)

### 0.4.0 (Planned)

- [ ] Animation system
- [ ] Enhanced DataTable (virtual scrolling, filtering, export)
- [ ] Form validation library integration
- [ ] Storybook documentation

### 1.0.0 (Future)

- [ ] Stable API
- [ ] Complete test coverage
- [ ] Performance optimizations
- [ ] Comprehensive documentation
- [ ] Production-ready for all use cases

---

## Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for development guidelines.

---

## License

MIT © Lugand Sistemas
