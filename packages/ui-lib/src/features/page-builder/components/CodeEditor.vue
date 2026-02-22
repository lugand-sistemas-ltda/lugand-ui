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
import type { PageSchema } from '../../../core/schema-system/types'

// ============================================
// PROPS & EMITS
// ============================================

interface Props {
  schema: PageSchema
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:schema': [schema: PageSchema]
}>()

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

<style scoped>
.code-editor {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--surface-2);
}

/* ============================================
   TOOLBAR
   ============================================ */

.code-editor__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-sm) var(--space-md);
  background: var(--surface-3);
  border-bottom: 1px solid var(--border);
}

.format-selector {
  padding: var(--space-xs) var(--space-sm);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--surface-1);
  color: var(--text-1);
  font-size: var(--text-sm);
  cursor: pointer;
}

.toolbar__actions {
  display: flex;
  gap: var(--space-sm);
}

/* ============================================
   CODE DISPLAY
   ============================================ */

.code-editor__content {
  flex: 1;
  margin: 0;
  padding: var(--space-md);
  background: #1e1e1e;
  color: #d4d4d4;
  font-family: 'Fira Code', 'Consolas', 'Monaco', monospace;
  font-size: var(--text-sm);
  line-height: 1.6;
  overflow: auto;
  white-space: pre;
  tab-size: 2;
}

.code-editor__content code {
  font-family: inherit;
  font-size: inherit;
}

/* Custom Scrollbar */
.code-editor__content::-webkit-scrollbar {
  width: 12px;
  height: 12px;
}

.code-editor__content::-webkit-scrollbar-track {
  background: #2d2d2d;
}

.code-editor__content::-webkit-scrollbar-thumb {
  background: #4d4d4d;
  border-radius: 6px;
}

.code-editor__content::-webkit-scrollbar-thumb:hover {
  background: #5d5d5d;
}
</style>
