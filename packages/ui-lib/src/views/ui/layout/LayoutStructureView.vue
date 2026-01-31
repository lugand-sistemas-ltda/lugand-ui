<script setup lang="ts">
/**
 * LayoutStructureView - Showcase da estrutura de Layout da aplicação
 * Demonstra como usar o DefaultLayout com Navbar, Header, Footer
 */
import { ref } from 'vue'
import ComponentShowcase from '@/shared/components/layout/ComponentShowcase.vue'
import CodeBlock from '@/shared/components/layout/CodeBlock.vue'

const showNavbar = ref(true)
const stickyHeader = ref(true)
const navbarPosition = ref<'left' | 'right'>('left')

// ============================================
// CODE EXAMPLES
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

const basicUsageCode = `<script setup lang="ts">
import { DefaultLayout } from '@lugand/vue-ui-lib'
<\/script>

<template>
  <DefaultLayout>
    <!-- Seu conteúdo aqui -->
    <router-view />
  </DefaultLayout>
</template>

<!-- 
  O DefaultLayout já inclui:
  ✅ Navbar lateral (colapsável)
  ✅ Header com tema e ações
  ✅ Footer
  ✅ Sistema de rotas
-->`

const customNavbarCode = `<script setup lang="ts">
import { DefaultLayout, Navbar, NavItem, NavLink } from '@lugand/vue-ui-lib'
<\/script>

<template>
  <DefaultLayout>
    <!-- Customize o conteúdo do Navbar -->
    <template #navbar>
      <Navbar position="left">
        <template #top>
          <NavLink to="/" exact>
            <span>🏠</span>
            <span>Home</span>
          </NavLink>
          
          <NavItem label="Produtos" icon="📦">
            <NavLink to="/products/list">Lista</NavLink>
            <NavLink to="/products/create">Criar</NavLink>
          </NavItem>
          
          <NavItem label="Vendas" icon="💰">
            <NavLink to="/sales/dashboard">Dashboard</NavLink>
            <NavLink to="/sales/reports">Relatórios</NavLink>
          </NavItem>
        </template>
        
        <template #bottom>
          <NavItem label="Configurações" icon="⚙️">
            <NavLink to="/settings">Preferências</NavLink>
          </NavItem>
        </template>
      </Navbar>
    </template>
    
    <router-view />
  </DefaultLayout>
</template>`

const componentPartsCode = `<!-- Componentes individuais do Layout -->

<!-- 1. Navbar (Menu Lateral) -->
<script setup>
import { Navbar, NavItem, NavLink } from '@lugand/vue-ui-lib'
<\/script>

<Navbar position="left" width="280px">
  <template #top>
    <NavLink to="/">Home</NavLink>
    <NavItem label="Menu" icon="📋">
      <NavLink to="/submenu">Submenu</NavLink>
    </NavItem>
  </template>
  <template #bottom>
    <NavLink to="/settings">Settings</NavLink>
  </template>
</Navbar>

<!-- 2. AppHeader (Cabeçalho) -->
<script setup>
import { AppHeader } from '@lugand/vue-ui-lib'
<\/script>

<AppHeader sticky>
  <template #left>
    <h1>My App</h1>
  </template>
  <template #actions>
    <button>Action 1</button>
    <button>Action 2</button>
  </template>
</AppHeader>

<!-- 3. AppFooter (Rodapé) -->
<script setup>
import { AppFooter } from '@lugand/vue-ui-lib'
<\/script>

<AppFooter>
  <p>© 2026 My Company</p>
</AppFooter>`

const propsReferenceCode = `// DefaultLayout Props (indiretas via componentes internos)

// Navbar Props
interface NavbarProps {
  position?: 'left' | 'right'        // Posição do menu
  width?: string                      // Largura (default: 280px)
  defaultVisible?: boolean            // Visível por padrão
  collapsible?: boolean               // Pode ser escondido
}

// AppHeader Props
interface AppHeaderProps {
  sticky?: boolean                    // Header fixo no topo
}

// NavItem Props
interface NavItemProps {
  label: string                       // Texto do item
  icon?: string                       // Ícone (emoji ou classe)
  collapsible?: boolean               // Pode expandir/colapsar
  defaultExpanded?: boolean           // Expandido por padrão
}

// NavLink Props
interface NavLinkProps {
  to: string                          // Rota do Vue Router
  exact?: boolean                     // Match exato da rota
  disabled?: boolean                  // Link desabilitado
}`
</script>

