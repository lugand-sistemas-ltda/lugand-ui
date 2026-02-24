/**
 * PDF Generator using jsPDF
 */

import jsPDF from 'jspdf'
import QRCode from 'qrcode'
import type {
    PDFOptions,
    PDFGenerationResult,
    DocumentTemplate,
    DocumentData,
    DocumentBlock
} from './types'

/**
 * Generate PDF from HTML content
 */
export async function generatePDFFromHTML(
    htmlContent: string,
    variables: DocumentData = {},
    options: PDFOptions = {}
): Promise<PDFGenerationResult> {
    try {
        // Process variables in HTML
        let processedHTML = htmlContent

        // Replace all {{variableName}} with actual values
        Object.entries(variables).forEach(([key, value]) => {
            const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g')
            processedHTML = processedHTML.replace(regex, String(value))
        })

        // Create PDF
        const pdf = createPDFDocument(options)

        // Convert HTML to PDF
        const tempDiv = document.createElement('div')
        tempDiv.innerHTML = processedHTML

        // Remove variable styling (keep only text)
        tempDiv.querySelectorAll('.doc-variable').forEach(el => {
            el.replaceWith(el.textContent || '')
        })

        await pdf.html(tempDiv, {
            callback: (doc) => {
                savePDF(doc, options.filename || 'document.pdf', options.preview)
            },
            x: options.margins?.left || 15,
            y: options.margins?.top || 15,
            width: getPageWidth(options) - (options.margins?.left || 15) - (options.margins?.right || 15),
            windowWidth: 800
        })

        return {
            success: true,
            filename: options.filename || 'document.pdf'
        }
    } catch (error) {
        console.error('Error generating PDF:', error)
        return {
            success: false,
            filename: options.filename || 'document.pdf',
            error: error instanceof Error ? error.message : 'Unknown error'
        }
    }
}

/**
 * Generate PDF from template
 */
export async function generatePDFFromTemplate(
    template: DocumentTemplate,
    data: DocumentData,
    options?: PDFOptions
): Promise<PDFGenerationResult> {
    try {
        // Merge template layout with options
        const pdfOptions: PDFOptions = {
            pageSize: template.layout.pageSize,
            orientation: template.layout.orientation,
            margins: template.layout.margins,
            metadata: template.metadata,
            ...options
        }

        const pdf = createPDFDocument(pdfOptions)

        let currentY = pdfOptions.margins?.top || 20

        // Process each block
        for (const block of template.blocks) {
            currentY = await renderBlock(pdf, block, data, pdfOptions, currentY)

            // Check if need new page
            const pageHeight = getPageHeight(pdfOptions)
            const bottomMargin = pdfOptions.margins?.bottom || 20

            if (currentY > pageHeight - bottomMargin) {
                pdf.addPage()
                currentY = pdfOptions.margins?.top || 20
            }
        }

        // Save PDF
        const filename = options?.filename || `${template.name}.pdf`
        savePDF(pdf, filename, options?.preview)

        return {
            success: true,
            filename
        }
    } catch (error) {
        console.error('Error generating PDF from template:', error)
        return {
            success: false,
            filename: options?.filename || 'document.pdf',
            error: error instanceof Error ? error.message : 'Unknown error'
        }
    }
}

/**
 * Create jsPDF document with options
 */
function createPDFDocument(options: PDFOptions = {}): jsPDF {
    const pdf = new jsPDF({
        orientation: options.orientation || 'portrait',
        unit: 'mm',
        format: options.pageSize || 'a4'
    })

    // Set metadata
    if (options.metadata) {
        pdf.setProperties({
            title: options.metadata.title,
            author: options.metadata.author,
            subject: options.metadata.subject,
            keywords: options.metadata.keywords,
            creator: options.metadata.creator || 'Lugand UI Library'
        })
    }

    return pdf
}

/**
 * Render a document block
 */
async function renderBlock(
    pdf: jsPDF,
    block: DocumentBlock,
    data: DocumentData,
    options: PDFOptions,
    currentY: number
): Promise<number> {
    const leftMargin = options.margins?.left || 20
    const rightMargin = options.margins?.right || 20
    const pageWidth = getPageWidth(options)
    const contentWidth = pageWidth - leftMargin - rightMargin

    switch (block.type) {
        case 'text':
        case 'heading':
            return renderTextBlock(pdf, block, data, leftMargin, contentWidth, currentY)

        case 'qrcode':
            return await renderQRCodeBlock(pdf, block, data, currentY)

        case 'signature':
            return renderSignatureBlock(pdf, block, currentY)

        case 'image':
            return await renderImageBlock(pdf, block, leftMargin, currentY)

        case 'table':
            return renderTableBlock(pdf, block, data, leftMargin, contentWidth, currentY)

        case 'spacer':
            return currentY + (block.content || 10)

        default:
            return currentY
    }
}

/**
 * Render text block
 */
