/**
 * Template: Contrato
 * 
 * Template básico de contrato entre duas partes
 */

import type { DocumentTemplate } from './types'
import type { DocumentSchema } from '../core/types'

const contractSchema: DocumentSchema = {
  id: 'contract-template',
  name: 'Contrato Padrão',
  version: '1.0.0',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  
  metadata: {
    title: 'Contrato de Prestação de Serviços',
    author: 'Sistema',
    subject: 'Contrato',
    keywords: ['contrato', 'prestação de serviços', 'acordo'],
    tags: ['juridico', 'contrato'],
    category: 'contract'
  },
  
  layout: {
    pageSize: 'a4',
    orientation: 'portrait',
    margins: {
      top: 20,
      right: 20,
      bottom: 20,
      left: 20
    }
  },
  
  variables: [
    {
      name: 'contratante_nome',
      label: 'Nome do Contratante',
      type: 'text',
      required: true
    },
    {
      name: 'contratante_cpf',
      label: 'CPF do Contratante',
      type: 'text',
      required: true
    },
    {
      name: 'contratante_endereco',
      label: 'Endereço do Contratante',
      type: 'text',
      required: true
    },
    {
      name: 'contratado_nome',
      label: 'Nome do Contratado',
      type: 'text',
      required: true
    },
    {
      name: 'contratado_cnpj',
      label: 'CNPJ do Contratado',
      type: 'text',
      required: true
    },
    {
      name: 'contratado_endereco',
      label: 'Endereço do Contratado',
      type: 'text',
      required: true
    },
    {
      name: 'servico_descricao',
      label: 'Descrição dos Serviços',
      type: 'text',
      required: true
    },
    {
      name: 'valor_total',
      label: 'Valor Total',
      type: 'number',
      required: true
    },
    {
      name: 'data_inicio',
      label: 'Data de Início',
      type: 'date',
      required: true
    },
    {
      name: 'data_termino',
      label: 'Data de Término',
      type: 'date',
      required: true
    },
    {
      name: 'data_assinatura',
      label: 'Data de Assinatura',
      type: 'date',
      required: true
    },
    {
      name: 'local',
      label: 'Local',
      type: 'text',
      required: true
    }
  ],
  
  items: [
    // Título principal
    {
      id: 'titulo',
      type: 'heading',
      content: {
        text: 'CONTRATO DE PRESTAÇÃO DE SERVIÇOS',
        level: 1
      },
      props: {},
      style: {
        align: 'center',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 20
      }
    },
    
    // Linha separadora
    {
      id: 'linha1',
      type: 'line',
      content: {},
      props: {},
      style: {
        marginBottom: 20
      }
    },
    
    // Qualificação das partes
    {
      id: 'qualificacao-titulo',
      type: 'heading',
      content: {
        text: 'DAS PARTES',
        level: 2
      },
      props: {},
      style: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 10
      }
    },
    
    {
      id: 'contratante',
      type: 'text',
      content: {
        text: 'CONTRATANTE: {{contratante_nome}}, inscrito no CPF sob nº {{contratante_cpf}}, residente e domiciliado em {{contratante_endereco}}.',
        format: 'plain'
      },
      props: {},
      style: {
        marginBottom: 10,
        align: 'justify'
      }
    },
    
    {
      id: 'contratado',
      type: 'text',
      content: {
        text: 'CONTRATADO: {{contratado_nome}}, inscrito no CNPJ sob nº {{contratado_cnpj}}, com sede em {{contratado_endereco}}.',
        format: 'plain'
      },
      props: {},
      style: {
        marginBottom: 20,
        align: 'justify'
      }
    },
    
    // Objeto do contrato
    {
      id: 'objeto-titulo',
      type: 'heading',
      content: {
        text: 'DO OBJETO',
        level: 2
      },
      props: {},
      style: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 10
      }
    },
    
    {
      id: 'objeto-texto',
      type: 'text',
      content: {
        text: 'O presente contrato tem por objeto a prestação de serviços de {{servico_descricao}}.',
        format: 'plain'
      },
      props: {},
      style: {
        marginBottom: 20,
        align: 'justify'
      }
    },
    
    // Valor
    {
      id: 'valor-titulo',
      type: 'heading',
      content: {
        text: 'DO VALOR',
        level: 2
      },
      props: {},
      style: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 10
      }
    },
    
    {
      id: 'valor-texto',
      type: 'text',
      content: {
        text: 'O valor total dos serviços prestados será de R$ {{valor_total}}, a ser pago conforme condições estabelecidas.',
        format: 'plain'
      },
      props: {},
      style: {
        marginBottom: 20,
        align: 'justify'
      }
    },
    
    // Prazo
    {
      id: 'prazo-titulo',
      type: 'heading',
      content: {
        text: 'DO PRAZO',
        level: 2
      },
      props: {},
      style: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 10
      }
    },
    
    {
      id: 'prazo-texto',
      type: 'text',
      content: {
        text: 'O prazo de vigência deste contrato será de {{data_inicio}} até {{data_termino}}.',
        format: 'plain'
      },
      props: {},
      style: {
        marginBottom: 30,
        align: 'justify'
      }
    },
    
    // Local e data
    {
      id: 'local-data',
      type: 'text',
      content: {
        text: '{{local}}, {{data_assinatura}}',
        format: 'plain'
      },
      props: {},
      style: {
        marginTop: 30,
        marginBottom: 40,
        align: 'center'
      }
    },
    
    // Assinaturas
    {
      id: 'assinatura-contratante',
      type: 'signature',
      content: {
        label: 'Contratante',
        showDate: false,
        width: 250,
        height: 80
      },
      props: {},
      style: {
        align: 'center',
        marginBottom: 30
      }
    },
    
    {
      id: 'assinatura-contratado',
      type: 'signature',
      content: {
        label: 'Contratado',
        showDate: false,
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

export const contractTemplate: DocumentTemplate = {
  id: 'contract-001',
  name: 'Contrato Padrão',
  description: 'Template básico de contrato de prestação de serviços entre duas partes',
  category: 'contract',
  tags: ['contrato', 'prestação de serviços', 'acordo', 'juridico'],
  schema: contractSchema
}
