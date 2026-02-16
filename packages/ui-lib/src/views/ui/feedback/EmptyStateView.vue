<script setup lang="ts">
import { ref } from 'vue'
import { EmptyState, Card, Button, ComponentShowcase, CodeBlock, GridContainer } from '@/shared/components'
import { useToast } from '@/modules/toast'

// Toast para notificações
const toast = useToast()

// Estado para exemplo interativo
const showExampleContent = ref(false)

// Handlers para os botões
function handleCreateNote() {
    toast.success({
        title: 'Nota criada!',
        message: 'Sua nova nota foi criada com sucesso.',
        duration: 3000
    })
}

function handleViewProducts() {
    toast.info({
        title: 'Redirecionando...',
        message: 'Abrindo catálogo de produtos.',
        duration: 2000
    })
}

function handleClearSearch() {
    toast.info('Busca limpa! Mostrando todos os resultados.')
}

function handleViewAll() {
    toast.success('Carregando todos os itens...')
}
</script>

<template>
    <div class="empty-state-view">
        <div class="header">
            <h1>Estados Vazios</h1>
            <p class="lead">Componentes e padrões para exibir quando não há dados disponíveis.</p>
        </div>

        <!-- 1. EMPTYSTATE BÁSICO -->
        <ComponentShowcase title="EmptyState (Componente Reutilizável)"
            description="Componente flex ível para exibir estados vazios em qualquer contexto.">
            <template #preview>
                <div class="showcase-group">
                    <h4>Básico</h4>
                    <EmptyState title="Nenhum item encontrado" description="Não há itens para exibir no momento." />
                </div>

                <div class="showcase-group">
                    <h4>Tamanhos</h4>
                    <div style="display: flex; gap: var(--spacing-xl); flex-wrap: wrap;">
                        <div style="flex: 1; min-width: 250px;">
                            <EmptyState size="sm" icon="📋" title="Lista vazia" description="Nenhum item adicionado." />
                        </div>
                        <div style="flex: 1; min-width: 250px;">
                            <EmptyState size="md" icon="📦" title="Lista vazia" description="Nenhum item adicionado." />
                        </div>
                        <div style="flex: 1; min-width: 250px;">
                            <EmptyState size="lg" icon="🗃️" title="Lista vazia"
                                description="Nenhum item adicionado." />
                        </div>
                    </div>
                </div>

                <div class="showcase-group">
                    <h4>Variantes (cores do ícone)</h4>
                    <div style="display: flex; gap: var(--spacing-xl); flex-wrap: wrap;">
                        <div style="flex: 1; min-width: 200px;">
                            <EmptyState variant="default" icon="📦" title="Padrão" size="sm" />
                        </div>
                        <div style="flex: 1; min-width: 200px;">
                            <EmptyState variant="search" icon="🔍" title="Busca" size="sm" />
                        </div>
                        <div style="flex: 1; min-width: 200px;">
                            <EmptyState variant="error" icon="⚠️" title="Erro" size="sm" />
                        </div>
                        <div style="flex: 1; min-width: 200px;">
                            <EmptyState variant="info" icon="ℹ️" title="Info" size="sm" />
                        </div>
                    </div>
                </div>

                <div class="showcase-group">
                    <h4>Com Ação</h4>
                    <EmptyState icon="📝" title="Nenhuma nota criada" description="Comece criando sua primeira nota."
                        action-label="Criar Nota" @action="handleCreateNote" />
                </div>

                <div class="showcase-group">
                    <h4>Com Card</h4>
                    <EmptyState with-card icon="🛒" title="Carrinho vazio"
                        description="Adicione produtos ao seu carrinho." action-label="Ver Produtos"
                        @action="handleViewProducts" />
                </div>

                <div class="showcase-group">
                    <h4>Conteúdo Customizado (slots)</h4>
                    <EmptyState icon="🔍" title="Nenhum resultado para sua busca">
                        <template #default>
                            <p style="margin: var(--spacing-md) 0; color: var(--color-text-secondary);">
                                Sugestões:
                            </p>
                            <ul
                                style="text-align: left; margin: 0 auto; max-width: 300px; color: var(--color-text-secondary);">
                                <li>Verifique a ortografia</li>
                                <li>Use termos mais genéricos</li>
                                <li>Tente palavras-chave diferentes</li>
                            </ul>
                        </template>
                        <template #actions>
                            <Button variant="primary" @click="handleClearSearch">Limpar Busca</Button>
                            <Button variant="outline" @click="handleViewAll">Ver Todos</Button>
                        </template>
                    </EmptyState>
                </div>

                <div class="showcase-group">
                    <h4>Exemplo Interativo</h4>
                    <Card padding="md">
                        <div style="margin-bottom: var(--spacing-md);">
                            <Button variant="outline" size="sm" @click="showExampleContent = !showExampleContent">
                                {{ showExampleContent ? 'Mostrar Empty' : 'Mostrar Conteúdo' }}
                            </Button>
                        </div>
                        <div v-if="showExampleContent"
                            style="padding: var(--spacing-lg); background: var(--color-bg-tertiary); border-radius: var(--radius-md);">
                            <h4 style="margin: 0 0 var(--spacing-sm) 0;">Lista de Tarefas</h4>
                            <ul style="margin: 0; padding-left: var(--spacing-lg);">
                                <li>Tarefa 1</li>
                                <li>Tarefa 2</li>
                                <li>Tarefa 3</li>
                            </ul>
                        </div>
                        <EmptyState v-else icon="✅" title="Todas as tarefas concluídas!"
                            description="Você completou todas as suas tarefas. Parabéns!" size="sm" />
                    </Card>
                </div>

                <div class="showcase-group">
                    <h4>Integração com Toast (Notificações)</h4>
                    <p
                        style="color: var(--color-text-secondary); font-size: 0.875rem; margin-bottom: var(--spacing-md);">
                        Demonstração de como usar Toast para feedback de ações nos Empty States.
                    </p>
                    <div style="display: grid; gap: var(--spacing-lg);">
                        <EmptyState icon="✨" title="Experimente os Toasts!"
                            description="Clique nos botões abaixo para ver notificações em ação." size="sm">
                            <template #actions>
                                <Button variant="primary" size="sm"
                                    @click="toast.success('Operação concluída com sucesso!')">
                                    Success Toast
                                </Button>
                                <Button variant="secondary" size="sm"
                                    @click="toast.info({ title: 'Informação', message: 'Este é um toast informativo.' })">
                                    Info Toast
                                </Button>
                                <Button variant="outline" size="sm"
                                    @click="toast.warning({ title: 'Atenção', message: 'Isso requer sua atenção.', duration: 4000 })">
                                    Warning Toast
                                </Button>
                                <Button variant="danger" size="sm"
                                    @click="toast.error({ title: 'Erro', message: 'Algo deu errado. Tente novamente.', duration: 5000 })">
                                    Error Toast
                                </Button>
                            </template>
                        </EmptyState>
                    </div>
                </div>
            </template>

            <template #code>
                <CodeBlock :code="`<!-- Básico -->