<template>
    <div class="layout-structure-view">
        <div class="view-header">
            <h1>Layout Structure</h1>
            <p class="view-description">
                Estrutura completa do layout da aplicação com <strong>Navbar</strong>, <strong>Header</strong>,
                <strong>Content</strong> e <strong>Footer</strong>. Demonstra como organizar sua aplicação com o
                <code>DefaultLayout</code>.
            </p>
        </div>

        <!-- ============================================ -->
        <!-- SHOWCASE 1: Visual Structure Preview -->
        <!-- ============================================ -->
        <ComponentShowcase title="Visual Structure"
            description="Visão geral da estrutura do layout com suas 4 áreas principais">
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

        <!-- ============================================ -->
        <!-- SHOWCASE 2: Basic Usage -->
        <!-- ============================================ -->
        <ComponentShowcase title="Basic Usage"
            description="Uso básico do DefaultLayout - estrutura pronta para começar">
            <template #preview>
                <div class="info-box">
                    <h3>📦 DefaultLayout Incluído no App.vue</h3>
                    <p>
                        O <code>DefaultLayout</code> já está configurado no <code>App.vue</code> desta biblioteca.
                        Ele envolve automaticamente todo o conteúdo e fornece:
                    </p>
                    <ul>
                        <li>✅ <strong>Navbar lateral</strong> com navegação hierárquica</li>
                        <li>✅ <strong>Header fixo</strong> com logo, título e ações (tema, perfil)</li>
                        <li>✅ <strong>Área de conteúdo</strong> responsiva com <code>&lt;router-view /&gt;</code></li>
                        <li>✅ <strong>Footer</strong> com informações de copyright</li>
                        <li>✅ <strong>Responsivo</strong> - navbar vira overlay em mobile</li>
                        <li>✅ <strong>Tema dinâmico</strong> - integrado com ThemeSelector</li>
                    </ul>
                    <div class="info-note">
                        <strong>💡 Nota:</strong> Para usar em sua aplicação, basta importar e envolver seu conteúdo
                        com o <code>DefaultLayout</code> como mostrado no código ao lado.
                    </div>
                </div>
            </template>

            <template #code>
                <CodeBlock :code="basicUsageCode" language="vue" />
            </template>
        </ComponentShowcase>

        <!-- ============================================ -->
        <!-- SHOWCASE 3: Custom Navbar Content -->
        <!-- ============================================ -->
        <ComponentShowcase title="Custom Navbar Content"
            description="Como customizar o conteúdo do menu lateral com seus próprios links e seções">
            <template #preview>
                <div class="info-box">
                    <h3>🎨 Customização do Navbar</h3>
                    <p>
                        Você pode personalizar completamente o conteúdo do navbar usando os componentes
                        <code>Navbar</code>, <code>NavItem</code> e <code>NavLink</code>:
                    </p>

                    <div class="feature-grid">
                        <div class="feature-card">
                            <div class="feature-icon">🔗</div>
                            <h4>NavLink</h4>
                            <p>Links simples para rotas</p>
                            <code>to="/route"</code>
                        </div>

                        <div class="feature-card">
                            <div class="feature-icon">📁</div>
                            <h4>NavItem</h4>
                            <p>Seções colapsáveis com submenus</p>
                            <code>label="Menu"</code>
                        </div>

                        <div class="feature-card">
                            <div class="feature-icon">🎯</div>
                            <h4>Slots</h4>
                            <p>Top (navegação) e Bottom (settings)</p>
                            <code>#top #bottom</code>
                        </div>

                        <div class="feature-card">
                            <div class="feature-icon">📱</div>
                            <h4>Responsivo</h4>
                            <p>Overlay automático em mobile</p>
                            <code>&lt;768px</code>
                        </div>
                    </div>
                </div>
            </template>

            <template #code>
                <CodeBlock :code="customNavbarCode" language="vue" />
            </template>
        </ComponentShowcase>

        <!-- ============================================ -->
        <!-- SHOWCASE 4: Component Parts -->
        <!-- ============================================ -->
        <ComponentShowcase title="Layout Component Parts"
            description="Componentes individuais que compõem o layout - use separadamente quando necessário">
            <template #preview>
                <div class="info-box">
                    <h3>🧩 Componentes Individuais</h3>
                    <p>
                        Além do <code>DefaultLayout</code> completo, você pode usar os componentes
                        individualmente em suas próprias composições:
                    </p>

                    <div class="components-list">
                        <div class="component-item">
                            <div class="component-header">
                                <strong>Navbar</strong>
                                <span class="component-badge">Menu Lateral</span>
                            </div>
                            <p>Menu lateral colapsável com suporte a navegação hierárquica</p>
                            <ul>
                                <li>Posição configurável (left/right)</li>
                                <li>Largura customizável</li>
                                <li>Slots para top e bottom</li>
                                <li>Auto-colapsa em mobile</li>
                            </ul>
                        </div>

                        <div class="component-item">
                            <div class="component-header">
                                <strong>NavItem</strong>
                                <span class="component-badge">Item Colapsável</span>
                            </div>
                            <p>Item de menu com suporte a submenus expandíveis</p>
                            <ul>
                                <li>Ícones customizáveis (emoji ou classes)</li>
                                <li>Estado expandido/colapsado</li>
                                <li>Aninhamento ilimitado</li>
                            </ul>
                        </div>

                        <div class="component-item">
                            <div class="component-header">
                                <strong>NavLink</strong>
                                <span class="component-badge">Link de Rota</span>
                            </div>
                            <p>Link integrado com Vue Router com estado ativo</p>
                            <ul>
                                <li>Highlight automático de rota ativa</li>
                                <li>Suporte a match exato</li>
                                <li>Estado desabilitado</li>
                            </ul>
                        </div>

                        <div class="component-item">
                            <div class="component-header">
                                <strong>AppHeader</strong>
                                <span class="component-badge">Cabeçalho</span>
                            </div>
                            <p>Header da aplicação com slots para logo e ações</p>
                            <ul>
                                <li>Sticky opcional (fixo no topo)</li>
                                <li>Slots left e actions</li>
                                <li>Responsivo</li>
                            </ul>
                        </div>

                        <div class="component-item">
                            <div class="component-header">
                                <strong>AppFooter</strong>
                                <span class="component-badge">Rodapé</span>
                            </div>
                            <p>Footer da aplicação com slot para conteúdo</p>
                            <ul>
                                <li>Centralizado por padrão</li>
                                <li>Slot padrão para customização</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </template>

            <template #code>
                <CodeBlock :code="componentPartsCode" language="vue" />
            </template>
        </ComponentShowcase>

        <!-- ============================================ -->
        <!-- SHOWCASE 5: API Reference -->
        <!-- ============================================ -->
        <ComponentShowcase title="API Reference"
            description="Referência completa de props e configurações dos componentes de layout">
            <template #preview>
                <div class="api-reference">
                    <h3>Props & Configuration</h3>

                    <!-- Navbar Props -->
                    <div class="api-section">
                        <h4>Navbar Props</h4>
                        <table class="api-table">
                            <thead>
                                <tr>
                                    <th>Prop</th>
                                    <th>Type</th>
                                    <th>Default</th>
                                    <th>Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><code>position</code></td>
                                    <td><code>'left' | 'right'</code></td>
                                    <td><code>'left'</code></td>
                                    <td>Posição do navbar</td>
                                </tr>
                                <tr>
                                    <td><code>width</code></td>
                                    <td><code>string</code></td>
                                    <td><code>'280px'</code></td>
                                    <td>Largura do navbar</td>
                                </tr>
                                <tr>
                                    <td><code>defaultVisible</code></td>
                                    <td><code>boolean</code></td>
                                    <td><code>true</code></td>
                                    <td>Visível por padrão (desktop)</td>
                                </tr>
                                <tr>
                                    <td><code>collapsible</code></td>
                                    <td><code>boolean</code></td>
                                    <td><code>true</code></td>
                                    <td>Pode ser escondido/mostrado</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- NavItem Props -->
                    <div class="api-section">
                        <h4>NavItem Props</h4>
                        <table class="api-table">
                            <thead>
                                <tr>
                                    <th>Prop</th>
                                    <th>Type</th>
                                    <th>Default</th>
                                    <th>Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><code>label</code></td>
                                    <td><code>string</code></td>
                                    <td>-</td>
                                    <td>Texto do item (obrigatório)</td>
                                </tr>
                                <tr>
                                    <td><code>icon</code></td>
                                    <td><code>string</code></td>
                                    <td>-</td>
                                    <td>Ícone (emoji ou classe CSS)</td>
                                </tr>
                                <tr>
                                    <td><code>collapsible</code></td>
                                    <td><code>boolean</code></td>
                                    <td><code>true</code></td>
                                    <td>Pode expandir/colapsar</td>
                                </tr>
                                <tr>
                                    <td><code>defaultExpanded</code></td>
                                    <td><code>boolean</code></td>
                                    <td><code>false</code></td>
                                    <td>Expandido por padrão</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- NavLink Props -->
                    <div class="api-section">
                        <h4>NavLink Props</h4>
                        <table class="api-table">
                            <thead>
                                <tr>
                                    <th>Prop</th>
                                    <th>Type</th>
                                    <th>Default</th>
                                    <th>Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><code>to</code></td>
                                    <td><code>string</code></td>
                                    <td>-</td>
                                    <td>Rota do Vue Router (obrigatório)</td>
                                </tr>
                                <tr>
                                    <td><code>exact</code></td>
                                    <td><code>boolean</code></td>
                                    <td><code>false</code></td>
                                    <td>Match exato da rota</td>
                                </tr>
                                <tr>
                                    <td><code>disabled</code></td>
                                    <td><code>boolean</code></td>
                                    <td><code>false</code></td>
                                    <td>Link desabilitado</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- AppHeader Props -->
                    <div class="api-section">
                        <h4>AppHeader Props</h4>
                        <table class="api-table">
                            <thead>
                                <tr>
                                    <th>Prop</th>
                                    <th>Type</th>
                                    <th>Default</th>
                                    <th>Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><code>sticky</code></td>
                                    <td><code>boolean</code></td>
                                    <td><code>false</code></td>
                                    <td>Header fixo no topo ao rolar</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- Slots -->
                    <div class="api-section">
                        <h4>Slots</h4>
                        <table class="api-table">
                            <thead>
                                <tr>
                                    <th>Component</th>
                                    <th>Slot</th>
                                    <th>Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><strong>Navbar</strong></td>
                                    <td><code>#top</code></td>
                                    <td>Conteúdo do topo (navegação principal)</td>
                                </tr>
                                <tr>
                                    <td><strong>Navbar</strong></td>
                                    <td><code>#bottom</code></td>
                                    <td>Conteúdo do rodapé (settings, user)</td>
                                </tr>
                                <tr>
                                    <td><strong>AppHeader</strong></td>
                                    <td><code>#left</code></td>
                                    <td>Lado esquerdo (logo, título)</td>
                                </tr>
                                <tr>
                                    <td><strong>AppHeader</strong></td>
                                    <td><code>#actions</code></td>
                                    <td>Lado direito (ações, botões)</td>
                                </tr>
                                <tr>
                                    <td><strong>AppFooter</strong></td>
                                    <td><code>default</code></td>
                                    <td>Conteúdo do footer</td>
                                </tr>
                                <tr>
                                    <td><strong>NavItem</strong></td>
                                    <td><code>default</code></td>
                                    <td>Conteúdo do submenu (NavLinks)</td>
                                </tr>
                                <tr>
                                    <td><strong>NavLink</strong></td>
                                    <td><code>default</code></td>
                                    <td>Conteúdo do link (texto, ícone)</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </template>

            <template #code>
                <CodeBlock :code="propsReferenceCode" language="typescript" />
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

        code {
            background: var(--color-bg-secondary);
            padding: 0.125rem 0.375rem;
            border-radius: var(--radius-sm);
            font-size: 0.9em;
            color: var(--color-primary);
        }
    }
}

