<template>
    <div class="stat-card-view">
        <div class="header">
            <h1>StatCard</h1>
            <p class="lead">Componente especializado para exibir estatísticas e KPIs em dashboards.</p>
        </div>

        <!-- 1. BÁSICO -->
        <ComponentShowcase title="Uso Básico" description="StatCard com valor, label e ícone.">
            <template #preview>
                <div
                    style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: var(--spacing-lg);">
                    <StatCard :value="12548" label="Vendas Totais" icon="💰" />
                    <StatCard :value="1234" label="Clientes Ativos" icon="👥" />
                    <StatCard value="98.5%" label="Taxa de Aprovação" icon="✅" />
                    <StatCard :value="42" label="Pedidos Pendentes" icon="📦" />
                </div>
            </template>

            <template #code>
                <CodeBlock :code="`<StatCard 
  :value='12548' 
  label='Vendas Totais' 
  icon='💰' 
/>

<StatCard 
  :value='1234' 
  label='Clientes Ativos' 
  icon='👥' 
/>

<StatCard 
  value='98.5%' 
  label='Taxa de Aprovação' 
  icon='✅' 
/>`" />
            </template>
        </ComponentShowcase>

        <!-- 2. TAMANHOS -->
        <ComponentShowcase title="Tamanhos" description="Três tamanhos disponíveis: sm, md (padrão), lg.">
            <template #preview>
                <div style="display: grid; gap: var(--spacing-lg);">
                    <StatCard size="sm" :value="250" label="Pequeno" icon="📊" description="Size: sm" />
                    <StatCard size="md" :value="5420" label="Médio (padrão)" icon="📈" description="Size: md" />
                    <StatCard size="lg" :value="89750" label="Grande" icon="💎" description="Size: lg" />
                </div>
            </template>

            <template #code>
                <CodeBlock :code="`<StatCard size='sm' :value='250' label='Pequeno' icon='📊' />
<StatCard size='md' :value='5420' label='Médio' icon='📈' />
<StatCard size='lg' :value='89750' label='Grande' icon='💎' />`" />
            </template>
        </ComponentShowcase>

        <!-- 3. VARIANTES -->
        <ComponentShowcase title="Variantes (cores do ícone)"
            description="Seis variantes que afetam a cor do ícone e fundo.">
            <template #preview>
                <div
                    style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--spacing-lg);">
                    <StatCard variant="default" :value="1234" label="Default" icon="📊" />
                    <StatCard variant="primary" :value="5678" label="Primary" icon="🎯" />
                    <StatCard variant="success" :value="9012" label="Success" icon="✅" />
                    <StatCard variant="warning" :value="345" label="Warning" icon="⚠️" />
                    <StatCard variant="error" :value="67" label="Error" icon="❌" />
                    <StatCard variant="info" :value="890" label="Info" icon="ℹ️" />
                </div>
            </template>

            <template #code>
                <CodeBlock :code="`<StatCard variant='default' :value='1234' label='Default' icon='📊' />
<StatCard variant='primary' :value='5678' label='Primary' icon='🎯' />
<StatCard variant='success' :value='9012' label='Success' icon='✅' />
<StatCard variant='warning' :value='345' label='Warning' icon='⚠️' />
<StatCard variant='error' :value='67' label='Error' icon='❌' />
<StatCard variant='info' :value='890' label='Info' icon='ℹ️' />`" />
            </template>
        </ComponentShowcase>

        <!-- 4. COM TENDÊNCIA -->
        <ComponentShowcase title="Com Tendência" description="Exiba mudanças com trend (up/down/neutral).">
            <template #preview>
                <div
                    style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: var(--spacing-lg);">
                    <StatCard variant="success" :value="15420" label="Receita Mensal" icon="💰" trend="up"
                        trend-value="+12.5%" trend-label="vs. mês anterior" />

                    <StatCard variant="error" :value="248" label="Tickets Abertos" icon="🎫" trend="down"
                        trend-value="-8%" trend-label="vs. semana anterior" />

                    <StatCard variant="primary" :value="3250" label="Visitas" icon="👀" trend="neutral" trend-value="0%"
                        trend-label="sem mudanças" />

                    <StatCard variant="warning" :value="42" label="Pedidos Pendentes" icon="📦" trend="up"
                        trend-value="+5" trend-label="últimas 24h" />
                </div>
            </template>

            <template #code>
                <CodeBlock :code="`<!-- Crescimento -->
