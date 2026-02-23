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

<style scoped lang="scss">
@use '@/styles/utils/mixins';

.code-editor {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--editor-bg);
  color: var(--editor-fg);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.editor-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--toolbar-bg);
  border-bottom: var(--toolbar-border);
}

.toolbar-left,
.toolbar-right {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.format-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.format-select {
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: var(--font-size-sm);
  background: var(--color-bg-elevated);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border-base);
  border-radius: var(--radius-sm);
  cursor: pointer;
  
  &:focus {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }
}

.editor-content {
  flex: 1;
  overflow: auto;
  padding: var(--editor-padding);
  @include mixins.custom-scrollbar;
}

.code-block {
  margin: 0;
  font-family: var(--editor-font-family);
  font-size: var(--editor-font-size);
  line-height: var(--editor-line-height);
  white-space: pre;
  tab-size: 2;
}

.code-block code {
  color: var(--editor-fg);
}
</style>
