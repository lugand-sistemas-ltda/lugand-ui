<script setup lang="ts">
/**
 * AppHeader - Header genérico com título e ações
 */
interface Props {
  title?: string
  userName?: string
  userAvatar?: string
  sticky?: boolean
}

withDefaults(defineProps<Props>(), {
  title: 'Application',
  sticky: false,
})
</script>

<template>
  <header :class="['app-header', { 'app-header--sticky': sticky }]">
    <div class="app-header__content">
      <div class="app-header__left">
        <slot name="left">
          <h1 class="app-title">{{ title }}</h1>
        </slot>
      </div>

      <div class="app-header__right">
        <slot name="actions"></slot>

        <div v-if="userName" class="user-info">
          <span class="user-name">{{ userName }}</span>
          <div class="user-avatar" v-if="userAvatar">
            <img :src="userAvatar" :alt="userName" />
          </div>
          <div class="user-avatar-placeholder" v-else>
            {{ userName.charAt(0).toUpperCase() }}
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<style lang="scss" scoped>
.app-header {
  background: var(--color-bg-primary);
  border-bottom: 1px solid var(--color-border-base);
  z-index: 50;
  height: 64px;
  display: flex;
  align-items: center;

  &--sticky {
    position: sticky;
    top: 0;
  }

  &__content {
    width: 100%;
    padding: 0 var(--spacing-lg);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__left {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
  }

  &__right {
    display: flex;
    align-items: center;
    gap: var(--spacing-lg);
  }
}

.app-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding-left: var(--spacing-lg);
  border-left: 1px solid var(--color-border-base);
}

.user-name {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  font-weight: var(--font-weight-medium);
}

.user-avatar,
.user-avatar-placeholder {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-avatar-placeholder {
  background: var(--color-primary);
  color: white;
  font-weight: bold;
  font-size: var(--font-size-sm);
}
</style>
