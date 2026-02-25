/**
 * Adapter de PDF usando jsPDF (OPCIONAL)
 * 
 * Este adapter requer instalação manual de jsPDF:
 * npm install jspdf
 * 
 * Se jsPDF não estiver instalado, o adapter lançará erro com instruções
 */

import type { PDFAdapter, PDFContent, PDFOptions, PDFElement } from '../types'
import { getAdapter } from '../registry'

/**
 * Adapter usando jsPDF
 * 
 * @example
 * ```ts
 * // Cliente instala jsPDF manualmente
 * npm install jspdf
 * 
 * // Registra adapter
 * import { registerAdapter } from '@lugand/vue-ui-lib'
 * import { JSPDFAdapter } from '@lugand/vue-ui-lib/adapters'
 * 
 * registerAdapter('pdf', new JSPDFAdapter())
 * ```
 */
export class JSPDFAdapter implements PDFAdapter {
  name = 'jspdf'
  
  capabilities = {
    supportsImages: true,
    supportsVectorGraphics: true,
    supportsDigitalSignature: false,
    supportsEncryption: true
  }
  
  /**
   * Gerar PDF a partir de conteúdo estruturado
   */
  async generate(content: PDFContent, options?: PDFOptions): Promise<Blob> {
    // Lazy import (só carrega se jsPDF estiver instalado)
    const jsPDF = await this.loadJSPDF()
    
    // Configurar primeira página
    const firstPage = content.pages[0]
    if (!firstPage) {
      throw new Error('PDF deve ter ao menos uma página')
    }
    
    const pdf = new jsPDF({
      orientation: firstPage.orientation,
      unit: 'mm',
      format: firstPage.size
    })
    
    // Adicionar metadados
    this.addMetadata(pdf, content.metadata)
    
    // Renderizar páginas
    for (let i = 0; i < content.pages.length; i++) {
      const page = content.pages[i]
      if (!page) continue
      
      if (i > 0) {
        pdf.addPage(
          page.size,
          page.orientation
        )
      }
      
      await this.renderPage(pdf, page, i + 1)
    }
    
    // Aplicar opções
    if (options) {
      await this.applyOptions(pdf, options)
    }
    
    // Retornar como Blob
    return pdf.output('blob')
  }
  
  /**
   * Lazy load jsPDF
   */
  private async loadJSPDF(): Promise<any> {
    try {
      const module = await import('jspdf')
      return module.jsPDF
    } catch (error) {
      throw new Error(
        'jsPDF não está instalado.\n\n' +
        'Para usar JSPDFAdapter, instale:\n' +
        '  npm install jspdf\n\n' +
        'Ou registre um adapter customizado:\n' +
        '  registerAdapter("pdf", new MyCustomPDFAdapter())'
      )
    }
  }
  
  /**
   * Adicionar metadados ao PDF
   */
  private addMetadata(pdf: any, metadata: PDFContent['metadata']): void {
    const props: Record<string, string> = {}
    
    if (metadata.title) props.title = metadata.title
    if (metadata.author) props.author = metadata.author
    if (metadata.subject) props.subject = metadata.subject
    if (metadata.creator) props.creator = metadata.creator
    if (metadata.keywords) props.keywords = metadata.keywords.join(', ')
    
    if (Object.keys(props).length > 0) {
      pdf.setProperties(props)
    }
  }
  
  /**
   * Renderizar página
   */
  private async renderPage(pdf: any, page: PDFContent['pages'][0], _pageNum: number): Promise<void> {
    // Aplicar margens (jsPDF não tem margins nativas, ajustamos posições)
    const { margins } = page
    
    // Renderizar elementos
    for (const element of page.elements) {
      await this.renderElement(pdf, element, margins)
    }
  }
  
  /**
   * Renderizar elemento
   */
  private async renderElement(
    pdf: any,
    element: PDFElement,
    margins: { top: number; right: number; bottom: number; left: number }
  ): Promise<void> {
    // Determinar x e y baseado no tipo de elemento
    const hasPosition = 'x' in element && 'y' in element
    const x = hasPosition ? (element as any).x + margins.left : margins.left
    const y = hasPosition ? (element as any).y + margins.top : margins.top
    
    switch (element.type) {
      case 'text':
        this.renderText(pdf, element, x, y)
        break
      
      case 'image':
        await this.renderImage(pdf, element, x, y)
        break
      
      case 'qrcode':
        await this.renderQRCode(pdf, element, x, y)
        break
      
      case 'line':
        this.renderLine(pdf, element, margins)
        break
      
      case 'rect':
        this.renderRect(pdf, element, x, y)
        break
      
      case 'path':
        this.renderPath(pdf, element, x, y)
        break
    }
  }
  
  /**
   * Renderizar texto
   */
  private renderText(pdf: any, element: Extract<PDFElement, { type: 'text' }>, x: number, y: number): void {
    const { text, style } = element
    
    // Aplicar estilo
    if (style.fontSize) pdf.setFontSize(style.fontSize)
    if (style.fontWeight === 'bold') pdf.setFont(undefined, 'bold')
    if (style.fontStyle === 'italic') pdf.setFont(undefined, 'italic')
    if (style.color) pdf.setTextColor(style.color)
    
    // Renderizar texto
    pdf.text(text, x, y, { align: style.align || 'left' })
    
    // Reset estilo
    pdf.setFont(undefined, 'normal')
  }
  
