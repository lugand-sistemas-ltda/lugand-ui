<script setup lang="ts">
import { computed, provide, watch, onMounted, onUnmounted, ref } from 'vue'
import { useTabs, type TabOrientation, type TabVariant } from '@/shared/composables'
import type { TabsContext, RegisteredTabPanel } from './types'
import { TABS_INJECTION_KEY } from './types'

export interface TabsProps {
  defaultTab?: string | number
  modelValue?: string | number
  orientation?: TabOrientation
  variant?: TabVariant
  keyboardNavigation?: boolean
  lazy?: boolean
  keepAlive?: boolean
  disabled?: boolean
  fullWidth?: boolean
  centered?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<TabsProps>(), {
  orientation: 'horizontal',
  variant: 'line',
  keyboardNavigation: true,
  lazy: false,
  keepAlive: true,
  disabled: false,
  fullWidth: false,
  centered: false,
  size: 'md'
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  'tab-change': [tabId: string | number]
}>()

const registeredPanels = ref<RegisteredTabPanel[]>([])

const registerTabPanel = (panel: RegisteredTabPanel) => {
  registeredPanels.value = registeredPanels.value.filter(p => p.id !== panel.id)
  registeredPanels.value.push(panel)
  registeredPanels.value.sort((a, b) => a.order - b.order)
}

const unregisterTabPanel = (tabId: string | number) => {
  registeredPanels.value = registeredPanels.value.filter(p => p.id !== tabId)
}

const tabs = useTabs({
  defaultTab: props.defaultTab,
  orientation: props.orientation,
  variant: props.variant,
  keyboardNavigation: props.keyboardNavigation,
  lazy: props.lazy,
  keepAlive: props.keepAlive,
  disabled: props.disabled,
  onTabChange: (tabId) => {
    emit('update:modelValue', tabId)
    emit('tab-change', tabId)
  }
})

watch(() => props.modelValue, (newVal) => {
  if (newVal !== undefined && newVal !== tabs.activeTab.value) {
    tabs.selectTab(newVal)
  }
})

const tabsContext: TabsContext = {
  activeTab: computed(() => tabs.activeTab.value),
  selectTab: tabs.selectTab,
  isActive: tabs.isActive,
  hasBeenVisited: tabs.hasBeenVisited,
  registerTab: tabs.registerTab,
  unregisterTab: tabs.unregisterTab,
  registerTabPanel,
  unregisterTabPanel,
  orientation: props.orientation,
  variant: props.variant,
  lazy: props.lazy,
  keepAlive: props.keepAlive,
  disabled: props.disabled,
  size: props.size,
  registeredPanels
}

provide(TABS_INJECTION_KEY, tabsContext)

const handleKeydown = (e: KeyboardEvent) => {
  if (!props.keyboardNavigation || props.disabled) return
  const isHorizontal = props.orientation === 'horizontal'
  const nextKey = isHorizontal ? 'ArrowRight' : 'ArrowDown'
  const prevKey = isHorizontal ? 'ArrowLeft' : 'ArrowUp'
  if (e.key === nextKey) {
    e.preventDefault()
    tabs.nextTab()
  } else if (e.key === prevKey) {
    e.preventDefault()
    tabs.prevTab()
  } else if (e.key === 'Home') {
    e.preventDefault()
    if (tabs.tabs.value[0]) tabs.selectTab(tabs.tabs.value[0])
  } else if (e.key === 'End') {
    e.preventDefault()
    const lastTab = tabs.tabs.value[tabs.tabs.value.length - 1]
    if (lastTab) tabs.selectTab(lastTab)
  }
}

onMounted(() => {
  if (props.keyboardNavigation) {
    document.addEventListener('keydown', handleKeydown)
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})

const tabsClasses = computed(() => [
  'tabs',
  `tabs--${props.orientation}`,
  `tabs--${props.variant}`,
  `tabs--${props.size}`,
  {
    'tabs--full-width': props.fullWidth,
    'tabs--centered': props.centered && props.orientation === 'horizontal',
    'tabs--disabled': props.disabled
  }
])

const tabListClasses = computed(() => [
  'tabs__list',
  {
    'tabs__list--full-width': props.fullWidth,
    'tabs__list--centered': props.centered && props.orientation === 'horizontal'
  }
])
</script>

<template>
  <div :class="tabsClasses" role="tablist">
    <div :class="tabListClasses">
      <component v-for="panel in registeredPanels" :key="`btn-${panel.id}`" :is="panel.renderButton" />
    </div>
    <div class="tabs__panels">
      <component v-for="panel in registeredPanels" :key="`content-${panel.id}`" :is="panel.renderContent" />
    </div>
    <div style="display: none;">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tabs {
  display: flex;
  width: 100%;

  &--horizontal {
    flex-direction: column;
  }

  &--vertical {
    flex-direction: row;
    align-items: flex-start;
    gap: var(--spacing-lg);
  }

  &--disabled {
    opacity: 0.6;
    pointer-events: none;
  }
}

.tabs__list {
  display: flex;
  position: relative;

  .tabs--horizontal & {
    flex-direction: row;
    border-bottom: 1px solid var(--color-border-primary);

    &--full-width {
      width: 100%;

      &> :deep(.tab-list-item) {
        flex: 1;
      }
    }

    &--centered {
      justify-content: center;
    }
  }

  .tabs--vertical & {
    flex-direction: column;
    min-width: 200px;
    border-right: 1px solid var(--color-border-primary);
    padding-right: var(--spacing-md);
  }
}

.tabs__panels {
  flex: 1;

  .tabs--horizontal & {
    width: 100%;
  }

  .tabs--vertical & {
    flex: 1;
  }
}
</style>
