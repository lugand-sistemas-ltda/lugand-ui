<script setup lang="ts">
/**
 * ComponentsView - Documentação de componentes
 */
</script>

<template>
    <div class="view-container">
        <h1>Components</h1>
        <p class="view-description">Referência completa de todos os componentes da Lugand UI</p>

        <section class="doc-section">
            <h2>Visão Geral</h2>
            <p>
                A Lugand UI oferece uma coleção abrangente de componentes Vue 3 organizados por categoria
                e complexidade. Todos os componentes são construídos com TypeScript, seguem padrões de
                acessibilidade e são totalmente customizáveis.
            </p>
        </section>

        <section class="doc-section">
            <h2>Categorias de Componentes</h2>

            <div class="category-card">
                <h3>📝 Inputs</h3>
                <p>Componentes para entrada de dados e formulários.</p>
                <ul>
                    <li><router-link to="/ui/inputs/text">Text Inputs</router-link> - Input, Textarea, PasswordInput
                    </li>
                    <li><router-link to="/ui/inputs/selection">Selection Inputs</router-link> - Select, Checkbox, Radio,
                        Switch</li>
                    <li><router-link to="/ui/inputs/specialized">Specialized Inputs</router-link> - DateInput,
                        FileUpload, ColorPicker</li>
                </ul>
            </div>

            <div class="category-card">
                <h3>🎨 Layout & Display</h3>
                <p>Componentes para estruturação e exibição de conteúdo.</p>
                <ul>
                    <li><router-link to="/ui/display/cards">Cards</router-link> - Card básico com header, footer e slots
                    </li>
                    <li><router-link to="/ui/display/containers">Containers</router-link> - Section, Container, Grid
                    </li>
                    <li><router-link to="/ui/layout/typography">Typography</router-link> - Heading, Text, Link</li>
                    <li><router-link to="/ui/elements/display">Badges & Tooltips</router-link> - Badge, Tooltip, Avatar
                    </li>
                </ul>
            </div>

            <div class="category-card">
                <h3>🔘 Actions</h3>
                <p>Componentes para interações do usuário.</p>
                <ul>
                    <li><router-link to="/ui/actions/buttons">Buttons</router-link> - Btn com múltiplas variantes e
                        tamanhos</li>
                </ul>
            </div>

            <div class="category-card">
                <h3>🔧 Complex</h3>
                <p>Componentes compostos e avançados.</p>
                <ul>
                    <li><router-link to="/ui/data-management/forms">Forms</router-link> - DynamicForm com validação e
                        schemas</li>
                    <li><router-link to="/ui/data-management/tables">Tables</router-link> - DataTable com sorting,
                        filtros e paginação</li>
                    <li><router-link to="/ui/alerts-overlay/modals">Modals</router-link> - Modal com múltiplas variantes
                        e tamanhos</li>
                </ul>
            </div>

            <div class="category-card">
                <h3>💬 Feedback</h3>
                <p>Componentes para comunicação com o usuário.</p>
                <ul>
                    <li><router-link to="/ui/alerts-overlay/alerts">Alerts</router-link> - Alert para mensagens
                        contextuais</li>
                    <li><router-link to="/ui/alerts-overlay/toasts">Toasts</router-link> - Toast notifications com
                        posicionamento</li>
                    <li>Spinner - Indicador de carregamento</li>
                    <li>ProgressBar - Barra de progresso</li>
                </ul>
            </div>

            <div class="category-card">
                <h3>📊 Visualization</h3>
                <p>Componentes para visualização de dados.</p>
                <ul>
                    <li><router-link to="/ui/visualization/charts">Charts</router-link> - Line, Bar, Pie, Area, Scatter,
                        Graph</li>
                </ul>
                <p class="note">
                    <strong>Arquitetura BaseChart:</strong> Todos os gráficos utilizam o padrão pai/filho com
                    BaseChart fornecendo container, header, toolbar e legenda, enquanto os gráficos específicos
                    implementam a lógica de renderização usando Canvas 2D API.
                </p>
            </div>

            <div class="category-card">
                <h3>🎯 Icons</h3>
                <p>Conjuntos de ícones e símbolos.</p>
                <ul>
                    <li><router-link to="/ui/icons/emojis">Emojis</router-link> - Coleção de emojis categorizados</li>
                    <li><router-link to="/ui/icons/brands">Brands</router-link> - Logos de marcas e plataformas</li>
                    <li><router-link to="/ui/icons/ui">UI Icons</router-link> - Ícones de interface</li>
                </ul>
            </div>
        </section>

        <section class="doc-section">
            <h2>Padrões Arquiteturais</h2>

            <h3>Composables</h3>
            <p>Lógica reutilizável através de composables:</p>
            <ul>
                <li><code>useTheme</code> - Gerenciamento de temas</li>
                <li><code>useModal</code> - Controle programático de modais</li>
                <li><code>useToast</code> - Sistema de notificações toast</li>
                <li><code>useLoading</code> - Estados de carregamento</li>
                <li><code>useChart</code> - Gerenciamento de canvas para gráficos</li>
            </ul>

            <h3>Padrão Pai/Filho</h3>
            <p>
                Componentes complexos seguem o padrão BaseComponent + Children específicos:
            </p>
            <ul>
                <li><strong>BaseChart</strong> → LineChart, BarChart, PieChart, etc.</li>
                <li>Container compartilhado com slots para customização</li>
                <li>Consistência visual e comportamental</li>
                <li>Reutilização de código (DRY)</li>
            </ul>

            <h3>Type Safety</h3>
            <p>
                Todos os componentes possuem tipos TypeScript completos exportados,
                incluindo Props, Emits, e interfaces específicas.
            </p>
        </section>

        <section class="doc-section">
            <h2>Guias de Uso</h2>
            <p>
                Cada componente possui uma view de demonstração completa com exemplos de código,
                props disponíveis, eventos e casos de uso comuns. Navegue pelo menu lateral
                para explorar os componentes.
            </p>
        </section>

        <section class="doc-section">
            <h2>Próximos Passos</h2>
            <ul>
                <li>Explore os <router-link to="/ui/actions/buttons">componentes de ação</router-link> para começar</li>
                <li>Aprenda sobre <router-link to="/ui/data-management/forms">componentes complexos</router-link></li>
                <li>Veja o <router-link to="/docs/theming">sistema de temas</router-link> para customização</li>
                <li>Confira os <router-link to="/ui/visualization/charts">gráficos</router-link> para visualização de
                    dados</li>
            </ul>
        </section>
    </div>
