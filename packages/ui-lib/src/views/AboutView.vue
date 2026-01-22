<script setup lang="ts">
/**
 * AboutView - Sobre o projeto
 */
</script>

<template>
    <div class="view-container">
        <div class="hero">
            <h1>Lugand UI</h1>
            <p class="tagline">Uma biblioteca de componentes Vue 3 moderna e elegante</p>
        </div>

        <section class="doc-section">
            <h2>Sobre a Biblioteca</h2>
            <p>
                <strong>Lugand UI</strong> é uma biblioteca de componentes Vue 3 construída com foco em 
                <strong>Developer Experience (DX)</strong> e <strong>User Experience (UX)</strong>. 
                Oferecemos uma coleção completa de componentes reutilizáveis, seguindo padrões 
                arquiteturais modernos e best practices da comunidade Vue.
            </p>
            <p>
                Nossa missão é fornecer ferramentas que permitam aos desenvolvedores criar interfaces 
                incríveis de forma rápida, consistente e manutenível.
            </p>
        </section>

        <section class="doc-section">
            <h2>Tecnologias</h2>
            <div class="tech-grid">
                <div class="tech-card">
                    <h3>🚀 Vue 3</h3>
                    <p>Composition API com <code>&lt;script setup&gt;</code> para código mais limpo e performático.</p>
                </div>
                <div class="tech-card">
                    <h3>📘 TypeScript</h3>
                    <p>Type safety completo com interfaces exportadas e strict mode habilitado.</p>
                </div>
                <div class="tech-card">
                    <h3>⚡ Vite</h3>
                    <p>Build ultra-rápido com Vite 7 e Rolldown para otimização de produção.</p>
                </div>
                <div class="tech-card">
                    <h3>🎨 SCSS</h3>
                    <p>Design tokens em CSS Variables com sistema HSL para tematização dinâmica.</p>
                </div>
            </div>
        </section>

        <section class="doc-section">
            <h2>Princípios de Design</h2>
            <ul class="principles-list">
                <li>
                    <strong>🎯 Composabilidade:</strong> Componentes pequenos e focados que podem ser 
                    combinados para criar interfaces complexas.
                </li>
                <li>
                    <strong>♿ Acessibilidade:</strong> Componentes seguem padrões ARIA e boas práticas 
                    de acessibilidade para inclusão de todos os usuários.
                </li>
                <li>
                    <strong>🎨 Customização:</strong> Sistema de temas completo com 10+ temas pré-configurados 
                    e suporte a temas customizados.
                </li>
                <li>
                    <strong>📦 Tree-shakeable:</strong> Importe apenas os componentes que você usa, 
                    mantendo o bundle otimizado.
                </li>
                <li>
                    <strong>🔧 Type Safe:</strong> TypeScript em todo o código com tipos exportados 
                    para melhor IntelliSense.
                </li>
                <li>
                    <strong>📚 Bem Documentado:</strong> Cada componente possui exemplos, documentação 
                    de API e casos de uso práticos.
                </li>
            </ul>
        </section>

        <section class="doc-section">
            <h2>Arquitetura</h2>
            <p>
                A biblioteca é organizada seguindo padrões bem definidos:
            </p>
            <ul>
                <li>
                    <strong>Padrão Pai/Filho:</strong> Componentes complexos como Charts utilizam um 
                    componente base (BaseChart) que fornece UI/UX consistente, enquanto componentes 
                    específicos (LineChart, BarChart) implementam a lógica especializada.
                </li>
                <li>
                    <strong>Composables:</strong> Lógica compartilhada é extraída em composables 
                    reutilizáveis como <code>useTheme</code>, <code>useModal</code>, <code>useChart</code>.
                </li>
                <li>
                    <strong>Singleton Managers:</strong> Sistemas globais como modalStack gerenciam 
                    estado compartilhado (z-index de modais, por exemplo).
                </li>
                <li>
                    <strong>Design Tokens:</strong> Todas as cores, espaçamentos e outros valores visuais 
                    são definidos como tokens CSS reutilizáveis.
                </li>
            </ul>
        </section>

        <section class="doc-section">
            <h2>Casos de Uso</h2>
            <p>Lugand UI é ideal para:</p>
            <ul>
                <li>Dashboards administrativos</li>
                <li>Aplicações SaaS</li>
                <li>Sistemas internos corporativos</li>
                <li>Protótipos e MVPs</li>
                <li>Aplicações data-driven com visualizações</li>
                <li>Projetos que precisam de tematização flexível</li>
            </ul>
        </section>

        <section class="doc-section">
            <h2>Roadmap</h2>
            <p>Próximas features planejadas:</p>
            <ul>
                <li>Família de componentes de Notificações (Toast, Alert, Banner, Snackbar)</li>
                <li>Componentes avançados de Tabela (TreeTable, PivotTable)</li>
                <li>Família de Menus (Dropdown, ContextMenu, Mega Menu)</li>
                <li>Testes unitários e E2E completos</li>
                <li>Documentação de arquitetura para todas as famílias de componentes</li>
                <li>Suporte a animações customizáveis</li>
                <li>Modo de alto contraste</li>
            </ul>
        </section>

        <section class="doc-section">
            <h2>Licença</h2>
            <p>
                Lugand UI é um projeto open source distribuído sob a licença MIT. 
                Você é livre para usar, modificar e distribuir conforme necessário.
            </p>
        </section>

        <section class="doc-section">
            <h2>Comece Agora</h2>
            <p>
                Pronto para começar? Confira o <router-link to="/docs/get-started">guia de instalação</router-link> 
                e comece a construir interfaces incríveis!
            </p>
        </section>
    </div>
</template>

<style lang="scss" scoped>
.view-container {
    .hero {
        text-align: center;
        padding: var(--spacing-2xl) 0;
        margin-bottom: var(--spacing-2xl);
        background: linear-gradient(
            135deg,
            hsl(var(--color-primary-h), var(--color-primary-s), calc(var(--color-primary-l) + 40%)),
            hsl(var(--color-secondary-h), var(--color-secondary-s), calc(var(--color-secondary-l) + 40%))
        );
        border-radius: var(--radius-lg);

        h1 {
            font-size: 3rem;
            margin-bottom: var(--spacing-md);
            color: var(--color-primary);
        }

        .tagline {
            font-size: var(--font-size-xl);
            color: var(--color-text-secondary);
        }
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

        ul, ol {
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

    .tech-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: var(--spacing-lg);
        margin: var(--spacing-lg) 0;
    }

    .tech-card {
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        padding: var(--spacing-lg);
        transition: all 0.2s ease;

        &:hover {
            box-shadow: var(--shadow-lg);
            transform: translateY(-4px);
            border-color: var(--color-primary);
        }

        h3 {
            margin-top: 0;
            margin-bottom: var(--spacing-sm);
            font-size: var(--font-size-lg);
        }

        p {
            margin: 0;
            color: var(--color-text-secondary);
            line-height: 1.5;
        }
    }

    .principles-list {
        li {
            padding: var(--spacing-md);
            background: var(--color-surface);
            border-left: 4px solid var(--color-primary);
            margin-bottom: var(--spacing-md);
            border-radius: var(--radius-sm);

            strong {
                display: block;
                margin-bottom: var(--spacing-xs);
                color: var(--color-primary);
            }
        }
    }

    a {
        color: var(--color-primary);
        text-decoration: none;
        font-weight: var(--font-weight-medium);
        
        &:hover {
            text-decoration: underline;
        }
    }
}
</style>