<StatCard 
  variant='success'
  :value='15420' 
  label='Receita Mensal' 
  icon='💰'
  trend='up'
  trend-value='+12.5%'
  trend-label='vs. mês anterior'
/>

<!-- Queda -->
<StatCard 
  variant='error'
  :value='248' 
  label='Tickets Abertos'
  trend='down'
  trend-value='-8%'
/>

<!-- Neutral -->
<StatCard 
  trend='neutral'
  trend-value='0%'
  trend-label='sem mudanças'
/>`" />
            </template>
        </ComponentShowcase>

        <!-- 5. COM DESCRIÇÃO -->
        <ComponentShowcase title="Com Descrição" description="Adicione contexto extra com a prop description.">
            <template #preview>
                <div
                    style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: var(--spacing-lg);">
                    <StatCard variant="primary" :value="89.7" label="NPS Score" icon="⭐"
                        description="Net Promoter Score do último trimestre" trend="up" trend-value="+3.2" />

                    <StatCard variant="success" value="4.8/5" label="Avaliação Média" icon="🌟"
                        description="Baseado em 1.250 avaliações" />

                    <StatCard variant="info" :value="24567" label="Downloads" icon="⬇️"
                        description="Total acumulado desde o lançamento" trend="up" trend-value="+450"
                        trend-label="esta semana" />
                </div>
            </template>

            <template #code>
                <CodeBlock :code="`<StatCard 
  variant='primary'
  :value='89.7' 
  label='NPS Score' 
  icon='⭐'
  description='Net Promoter Score do último trimestre'
  trend='up'
  trend-value='+3.2'
/>`" />
            </template>
        </ComponentShowcase>

        <!-- 6. COM CARD VARIANT -->
        <ComponentShowcase title="Variantes de Card" description="Controle o estilo do Card wrapper com cardVariant.">
            <template #preview>
                <div style="display: grid; gap: var(--spacing-lg);">
                    <StatCard card-variant="default" :value="1234" label="Default Card" icon="📊" />
                    <StatCard card-variant="outline" :value="5678" label="Outline Card" icon="📈" />
                    <StatCard card-variant="ghost" :value="9012" label="Ghost Card" icon="💡" />
                    <StatCard card-variant="flat" :value="3456" label="Flat Card" icon="🎯" />
                </div>
            </template>

            <template #code>
                <CodeBlock :code="`<StatCard card-variant='default' :value='1234' label='Default' />
<StatCard card-variant='outline' :value='5678' label='Outline' />
<StatCard card-variant='ghost' :value='9012' label='Ghost' />
<StatCard card-variant='flat' :value='3456' label='Flat' />`" />
            </template>
        </ComponentShowcase>

        <!-- 7. COM SLOTS CUSTOMIZADOS -->
        <ComponentShowcase title="Slots Customizados" description="Customize ícone, label, valor, descrição e ações.">
            <template #preview>
                <div style="display: grid; gap: var(--spacing-lg);">
                    <!-- Custom icon slot -->
                    <StatCard :value="1234" label="Vendas">
                        <template #icon>
                            <div
                                style="width: 48px; height: 48px; border-radius: 50%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white;">
                                💰
                            </div>
                        </template>
                    </StatCard>

                    <!-- Custom value slot -->
                    <StatCard value="75" label="Progresso">
                        <template #value>
                            <div style="display: flex; align-items: center; gap: var(--spacing-sm);">
                                <span style="font-size: 2rem; font-weight: 700;">75%</span>
                                <Badge variant="success">Ativo</Badge>
                            </div>
                        </template>
                    </StatCard>

                    <!-- Custom actions slot -->
                    <StatCard variant="primary" :value="5678" label="Relatório Mensal" icon="📊">
                        <template #actions>
                            <Button variant="ghost" size="sm">
                                Ver
                            </Button>
                        </template>
                    </StatCard>

                    <!-- Multiple slots -->
                    <StatCard value="18.5" label="Taxa de Conversão">
                        <template #icon>
                            <div
                                style="width: 48px; height: 48px; border-radius: var(--radius-md); background: var(--color-success-bg); display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">
                                🎯
                            </div>
                        </template>
                        <template #value>
                            <div>
                                <div style="font-size: 2rem; font-weight: 700; color: var(--color-success);">
                                    18.5%
                                </div>
                                <div style="font-size: 0.75rem; color: var(--color-text-tertiary); margin-top: 2px;">
                                    Meta: 15%
                                </div>
                            </div>
                        </template>
                        <template #description>
                            <Badge variant="success" size="sm">Acima da meta</Badge>
                        </template>
                    </StatCard>
                </div>
            </template>

            <template #code>
                <CodeBlock :code="`<!-- Custom icon -->
