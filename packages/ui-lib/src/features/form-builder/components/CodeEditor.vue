<template>
  <div class="code-editor">
    <div class="editor-toolbar">
      <div class="toolbar-left">
        <span class="format-label">Format:</span>
        <select v-model="exportFormat" class="format-select">
          <option value="json">JSON</option>
          <option value="typescript">TypeScript</option>
          <option value="vue">Vue SFC</option>
        </select>
      </div>
      <div class="toolbar-right">
        <Button size="sm" variant="secondary" @click="copyToClipboard">
          📋 Copy
        </Button>
        <Button size="sm" @click="downloadFile">
          💾 Download
        </Button>
      </div>
    </div>

    <div class="editor-content">
      <pre class="code-block"><code>{{ formattedCode }}</code></pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Button } from '../../../shared/components'
import type { FormSchema } from '../../form-renderer/types'

interface Props {
  schema: FormSchema
}

interface Emits {
  (e: 'update:schema', schema: FormSchema): void
}

const props = defineProps<Props>()
defineEmits<Emits>()

const exportFormat = ref<'json' | 'typescript' | 'vue'>('json')

const formattedCode = computed(() => {
  switch (exportFormat.value) {
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

function generateTypeScript(): string {
  const json = JSON.stringify(props.schema, null, 2)
  return `import type { FormSchema } from '@lugand-sistemas-ltda/vue-ui-lib'

export const formSchema: FormSchema = ${json}
`
}

function generateVue(): string {
  const json = JSON.stringify(props.schema, null, 2)
  return `<template>
  <FormRenderer
    :schema="schema"
    @submit="handleSubmit"
  />
</template>

<script setup lang="ts">
import { FormRenderer } from '@lugand-sistemas-ltda/vue-ui-lib'
import type { FormSchema } from '@lugand-sistemas-ltda/vue-ui-lib'

const schema: FormSchema = ${json}

function handleSubmit(data: Record<string, any>) {
  console.log('Form submitted:', data)
}
<\/script>
`
}

async function copyToClipboard() {
  try {
    await navigator.clipboard.writeText(formattedCode.value)
    console.log('Copied to clipboard!')
  } catch (error) {
    console.error('Failed to copy:', error)
  }
}

function downloadFile() {
  const extensions = {
    json: 'json',
    typescript: 'ts',
    vue: 'vue'
  }

  const ext = extensions[exportFormat.value]
  const filename = `${props.schema.id || 'form'}.${ext}`

  const blob = new Blob([formattedCode.value], { type: 'text/plain' })
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
  background: var(--surface-color, #1e1e1e);
  color: #d4d4d4;
  border-radius: 0.5rem;
  overflow: hidden;
}

.editor-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background: #2d2d2d;
  border-bottom: 1px solid #3e3e3e;
}

.toolbar-left,
.toolbar-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.format-label {
  font-size: 0.875rem;
  color: #8c8c8c;
}

.format-select {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  background: #1e1e1e;
  color: #d4d4d4;
  border: 1px solid #3e3e3e;
  border-radius: 0.25rem;
  cursor: pointer;
}

.editor-content {
  flex: 1;
  overflow: auto;
  padding: 1rem;
}

.code-block {
  margin: 0;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 0.875rem;
  line-height: 1.6;
  white-space: pre;
  tab-size: 2;
}

.code-block code {
  color: #d4d4d4;
}

/* Dark theme scrollbar */
.editor-content::-webkit-scrollbar {
  width: 12px;
  height: 12px;
}

.editor-content::-webkit-scrollbar-track {
  background: #1e1e1e;
}

.editor-content::-webkit-scrollbar-thumb {
  background: #424242;
  border-radius: 6px;
}

.editor-content::-webkit-scrollbar-thumb:hover {
  background: #4e4e4e;
}
</style>