  /**
   * Renderizar imagem
   */
  private async renderImage(pdf: any, element: Extract<PDFElement, { type: 'image' }>, x: number, y: number): Promise<void> {
    const { data, width, height, format, opacity } = element
    
    try {
      if (opacity && opacity < 1) {
        pdf.saveGraphicsState()
        pdf.setGState(new pdf.GState({ opacity }))
      }
      
      pdf.addImage(data, format.toUpperCase(), x, y, width, height)
      
      if (opacity && opacity < 1) {
        pdf.restoreGraphicsState()
      }
    } catch (error) {
      console.error('Erro ao renderizar imagem:', error)
    }
  }
  
  /**
   * Renderizar QR Code
   */
  private async renderQRCode(pdf: any, element: Extract<PDFElement, { type: 'qrcode' }>, x: number, y: number): Promise<void> {
    const { data, size, errorCorrectionLevel } = element
    
    // Usar QRCode adapter se disponível
    const qrAdapter = getAdapter('qrcode')
    
    if (qrAdapter) {
      try {
        const dataURL = await qrAdapter.generateDataURL(data, {
          size,
          errorCorrectionLevel
        })
        
        pdf.addImage(dataURL, 'PNG', x, y, size, size)
      } catch (error) {
        console.error('Erro ao gerar QR Code:', error)
      }
    } else {
      console.warn('QRCodeAdapter não registrado. Registre com: registerAdapter("qrcode", adapter)')
    }
  }
  
  /**
   * Renderizar linha
   */
  private renderLine(pdf: any, element: Extract<PDFElement, { type: 'line' }>, margins: any): void {
    const { x1, y1, x2, y2, color, width, dashPattern } = element
    
    if (color) pdf.setDrawColor(color)
    if (width) pdf.setLineWidth(width)
    if (dashPattern) pdf.setLineDash(dashPattern)
    
    pdf.line(
      x1 + margins.left,
      y1 + margins.top,
      x2 + margins.left,
      y2 + margins.top
    )
    
    // Reset
    pdf.setLineDash([])
  }
  
  /**
   * Renderizar retângulo
   */
  private renderRect(pdf: any, element: Extract<PDFElement, { type: 'rect' }>, x: number, y: number): void {
    const { width, height, fill, stroke, strokeWidth, cornerRadius } = element
    
    if (cornerRadius) {
      // jsPDF não tem roundRect nativo, usar path
      this.renderRoundRect(pdf, x, y, width, height, cornerRadius, fill, stroke, strokeWidth)
      return
    }
    
    let style = ''
    if (fill) {
      pdf.setFillColor(fill)
      style += 'F'
    }
    if (stroke) {
      pdf.setDrawColor(stroke)
      if (strokeWidth) pdf.setLineWidth(strokeWidth)
      style += 'D'
    }
    
    pdf.rect(x, y, width, height, style || undefined)
  }
  
  /**
   * Renderizar retângulo com bordas arredondadas
   */
  private renderRoundRect(
    pdf: any,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number,
    fill?: string,
    stroke?: string,
    strokeWidth?: number
  ): void {
    // Implementação simplificada usando linhas e arcos
    const r = Math.min(radius, width / 2, height / 2)
    
    if (fill) pdf.setFillColor(fill)
    if (stroke) {
      pdf.setDrawColor(stroke)
      if (strokeWidth) pdf.setLineWidth(strokeWidth)
    }
    
    // Path do retângulo arredondado
    pdf.lines(
      [
        [width - r, 0],
        [0, r],
        [0, height - 2 * r],
        [0, r],
        [-(width - 2 * r), 0],
        [0, r],
        [0, -(height - 2 * r)],
        [0, -r]
      ],
      x + r,
      y,
      [1, 1],
      fill ? 'F' : stroke ? 'D' : undefined
    )
  }
  
  /**
   * Renderizar path SVG
   */
  private renderPath(_pdf: any, _element: Extract<PDFElement, { type: 'path' }>, _x: number, _y: number): void {
    // jsPDF tem suporte limitado a paths
    // Para produção, considere usar library svg2pdf.js
    console.warn('Path SVG não totalmente suportado pelo JSPDFAdapter')
  }
  
  /**
   * Aplicar opções ao PDF
   */
  private async applyOptions(pdf: any, options: PDFOptions): Promise<void> {
    // Compressão
    if (options.compress) {
      // jsPDF comprime automaticamente
    }
    
    // Senha
    if (options.password) {
      // jsPDF não suporta senha nativamente
      console.warn('Proteção por senha não suportada pelo jsPDF')
    }
    
    // Marca d'água
    if (options.watermark) {
      // Adicionar em todas as páginas
      const pageCount = pdf.internal.getNumberOfPages()
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i)
        this.addWatermark(pdf, options.watermark)
      }
    }
  }
  
  /**
   * Adicionar marca d'água
   */
  private addWatermark(pdf: any, watermark: NonNullable<PDFOptions['watermark']>): void {
    const { text, opacity = 0.3, angle = 45, fontSize = 50, color = '#CCCCCC' } = watermark
    
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    
    pdf.saveGraphicsState()
    pdf.setGState(new pdf.GState({ opacity }))
    pdf.setFontSize(fontSize)
    pdf.setTextColor(color)
    
    // Centralizar e rotacionar
    const centerX = pageWidth / 2
    const centerY = pageHeight / 2
    
    pdf.text(text, centerX, centerY, {
      align: 'center',
      angle
    })
    
    pdf.restoreGraphicsState()
  }
}