<StatCard :value='1234' label='Vendas'>
  <template #icon>
    <div style='...gradient...'>💰</div>
  </template>
    </StatCard>

    <!-- Custom value -->
    <StatCard label='Progresso'>
        <template #value>
    <span>75%</span>
    <Badge variant='success'>Ativo</Badge>
  </template>
    </StatCard>

    <!-- Custom actions -->
    <StatCard :value='5678' label='Relatório'>
        <template #actions>
    <Button size='sm' @click='viewReport'>Ver</Button>
  </template>
    </StatCard>`" />
            </template>
        </ComponentShowcase>

        <!-- 8. DASHBOARD COMPLETO -->
        <ComponentShowcase title="Exemplo: Dashboard Completo" description="Grid responsivo com múltiplos StatCards.">
            <template #preview>
                <div
                    style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: var(--spacing-lg);">
                    <StatCard variant="primary" :value="24567" label="Usuários Totais" icon="👥" trend="up"
                        trend-value="+12%" trend-label="vs. mês anterior" />

                    <StatCard variant="success" value="R$ 145.280" label="Receita" icon="💰" trend="up"
                        trend-value="+8.5%" trend-label="vs. mês anterior" />

                    <StatCard variant="info" :value="1850" label="Novos Cadastros" icon="📝" trend="up"
                        trend-value="+15%" trend-label="últimos 30 dias" />

                    <StatCard variant="warning" :value="42" label="Tickets Abertos" icon="🎫" trend="down"
                        trend-value="-5" trend-label="vs. semana anterior" />

                    <StatCard variant="success" value="98.5%" label="Uptime" icon="✅"
                        description="Disponibilidade do sistema" />

                    <StatCard variant="info" value="4.8/5" label="Satisfação" icon="⭐"
                        description="Baseado em 450 avaliações" />
                </div>
            </template>

            <template #code>
                <CodeBlock :code="`<div style='display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: var(--spacing-lg);'>
  <StatCard 
    variant='primary'
    :value='24567' 
    label='Usuários Totais' 
    icon='👥'
    trend='up'
    trend-value='+12%'
    trend-label='vs. mês anterior'
  />
  
  <StatCard 
    variant='success'
    value='R$ 145.280' 
    label='Receita' 
    icon='💰'
    trend='up'
    trend-value='+8.5%'
  />
  
  <!-- Mais cards... -->
</div>`" />
            </template>
        </ComponentShowcase>

        <!-- BEST PRACTICES -->
        <Card padding="lg" variant="outline">
            <h3 style="margin: 0 0 var(--spacing-md) 0;">💡 Boas Práticas</h3>
            <ul style="margin: 0; padding-left: var(--spacing-lg); color: var(--color-text-secondary);">
                <li>Use <strong>variant</strong> para indicar status (success para métricas positivas, error para
                    alertas)
                </li>
                <li>Combine <strong>trend</strong> com variant para reforçar o significado visual</li>
                <li>Use <strong>description</strong> para adicionar contexto quando o valor precisa de explicação</li>
                <li>Em dashboards, use grid responsivo
                    (<code>grid-template-columns: repeat(auto-fit, minmax(...))</code>)
                </li>
                <li>Mantenha labels curtos e descritivos (2-3 palavras)</li>
                <li>Formate valores grandes com separadores (o componente faz automaticamente para números)</li>
                <li>Use <strong>size="sm"</strong> para dashboards com muitos cards, <strong>lg</strong> para hero stats
                </li>
            </ul>
        </Card>
    </div>
</template>

<script setup lang="ts">
import ComponentShowcase from '@/shared/components/layout/ComponentShowcase.vue'
import CodeBlock from '@/shared/components/layout/CodeBlock.vue'
import StatCard from '@/shared/components/display/StatCard.vue'
import Card from '@/shared/components/display/Card.vue'
import Badge from '@/shared/components/display/Badge.vue'
import Button from '@/shared/components/primitives/Button.vue'
</script>

<style scoped lang="scss">
.stat-card-view {
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
