/**
 * Formatters Util
 * Centralized logic for formatting data types.
 */

/* --- Currency --- */
export const formatCurrency = (value: number, locale = 'pt-BR', currency = 'BRL'): string => {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value)
}

export const parseCurrency = (value: string): number => {
    // Remove non-numeric chars except comma/dot related to currency
    // For BRL (pt-BR), 1.000,00 -> remove dots, replace comma with dot -> 1000.00
    const clean = value.replace(/[^\d,]/g, '').replace(',', '.')
    return Number.parseFloat(clean) || 0
}

/* --- Date & Time Utils --- */

/**
 * Valida se uma data é válida semanticamente
 * Verifica se dia/mês/ano formam uma data real (lida com anos bissextos, meses com 30/31 dias, etc)
 */
export const isValidDate = (day: number, month: number, year: number, hour = 0, minute = 0): boolean => {
    // Validações básicas de range
    if (month < 1 || month > 12) return false
    if (day < 1 || day > 31) return false
    if (year < 1000 || year > 9999) return false
    if (hour < 0 || hour > 23) return false
    if (minute < 0 || minute > 59) return false

    // Validação estrita usando JS Date (detecta rolagem de data - ex: 31/02 vira 03/03)
    const date = new Date(year, month - 1, day, hour, minute, 0, 0)

    // Se a data "rolou" (ex: 31 de Fev virou 3 de Mar), é inválida
    return date.getFullYear() === year &&
        date.getMonth() === (month - 1) &&
        date.getDate() === day
}

/**
 * Retorna o dia da semana de uma data (0 = Domingo, 6 = Sábado)
 */
export const getDayOfWeek = (date: Date): number => {
    return date.getDay()
}

/**
 * Retorna o nome do dia da semana em português
 */
export const getDayOfWeekName = (date: Date, format: 'long' | 'short' = 'long'): string => {
    const days = {
        long: ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'],
        short: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
    }
    return days[format][date.getDay()] || ''
}

/**
 * Verifica se a data é um dia útil (segunda a sexta)
 */
export const isWeekday = (date: Date): boolean => {
    const day = date.getDay()
    return day >= 1 && day <= 5
}

/**
 * Verifica se a data é fim de semana (sábado ou domingo)
 */
export const isWeekend = (date: Date): boolean => {
    const day = date.getDay()
    return day === 0 || day === 6
}

/**
 * Valida se data está dentro de um range (min/max)
 */
export const isDateInRange = (date: Date, min?: Date | null, max?: Date | null): boolean => {
    if (min && date < min) return false
    if (max && date > max) return false
    return true
}

/**
 * Converte string DD/MM/YYYY para Date object (local time)
 * Retorna null se a string for inválida ou a data for impossível
 */
export const parseDateBR = (value: string): Date | null => {
    if (!value || value.length < 10) return null

    const parts = value.split('/')
    if (parts.length !== 3) return null

    const day = Number(parts[0])
    const month = Number(parts[1])
    const year = Number(parts[2])

    if (!isValidDate(day, month, year)) return null

    return new Date(year, month - 1, day, 0, 0, 0, 0)
}

/**
 * Converte string DD/MM/YYYY HH:mm para Date object (local time)
 * Retorna null se a string for inválida ou a data/hora for impossível
 */
export const parseDateTimeBR = (value: string): Date | null => {
    if (!value || value.length < 16) return null

    const [datePart, timePart] = value.split(' ')
    if (!datePart || !timePart) return null

    const dateParts = datePart.split('/')
    const timeParts = timePart.split(':')

    if (dateParts.length !== 3 || timeParts.length !== 2) return null

    const day = Number(dateParts[0])
    const month = Number(dateParts[1])
    const year = Number(dateParts[2])
    const hour = Number(timeParts[0])
    const minute = Number(timeParts[1])

    if (!isValidDate(day, month, year, hour, minute)) return null

    return new Date(year, month - 1, day, hour, minute, 0, 0)
}

/**
 * Converte string HH:mm para Date object (hoje com o horário especificado)
 * Retorna null se a string for inválida
 */
export const parseTimeBR = (value: string): Date | null => {
    if (!value || value.length < 5) return null

    const parts = value.split(':')
    if (parts.length !== 2) return null

    const hour = Number(parts[0])
    const minute = Number(parts[1])

    if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null

    const date = new Date()
    date.setHours(hour, minute, 0, 0)
    return date
}

/**
 * Converte string ISO (YYYY-MM-DD ou YYYY-MM-DDTHH:mm:ss) para Date (local time)
 * Remove timezone info para tratar como local, evitando deslocamentos UTC
 */
