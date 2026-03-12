<!--
  PropEditor.vue — Low-Code Engine Sprint 6

  Renderiza o campo de edição adequado para cada tipo de PropDefinition.
  Um switch sobre PropDefinition.type gera o input correto:

  | PropDefinition.type | Campo renderizado                          |
  |---------------------|--------------------------------------------|
  | string              | <input type="text"> ou <textarea>          |
  | number              | <input type="number"> com min/max/step     |
  | boolean             | <input type="checkbox"> (toggle)           |
  | select              | <select> com options                       |
  | multiselect         | Lista de checkboxes                        |
  | color               | <input type="color"> + input de texto      |
  | icon                | Input de texto (Sprint 7: icon picker)     |
  | responsive          | input com mini-tabs de breakpoint          |
  | data-binding        | DataBindingEditor (Sprint 8)               |
  | columns-config      | ColumnsConfigEditor (Sprint 8)             |

  EMITS:
  - update:modelValue — novo valor da prop ao mudar

  USO (direto):
  ```vue
  <PropEditor
    :definition="propDef"
    v-model="node.props[propDef.key]"
    :active-breakpoint="activeBreakpoint"
  />
  ```
-->
<template>
  <div class="lg-prop-editor" :class="`lg-prop-editor--${definition.type}`">
    <!-- Label -->
    <label class="lg-prop-editor__label">
      {{ definition.label }}
      <span v-if="definition.required" class="lg-prop-editor__required" title="Required">*</span>
      <span
        v-if="definition.description"
        class="lg-prop-editor__help"
        :title="definition.description"
      >?</span>
    </label>

    <!-- ── string ─────────────────────────────────── -->
    <textarea
      v-if="definition.type === 'string' && definition.multiline"
      class="lg-prop-editor__input lg-prop-editor__textarea"
      :value="(modelValue as string) ?? definition.defaultValue"
      :placeholder="definition.placeholder"
      :maxlength="definition.maxLength"
      rows="3"
      @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    />
    <input
      v-else-if="definition.type === 'string'"
      type="text"
      class="lg-prop-editor__input"
      :value="(modelValue as string) ?? definition.defaultValue"
      :placeholder="definition.placeholder"
      :maxlength="definition.maxLength"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />

    <!-- ── number ─────────────────────────────────── -->
    <div v-else-if="definition.type === 'number'" class="lg-prop-editor__number-wrap">
      <input
        type="number"
        class="lg-prop-editor__input lg-prop-editor__input--number"
        :value="(modelValue as number) ?? definition.defaultValue"
        :min="definition.min"
        :max="definition.max"
        :step="definition.step ?? 1"
        @input="emit('update:modelValue', Number(($event.target as HTMLInputElement).value))"
      />
      <span v-if="definition.unit" class="lg-prop-editor__unit">{{ definition.unit }}</span>
    </div>

    <!-- ── boolean ────────────────────────────────── -->
    <label v-else-if="definition.type === 'boolean'" class="lg-prop-editor__toggle">
      <input
        type="checkbox"
        class="lg-prop-editor__toggle-input"
        :checked="(modelValue as boolean) ?? definition.defaultValue"
        @change="emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
      />
      <span class="lg-prop-editor__toggle-track" />
    </label>

    <!-- ── select ─────────────────────────────────── -->
    <select
      v-else-if="definition.type === 'select'"
      class="lg-prop-editor__select"
      :value="(modelValue as string) ?? definition.defaultValue"
      @change="emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    >
      <option
        v-for="opt in definition.options"
        :key="opt.value"
        :value="opt.value"
      >
        {{ opt.label }}
      </option>
    </select>

    <!-- ── multiselect ────────────────────────────── -->
    <div v-else-if="definition.type === 'multiselect'" class="lg-prop-editor__multiselect">
      <label
        v-for="opt in definition.options"
        :key="opt.value"
        class="lg-prop-editor__multiselect-item"
      >
        <input
          type="checkbox"
          :checked="((modelValue as string[]) ?? definition.defaultValue).includes(opt.value)"
          @change="handleMultiselectChange(opt.value, ($event.target as HTMLInputElement).checked)"
        />
        {{ opt.label }}
      </label>
    </div>

    <!-- ── color ──────────────────────────────────── -->
    <div v-else-if="definition.type === 'color'" class="lg-prop-editor__color-wrap">
      <input
        type="color"
        class="lg-prop-editor__color-swatch"
        :value="colorHexValue"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />
      <input
        type="text"
        class="lg-prop-editor__input lg-prop-editor__input--color-text"
        :value="(modelValue as string) ?? definition.defaultValue"
        placeholder="#000000 or var(--color)"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />
    </div>

    <!-- ── icon ───────────────────────────────────── -->
    <input
      v-else-if="definition.type === 'icon'"
      type="text"
      class="lg-prop-editor__input"
      :value="(modelValue as string) ?? definition.defaultValue"
      placeholder="Icon name…"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />

    <!-- ── responsive ─────────────────────────────── -->
    <div v-else-if="definition.type === 'responsive'" class="lg-prop-editor__responsive">
      <div class="lg-prop-editor__responsive-tabs">
        <button
          v-for="bp in BREAKPOINT_LIST"
          :key="bp.key"
          class="lg-prop-editor__responsive-tab"
          :class="{ 'lg-prop-editor__responsive-tab--active': activeResponsiveBp === bp.key }"
          :title="bp.label"
          @click="activeResponsiveBp = bp.key as ActiveBreakpoint"
        >
          {{ bp.icon }}
        </button>
      </div>
      <!-- Select para responsive com options -->
      <select
        v-if="definition.valueType === 'select'"
        class="lg-prop-editor__select"
        :value="responsiveValue"
        @change="handleResponsiveChange(($event.target as HTMLSelectElement).value)"
      >
        <option
          v-for="opt in definition.options"
          :key="opt.value"
          :value="opt.value"
        >
          {{ opt.label }}
        </option>
      </select>
      <!-- Number responsive -->
      <div v-else-if="definition.valueType === 'number'" class="lg-prop-editor__number-wrap">
        <input
          type="number"
          class="lg-prop-editor__input lg-prop-editor__input--number"
          :value="responsiveValue"
          @input="handleResponsiveChange(($event.target as HTMLInputElement).value)"
        />
        <span v-if="definition.unit" class="lg-prop-editor__unit">{{ definition.unit }}</span>
      </div>
      <!-- String responsive -->
      <input
        v-else
        type="text"
        class="lg-prop-editor__input"
        :value="responsiveValue"
        @input="handleResponsiveChange(($event.target as HTMLInputElement).value)"
      />
    </div>

    <!-- ── data-binding ──────────────────────────── -->
    <DataBindingEditor
      v-else-if="definition.type === 'data-binding'"
      :model-value="modelValue"
      @update:model-value="emit('update:modelValue', $event)"
    />

    <!-- ── columns-config ────────────────────────── -->
    <ColumnsConfigEditor
      v-else-if="definition.type === 'columns-config'"
      :model-value="(modelValue as ColumnConfig[]) ?? []"
      @update:model-value="emit('update:modelValue', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { ActiveBreakpoint } from '../types'
