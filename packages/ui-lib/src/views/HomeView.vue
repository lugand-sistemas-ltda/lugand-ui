<script setup lang="ts">
/**
 * HomeView - Página inicial de boas-vindas
 * Minimalista e focada em direcionar o usuário
 */
import { NavLink } from '@/shared/components'
</script>

<template>
  <div class="home-view">
    <section class="hero">
      <h1>UI Component Library</h1>
      <p class="hero__subtitle">
        Sistema robusto de componentes genéricos e reutilizáveis
      </p>
      <p class="hero__description">
        Arquitetura minimalista • Design Tokens HSL • Componentes Primitivos
      </p>
    </section>

    <section class="quick-links">
      <h2>Quick Start</h2>
      <div class="quick-links__grid">
        <NavLink to="/ui/simple/buttons" class="quick-link-card">
          <span class="quick-link-card__icon">🎨</span>
          <h3>Components</h3>
          <p>Explore componentes UI simples e complexos</p>
        </NavLink>

        <NavLink to="/docs/get-started" class="quick-link-card">
          <span class="quick-link-card__icon">📚</span>
          <h3>Documentation</h3>
          <p>Guias de instalação e uso</p>
        </NavLink>

        <NavLink to="/docs/theming" class="quick-link-card">
          <span class="quick-link-card__icon">🌈</span>
          <h3>Theming</h3>
          <p>Sistema de temas e design tokens</p>
        </NavLink>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.home-view {
  max-width: 1000px;
  margin: 0 auto;

  section {
    margin-bottom: var(--spacing-3xl);

    // Mobile: margin menor
    @media (max-width: 767px) {
      margin-bottom: var(--spacing-2xl);
    }
  }
}

.hero {
  text-align: center;
  padding: var(--spacing-3xl) 0;

  // Mobile: padding menor
  @media (max-width: 767px) {
    padding: var(--spacing-xl) 0;
  }

  h1 {
    font-size: var(--font-size-3xl);
    margin-bottom: var(--spacing-md);
    background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;

    // Tablet: fonte menor
    @media (max-width: 1024px) {
      font-size: var(--font-size-2xl);
    }

    // Mobile: fonte menor
    @media (max-width: 767px) {
      font-size: var(--font-size-xl);
    }
  }

  &__subtitle {
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-semibold);
    color: var(--color-text-primary);
    margin-bottom: var(--spacing-sm);

    // Tablet: fonte menor
    @media (max-width: 1024px) {
      font-size: var(--font-size-lg);
    }

    // Mobile: fonte menor
    @media (max-width: 767px) {
      font-size: var(--font-size-base);
    }
  }

  &__description {
    font-size: var(--font-size-base);
    color: var(--color-text-secondary);
    margin: 0;

    // Mobile: fonte menor
    @media (max-width: 767px) {
      font-size: var(--font-size-sm);
    }
  }
}

.quick-links {
  h2 {
    text-align: center;
    margin-bottom: var(--spacing-xl);

    // Mobile: margin menor
    @media (max-width: 767px) {
      margin-bottom: var(--spacing-lg);
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: var(--spacing-lg);

    // Mobile: coluna única, gap menor
    @media (max-width: 767px) {
      grid-template-columns: 1fr;
      gap: var(--spacing-md);
    }
  }
}

.quick-link-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: var(--spacing-xl);
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border-base);
  border-radius: var(--radius-lg);
  text-decoration: none;
  transition: all var(--transition-base);

  // Mobile: padding menor
  @media (max-width: 767px) {
    padding: var(--spacing-lg);
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
    border-color: var(--color-primary);
    background: var(--color-bg-primary);

    // Mobile: sem transform (touch devices)
    @media (max-width: 767px) {
      transform: none;
    }
  }

  &__icon {
    font-size: 3rem;
    margin-bottom: var(--spacing-md);

    // Mobile: ícone menor
    @media (max-width: 767px) {
      font-size: 2.5rem;
      margin-bottom: var(--spacing-sm);
    }
  }

  h3 {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-semibold);
    color: var(--color-text-primary);
    margin-bottom: var(--spacing-xs);

    // Mobile: fonte menor
    @media (max-width: 767px) {
      font-size: var(--font-size-base);
    }
  }

  p {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    margin: 0;

    // Mobile: fonte menor
    @media (max-width: 767px) {
      font-size: var(--font-size-xs);
    }
  }
}
</style>
