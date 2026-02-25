/**
 * Template: Certificado
 * 
 * Template de certificado de participação/conclusão
 */

import type { DocumentTemplate } from './types'
import type { DocumentSchema } from '../core/types'

const certificateSchema: DocumentSchema = {
  id: 'certificate-template',
  name: 'Certificado',
  version: '1.0.0',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  
  metadata: {
    title: 'Certificado',
    author: 'Sistema',
    subject: 'Certificado',
    keywords: ['certificado', 'conclusão', 'participação'],
    tags: ['certificado', 'educacao'],
    category: 'certificate'
  },
  
  layout: {
    pageSize: 'a4',
    orientation: 'landscape',
    margins: {
      top: 30,
      right: 40,
      bottom: 30,
      left: 40
    }
  },
  
  variables: [
    {
      name: 'participante_nome',
      label: 'Nome do Participante',
      type: 'text',
      required: true
    },
    {
      name: 'documento',
      label: 'CPF/RG',
      type: 'text',
      required: true
    },
    {
      name: 'curso_nome',
      label: 'Nome do Curso/Evento',
      type: 'text',
      required: true
    },
    {
      name: 'carga_horaria',
      label: 'Carga Horária',
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
      name: 'data_conclusao',
      label: 'Data de Conclusão',
      type: 'date',
      required: true
    },
    {
      name: 'instituicao',
      label: 'Instituição',
      type: 'text',
      required: true
    },
    {
      name: 'responsavel_nome',
      label: 'Nome do Responsável',
      type: 'text',
      required: true
    },
    {
      name: 'responsavel_cargo',
      label: 'Cargo do Responsável',
      type: 'text',
      required: true
    },
    {
      name: 'codigo_verificacao',
      label: 'Código de Verificação',
      type: 'text',
      required: true
    }
  ],
  
  items: [
    // Espaço superior
    {
      id: 'spacer-top',
      type: 'spacer',
      content: {
        height: 40
      },
      props: {},
      style: {}
    },
    
    // Título
    {
      id: 'titulo',
      type: 'heading',
      content: {
        text: 'CERTIFICADO',
        level: 1
      },
      props: {},
      style: {
        align: 'center',
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 10
      }
    },
    
    {
      id: 'subtitulo',
      type: 'text',
      content: {
        text: 'DE CONCLUSÃO',
        format: 'plain'
      },
      props: {},
      style: {
        align: 'center',
        fontSize: 18,
        marginBottom: 40
      }
    },
    
    // Certificamos que
    {
      id: 'certificamos',
      type: 'text',
      content: {
        text: 'Certificamos que',
        format: 'plain'
      },
      props: {},
      style: {
        align: 'center',
        fontSize: 14,
        marginBottom: 20
      }
    },
    
    // Nome do participante (destaque)
    {
      id: 'participante',
      type: 'heading',
      content: {
        text: '{{participante_nome}}',
        level: 2
      },
      props: {},
      style: {
        align: 'center',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#2c3e50'
      }
    },
    
    {
      id: 'documento-texto',
      type: 'text',
      content: {
        text: 'CPF/RG: {{documento}}',
        format: 'plain'
      },
      props: {},
      style: {
        align: 'center',
        fontSize: 11,
        marginBottom: 30
      }
    },
    
    // Linha decorativa
    {
      id: 'linha1',
      type: 'line',
      content: {},
      props: {},
      style: {
        marginBottom: 30
      }
    },
    
    // Texto do certificado
    {
      id: 'texto-principal',
      type: 'text',
      content: {
        text: 'Participou e concluiu com êxito o curso',
        format: 'plain'
      },
      props: {},
      style: {
        align: 'center',
        fontSize: 14,
        marginBottom: 15
      }
    },
    
    {
      id: 'curso-nome',
      type: 'heading',
      content: {
        text: '{{curso_nome}}',
        level: 3
      },
      props: {},
      style: {
        align: 'center',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20
      }
    },
    
    // Detalhes do curso
    {
      id: 'detalhes',
      type: 'text',
      content: {
        text: 'Com carga horária de {{carga_horaria}} horas, realizado no período de {{data_inicio}} a {{data_conclusao}}.',
        format: 'plain'
      },
      props: {},
      style: {
        align: 'center',
        fontSize: 12,
        marginBottom: 40
      }
    },
    
    // Linha decorativa
    {
      id: 'linha2',
      type: 'line',
      content: {},
      props: {},
      style: {
        marginBottom: 30
      }
    },
    
    // Instituição
    {
      id: 'instituicao-texto',
      type: 'text',
      content: {
        text: '{{instituicao}}',
        format: 'plain'
      },
      props: {},
      style: {
        align: 'center',
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 40
      }
    },
    
    // Assinatura
    {
      id: 'assinatura',
      type: 'signature',
      content: {
        label: '{{responsavel_nome}}\n{{responsavel_cargo}}',
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
    
    // Espaço
    {
      id: 'spacer-bottom',
      type: 'spacer',
      content: {
        height: 20
      },
      props: {},
      style: {}
    },
    
    // QR Code para validação
    {
      id: 'qrcode',
      type: 'qrcode',
      content: {
        data: '{{codigo_verificacao}}',
        size: 80,
        errorCorrectionLevel: 'H'
      },
      props: {},
      style: {
        align: 'center',
        marginBottom: 8
      }
    },
    
    {
      id: 'codigo-validacao',
      type: 'text',
      content: {
        text: 'Código de Validação: {{codigo_verificacao}}',
        format: 'plain'
      },
      props: {},
      style: {
        align: 'center',
        fontSize: 8
      }
    }
  ]
}

export const certificateTemplate: DocumentTemplate = {
  id: 'certificate-001',
  name: 'Certificado de Conclusão',
  description: 'Template de certificado de conclusão de curso com QR Code de validação',
  category: 'certificate',
  tags: ['certificado', 'conclusão', 'curso', 'educação', 'qrcode'],
  schema: certificateSchema
}
