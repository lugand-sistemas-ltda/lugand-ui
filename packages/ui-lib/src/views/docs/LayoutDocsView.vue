<script setup lang="ts">
/**
 * LayoutDocsView - Documentação conceitual sobre Layout
 * Teoria, uso, API reference dos componentes de layout
 */
import CodeBlock from '@/shared/components/layout/CodeBlock.vue'

// ============================================
// CODE EXAMPLES
// ============================================

const basicUsageCode = `<script setup lang="ts">
import { DefaultLayout } from '@lugand/vue-ui-lib'
</scr` + `ipt>

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
</scr` + `ipt>

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
</scr` + `ipt>

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
</scr` + `ipt>

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
</scr` + `ipt>

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
    <div class="layout-docs-view">
        <div class="view-header">
            <h1>📐 Layout System - Documentation</h1>
            <p class="view-description">
                Documentação completa sobre o sistema de layout: conceitos, componentes, API e boas práticas.
            </p>
        </div>

        <!-- ============================================ -->
        <!-- DOC 1: Basic Usage -->
        <!-- ============================================ -->
        <section class="doc-section">
            <header class="section-header">
                <h2>Basic Usage</h2>
                <p class="section-description">Uso básico do DefaultLayout - estrutura pronta para começar</p>
            </header>

            <div class="section-content">
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
                        com o <code>DefaultLayout</code> como mostrado no código abaixo.
                    </div>
                </div>

                <div class="code-block">
                    <CodeBlock :code="basicUsageCode" language="vue" />
                </div>
            </div>
        </section>

        <!-- ============================================ -->
        <!-- DOC 2: Custom Navbar Content -->
        <!-- ============================================ -->
        <section class="doc-section">
            <header class="section-header">
                <h2>Custom Navbar Content</h2>
                <p class="section-description">Como customizar o conteúdo do menu lateral com seus próprios links e
                    seções</p>
            </header>

            <div class="section-content">
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

                <div class="code-block">
                    <CodeBlock :code="customNavbarCode" language="vue" />
                </div>
            </div>
        </section>

        <!-- ============================================ -->
        <!-- DOC 3: Component Parts -->
        <!-- ============================================ -->
        <section class="doc-section">
            <header class="section-header">
                <h2>Layout Component Parts</h2>
                <p class="section-description">Componentes individuais que compõem o layout - use separadamente quando
                    necessário</p>
            </header>

            <div class="section-content">
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

                <div class="code-block">
                    <CodeBlock :code="componentPartsCode" language="vue" />
                </div>
            </div>
        </section>

        <!-- ============================================ -->
        <!-- DOC 4: API Reference -->
        <!-- ============================================ -->
        <section class="doc-section">
            <header class="section-header">
                <h2>API Reference</h2>
                <p class="section-description">Referência completa de props e configurações dos componentes de layout
                </p>
            </header>

            <div class="section-content">
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
                                    <td>Conteúdo do rodapé (configurações, perfil)</td>
                                </tr>
                                <tr>
                                    <td><strong>AppHeader</strong></td>
                                    <td><code>#left</code></td>
                                    <td>Logo e título da aplicação</td>
                                </tr>
                                <tr>
                                    <td><strong>AppHeader</strong></td>
                                    <td><code>#actions</code></td>
                                    <td>Ações (tema, notificações, perfil)</td>
                                </tr>
                                <tr>
                                    <td><strong>AppFooter</strong></td>
                                    <td><code>default</code></td>
                                    <td>Conteúdo do footer</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="code-block">
                    <CodeBlock :code="propsReferenceCode" language="typescript" />
                </div>
            </div>
        </section>
    </div>
</template>

<style scoped lang="scss">
.layout-docs-view {
    .view-header {
        margin-bottom: 3rem;
        padding: 2rem;
        background: var(--color-surface);
        border-radius: var(--border-radius-lg);
        border: 1px solid var(--color-border);

        h1 {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 0.75rem;
            color: var(--color-text-primary);
        }

        .view-description {
            font-size: 1.125rem;
            color: var(--color-text-secondary);
            margin: 0;
            line-height: 1.6;
        }
    }

    // Doc sections
    .doc-section {
        margin-bottom: 4rem;

        &:last-child {
            margin-bottom: 0;
        }
    }

    .section-header {
        margin-bottom: 2rem;

        h2 {
            font-size: 2rem;
            font-weight: 600;
            margin-bottom: 0.5rem;
            color: var(--color-text-primary);
            border-bottom: 2px solid var(--color-primary);
            padding-bottom: 0.5rem;
        }

        .section-description {
            font-size: 1rem;
            color: var(--color-text-secondary);
            margin: 0;
        }
    }

    .section-content {
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }

    .code-block {
        background: var(--color-background);
        border-radius: var(--border-radius-md);
        overflow: hidden;
    }

    .info-box {
        padding: 2rem;
        background: var(--color-background);
        border-radius: var(--border-radius-md);
        border: 1px solid var(--color-border);

        h3 {
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 1rem;
            color: var(--color-text-primary);
        }

        p {
            color: var(--color-text-secondary);
            line-height: 1.6;
            margin-bottom: 1rem;
        }

        ul {
            margin: 1rem 0;
            padding-left: 1.5rem;

            li {
                color: var(--color-text-secondary);
                margin-bottom: 0.5rem;
                line-height: 1.6;

                strong {
                    color: var(--color-text-primary);
                }
            }
        }

        code {
            background: var(--color-surface);
            padding: 0.125rem 0.5rem;
            border-radius: var(--border-radius-sm);
            font-family: 'Fira Code', monospace;
            font-size: 0.875rem;
            color: var(--color-primary);
        }

        .info-note {
            margin-top: 1.5rem;
            padding: 1rem;
            background: var(--color-primary-bg);
            border-left: 4px solid var(--color-primary);
            border-radius: var(--border-radius-sm);
            color: var(--color-text-secondary);
        }
    }

    .feature-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
        margin-top: 1.5rem;
    }

    .feature-card {
        padding: 1.5rem;
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: var(--border-radius-md);
        text-align: center;

        .feature-icon {
            font-size: 2.5rem;
            margin-bottom: 0.75rem;
        }

        h4 {
            font-size: 1.125rem;
            font-weight: 600;
            margin-bottom: 0.5rem;
            color: var(--color-text-primary);
        }

        p {
            font-size: 0.875rem;
            color: var(--color-text-secondary);
            margin-bottom: 0.75rem;
        }

        code {
            display: inline-block;
            background: var(--color-background);
            padding: 0.25rem 0.75rem;
            border-radius: var(--border-radius-sm);
            font-family: monospace;
            font-size: 0.75rem;
            color: var(--color-primary);
        }
    }

    .components-list {
        margin-top: 1.5rem;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .component-item {
        padding: 1.5rem;
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: var(--border-radius-md);

        .component-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.75rem;

            strong {
                font-size: 1.125rem;
                color: var(--color-text-primary);
            }

            .component-badge {
                padding: 0.25rem 0.75rem;
                background: var(--color-primary-bg);
                color: var(--color-primary);
                border-radius: var(--border-radius-sm);
                font-size: 0.75rem;
                font-weight: 600;
            }
        }

        p {
            color: var(--color-text-secondary);
            margin-bottom: 1rem;
        }

        ul {
            list-style: none;
            padding-left: 0;

            li {
                padding-left: 1.5rem;
                position: relative;
                color: var(--color-text-secondary);
                margin-bottom: 0.5rem;

                &::before {
                    content: "→";
                    position: absolute;
                    left: 0;
                    color: var(--color-primary);
                }
            }
        }
    }

    .api-reference {
        padding: 2rem;
        background: var(--color-background);
        border-radius: var(--border-radius-md);

        h3 {
            font-size: 1.75rem;
            font-weight: 600;
            margin-bottom: 2rem;
            color: var(--color-text-primary);
        }
    }

    .api-section {
        margin-bottom: 2.5rem;

        &:last-child {
            margin-bottom: 0;
        }

        h4 {
            font-size: 1.25rem;
            font-weight: 600;
            margin-bottom: 1rem;
            color: var(--color-text-primary);
        }
    }

    .api-table {
        width: 100%;
        border-collapse: collapse;
        background: var(--color-surface);
        border-radius: var(--border-radius-md);
        overflow: hidden;

        thead {
            background: var(--color-background);

            th {
                padding: 0.75rem 1rem;
                text-align: left;
                font-weight: 600;
                color: var(--color-text-primary);
                border-bottom: 2px solid var(--color-border);
                font-size: 0.875rem;
            }
        }

        tbody {
            tr {
                border-bottom: 1px solid var(--color-border);

                &:last-child {
                    border-bottom: none;
                }

                &:hover {
                    background: var(--color-background);
                }
            }

            td {
                padding: 0.75rem 1rem;
                color: var(--color-text-secondary);
                font-size: 0.875rem;

                code {
                    background: var(--color-background);
                    padding: 0.125rem 0.5rem;
                    border-radius: var(--border-radius-sm);
                    font-family: 'Fira Code', monospace;
                    font-size: 0.8125rem;
                    color: var(--color-primary);
                }

                strong {
                    color: var(--color-text-primary);
                }
            }
        }
    }
}
</style>
