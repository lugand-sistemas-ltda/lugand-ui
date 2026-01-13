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
    // Simple naive parser for BRL
    const clean = value.replace(/[^\d,]/g, '').replace(',', '.')
    return parseFloat(clean) || 0
}

/* --- Date --- */
export const formatDate = (value: string | Date, options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' }, locale = 'pt-BR'): string => {
    let date: Date;
    if (typeof value === 'string') {
        // Fix for ISO date strings (YYYY-MM-DD) - parse components to avoid UTC timezone shift
        if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
            const [y, m, d] = value.split('-').map(Number)
            date = new Date(y || 0, (m || 1) - 1, d || 1)
        } else {
            date = new Date(value)
        }
    } else {
        date = value;
    }

    if (isNaN(date.getTime())) return ''
    return new Intl.DateTimeFormat(locale, options).format(date)
}

// ISO Format YYYY-MM-DD
export const toISODate = (date: Date): string => {
    if (isNaN(date.getTime())) return ''
    return date.toISOString().split('T')[0] || ''
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
    return value.replace(/[^a-zA-Z0-9]/g, '')
}