</template>

<style lang="scss" scoped>
.view-container {
    h1 {
        margin-bottom: var(--spacing-sm);
    }

    .view-description {
        color: var(--color-text-secondary);
        font-size: var(--font-size-lg);
        margin-bottom: var(--spacing-2xl);
    }

    .doc-section {
        margin-bottom: var(--spacing-2xl);

        h2 {
            color: var(--color-primary);
            margin-bottom: var(--spacing-md);
            padding-bottom: var(--spacing-sm);
            border-bottom: 2px solid var(--color-border);
        }

        h3 {
            margin-top: var(--spacing-lg);
            margin-bottom: var(--spacing-md);
            color: var(--color-text);
        }

        p {
            line-height: 1.6;
            margin-bottom: var(--spacing-md);
        }

        ul,
        ol {
            margin-left: var(--spacing-lg);
            margin-bottom: var(--spacing-md);

            li {
                margin-bottom: var(--spacing-sm);
                line-height: 1.6;
            }
        }

        code {
            background: var(--color-surface);
            padding: 0.2em 0.4em;
            border-radius: var(--radius-sm);
            font-family: 'Courier New', monospace;
            font-size: 0.9em;
        }
    }

    .category-card {
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        padding: var(--spacing-lg);
        margin-bottom: var(--spacing-lg);
        transition: all 0.2s ease;

        &:hover {
            box-shadow: var(--shadow-md);
            border-color: var(--color-primary);
        }

        h3 {
            margin-top: 0;
            margin-bottom: var(--spacing-sm);
            color: var(--color-primary);
        }

        >p {
            color: var(--color-text-secondary);
            margin-bottom: var(--spacing-md);
        }

        ul {
            margin-left: var(--spacing-md);

            li {
                margin-bottom: var(--spacing-sm);
            }
        }

        .note {
            background: hsl(var(--color-info-h), var(--color-info-s), calc(var(--color-info-l) + 40%));
            border-left: 4px solid var(--color-info);
            padding: var(--spacing-sm) var(--spacing-md);
            border-radius: var(--radius-sm);
            margin-top: var(--spacing-md);
            font-size: var(--font-size-sm);

            strong {
                color: var(--color-info);
            }
        }
    }

    a {
        color: var(--color-primary);
        text-decoration: none;

        &:hover {
            text-decoration: underline;
        }
    }
}
</style>