// ============================================
// LAYOUT PREVIEW (SHOWCASE 1)
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
// INFO BOX (SHOWCASES 2, 3, 4)
// ============================================
.info-box {
    padding: var(--spacing-lg);
    background: var(--color-bg-secondary);
    border-radius: var(--radius-md);
    border: 1px solid var(--color-border);

    h3 {
        margin: 0 0 var(--spacing-md) 0;
        color: var(--color-text-primary);
        font-size: var(--font-size-xl);
    }

    p {
        margin: 0 0 var(--spacing-md) 0;
        color: var(--color-text-secondary);
        line-height: 1.6;
    }

    ul {
        margin: var(--spacing-md) 0;
        padding-left: var(--spacing-xl);
        color: var(--color-text-secondary);
        line-height: 1.8;

        li {
            margin-bottom: var(--spacing-xs);

            strong {
                color: var(--color-text-primary);
            }
        }
    }

    code {
        background: var(--color-bg-tertiary);
        padding: 0.125rem 0.375rem;
        border-radius: var(--radius-sm);
        font-size: 0.9em;
        color: var(--color-primary);
    }
}

.info-note {
    margin-top: var(--spacing-lg);
    padding: var(--spacing-md);
    background: var(--color-primary-alpha);
    border-left: 4px solid var(--color-primary);
    border-radius: var(--radius-sm);
    color: var(--color-text-secondary);

    strong {
        color: var(--color-primary);
    }
}

