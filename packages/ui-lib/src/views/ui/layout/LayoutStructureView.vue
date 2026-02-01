<script setup lang="ts">
/**
 * LayoutStructureView - Showcase VISUAL da estrutura de Layout
 * Preview interativo mostrando as 4 áreas principais do layout
 */
import { ref } from 'vue'
import ComponentShowcase from '@/shared/components/layout/ComponentShowcase.vue'
import CodeBlock from '@/shared/components/layout/CodeBlock.vue'

const showNavbar = ref(true)
const stickyHeader = ref(true)
const navbarPosition = ref<'left' | 'right'>('left')

// ============================================
// CODE EXAMPLE
// ============================================

const visualStructureCode = `<!-- Visual Structure Overview -->
<DefaultLayout>
  <!-- Layout completo com 4 áreas principais -->
  
  ┌─────────────────────────────────────┐
  │  Navbar (sidebar)                   │
  │  ├── Top navigation                 │
  │  │   ├── Menu items                 │
  │  │   └── Submenus                   │
  │  └── Bottom navigation              │
  │      └── Settings/User              │
  └─────────────────────────────────────┘
  
  ┌─────────────────────────────────────┐
  │  Header (AppHeader)                 │
  │  ├── Logo & Title                   │
  │  └── Actions (Theme, Profile, etc)  │
  └─────────────────────────────────────┘
  
  ┌─────────────────────────────────────┐
  │  Main Content Area                  │
  │  <router-view />                    │
  │  (Your pages render here)           │
  └─────────────────────────────────────┘
  
  ┌─────────────────────────────────────┐
  │  Footer (AppFooter)                 │
  │  Copyright & Links                  │
  └─────────────────────────────────────┘
</DefaultLayout>`
</script>

<template>
    <div class="layout-structure-view">
        <div class="view-header">
            <h1>🏗️ Layout Structure</h1>
            <p class="view-description">
                Preview interativo da estrutura visual do layout com suas 4 áreas principais:
                <strong>Navbar</strong>, <strong>Header</strong>, <strong>Content</strong> e <strong>Footer</strong>.
            </p>
        </div>

        <!-- ============================================ -->
        <!-- SHOWCASE: Visual Structure Preview -->
        <!-- ============================================ -->
        <ComponentShowcase title="Visual Structure"
            description="Visão geral interativa da estrutura do layout com suas 4 áreas principais">
            <template #preview>
                <div class="layout-preview-container">
                    <!-- Mini Layout Preview -->
                    <div class="layout-mini-preview">
                        <div v-if="showNavbar" :class="['preview-navbar', `preview-navbar--${navbarPosition}`]">
                            <div class="preview-section">
                                <div class="preview-label">Navbar Top</div>
                                <div class="preview-item">🏠 Home</div>
                                <div class="preview-item">📦 Items</div>
                                <div class="preview-item">📊 Reports</div>
                            </div>
                            <div class="preview-section preview-section--bottom">
                                <div class="preview-label">Navbar Bottom</div>
                                <div class="preview-item">⚙️ Settings</div>
                            </div>
                        </div>

                        <div class="preview-main">
                            <div v-if="stickyHeader" class="preview-header">
                                <div class="preview-label">Header</div>
                                <div style="display: flex; align-items: center; gap: 0.5rem;">
                                    <span>🎨 My App</span>
                                    <span style="margin-left: auto;">👤 Profile</span>
                                </div>
                            </div>

                            <div class="preview-content">
                                <div class="preview-label">Main Content</div>
                                <div class="preview-content-placeholder">
                                    <p>&lt;router-view /&gt;</p>
                                    <p style="font-size: 0.75rem; opacity: 0.7;">Your pages render here</p>
                                </div>
                            </div>

                            <div class="preview-footer">
                                <div class="preview-label">Footer</div>
                                <p style="font-size: 0.7rem; text-align: center; opacity: 0.8;">© 2026 Company</p>
                            </div>
                        </div>
                    </div>

                    <!-- Controls -->
                    <div class="preview-controls">
                        <label class="control-item">
                            <input v-model="showNavbar" type="checkbox">
                            <span>Show Navbar</span>
                        </label>
                        <label class="control-item">
                            <input v-model="stickyHeader" type="checkbox">
                            <span>Sticky Header</span>
                        </label>
                        <label class="control-item">
                            <span>Navbar Position:</span>
                            <select v-model="navbarPosition">
                                <option value="left">Left</option>
                                <option value="right">Right</option>
                            </select>
                        </label>
                    </div>
                </div>
            </template>

            <template #code>
                <CodeBlock :code="visualStructureCode" language="html" />
            </template>
        </ComponentShowcase>
    </div>
