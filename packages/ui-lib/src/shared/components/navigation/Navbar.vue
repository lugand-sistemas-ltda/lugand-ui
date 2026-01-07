<script setup lang="ts">
/**
 * Navbar - Menu lateral genérico
 * - Posição configurável (left/right)
 * - Scroll vertical automático
 * - Seções top/bottom separadas
 * - Suporta items colapsáveis hierárquicos
 * - Toggle hide/show
 * - Responsivo: overlay em mobile
 */
import { ref, onMounted, onUnmounted } from 'vue'
import Scrollable from '../primitives/Scrollable.vue'

interface Props {
  position?: 'left' | 'right'
  width?: string
  defaultVisible?: boolean
  collapsible?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  position: 'left',
  width: '280px',
  defaultVisible: true,
  collapsible: true,
})

const isVisible = ref(props.defaultVisible)
const isMobile = ref(false)

const checkMobile = () => {
  isMobile.value = window.innerWidth < 768
  // Auto-esconde em mobile, auto-mostra em desktop
  if (isMobile.value && isVisible.value) {
    isVisible.value = false
  } else if (!isMobile.value && !isVisible.value && props.defaultVisible) {
    isVisible.value = true
  }
}

const emit = defineEmits<{
  (e: 'update:visible', visible: boolean): void
}>()

const toggle = () => {
  isVisible.value = !isVisible.value
  emit('update:visible', isVisible.value)
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})

// Expõe métodos para controle externo
defineExpose({
  toggle,
  isVisible,
})
</script>

<template>
  <div>
    <!-- Overlay para mobile (fecha navbar ao clicar fora) -->
    <div v-if="isMobile && isVisible" class="navbar__overlay" @click="toggle" />

    <!-- Toggle Button -->
    <button v-if="collapsible"
      :class="['navbar__toggle', `navbar__toggle--${position}`, { 'navbar__toggle--visible': isVisible }]"
      :title="isVisible ? 'Hide sidebar' : 'Show sidebar'" @click="toggle">
      <span class="navbar__toggle-icon">
        {{ isVisible ? (position === 'left' ? '◀' : '▶') : (position === 'left' ? '▶' : '◀') }}
      </span>
    </button>

    <!-- Navbar -->
    <aside v-show="isVisible" :class="['navbar', `navbar--${position}`, { 'navbar--mobile': isMobile }]"
      :style="{ width }">
      <div class="navbar__top">
        <Scrollable max-height="100%">
          <nav class="navbar__content" aria-label="Main navigation">
            <slot name="top" />
          </nav>
        </Scrollable>
      </div>

      <div v-if="$slots.bottom" class="navbar__bottom">
        <nav class="navbar__content" aria-label="Secondary navigation">
          <slot name="bottom" />
        </nav>
      </div>
    </aside>
  </div>
</template>

<style lang="scss" scoped>
.navbar {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: var(--color-bg-primary);
  border-color: var(--color-border-base);
  border-style: solid;
  border-width: 0;
  position: fixed;
  top: 0;
  z-index: 100;
  transition: transform var(--transition-base);

  &--left {
    left: 0;
    border-right-width: 1px;
  }

  &--right {
    right: 0;
    border-left-width: 1px;
  }

  // Mobile: navbar vira overlay (por cima do conteúdo)
  &--mobile {
    z-index: 200;
    box-shadow: var(--shadow-xl);
  }

  &__top {
    flex: 1;
    min-height: 0; // Permite flex child scrollar
    display: flex;
    flex-direction: column;
  }

  &__bottom {
    border-top: 1px solid var(--color-border-base);
    padding: var(--spacing-sm) 0;
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-2xs);
    padding: var(--spacing-md);
  }

  &__overlay {
    position: fixed;
    inset: 0;
    background: hsla(0, 0%, 0%, 0.5);
    z-index: 199;
    animation: fadeIn var(--transition-fast);
  }

  &__toggle {
    position: fixed;
    top: 50%;
    transform: translateY(-50%);
    z-index: 101;
    background: var(--color-bg-primary);
    border: 1px solid var(--color-border-base);
    border-radius: var(--radius-md);
    padding: var(--spacing-sm) var(--spacing-xs);
    cursor: pointer;
    transition: all var(--transition-base);
    box-shadow: var(--shadow-md);

    &:hover {
      background: var(--color-bg-secondary);
      border-color: var(--color-primary);
      box-shadow: var(--shadow-lg);
    }

    &--left {
      left: 0;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;

      &.navbar__toggle--visible {
        left: v-bind(width);

        // Mobile: botão fica em cima do overlay
        @media (max-width: 767px) {
          left: 0;
          z-index: 201;
        }
      }
    }

    &--right {
      right: 0;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;

      &.navbar__toggle--visible {
        right: v-bind(width);

        // Mobile: botão fica em cima do overlay
        @media (max-width: 767px) {
          right: 0;
          z-index: 201;
        }
      }
    }

    // Mobile: converte em hamburger icon no topo
    @media (max-width: 767px) {
      top: var(--spacing-md);
      transform: translateY(0);
      border-radius: var(--radius-md);
    }
  }

  &__toggle-icon {
    display: block;
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    line-height: 1;

    // Mobile: ícone hamburger
    @media (max-width: 767px) {
      font-size: var(--font-size-lg);
    }
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}
</style>