import type {
  PropDefinition,
  ResponsivePropDefinition,
  ColumnConfig,
} from '../types/component.types'
import DataBindingEditor from './DataBindingEditor.vue'
import ColumnsConfigEditor from './ColumnsConfigEditor.vue'

// ============================================================
// PROPS
// ============================================================

interface Props {
  /** A definição da propriedade (determina qual campo renderizar) */
  definition: PropDefinition

  /** Valor atual da prop (v-model) */
  modelValue: unknown

  /**
   * Breakpoint ativo no editor.
   * Usado pelo campo 'responsive' para mostrar o valor do breakpoint correto.
   * @default 'base'
   */
  activeBreakpoint?: ActiveBreakpoint
}

const props = withDefaults(defineProps<Props>(), {
  activeBreakpoint: 'base',
})

const emit = defineEmits<{
  'update:modelValue': [value: unknown]
}>()

// ============================================================
// BREAKPOINTS (para campos responsive)
// ============================================================

const BREAKPOINT_LIST = [
  { key: 'base', icon: '🖥', label: 'Base (all sizes)' },
  { key: 'lg',   icon: '💻', label: 'Laptop (lg)'      },
  { key: 'md',   icon: '📱', label: 'Tablet (md)'      },
  { key: 'sm',   icon: '📲', label: 'Mobile (sm)'      },
] as const

/** Breakpoint selecionado dentro deste campo responsive (local ao campo) */
const activeResponsiveBp = ref<ActiveBreakpoint>(props.activeBreakpoint)

// ============================================================
// COLOR
// ============================================================

/**
 * O <input type="color"> só aceita valores hex (#rrggbb).
 * Se o valor é uma CSS var ou token, exibe #000000 como fallback.
 */
const colorHexValue = computed(() => {
  const val = (props.modelValue as string | undefined) ?? ''
  return /^#[0-9a-fA-F]{3,6}$/.test(val) ? val : '#000000'
})

// ============================================================
// MULTISELECT
// ============================================================

function handleMultiselectChange(optValue: string, checked: boolean) {
  const def = props.definition
  if (def.type !== 'multiselect') return
  const current: string[] = Array.isArray(props.modelValue)
    ? [...(props.modelValue as string[])]
    : [...def.defaultValue]

  if (checked && !current.includes(optValue)) {
    current.push(optValue)
  } else if (!checked) {
    const idx = current.indexOf(optValue)
    if (idx !== -1) current.splice(idx, 1)
  }
  emit('update:modelValue', current)
}

// ============================================================
// RESPONSIVE
// ============================================================

/**
 * Para campos 'responsive', o modelValue é um objeto:
 * { base: 'value', sm: 'value', md: 'value', ... }
 * Lê o valor do breakpoint ativo.
 */
