<template>
    <div class="timeline-view">
        <div class="header">
            <h1>Timeline</h1>
            <p class="lead">Componentes para exibir eventos cronológicos, rastreamento de pedidos e processos.</p>
        </div>

        <!-- 1. BÁSICO VERTICAL -->
        <ComponentShowcase title="Timeline Vertical (padrão)"
            description="Timeline padrão com status diferentes para cada item.">
            <template #preview>
                <Timeline>
                    <TimelineItem status="completed" title="Pedido Criado" description="Pedido #12345 foi criado"
                        timestamp="10:30 AM" icon="📝" />
                    <TimelineItem status="completed" title="Pagamento Confirmado"
                        description="Pagamento processado com sucesso" timestamp="10:35 AM" icon="💳" />
                    <TimelineItem status="current" title="Em Separação" description="Seu pedido está sendo preparado"
                        timestamp="11:00 AM" icon="📦" />
                    <TimelineItem status="pending" title="Em Transporte" description="Aguardando envio"
                        timestamp="--:--" icon="🚚" />
                    <TimelineItem status="pending" title="Entregue" description="Pedido será entregue" timestamp="--:--"
                        icon="✅" :is-last="true" />
                </Timeline>
            </template>

            <template #code>
                <CodeBlock code="<Timeline>
  <TimelineItem 
    status='completed'
    title='Pedido Criado' 
    description='Pedido #12345 foi criado'
    timestamp='10:30 AM'
    icon='📝'
  />
  
  <TimelineItem 
    status='current'
    title='Em Separação'
    description='Seu pedido está sendo preparado'
    timestamp='11:00 AM'
    icon='📦'
  />
  
  <TimelineItem 
    status='pending'
    title='Em Transporte'
    timestamp='--:--'
    icon='🚚'
  />
  
  <TimelineItem 
    status='pending'
    title='Entregue'
    :is-last='true'
    icon='✅'
  />
</Timeline>" />
            </template>
        </ComponentShowcase>

        <!-- 2. STATUS VARIANTS -->
        <ComponentShowcase title="Status Variants"
            description="Cinco status disponíveis: completed, current, pending, error, warning.">
            <template #preview>
                <Timeline>
                    <TimelineItem status="completed" title="Completed Status" description="Tarefa concluída com sucesso"
                        timestamp="Ontem" icon="✅" />
                    <TimelineItem status="current" title="Current Status" description="Tarefa em andamento no momento"
                        timestamp="Agora" icon="⏳" />
                    <TimelineItem status="pending" title="Pending Status" description="Aguardando início"
                        timestamp="Futuro" icon="⏱️" />
                    <TimelineItem status="error" title="Error Status" description="Ocorreu um erro no processo"
                        timestamp="2h atrás" icon="❌" />
                    <TimelineItem status="warning" title="Warning Status" description="Atenção necessária"
                        timestamp="1h atrás" icon="⚠️" :is-last="true" />
                </Timeline>
            </template>

            <template #code>
                <CodeBlock code="<Timeline>
  <TimelineItem status='completed' title='Completed' icon='✅' />
  <TimelineItem status='current' title='Current' icon='⏳' />
  <TimelineItem status='pending' title='Pending' icon='⏱️' />
  <TimelineItem status='error' title='Error' icon='❌' />
  <TimelineItem status='warning' title='Warning' icon='⚠️' :is-last='true' />
</Timeline>" />
            </template>
        </ComponentShowcase>

        <!-- 3. HORIZONTAL -->
        <ComponentShowcase title="Timeline Horizontal" description="Ideal para processos lineares e steppers.">
            <template #preview>
                <div
                    style="background: var(--color-bg-secondary); padding: var(--spacing-xl); border-radius: var(--radius-lg);">
                    <Timeline orientation="horizontal">
                        <TimelineItem orientation="horizontal" status="completed" title="Carrinho" icon="🛒"
                            timestamp="Etapa 1" />
                        <TimelineItem orientation="horizontal" status="completed" title="Endereço" icon="📍"
                            timestamp="Etapa 2" />
                        <TimelineItem orientation="horizontal" status="current" title="Pagamento" icon="💳"
                            timestamp="Etapa 3" />
                        <TimelineItem orientation="horizontal" status="pending" title="Confirmação" icon="✅"
                            timestamp="Etapa 4" :is-last="true" />
                    </Timeline>
                </div>
            </template>

            <template #code>
                <CodeBlock code="<Timeline orientation='horizontal'>
  <TimelineItem 
    orientation='horizontal'
    status='completed'
    title='Carrinho'
    icon='🛒'
  />
  
  <TimelineItem 
    orientation='horizontal'
    status='current'
    title='Pagamento'
    icon='💳'
  />
  
  <TimelineItem 
    orientation='horizontal'
    status='pending'
    title='Confirmação'
    icon='✅'
    :is-last='true'
  />
