/**
 * Template: Nota Fiscal
 * 
 * Template simplificado de nota fiscal
 */

import type { DocumentTemplate } from './types'
import type { DocumentSchema } from '../core/types'

const invoiceSchema: DocumentSchema = {
  id: 'invoice-template',
  name: 'Nota Fiscal',
  version: '1.0.0',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  
  metadata: {
    title: 'Nota Fiscal',
    author: 'Sistema',
    subject: 'Nota Fiscal',
    keywords: ['nota fiscal', 'fatura', 'pagamento'],
    tags: ['financeiro', 'fiscal'],
    category: 'invoice'
  },
  
  layout: {
    pageSize: 'a4',
    orientation: 'portrait',
    margins: {
      top: 15,
      right: 15,
      bottom: 15,
      left: 15
    }
  },
  
  variables: [
    {
      name: 'numero_nota',
      label: 'Número da Nota',
      type: 'text',
      required: true
    },
    {
      name: 'data_emissao',
      label: 'Data de Emissão',
      type: 'date',
      required: true
    },
    {
      name: 'empresa_nome',
      label: 'Nome da Empresa',
      type: 'text',
      required: true
    },
    {
      name: 'empresa_cnpj',
      label: 'CNPJ',
      type: 'text',
      required: true
    },
    {
      name: 'empresa_endereco',
      label: 'Endereço',
      type: 'text',
      required: true
    },
    {
      name: 'empresa_telefone',
      label: 'Telefone',
      type: 'text',
      required: false
    },
    {
      name: 'cliente_nome',
      label: 'Nome do Cliente',
      type: 'text',
      required: true
    },
    {
      name: 'cliente_documento',
      label: 'CPF/CNPJ do Cliente',
      type: 'text',
      required: true
    },
    {
      name: 'cliente_endereco',
      label: 'Endereço do Cliente',
      type: 'text',
      required: true
    },
    {
      name: 'descricao_servicos',
      label: 'Descrição dos Serviços',
      type: 'text',
      required: true
    },
    {
      name: 'valor_servicos',
      label: 'Valor dos Serviços',
      type: 'number',
      required: true
    },
    {
      name: 'valor_desconto',
      label: 'Desconto',
      type: 'number',
      required: false
    },
    {
      name: 'valor_total',
      label: 'Valor Total',
      type: 'number',
      required: true
    },
    {
      name: 'chave_acesso',
      label: 'Chave de Acesso',
      type: 'text',
      required: true
    }
  ],
  
  items: [
    // Cabeçalho com logo e informações da empresa
    {
      id: 'cabecalho',
      type: 'group',
      content: {
        items: []
      },
      props: {},
      style: {
        marginBottom: 20
      }
    },
    
    {
      id: 'titulo',
      type: 'heading',
      content: {
        text: 'NOTA FISCAL',
        level: 1
      },
      props: {},
      style: {
        align: 'center',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5
      }
    },
    
    {
      id: 'numero-nota',
      type: 'text',
      content: {
        text: 'Nº {{numero_nota}}',
        format: 'plain'
      },
      props: {},
      style: {
        align: 'center',
        fontSize: 12,
        marginBottom: 20
      }
    },
    
    // Dados da empresa
    {
      id: 'empresa-titulo',
      type: 'heading',
      content: {
        text: 'EMITENTE',
        level: 3
      },
      props: {},
      style: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 10
      }
    },
    
    {
      id: 'empresa-dados',
      type: 'text',
      content: {
        text: '{{empresa_nome}}\nCNPJ: {{empresa_cnpj}}\n{{empresa_endereco}}\nTelefone: {{empresa_telefone}}',
        format: 'plain'
      },
      props: {},
      style: {
        fontSize: 10,
        marginBottom: 20
      }
    },
    
    // Dados do cliente
    {
      id: 'cliente-titulo',
      type: 'heading',
      content: {
        text: 'DESTINATÁRIO',
        level: 3
      },
      props: {},
      style: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 10
      }
    },
    
    {
      id: 'cliente-dados',
      type: 'text',
      content: {
        text: '{{cliente_nome}}\nCPF/CNPJ: {{cliente_documento}}\n{{cliente_endereco}}',
        format: 'plain'
      },
      props: {},
      style: {
        fontSize: 10,
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
    
    // Discriminação dos serviços
    {
      id: 'servicos-titulo',
      type: 'heading',
      content: {
        text: 'DISCRIMINAÇÃO DOS SERVIÇOS',
        level: 3
      },
      props: {},
      style: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 10
      }
    },
    
    {
      id: 'servicos-descricao',
      type: 'text',
      content: {
        text: '{{descricao_servicos}}',
        format: 'plain'
      },
      props: {},
      style: {
        fontSize: 10,
        marginBottom: 20,
        align: 'justify'
      }
    },
    
    // Valores
    {
      id: 'valores-titulo',
      type: 'heading',
      content: {
        text: 'VALORES',
        level: 3
      },
      props: {},
      style: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 10
      }
    },
    
    {
      id: 'valor-servicos',
      type: 'text',
      content: {
        text: 'Valor dos Serviços: R$ {{valor_servicos}}',
        format: 'plain'
      },
      props: {},
      style: {
        fontSize: 10,
        marginBottom: 5
      }
    },
    
    {
      id: 'valor-desconto',
      type: 'text',
      content: {
        text: 'Desconto: R$ {{valor_desconto}}',
        format: 'plain'
      },
      props: {},
      style: {
        fontSize: 10,
        marginBottom: 5
      }
    },
    
    {
      id: 'valor-total',
      type: 'text',
      content: {
        text: 'VALOR TOTAL: R$ {{valor_total}}',
        format: 'plain'
      },
      props: {},
      style: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 30
      }
    },
    
    // Data de emissão
    {
      id: 'data-emissao',
      type: 'text',
      content: {
        text: 'Data de Emissão: {{data_emissao}}',
        format: 'plain'
      },
      props: {},
      style: {
        fontSize: 9,
        align: 'right',
        marginBottom: 30
      }
    },
    
    // QR Code com chave de acesso
    {
      id: 'qrcode',
      type: 'qrcode',
      content: {
        data: '{{chave_acesso}}',
        size: 120,
        errorCorrectionLevel: 'M'
      },
      props: {},
      style: {
        align: 'center',
        marginBottom: 10
      }
    },
    
    {
      id: 'chave-texto',
      type: 'text',
      content: {
        text: 'Chave de Acesso:\n{{chave_acesso}}',
        format: 'plain'
      },
      props: {},
      style: {
        fontSize: 8,
        align: 'center'
      }
    }
  ]
}

export const invoiceTemplate: DocumentTemplate = {
  id: 'invoice-001',
  name: 'Nota Fiscal Simplificada',
  description: 'Template de nota fiscal simplificada com QR Code',
  category: 'invoice',
  tags: ['nota fiscal', 'fatura', 'nfe', 'qrcode'],
  schema: invoiceSchema
}