const responsiveValue = computed(() => {
  const def = props.definition as ResponsivePropDefinition
  if (typeof props.modelValue === 'object' && props.modelValue !== null) {
    return (props.modelValue as Record<string, string>)[activeResponsiveBp.value]
      ?? def.defaultValue
  }
  return def.defaultValue
})

function handleResponsiveChange(newVal: string) {
  const existing =
    typeof props.modelValue === 'object' && props.modelValue !== null
      ? { ...(props.modelValue as Record<string, string>) }
      : {}
  existing[activeResponsiveBp.value] = newVal
  emit('update:modelValue', existing)
}
</script>

<style scoped>
/* ── Root ─────────────────────────────────────────── */
.lg-prop-editor {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

/* ── Label ────────────────────────────────────────── */
.lg-prop-editor__label {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 500;
  color: var(--lg-prop-label-color, #6b7280);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  cursor: default;
}

.lg-prop-editor__required {
  color: var(--lg-danger, #ef4444);
  font-size: 12px;
  line-height: 1;
}

.lg-prop-editor__help {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--lg-border, #e5e7eb);
  font-size: 9px;
  color: var(--lg-muted, #9ca3af);
  cursor: help;
  margin-left: 2px;
}

/* ── Base input ───────────────────────────────────── */
.lg-prop-editor__input,
.lg-prop-editor__select,
.lg-prop-editor__textarea {
  width: 100%;
  padding: 5px 8px;
  border: 1px solid var(--lg-border, #d1d5db);
  border-radius: 4px;
  font-size: 12px;
  color: var(--lg-text, #111827);
  background: #fff;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.15s, box-shadow 0.15s;
  font-family: inherit;
}

.lg-prop-editor__input:focus,
.lg-prop-editor__select:focus,
.lg-prop-editor__textarea:focus {
  border-color: var(--lg-accent, #3b82f6);
  box-shadow: 0 0 0 2px var(--lg-accent-light, #dbeafe);
}

.lg-prop-editor__textarea {
  resize: vertical;
  min-height: 60px;
  line-height: 1.5;
}

.lg-prop-editor__select {
  cursor: pointer;
  appearance: auto;
}

/* ── Number ───────────────────────────────────────── */
.lg-prop-editor__number-wrap {
  display: flex;
  align-items: center;
  gap: 4px;
}

.lg-prop-editor__input--number {
  flex: 1;
}

.lg-prop-editor__unit {
  font-size: 11px;
  color: var(--lg-muted, #9ca3af);
  flex-shrink: 0;
  min-width: 24px;
}

/* ── Boolean toggle ───────────────────────────────── */
.lg-prop-editor__toggle {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  gap: 6px;
  user-select: none;
}

.lg-prop-editor__toggle-input {
  display: none;
}

.lg-prop-editor__toggle-track {
  display: inline-block;
  width: 32px;
  height: 18px;
  border-radius: 9px;
  background: var(--lg-border, #d1d5db);
  position: relative;
  transition: background 0.2s;
}

.lg-prop-editor__toggle-track::after {
  content: '';
  position: absolute;
  left: 2px;
  top: 2px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 2px rgba(0,0,0,0.2);
  transition: transform 0.2s;
}

.lg-prop-editor__toggle-input:checked + .lg-prop-editor__toggle-track {
  background: var(--lg-accent, #3b82f6);
}

.lg-prop-editor__toggle-input:checked + .lg-prop-editor__toggle-track::after {
  transform: translateX(14px);
}

/* ── Multiselect ──────────────────────────────────── */
.lg-prop-editor__multiselect {
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-height: 120px;
  overflow-y: auto;
  padding: 4px;
  border: 1px solid var(--lg-border, #d1d5db);
  border-radius: 4px;
  background: #fff;
}

.lg-prop-editor__multiselect-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--lg-text, #111827);
  cursor: pointer;
  padding: 2px 4px;
  border-radius: 3px;
}

.lg-prop-editor__multiselect-item:hover {
  background: var(--lg-toolbar-hover-bg, #f3f4f6);
}

/* ── Color ────────────────────────────────────────── */
.lg-prop-editor__color-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
}

.lg-prop-editor__color-swatch {
  width: 28px;
  height: 28px;
  padding: 1px;
  border: 1px solid var(--lg-border, #d1d5db);
  border-radius: 4px;
  cursor: pointer;
  background: none;
  flex-shrink: 0;
}

.lg-prop-editor__input--color-text {
  flex: 1;
}

/* ── Responsive ───────────────────────────────────── */
.lg-prop-editor__responsive {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.lg-prop-editor__responsive-tabs {
  display: flex;
  gap: 2px;
}

.lg-prop-editor__responsive-tab {
  flex: 1;
  padding: 3px;
  font-size: 12px;
  border: 1px solid var(--lg-border, #d1d5db);
  border-radius: 4px;
  background: transparent;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
}

.lg-prop-editor__responsive-tab:hover {
  background: var(--lg-toolbar-hover-bg, #f3f4f6);
}

.lg-prop-editor__responsive-tab--active {
  background: var(--lg-accent-light, #eff6ff);
  border-color: var(--lg-accent, #3b82f6);
}


</style>
