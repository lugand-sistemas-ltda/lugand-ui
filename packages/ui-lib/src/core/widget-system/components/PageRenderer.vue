<script lang="ts">
/**
 * PageRenderer - Componente para renderizar PageSchema em modo preview
 * 
 * Renderiza widgets de forma recursiva, suportando aninhamento e data binding
 */

import { defineComponent, h, resolveComponent } from 'vue'
import type { WidgetSchema } from '@/core/widget-system/types'
import type { PageSchema } from '@/core/schema-system/types'

export default defineComponent({
    name: 'PageRenderer',

    props: {
        schema: {
            type: Object as () => PageSchema,
            required: true
        },
        interactive: {
            type: Boolean,
            default: true
        }
    },

    setup(props) {
        /**
         * Renderiza um widget individual
         */
        function renderWidget(widget: WidgetSchema): any {
            // Mapear tipos de widget para componentes da lib
            const componentMap: Record<string, string> = {
                // Layout
                'container': 'div',
                'card': 'Card',
                'section': 'section',

                // Data Entry
                'input': 'Input',
                'textarea': 'Textarea',
                'select': 'Select',
                'checkbox': 'Checkbox',
                'radio': 'Radio',
                'switch': 'Switch',
                'datepicker': 'DatePicker',

                // Data Display
                'text': 'p',
                'heading': 'h2',
                'table': 'DataTable',
                'list': 'ul',

                // Actions
                'button': 'Button',
                'link': 'a',

                // Feedback
                'alert': 'Alert',
                'badge': 'Badge',
                'progress': 'ProgressBar',

                // Media
                'image': 'img',
                'avatar': 'Avatar',
            }

            const componentName = componentMap[widget.type] || 'div'

            // Para componentes HTML nativos, use string
            // Para componentes da lib, resolva dinamicamente
            const component = ['div', 'section', 'p', 'h1', 'h2', 'h3', 'ul', 'img', 'a'].includes(componentName)
                ? componentName
                : resolveComponent(componentName)

            // Construir props do widget
            const widgetProps: Record<string, any> = {
                ...widget.config,
                'data-widget-id': widget.id,
                'data-widget-type': widget.type,
            }

            // Aplicar estilos de posição se existir
            if (widget.position) {
                widgetProps.style = {
                    gridColumn: `${widget.position.x + 1} / span ${widget.position.w}`,
                    gridRow: `${widget.position.y + 1} / span ${widget.position.h}`,
                }
            }

            // Se widget não é interativo, desabilitar
            if (!props.interactive && componentName === 'Button') {
                widgetProps.disabled = true
            }

            // Renderizar children recursivamente
            const children = widget.children?.map(child => renderWidget(child)) || []

            // Para alguns widgets, adicionar conteúdo padrão
            if (widget.type === 'text' && widget.config.content) {
                children.push(widget.config.content)
            } else if (widget.type === 'heading' && widget.config.text) {
                children.push(widget.config.text)
            } else if (widget.type === 'button' && widget.config.label) {
                children.push(widget.config.label)
            }

            return h(component, widgetProps, children)
        }

        /**
         * Renderiza a página completa
         */
        function renderPage() {
            const pageClass = ['page-renderer']

            // Aplicar classes baseadas no layout
            if (props.schema.layout?.strategy) {
                pageClass.push(`layout-${props.schema.layout.strategy}`)
            }

            const pageStyles: Record<string, any> = {}

            // Se layout é grid, aplicar configurações
            if (props.schema.layout?.strategy === 'grid') {
                pageStyles.display = 'grid'
                pageStyles.gridTemplateColumns = `repeat(${props.schema.layout.config.columns || 12}, 1fr)`
                pageStyles.gap = props.schema.layout.config.gap || '1rem'
            }

            // Renderizar todos os widgets
            const widgets = props.schema.widgets?.map(widget => renderWidget(widget)) || []

            return h(
                'div',
                {
                    class: pageClass,
                    style: pageStyles,
                    'data-page-id': props.schema.id
                },
                widgets
            )
        }

        return () => renderPage()
    }
})
</script>