function renderTextBlock(
    pdf: jsPDF,
    block: DocumentBlock,
    data: DocumentData,
    x: number,
    width: number,
    y: number
): number {
    const style = block.style || {}

    // Replace variables in text
    let text = String(block.content || '')
    Object.entries(data).forEach(([key, value]) => {
        const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g')
        text = text.replace(regex, String(value))
    })

    // Set font
    pdf.setFontSize(style.fontSize || (block.type === 'heading' ? 18 : 12))
    pdf.setFont('helvetica', style.fontWeight || 'normal', style.fontStyle || 'normal')

    // Set color
    if (style.color) {
        const [r, g, b] = hexToRgb(style.color)
        pdf.setTextColor(r, g, b)
    } else {
        pdf.setTextColor(0, 0, 0)
    }

    // Add margin top
    if (style.marginTop) {
        y += style.marginTop
    }

    // Split text into lines
    const lines = pdf.splitTextToSize(text, width)
    const lineHeight = style.lineHeight || 7

    // Render text
    pdf.text(lines, x, y, {
        align: style.align || 'left',
        maxWidth: width
    })

    // Calculate new Y position
    const textHeight = lines.length * lineHeight
    let newY = y + textHeight

    // Add margin bottom
    if (style.marginBottom) {
        newY += style.marginBottom
    }

    return newY
}

/**
 * Render QR Code block
 */
async function renderQRCodeBlock(
    pdf: jsPDF,
    block: DocumentBlock,
    data: DocumentData,
    y: number
): Promise<number> {
    // Replace variables in QR data
    let qrData = String(block.content || '')
    Object.entries(data).forEach(([key, value]) => {
        const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g')
        qrData = qrData.replace(regex, String(value))
    })

    // Generate QR Code as data URL
    const qrDataUrl = await QRCode.toDataURL(qrData, {
        width: 100,
        margin: 1
    })

    // Position
    const x = block.position?.x || 160
    const blockY = block.position?.y || y
    const size = 30

    // Add QR code to PDF
    pdf.addImage(qrDataUrl, 'PNG', x, blockY, size, size)

    // Return Y position after QR code
    return block.position?.y ? y : y + size + 10
}

/**
 * Render signature block
 */
function renderSignatureBlock(
    pdf: jsPDF,
    block: DocumentBlock,
    y: number
): number {
    const x = block.position?.x || 20
    const blockY = block.position?.y || y

    // If signature image provided
    if (block.content && typeof block.content === 'string') {
        pdf.addImage(block.content, 'PNG', x, blockY, 60, 30)
    }

    // Draw signature line
    pdf.setLineWidth(0.5)
    pdf.line(x, blockY + 35, x + 60, blockY + 35)

    // Add label
    pdf.setFontSize(10)
    pdf.text(block.style?.align || 'Assinatura', x + 10, blockY + 40)

    // Return Y position
    return block.position?.y ? y : blockY + 45
}

/**
 * Render image block
 */
async function renderImageBlock(
    pdf: jsPDF,
    block: DocumentBlock,
    x: number,
    y: number
): Promise<number> {
    const style = block.style || {}
    const width = style.fontSize || 40  // Using fontSize as width for simplicity
    const height = style.lineHeight || 40  // Using lineHeight as height

    if (block.content && typeof block.content === 'string') {
        pdf.addImage(block.content, 'PNG', x, y, width, height)
    }

    return y + height + 10
}

/**
 * Render table block
 */
function renderTableBlock(
    pdf: jsPDF,
    block: DocumentBlock,
    data: DocumentData,
    x: number,
    _width: number,
    y: number
): number {
    // Simple table rendering
    // For complex tables, would use jspdf-autotable plugin

    const tableData = data[block.content] || []
    if (!Array.isArray(tableData) || tableData.length === 0) {
        return y
    }

    pdf.setFontSize(10)

    // Draw simple rows
    tableData.forEach((row: any, index: number) => {
        const rowText = typeof row === 'object'
            ? Object.values(row).join(' | ')
            : String(row)

        pdf.text(rowText, x, y + (index * 7))
    })

    return y + (tableData.length * 7) + 10
}

/**
 * Get page width in mm
 */
function getPageWidth(options: PDFOptions): number {
    const pageSize = options.pageSize || 'a4'
    const orientation = options.orientation || 'portrait'

    const sizes: Record<string, { width: number; height: number }> = {
        a4: { width: 210, height: 297 },
        letter: { width: 216, height: 279 },
        legal: { width: 216, height: 356 }
    }

    const size = sizes[pageSize]
    if (!size) return 210 // Default to A4 width

    return orientation === 'portrait' ? size.width : size.height
}

/**
 * Get page height in mm
 */
function getPageHeight(options: PDFOptions): number {
    const pageSize = options.pageSize || 'a4'
    const orientation = options.orientation || 'portrait'

    const sizes: Record<string, { width: number; height: number }> = {
        a4: { width: 210, height: 297 },
        letter: { width: 216, height: 279 },
        legal: { width: 216, height: 356 }
    }

    const size = sizes[pageSize]
    if (!size) return 297 // Default to A4 height

    return orientation === 'portrait' ? size.height : size.width
}

/**
 * Save PDF to file
 */
function savePDF(pdf: jsPDF, filename: string, preview?: boolean): void {
    if (preview) {
        // Open in new window
        window.open(pdf.output('bloburl'), '_blank')
    } else {
        // Download
        pdf.save(filename)
    }
}

/**
 * Convert hex color to RGB
 */
function hexToRgb(hex: string): [number, number, number] {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    if (!result || !result[1] || !result[2] || !result[3]) {
        return [0, 0, 0]
    }
    return [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
}

/**
 * Export PDF as blob
 */
export function exportPDFAsBlob(pdf: jsPDF): Blob {
    return pdf.output('blob')
}

/**
 * Export PDF as base64
 */
export function exportPDFAsBase64(pdf: jsPDF): string {
    return pdf.output('datauristring')
}