</Timeline>" />
            </template>
        </ComponentShowcase>

        <!-- 4. VARIANT COMPACT -->
        <ComponentShowcase title="Variant Compact" description="Timeline com espaçamento reduzido.">
            <template #preview>
                <Timeline variant="compact">
                    <TimelineItem status="completed" title="Deploy iniciado" timestamp="14:30" icon="🚀" />
                    <TimelineItem status="completed" title="Build concluído" timestamp="14:32" icon="🔨" />
                    <TimelineItem status="completed" title="Testes passaram" timestamp="14:35" icon="✅" />
                    <TimelineItem status="current" title="Deploy em produção" timestamp="14:37" icon="🌐" />
                    <TimelineItem status="pending" title="Verificação" timestamp="--:--" icon="🔍" :is-last="true" />
                </Timeline>
            </template>

            <template #code>
                <CodeBlock code="<Timeline variant='compact'>
  <TimelineItem 
    status='completed'
    title='Deploy iniciado'
    timestamp='14:30'
    icon='🚀'
  />
  <!-- Mais itens... -->
</Timeline>" />
            </template>
        </ComponentShowcase>

        <!-- 5. SEM ÍCONES -->
        <ComponentShowcase title="Sem Ícones (dot padrão)"
            description="TimelineItem sem prop icon usa dot colorido automático.">
            <template #preview>
                <Timeline>
                    <TimelineItem status="completed" title="Tarefa 1" description="Primeira tarefa concluída"
                        timestamp="10:00" />
                    <TimelineItem status="completed" title="Tarefa 2" description="Segunda tarefa concluída"
                        timestamp="11:00" />
                    <TimelineItem status="current" title="Tarefa 3" description="Em andamento" timestamp="12:00" />
                    <TimelineItem status="pending" title="Tarefa 4" description="Pendente" timestamp="--:--"
                        :is-last="true" />
                </Timeline>
            </template>

            <template #code>
                <CodeBlock code="<Timeline>
  <TimelineItem 
    status='completed'
    title='Tarefa 1'
    description='Concluída'
  />
  <!-- Sem prop icon, usa dot automático -->
