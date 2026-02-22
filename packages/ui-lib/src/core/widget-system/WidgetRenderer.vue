<template>
  <component :is="widgetComponent" v-if="widgetComponent" v-bind="mergedConfig" :widget-id="schema.id"
    :data-source="schema.dataSource" @widget-event="handleWidgetEvent">
    <!-- Slot para conteúdo customizado -->
    <template v-if="$slots.default" #default="slotProps">
      <slot v-bind="slotProps" />
    </template>
  </component>

  <div v-else class="widget-renderer__error">
    <div class="widget-renderer__error-content">
      <span class="widget-renderer__error-icon">⚠️</span>
      <h3 class="widget-renderer__error-title">Widget não encontrado</h3>
      <p class="widget-renderer__error-message">
        O widget de tipo <code>{{ schema.type }}</code> não está registrado.
      </p>
      <p v-if="availableTypes.length" class="widget-renderer__error-suggestion">
        Tipos disponíveis: <code>{{ availableTypes.join(', ') }}</code>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * WidgetRenderer
 * 
 * Componente universal que renderiza qualquer widget baseado em schema JSON.
 * Consulta o Widget Registry para obter o componente correto.
 * 
 * Funcionamento:
 * 1. Recebe um WidgetSchema via prop
 * 2. Busca a definição no Widget Registry pelo type
 * 3. Renderiza o componente dinamicamente via <component :is>
 * 4. Faz merge do defaultConfig com config do schema
 * 5. Emite eventos do widget para o parent
 * 
 * @component WidgetRenderer
 */

import { computed, type Component } from 'vue'
import type { WidgetSchema, WidgetEvent } from './types'
import { getWidget, getAllWidgets } from './widget-registry'

/**
 * Props do WidgetRenderer
 */
interface Props {
  /**
   * Schema JSON do widget a renderizar.
   * Deve conter type, config, etc.
   */
  schema: WidgetSchema

  /**
   * Contexto adicional passado para o widget.
   * Ex: user, permissions, parentData, etc.
   */
  context?: Record<string, any>

  /**
   * Se true, renderiza em modo preview (sem interação).
   */
  preview?: boolean

  /**
   * Se true, renderiza em modo de edição (com overlay).
   */
  editable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  context: () => ({}),
  preview: false,
  editable: false
})

/**
 * Emits
 */
const emit = defineEmits<{
  /**
   * Emitido quando o widget emite um evento.
   * Parent pode escutar e tratar.
   */
  widgetEvent: [event: WidgetEvent]

  /**
   * Emitido quando widget não é encontrado.
   */
  widgetNotFound: [type: string]

  /**
   * Emitido quando widget é montado.
   */
  widgetMounted: [widgetId: string, type: string]
}>()

/**
 * Busca a definição do widget no registry.
 */
const widgetDefinition = computed(() => {
  const definition = getWidget(props.schema.type)

  if (!definition) {
    console.warn(
      `[WidgetRenderer] Widget type "${props.schema.type}" not found in registry`
    )
    emit('widgetNotFound', props.schema.type)
  }

  return definition
})

/**
 * Componente Vue a ser renderizado.
 * Pode vir de definition.component ou definition.renderer.
 */
const widgetComponent = computed<Component | undefined>(() => {
  if (!widgetDefinition.value) return undefined

  // Preferência: renderer > component
  return widgetDefinition.value.renderer || widgetDefinition.value.component
})

/**
 * Config mesclada: defaultConfig + schema.config.
 * Schema config sobrescreve defaults.
 */
const mergedConfig = computed(() => {
  if (!widgetDefinition.value) return {}

  const baseConfig = widgetDefinition.value.defaultConfig || {}
  const schemaConfig = props.schema.config || {}

  return {
    ...baseConfig,
    ...schemaConfig,
    // Injeta props especiais
    preview: props.preview,
    editable: props.editable,
    context: props.context
  }
})

/**
 * Lista de tipos disponíveis (para mensagem de erro).
 */
const availableTypes = computed(() => {
  return getAllWidgets().map((w) => w.type)
})

/**
 * Handler de eventos do widget.
 * Captura eventos emitidos pelo widget e repassa para o parent.
 */
function handleWidgetEvent(event: WidgetEvent) {
  console.log('[WidgetRenderer] Widget event:', event)
  emit('widgetEvent', event)
}

/**
 * Lifecycle: emite evento quando widget é montado.
 */
import { onMounted } from 'vue'

onMounted(() => {
  if (widgetComponent.value) {
    emit('widgetMounted', props.schema.id, props.schema.type)
  }
})
</script>

<style lang="scss" scoped>
/**
 * Estilos do WidgetRenderer
 */

.widget-renderer__error {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  padding: var(--spacing-lg);
  background: var(--color-danger-bg);
  border: 2px dashed var(--color-danger);
  border-radius: var(--border-radius);
}

.widget-renderer__error-content {
  text-align: center;
  max-width: 400px;
}

.widget-renderer__error-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: var(--spacing-md);
}

.widget-renderer__error-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--color-danger);
  margin: 0 0 var(--spacing-sm) 0;
}

.widget-renderer__error-message {
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
  margin: 0 0 var(--spacing-sm) 0;

  code {
    background: var(--color-danger-light);
    padding: 2px 6px;
    border-radius: 3px;
    font-family: var(--font-family-mono);
    font-size: 0.9em;
  }
}

.widget-renderer__error-suggestion {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin: var(--spacing-sm) 0 0 0;

  code {
    background: var(--color-bg-secondary);
    padding: 2px 6px;
    border-radius: 3px;
    font-family: var(--font-family-mono);
    font-size: 0.9em;
    color: var(--color-primary);
  }
}

/**
 * Modo preview: pointer-events none
 */
:deep(.widget-renderer__preview) {
  pointer-events: none;
  opacity: 0.8;
}

/**
 * Modo editable: adiciona outline ao hover
 */
:deep(.widget-renderer__editable) {
  &:hover {
    outline: 2px dashed var(--color-primary);
    outline-offset: 4px;
  }
}
</style>