export const parseISOToLocal = (isoString: string): Date | null => {
    if (!isoString) return null

    // Remove timezone indicators (Z, +03:00, etc) e trata como local
    const cleanISO = isoString.replace(/[TZ]/g, ' ').replace(/[+-]\d{2}:\d{2}$/, '').trim()
    const [datePart, timePart] = cleanISO.split(' ')

    if (!datePart) return null

    const dateParts = datePart.split('-').map(Number)
    if (dateParts.length !== 3) return null

    const year = dateParts[0] || 0
    const month = dateParts[1] || 0
    const day = dateParts[2] || 0

    if (timePart) {
        const timeParts = timePart.split(':').map(Number)
        const hour = timeParts[0] || 0
        const minute = timeParts[1] || 0

        if (!isValidDate(day, month, year, hour, minute)) return null
        return new Date(year, month - 1, day, hour, minute, 0, 0)
    }

    if (!isValidDate(day, month, year)) return null
    return new Date(year, month - 1, day, 0, 0, 0, 0)
}

/**
 * Formata Date para DD/MM/YYYY
 */
export const formatDateBR = (date: Date | null): string => {
    if (!date || Number.isNaN(date.getTime())) return ''

    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()

    return `${day}/${month}/${year}`
}

/**
 * Formata Date para DD/MM/YYYY HH:mm
 */
export const formatDateTimeBR = (date: Date | null): string => {
    if (!date || Number.isNaN(date.getTime())) return ''

    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    const hour = String(date.getHours()).padStart(2, '0')
    const minute = String(date.getMinutes()).padStart(2, '0')

    return `${day}/${month}/${year} ${hour}:${minute}`
}

/**
 * Formata Date para HH:mm
 */
export const formatTimeBR = (date: Date | null): string => {
    if (!date || Number.isNaN(date.getTime())) return ''

    const hour = String(date.getHours()).padStart(2, '0')
    const minute = String(date.getMinutes()).padStart(2, '0')

    return `${hour}:${minute}`
}

/**
 * Formata Date para ISO (YYYY-MM-DD)
 */
export const toISODate = (date: Date | null): string => {
    if (!date || Number.isNaN(date.getTime())) return ''

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
}

/**
 * Formata Date para ISO DateTime (YYYY-MM-DDTHH:mm:ss)
 */
export const toISODateTime = (date: Date | null): string => {
    if (!date || Number.isNaN(date.getTime())) return ''
    return date.toISOString()
}

/**
 * Função genérica de formatação usando Intl.DateTimeFormat
 * Mantida para compatibilidade com código existente
 */
export const formatDate = (
    value: string | Date,
    options?: Intl.DateTimeFormatOptions,
    locale = 'pt-BR'
): string => {
    const defaultOptions: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }

    const finalOptions = options || defaultOptions

    let date: Date | null = null;

    if (typeof value === 'string') {
        // Tenta parsear ISO primeiro
        date = parseISOToLocal(value)
        // Se falhar, tenta formato BR
        date ??= parseDateBR(value)
        // Se falhar, tenta DateTime BR
        date ??= parseDateTimeBR(value)
    } else {
        date = value;
    }

    if (!date || Number.isNaN(date.getTime())) return ''
    return new Intl.DateTimeFormat(locale, finalOptions).format(date)
}

/* --- Masks --- */

export const MASKS = {
    CPF: '###.###.###-##',
    CNPJ: '##.###.###/####-##',
    RG: '##.###.###-#',
    PHONE: '(##) #####-####',
    CEP: '#####-###',
    DATE_BR: '##/##/####',
    TIME: '##:##',
    DATETIME_BR: '##/##/#### ##:##'
}

/**
 * Applies a mask to a string value
 * Supports '#' for digits, 'A' for letters, 'X' for alphanumeric
 */
export const applyMask = (value: string, mask: string): string => {
    if (!value) return ''

    // Clean based on what the mask expects (mostly digits for standard masks)
    // This is a simplification. For mixed masks, valid characters logic needs to be smarter.
    // Assuming mostly numeric masks for now (CPF, CNPJ, Phone)
    const isNumericMask = !mask.includes('A')
    const cleanValue = value.replace(isNumericMask ? /\D/g : /[^a-zA-Z0-9]/g, '')

    let result = ''
    let valIndex = 0

    for (let i = 0; i < mask.length; i++) {
        if (valIndex >= cleanValue.length) break

        const maskChar = mask[i]
        const valChar = cleanValue[valIndex] || ''

        if (maskChar === '#') {
            if (/\d/.test(valChar)) {
                result += valChar
                valIndex++
            } else {
                valIndex++ // Skip invalid char input? Or stop? Better to just filter input beforehand
            }
        } else if (maskChar === 'A') {
            if (/[a-zA-Z]/.test(valChar)) {
                result += valChar
                valIndex++
            } else {
                valIndex++
            }
        } else if (maskChar === 'X') {
            result += valChar
            valIndex++
        } else {
            // Literal character in mask
            result += maskChar
            // If the user typed the literal character, consume it from value as well to avoid duplication
            if (valChar === maskChar) {
                valIndex++
            }
        }
    }
    return result
}

// Removes all non-alphanumeric characters
export const unmask = (value: string): string => {
    return value.replace(/[^a-zA-Z0-9]/g, '') // Keep .replace for compatibility
}
