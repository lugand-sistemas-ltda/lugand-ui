<script setup lang="ts">
import { computed, inject, onMounted, onUnmounted, ref, h, useSlots } from 'vue'
import type { TabsContext } from './types'
import { TABS_INJECTION_KEY } from './types'

export interface TabPanelProps {
  id: string | number
  label: string
  icon?: string
  badge?: string | number
  disabled?: boolean
  forceRender?: boolean
}

const props = withDefaults(defineProps<TabPanelProps>(), {
  disabled: false,
  forceRender: false
})

const tabsContext = inject<TabsContext>(TABS_INJECTION_KEY)
if (!tabsContext) {
  throw new Error('TabPanel must be used within a Tabs component')
}

const isActive = computed(() => tabsContext.isActive(props.id))
const hasBeenVisited = computed(() => tabsContext.hasBeenVisited(props.id))

const shouldRenderContent = computed(() => {
  if (props.forceRender) return true
  if (!tabsContext.lazy) return true
  if (isActive.value) return true
  if (tabsContext.keepAlive && hasBeenVisited.value) return true
  return false
})

const tabButtonClasses = computed(() => [
  'tab-button',
  {
    'tab-button--active': isActive.value,
    'tab-button--disabled': props.disabled || tabsContext.disabled
  }
])

const tabPanelClasses = computed(() => [
  'tab-panel',
  {
    'tab-panel--active': isActive.value,
    'tab-panel--hidden': !isActive.value
  }
])

const handleClick = () => {
  if (!props.disabled && !tabsContext.disabled) {
    tabsContext.selectTab(props.id)
  }
}

const buttonRef = ref<HTMLButtonElement>()
const slots = useSlots()
let registrationOrder = 0

onMounted(() => {
  tabsContext.registerTab(props.id)

  tabsContext.registerTabPanel({
    id: props.id,
    label: props.label,
    icon: props.icon,
    badge: props.badge,
    disabled: props.disabled || false,
    order: registrationOrder++,
    renderButton: () => h('div', {
      class: ['tab-list-item', `tab-list-item--${tabsContext.variant}`]
    }, [
      h('button', {
        ref: buttonRef,
        class: tabButtonClasses.value,
        'aria-selected': isActive.value,
        'aria-controls': `panel-${props.id}`,
        disabled: props.disabled || tabsContext.disabled,
        tabindex: isActive.value ? 0 : -1,
        role: 'tab',
        onClick: handleClick
      }, [
        props.icon ? h('span', { class: 'tab-icon' }, props.icon) : null,
        h('span', { class: 'tab-label' }, props.label),
        props.badge ? h('span', { class: 'tab-badge' }, props.badge.toString()) : null
      ].filter(Boolean))
    ]),
    renderContent: () => shouldRenderContent.value ? h('div', {
      id: `panel-${props.id}`,
      class: tabPanelClasses.value,
      'aria-labelledby': `tab-${props.id}`,
      role: 'tabpanel'
    }, [
      slots.default?.()
    ]) : null
  })
})

onUnmounted(() => {
  tabsContext.unregisterTab(props.id)
  tabsContext.unregisterTabPanel(props.id)
})
</script>

<template>
  <!-- Componente sem renderização direta - tudo via render functions -->
</template>

<style lang="scss">
.tab-list-item {
  flex-shrink: 0;

  &--line {
    position: relative;
  }

  &--enclosed {
    margin-right: var(--spacing-xs);
  }

  &--pills {
    margin-right: var(--spacing-xs);
  }

  &--soft {
    margin-right: var(--spacing-xs);
  }

  &--vertical {
    width: 100%;
    margin-right: 0;
    margin-bottom: var(--spacing-xs);
  }
}

.tab-button {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  background: transparent;
  border: none;
  border-radius: 0;
  font-size: var(--font-size-md);
  font-weight: 500;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover:not(:disabled) {
    color: var(--color-text-primary);
    background: var(--color-bg-secondary);
  }

  &:focus-visible {
    outline: 2px solid var(--color-border-focus);
    outline-offset: -2px;
  }

  &--active {
    color: var(--color-primary);
    font-weight: 600;

    .tab-list-item--line & {
      border-bottom: 2px solid var(--color-primary);
    }

    .tab-list-item--enclosed & {
      background: var(--color-bg-primary);
      border: 1px solid var(--color-border-primary);
      border-bottom-color: transparent;
      border-radius: var(--radius-md) var(--radius-md) 0 0;
    }

    .tab-list-item--pills & {
      background: var(--color-primary);
      color: white;
      border-radius: var(--radius-full);
    }

    .tab-list-item--soft & {
      background: var(--color-primary-light);
      color: var(--color-primary);
      border-radius: var(--radius-md);
    }
  }

  &--disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }
}

.tab-icon {
  font-size: 1.2em;
  display: flex;
  align-items: center;
}

.tab-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.25rem;
  height: 1.25rem;
  padding: 0 var(--spacing-xs);
  background: var(--color-primary);
  color: white;
  font-size: var(--font-size-xs);
  font-weight: 600;
  border-radius: var(--radius-full);

  .tab-button--active & {
    background: white;
    color: var(--color-primary);
  }
}

.tab-panel {
  padding: var(--spacing-lg);

  &--hidden {
    display: none;
  }

  &--active {
    display: block;
    animation: fadeIn 0.2s ease;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(4px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
