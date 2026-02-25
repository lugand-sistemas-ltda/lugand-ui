/**
 * Template: Relatório
 * 
 * Template de relatório técnico/executivo
 */

import type { DocumentTemplate } from './types'
import type { DocumentSchema } from '../core/types'

const reportSchema: DocumentSchema = {
  id: 'report-template',
  name: 'Relatório',
  version: '1.0.0',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  
  metadata: {
    title: 'Relatório',
    author: 'Sistema',
    subject: 'Relatório',
    keywords: ['relatório', 'análise', 'dados'],
    tags: ['relatorio', 'analise'],
    category: 'report'
  },
  
  layout: {
    pageSize: 'a4',
    orientation: 'portrait',
    margins: {
      top: 25,
      right: 20,
      bottom: 25,
      left: 20
    }
  },
  
  variables: [
    {
      name: 'titulo_relatorio',
      label: 'Título do Relatório',
      type: 'text',
      required: true
    },
    {
      name: 'autor',
      label: 'Autor',
      type: 'text',
      required: true
    },
    {
      name: 'departamento',
      label: 'Departamento',
      type: 'text',
      required: false
    },
    {
      name: 'data_relatorio',
      label: 'Data do Relatório',
      type: 'date',
      required: true
    },
    {
      name: 'periodo_inicio',
      label: 'Período Inicial',
      type: 'date',
      required: true
    },
    {
      name: 'periodo_fim',
      label: 'Período Final',
      type: 'date',
      required: true
    },
    {
      name: 'resumo_executivo',
      label: 'Resumo Executivo',
      type: 'text',
      required: true
    },
    {
      name: 'introducao',
      label: 'Introdução',
      type: 'text',
      required: true
    },
    {
      name: 'metodologia',
      label: 'Metodologia',
      type: 'text',
      required: true
    },
    {
      name: 'resultados',
      label: 'Resultados',
      type: 'text',
      required: true
    },
    {
      name: 'conclusao',
      label: 'Conclusão',
      type: 'text',
      required: true
    },
    {
      name: 'recomendacoes',
      label: 'Recomendações',
      type: 'text',
      required: false
    }
  ],
  
  items: [
    // Capa
    {
      id: 'spacer-top',
      type: 'spacer',
      content: {
        height: 100
      },
      props: {},
      style: {}
    },
    
    {
      id: 'titulo',
      type: 'heading',
      content: {
        text: '{{titulo_relatorio}}',
        level: 1
      },
      props: {},
      style: {
        align: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 30
      }
    },
    
    {
      id: 'autor-info',
      type: 'text',
      content: {
        text: 'Elaborado por: {{autor}}',
        format: 'plain'
      },
      props: {},
      style: {
        align: 'center',
        fontSize: 12,
        marginBottom: 5
      }
    },
    
    {
      id: 'departamento-info',
      type: 'text',
      content: {
        text: '{{departamento}}',
        format: 'plain'
      },
      props: {},
      style: {
        align: 'center',
        fontSize: 12,
        marginBottom: 30
      }
    },
    
    {
      id: 'data-info',
      type: 'text',
      content: {
        text: '{{data_relatorio}}',
        format: 'plain'
      },
      props: {},
      style: {
        align: 'center',
        fontSize: 11
      }
    },
    
    {
      id: 'spacer-middle',
      type: 'spacer',
      content: {
        height: 80
      },
      props: {},
      style: {}
    },
    
    // Linha separadora
    {
      id: 'linha-capa',
      type: 'line',
      content: {},
      props: {},
      style: {
        marginBottom: 40
      }
    },
    
    // Resumo Executivo
    {
      id: 'resumo-titulo',
      type: 'heading',
      content: {
        text: 'RESUMO EXECUTIVO',
        level: 2
      },
      props: {},
      style: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 15
      }
    },
    
    {
      id: 'resumo-texto',
      type: 'text',
      content: {
        text: '{{resumo_executivo}}',
        format: 'plain'
      },
      props: {},
      style: {
        align: 'justify',
        marginBottom: 30
      }
    },
    
    // Introdução
    {
      id: 'introducao-titulo',
      type: 'heading',
      content: {
        text: '1. INTRODUÇÃO',
        level: 2
      },
      props: {},
      style: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 15
      }
    },
    
    {
      id: 'introducao-texto',
      type: 'text',
      content: {
        text: '{{introducao}}',
        format: 'plain'
      },
      props: {},
      style: {
        align: 'justify',
        marginBottom: 20
      }
    },
    
    {
      id: 'periodo-texto',
      type: 'text',
      content: {
        text: 'Período analisado: {{periodo_inicio}} a {{periodo_fim}}',
        format: 'plain'
      },
      props: {},
      style: {
        fontSize: 11,
        fontStyle: 'italic',
        marginBottom: 30
      }
    },
    
    // Metodologia
    {
      id: 'metodologia-titulo',
      type: 'heading',
      content: {
        text: '2. METODOLOGIA',
        level: 2
      },
      props: {},
      style: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 15
      }
    },
    
    {
      id: 'metodologia-texto',
      type: 'text',
      content: {
        text: '{{metodologia}}',
        format: 'plain'
      },
      props: {},
      style: {
        align: 'justify',
        marginBottom: 30
      }
    },
    
    // Resultados
    {
      id: 'resultados-titulo',
      type: 'heading',
      content: {
        text: '3. RESULTADOS',
        level: 2
      },
      props: {},
      style: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 15
      }
    },
    
    {
      id: 'resultados-texto',
      type: 'text',
      content: {
        text: '{{resultados}}',
        format: 'plain'
      },
      props: {},
      style: {
        align: 'justify',
        marginBottom: 30
      }
    },
    
    // Conclusão
    {
      id: 'conclusao-titulo',
      type: 'heading',
      content: {
        text: '4. CONCLUSÃO',
        level: 2
      },
      props: {},
      style: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 15
      }
    },
    
    {
      id: 'conclusao-texto',
      type: 'text',
      content: {
        text: '{{conclusao}}',
        format: 'plain'
      },
      props: {},
      style: {
        align: 'justify',
        marginBottom: 30
      }
    },
    
    // Recomendações
    {
      id: 'recomendacoes-titulo',
      type: 'heading',
      content: {
        text: '5. RECOMENDAÇÕES',
        level: 2
      },
      props: {},
      style: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 15
      }
    },
    
    {
      id: 'recomendacoes-texto',
      type: 'text',
      content: {
        text: '{{recomendacoes}}',
        format: 'plain'
      },
      props: {},
      style: {
        align: 'justify',
        marginBottom: 50
      }
    },
    
    // Assinatura
    {
      id: 'linha-assinatura',
      type: 'line',
      content: {},
      props: {},
      style: {
        marginBottom: 30
      }
    },
    
    {
      id: 'assinatura',
      type: 'signature',
      content: {
        label: 'Responsável pelo Relatório',
        showDate: true,
        width: 250,
        height: 80
      },
      props: {},
      style: {
        align: 'center'
      }
    }
  ]
}

export const reportTemplate: DocumentTemplate = {
  id: 'report-001',
  name: 'Relatório Técnico',
  description: 'Template de relatório técnico/executivo com seções padronizadas',
  category: 'report',
  tags: ['relatório', 'análise', 'técnico', 'executivo'],
  schema: reportSchema
}