// ============================================
// FEATURE GRID (SHOWCASE 3)
// ============================================
.feature-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--spacing-md);
    margin-top: var(--spacing-lg);
}

.feature-card {
    padding: var(--spacing-md);
    background: var(--color-bg-tertiary);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    text-align: center;

    .feature-icon {
        font-size: 2rem;
        margin-bottom: var(--spacing-sm);
    }

    h4 {
        margin: 0 0 var(--spacing-xs) 0;
        font-size: var(--font-size-md);
        color: var(--color-text-primary);
    }

    p {
        margin: 0 0 var(--spacing-sm) 0;
        font-size: var(--font-size-sm);
        color: var(--color-text-secondary);
    }

    code {
        font-size: var(--font-size-xs);
        background: var(--color-bg-primary);
        padding: 0.125rem 0.375rem;
        border-radius: var(--radius-sm);
        color: var(--color-text-tertiary);
    }
}

// ============================================
// COMPONENTS LIST (SHOWCASE 4)
// ============================================
.components-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
    margin-top: var(--spacing-lg);
}

.component-item {
    padding: var(--spacing-md);
    background: var(--color-bg-tertiary);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);

    .component-header {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        margin-bottom: var(--spacing-sm);

        strong {
            font-size: var(--font-size-lg);
            color: var(--color-text-primary);
        }
    }

    .component-badge {
        font-size: var(--font-size-xs);
        padding: 0.25rem 0.5rem;
        background: var(--color-primary-alpha);
        color: var(--color-primary);
        border-radius: var(--radius-sm);
        font-weight: var(--font-weight-semibold);
    }

    p {
        margin: 0 0 var(--spacing-sm) 0;
        color: var(--color-text-secondary);
    }

    ul {
        margin: var(--spacing-sm) 0 0 0;
        padding-left: var(--spacing-lg);
        color: var(--color-text-secondary);
        font-size: var(--font-size-sm);

        li {
            margin-bottom: var(--spacing-2xs);
        }
    }
}