</template>

<style lang="scss" scoped>
.layout-structure-view {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xl);
}

.view-header {
    h1 {
        font-size: var(--font-size-3xl);
        font-weight: var(--font-weight-bold);
        color: var(--color-text-primary);
        margin: 0 0 var(--spacing-sm) 0;
    }

    .view-description {
        font-size: var(--font-size-lg);
        color: var(--color-text-secondary);
        line-height: 1.6;
        margin: 0;

        strong {
            color: var(--color-text-primary);
        }
    }
}

// ============================================
// LAYOUT PREVIEW
// ============================================
.layout-preview-container {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
    width: 100%;
}

.layout-mini-preview {
    display: flex;
    border: 2px solid var(--color-border);
    border-radius: var(--radius-md);
    overflow: hidden;
    background: var(--color-bg-primary);
    height: 400px;
    box-shadow: var(--shadow-md);
    width: 100%;
}

.preview-navbar {
    width: 180px;
    background: var(--color-bg-secondary);
    border-right: 2px solid var(--color-border);
    display: flex;
    flex-direction: column;
    flex-shrink: 0;

    &--right {
        order: 2;
        border-right: none;
        border-left: 2px solid var(--color-border);
    }
}

.preview-section {
    padding: var(--spacing-sm);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);

    &--bottom {
        margin-top: auto;
        border-top: 1px solid var(--color-border);
    }
}

.preview-label {
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-semibold);
    color: var(--color-text-tertiary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: var(--spacing-2xs);
}

.preview-item {
    padding: var(--spacing-xs);
    background: var(--color-bg-tertiary);
    border-radius: var(--radius-sm);
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
}

.preview-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.preview-header {
    padding: var(--spacing-md);
    background: var(--color-primary);
    color: var(--color-text-inverse);
    border-bottom: 2px solid var(--color-border);
}

.preview-content {
    flex: 1;
    padding: var(--spacing-md);
    overflow: auto;
}

.preview-content-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    background: var(--color-bg-secondary);
    border: 2px dashed var(--color-border);
    border-radius: var(--radius-md);
    color: var(--color-text-tertiary);
    gap: var(--spacing-sm);

    p {
        margin: 0;
    }
}

.preview-footer {
    padding: var(--spacing-md);
    background: var(--color-bg-secondary);
    border-top: 2px solid var(--color-border);

    p {
        margin: 0;
    }
}

.preview-controls {
    display: flex;
    gap: var(--spacing-lg);
    padding: var(--spacing-md);
    background: var(--color-bg-secondary);
    border-radius: var(--radius-md);
    flex-wrap: wrap;
}

.control-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    cursor: pointer;

    input[type="checkbox"],
    input[type="radio"] {
        cursor: pointer;
    }

    select {
        margin-left: var(--spacing-xs);
        padding: var(--spacing-2xs) var(--spacing-xs);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-sm);
        background: var(--color-bg-primary);
        color: var(--color-text-primary);
        cursor: pointer;
    }
}

// ============================================
// RESPONSIVE
// ============================================
@media (max-width: 768px) {
    .layout-mini-preview {
        height: 300px;
    }

    .preview-navbar {
        width: 120px;
    }

    .preview-controls {
        flex-direction: column;
        align-items: flex-start;
    }
}
</style>
