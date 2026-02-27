<template>
  <div class="code-editor">
    <!-- Toolbar -->
    <div class="code-editor__toolbar">
      <select v-model="format" class="format-selector">
        <option value="json">JSON</option>
        <option value="typescript">TypeScript</option>
        <option value="vue">Vue SFC</option>
      </select>

      <div class="toolbar__actions">
        <Button variant="ghost" size="sm" @click="copyToClipboard">
          📋 Copy
        </Button>
        <Button variant="ghost" size="sm" @click="downloadFile">
          💾 Download
        </Button>
      </div>
    </div>

    <!-- Code Display -->
    <pre class="code-editor__content"><code>{{ formattedCode }}</code></pre>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Button } from '../../../shared/components'
import type { PageSchema } from '../types'

// ============================================
// PROPS & EMITS
// ============================================

interface Props {
  schema: PageSchema
}

const props = defineProps<Props>()

// Emit declarado para uso futuro (ex: edição de código)
// const emit = defineEmits<{
//   'update:schema': [schema: PageSchema]
// }>()

// ============================================
// STATE
// ============================================

const format = ref<'json' | 'typescript' | 'vue'>('json')

// ============================================
// COMPUTED
// ============================================

const formattedCode = computed(() => {
  switch (format.value) {
    case 'json':
      return JSON.stringify(props.schema, null, 2)

    case 'typescript':
      return generateTypeScript()

    case 'vue':
      return generateVue()

    default:
      return JSON.stringify(props.schema, null, 2)
  }
})

// ============================================
// METHODS
// ============================================

function generateTypeScript(): string {
  return `import type { PageSchema } from '@lugand-sistemas-ltda/vue-ui-lib'

export const pageSchema: PageSchema = ${JSON.stringify(props.schema, null, 2)}
`
}

function generateVue(): string {
  return `<template>
  <PageRenderer :schema="pageSchema" />
</template>

<script setup lang="ts">
import { PageRenderer } from '@lugand-sistemas-ltda/vue-ui-lib'
import type { PageSchema } from '@lugand-sistemas-ltda/vue-ui-lib'

const pageSchema: PageSchema = ${JSON.stringify(props.schema, null, 2)}
<\/script>
`
}

async function copyToClipboard() {
  try {
    await navigator.clipboard.writeText(formattedCode.value)
    // TODO: Show toast notification
    console.log('Copied to clipboard!')
  } catch (error) {
    console.error('Failed to copy:', error)
  }
}

function downloadFile() {
  const ext = format.value === 'json' ? 'json' : format.value === 'typescript' ? 'ts' : 'vue'
  const filename = `${props.schema.id || 'page'}.${ext}`

  const blob = new Blob([formattedCode.value], {
    type: format.value === 'json' ? 'application/json' : 'text/plain'
  })

  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<style scoped lang="scss">
@use '@/styles/utils/mixins';

.code-editor {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--panel-bg);
}

/* ============================================
   TOOLBAR
   ============================================ */

.code-editor__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--toolbar-bg);
  border-bottom: var(--toolbar-border);
}

.format-selector {
  padding: var(--spacing-xs) var(--spacing-sm);
  border: 1px solid var(--color-border-base);
  border-radius: var(--radius-sm);
  background: var(--color-bg-elevated);
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  cursor: pointer;
  
  &:focus {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }
}

.toolbar__actions {
  display: flex;
  gap: var(--spacing-sm);
}

/* ============================================
   CODE DISPLAY
   ============================================ */

.code-editor__content {
  flex: 1;
  margin: 0;
  padding: var(--editor-padding);
  background: var(--editor-bg);
  color: var(--editor-fg);
  font-family: var(--editor-font-family);
  font-size: var(--editor-font-size);
  line-height: var(--editor-line-height);
  overflow: auto;
  white-space: pre;
  tab-size: 2;
  @include mixins.custom-scrollbar;
}

.code-editor__content code {
  font-family: inherit;
  font-size: inherit;
}
</style>