<EmptyState 
  title='Nenhum item encontrado' 
  description='Não há itens para exibir.' 
/>

<!-- Com ação -->
<EmptyState 
  icon='📝'
  title='Nenhuma nota criada' 
  description='Comece criando sua primeira nota.'
  action-label='Criar Nota'
  @action='createNote'
/>

<!-- Com Card wrapper -->
<EmptyState 
  with-card
  icon='🛒'
  title='Carrinho vazio'
  action-label='Ver Produtos'
/>

<!-- Tamanhos -->
<EmptyState size='sm' title='Pequeno' />
<EmptyState size='md' title='Médio' />
<EmptyState size='lg' title='Grande' />

<!-- Variantes -->
<EmptyState variant='default' icon='📦' />
<EmptyState variant='search' icon='🔍' />
<EmptyState variant='error' icon='⚠️' />
<EmptyState variant='info' icon='ℹ️' />

<!-- Slots customizados -->
<EmptyState icon='🔍' title='Nenhum resultado'>
  <template #default>
    <p>Conteúdo customizado</p>
  </template>
<template #actions>
    <Button @click='clearSearch'>Limpar</Button>
    <Button @click='viewAll'>Ver Todos</Button>
  </template>
</EmptyState>`" />
            </template>
        </ComponentShowcase>

        <!-- GRIDCONTAINER EMPTY STATE -->
        <ComponentShowcase title="GridContainer com Empty State"
            description="GridContainer já possui suporte nativo para estado vazio.">
            <template #preview>
                <div class="showcase-group">
                    <h4>Estado Empty (padrão)</h4>
                    <GridContainer :empty="true" :cols="3" gap="md" style="max-width: 800px;" />
                </div>

                <div class="showcase-group">
                    <h4>Empty Customizado (via slot)</h4>
                    <GridContainer :empty="true" :cols="2" gap="md" style="max-width: 600px;">
                        <template #empty>
                            <Card padding="lg" style="text-align: center; grid-column: 1 / -1;">
                                <div style="font-size: 3rem; margin-bottom: var(--spacing-md);">📦</div>
                                <h3 style="margin: 0 0 var(--spacing-sm) 0;">Nenhum produto encontrado</h3>
                                <p style="color: var(--color-text-secondary); margin: 0;">
                                    Tente ajustar os filtros ou adicionar novos produtos.
                                </p>
                            </Card>
                        </template>
                    </GridContainer>
                </div>
            </template>

            <template #code>
                <CodeBlock :code="`<!-- Empty padrão -->