// ============================================
// API REFERENCE (SHOWCASE 5)
// ============================================
.api-reference {
    h3 {
        margin: 0 0 var(--spacing-lg) 0;
        font-size: var(--font-size-2xl);
        color: var(--color-text-primary);
    }
}

.api-section {
    margin-bottom: var(--spacing-xl);

    h4 {
        margin: 0 0 var(--spacing-md) 0;
        font-size: var(--font-size-lg);
        color: var(--color-text-primary);
        padding-bottom: var(--spacing-sm);
        border-bottom: 2px solid var(--color-border);
    }
}

.api-table {
    width: 100%;
    border-collapse: collapse;
    font-size: var(--font-size-sm);

    thead {
        background: var(--color-bg-secondary);

        th {
            padding: var(--spacing-sm);
            text-align: left;
            font-weight: var(--font-weight-semibold);
            color: var(--color-text-primary);
            border: 1px solid var(--color-border);
        }
    }

    tbody {
        tr {
            &:nth-child(even) {
                background: var(--color-bg-secondary);
            }

            &:hover {
                background: var(--color-bg-tertiary);
            }
        }

        td {
            padding: var(--spacing-sm);
            color: var(--color-text-secondary);
            border: 1px solid var(--color-border);

            code {
                background: var(--color-bg-tertiary);
                padding: 0.125rem 0.375rem;
                border-radius: var(--radius-sm);
                font-size: 0.9em;
                color: var(--color-primary);
            }
        }
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

    .feature-grid {
        grid-template-columns: 1fr;
    }

    .preview-controls {
        flex-direction: column;
        align-items: flex-start;
    }
}
</style>