</Timeline>" />
            </template>
        </ComponentShowcase>

        <!-- 6. CONTEÚDO CUSTOMIZADO -->
        <ComponentShowcase title="Slots Customizados" description="Customize título, timestamp, ícone e conteúdo.">
            <template #preview>
                <Timeline>
                    <!-- Custom icon slot -->
                    <TimelineItem status="completed" title="Upload Completo" timestamp="5 min atrás">
                        <template #icon>
                            <div
                                style="width: 24px; height: 24px; border-radius: 50%; background: var(--color-success); display: flex; align-items: center; justify-content: center; color: white; font-size: 0.75rem;">
                                ✓
                            </div>
                        </template>
                        <template #description>
                            <div style="color: var(--color-text-secondary);">
                                3 arquivos enviados com sucesso
                            </div>
                        </template>
                        <Card padding="sm" style="margin-top: var(--spacing-sm);">
                            <div style="font-size: 0.8125rem;">
                                <div>📄 documento.pdf (2.5 MB)</div>
                                <div>📊 relatorio.xlsx (1.2 MB)</div>
                                <div>🖼️ imagem.jpg (850 KB)</div>
                            </div>
                        </Card>
                    </TimelineItem>

                    <!-- Custom title + badge -->
                    <TimelineItem status="current" timestamp="Agora">
                        <template #title>
                            <div style="display: flex; align-items: center; gap: var(--spacing-sm);">
                                <span>Processando</span>
                                <Badge variant="primary" size="sm">Em andamento</Badge>
                            </div>
                        </template>
                        <div
                            style="display: flex; align-items: center; gap: var(--spacing-sm); margin-top: var(--spacing-sm);">
                            <div
                                style="flex: 1; height: 8px; background: var(--color-bg-tertiary); border-radius: var(--radius-full); overflow: hidden;">
                                <div
                                    style="width: 65%; height: 100%; background: var(--color-primary); transition: width 0.3s;">
                                </div>
                            </div>
                            <span style="font-size: 0.8125rem; color: var(--color-text-secondary);">65%</span>
                        </div>
                    </TimelineItem>

                    <!-- Custom content with actions -->
                    <TimelineItem status="error" title="Falha na Validação" timestamp="10 min atrás" icon="❌">
                        <div style="margin-top: var(--spacing-sm);">
                            <div
                                style="padding: var(--spacing-sm); background: var(--color-error-bg); border-radius: var(--radius-sm); font-size: 0.8125rem; color: var(--color-error); margin-bottom: var(--spacing-sm);">
                                ⚠️ Formato de arquivo inválido detectado
                            </div>
                            <Button size="sm" variant="outline">
                                Tentar Novamente
                            </Button>
                        </div>
                    </TimelineItem>

                    <TimelineItem status="pending" title="Próxima Etapa" timestamp="Aguardando" :is-last="true" />
                </Timeline>
            </template>

            <template #code>
                <CodeBlock code="<Timeline>
  <!-- Custom icon -->
  <TimelineItem title='Upload'>
    <template #icon>
      <div style='...'>✓</div>
    </template>
    </TimelineItem>

    <!-- Custom title com Badge -->
    <TimelineItem>
        <template #title>
      <span>Processando</span>
      <Badge variant='primary'>Em andamento</Badge>
    </template>
    </TimelineItem>

    <!-- Custom content (default slot) -->
    <TimelineItem title='Falha'>
        <div>Conteúdo customizado</div>
        <Button size='sm'>Tentar Novamente</Button>
    </TimelineItem>
    </Timeline>" />
            </template>
        </ComponentShowcase>

        <!-- 7. CLICKABLE -->
        <ComponentShowcase title="Itens Clicáveis" description="TimelineItem com evento @click.">
            <template #preview>
                <Timeline>
                    <TimelineItem clickable status="completed" title="Ver Detalhes do Pedido #12345"
                        description="Clique para ver informações completas" timestamp="10:30 AM" icon="📦" />
                    <TimelineItem clickable status="completed" title="Ver Comprovante de Pagamento"
                        description="Clique para baixar comprovante" timestamp="10:35 AM" icon="💳" />
                    <TimelineItem clickable status="current" title="Rastrear Entrega"
                        description="Clique para ver rastreamento" timestamp="11:00 AM" icon="🚚" :is-last="true" />
                </Timeline>
            </template>

            <template #code>
                <CodeBlock code="<Timeline>
  <TimelineItem 
    clickable
    status='completed'
    title='Ver Detalhes'
    @click='viewDetails'
  />
  
  <TimelineItem 
    clickable
    status='current'
    title='Rastrear Entrega'
    @click='trackOrder'
    :is-last='true'
  />
</Timeline>" />
            </template>
        </ComponentShowcase>

        <!-- BEST PRACTICES -->
        <Card padding="lg" variant="outline">
            <h3 style="margin: 0 0 var(--spacing-md) 0;">💡 Boas Práticas</h3>
            <ul style="margin: 0; padding-left: var(--spacing-lg); color: var(--color-text-secondary);">
                <li>Use <strong>status="current"</strong> para destacar o evento atual em processos</li>
                <li>Combine <strong>status</strong> com ícones apropriados (✅ completed, ⏳ current, ⏱️ pending)</li>
                <li>Use <strong>orientation="horizontal"</strong> para steppers e processos lineares</li>
                <li>Use <strong>variant="compact"</strong> para históricos longos com muitos itens</li>
                <li>Marque o último item com <strong>:is-last="true"</strong> para remover linha conectora</li>
                <li>Para eventos críticos, use <strong>status="error"</strong> ou <strong>"warning"</strong></li>
                <li>Timestamps devem ser consistentes (formato relativo ou absoluto, não misture)</li>
                <li>Use <strong>clickable</strong> quando o item abre detalhes ou executa ação</li>
            </ul>
        </Card>
    </div>
</template>

<script setup lang="ts">
import ComponentShowcase from '@/shared/components/layout/ComponentShowcase.vue'
import CodeBlock from '@/shared/components/layout/CodeBlock.vue'
import Timeline from '@/shared/components/display/Timeline.vue'
import TimelineItem from '@/shared/components/display/TimelineItem.vue'
import Card from '@/shared/components/display/Card.vue'
import Badge from '@/shared/components/display/Badge.vue'
import Button from '@/shared/components/primitives/Button.vue'
</script>

<style scoped lang="scss">
.timeline-view {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-2xl);
    padding: var(--spacing-2xl);

    .header {
        h1 {
            margin: 0 0 var(--spacing-sm) 0;
            font-size: 2rem;
            color: var(--color-text-primary);
        }

        .lead {
            margin: 0;
            font-size: 1.125rem;
            color: var(--color-text-secondary);
        }
    }
}
</style>