<GridContainer :empty='true' :cols='3' gap='md'>
  <!-- Mostra mensagem padrão: 'Nenhum item encontrado.' -->
</GridContainer>

<!-- Empty customizado -->
<GridContainer :empty='isEmpty' :cols='2'>
  <template #empty>
    <Card style='text-align: center; grid-column: 1 / -1'>
      <div style='font-size: 3rem'>📦</div>
      <h3>Nenhum produto encontrado</h3>
      <p>Tente ajustar os filtros.</p>
    </Card>
  </template>

    <!-- Conteúdo real aqui -->
    <Card v-for='item in items' :key='item.id'>
        {{ item.title }}
    </Card>
    </GridContainer>`" />
            </template>
        </ComponentShowcase>

        <!-- PADRÕES COMUNS -->
        <Card padding="lg" variant="outline">
            <h3 style="margin-top: 0;">🎯 Padrões de Empty States</h3>
            <ul style="line-height: 1.8;">
                <li><strong>Busca sem resultados</strong>: "Nenhum resultado para '[termo]'" + botão limpar filtros
                </li>
                <li><strong>Lista vazia inicial</strong>: "Você ainda não tem [items]" + botão adicionar</li>
                <li><strong>Filtros muito restritivos</strong>: "Nenhum item encontrado com esses filtros" + sugestões
                </li>
                <li><strong>Erro temporário</strong>: "Não foi possível carregar" + botão tentar novamente</li>
                <li><strong>Permissão negada</strong>: "Você não tem acesso a esses dados" + link ajuda</li>
            </ul>
        </Card>
    </div>
</template>

<style lang="scss" scoped>
.empty-state-view {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xl);
}

.header {
    margin-bottom: var(--spacing-lg);

    h1 {
        font-size: 2rem;
        font-weight: 700;
        margin: 0 0 var(--spacing-sm) 0;
        color: var(--color-text-primary);
    }

    .lead {
        font-size: 1.125rem;
        color: var(--color-text-secondary);
        margin: 0;
        max-width: 800px;
    }
}

.showcase-group {
    margin-bottom: var(--spacing-lg);

    &:last-child {
        margin-bottom: 0;
    }

    h4 {
        font-size: 0.875rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        color: var(--color-text-secondary);
        margin: 0 0 var(--spacing-md) 0;
    }
}
</style>
