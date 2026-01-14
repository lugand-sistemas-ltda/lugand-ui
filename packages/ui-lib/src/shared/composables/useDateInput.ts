/**
 * useDateInput - Composable centralizado para manipulação de datas
 * 
 * Fonte única de verdade para conversões entre:
 * - Date objects (modelo interno)
 * - Strings formatadas BR (DD/MM/YYYY, DD/MM/YYYY HH:mm, HH:mm)
 * - Strings ISO (YYYY-MM-DD, ISO 8601)
 * 
 * Uso:
 * ```ts
 * const { date, displayValue, setFromBRFormat, setFromISO, toISO } = useDateInput()
 * ```
 */

import { ref, computed, type Ref } from 'vue'
import {
    parseDateBR,
    parseDateTimeBR,
    parseTimeBR,
    parseISOToLocal,
    formatDateBR,
    formatDateTimeBR,
    formatTimeBR,
    toISODate,
    toISODateTime
} from '@/core/utils/formatters'

export type DateInputType = 'date' | 'datetime-local' | 'time'
export type DateOutputFormat = 'date' | 'iso-string'

export interface UseDateInputOptions {
    /**
     * Tipo de input (define formato de display)
     */
    type?: DateInputType

    /**
     * Formato de saída ao emitir valor (Date object ou ISO string)
     */
    outputFormat?: DateOutputFormat

    /**
     * Valor inicial
     */
    initialValue?: Date | string | null
}

export interface UseDateInputReturn {
    /**
     * Date object interno (fonte da verdade)
     */
    date: Ref<Date | null>

    /**
     * String formatada para display no formato BR
     */
    displayValue: Ref<string>

    /**
     * String do último input recebido (pode estar inválido)
     */
    inputValue: Ref<string>

    /**
     * Define data a partir de string no formato BR (DD/MM/YYYY, DD/MM/YYYY HH:mm, HH:mm)
     */
    setFromBRFormat: (value: string) => void

    /**
     * Define data a partir de string ISO (YYYY-MM-DD ou ISO 8601)
     */
    setFromISO: (value: string) => void

    /**
     * Define data a partir de Date object
     */
    setFromDate: (value: Date | null) => void

    /**
     * Retorna valor no formato de saída configurado (Date ou ISO string)
     */
    outputValue: Ref<Date | string | null>

    /**
     * Converte date atual para ISO string
     */
    toISO: () => string

    /**
     * Limpa o valor
     */
    clear: () => void

    /**
     * Valida se a data atual é válida
     */
    isValid: Ref<boolean>

    /**
     * Indica se há um erro de validação (input inválido)
     */
    hasError: Ref<boolean>

    /**
     * Mensagem de erro específica
     */
    errorMessage: Ref<string>
}

export function useDateInput(options: UseDateInputOptions = {}): UseDateInputReturn {
    const {
        type = 'date',
        outputFormat = 'date',
        initialValue = null
    } = options

    // Estado interno: Date object (fonte única da verdade)
    const date = ref<Date | null>(null)

    // Estado do último input recebido (pode estar inválido)
    const inputValue = ref<string>('')

    // Estado de erro
    const hasError = ref<boolean>(false)
    const errorMessage = ref<string>('')

    // Inicializa valor
    if (initialValue) {
        if (initialValue instanceof Date) {
            date.value = initialValue
        } else if (typeof initialValue === 'string') {
            // Tenta parsear como ISO primeiro, depois BR
            date.value = parseISOToLocal(initialValue) || parseDateBR(initialValue) || parseDateTimeBR(initialValue) || parseTimeBR(initialValue)
        }
    }

    // Computed: String formatada para display (DD/MM/YYYY, etc)
    const displayValue = computed(() => {
        if (!date.value) return inputValue.value

        switch (type) {
            case 'time':
                return formatTimeBR(date.value)
            case 'datetime-local':
                return formatDateTimeBR(date.value)
            case 'date':
            default:
                return formatDateBR(date.value)
        }
    })

    // Computed: Valor de saída (Date ou ISO string)
    const outputValue = computed(() => {
        if (!date.value) return null

        if (outputFormat === 'iso-string') {
            return type === 'datetime-local' || type === 'time'
                ? toISODateTime(date.value)
                : toISODate(date.value)
        }

        return date.value
    })

    // Computed: Valida se a data é válida
    const isValid = computed(() => {
        if (!date.value) return false
        return !Number.isNaN(date.value.getTime())
    })

    /**
     * Valida comprimento do input baseado no tipo
     */
    const isInputComplete = (value: string): boolean => {
        let expectedLength: number
        if (type === 'datetime-local') {
            expectedLength = 16 // DD/MM/YYYY HH:mm
        } else if (type === 'time') {
            expectedLength = 5 // HH:mm
        } else {
            expectedLength = 10 // DD/MM/YYYY
        }

        return value.length >= expectedLength
    }

    /**
     * Gera mensagem de erro específica baseada no tipo
     */
    const getErrorMessage = (value: string): string => {
        if (!value) return ''

        if (!isInputComplete(value)) {
            return '' // Não exibe erro enquanto digita
        }

        switch (type) {
            case 'time':
                return 'Horário inválido. Use o formato HH:mm (ex: 14:30)'
            case 'datetime-local':
                return 'Data/hora inválida. Use o formato DD/MM/YYYY HH:mm'
            case 'date':
            default:
                return 'Data inválida. Verifique dia, mês e ano'
        }
    }

    /**
     * Define data a partir de string no formato BR
     */
    const setFromBRFormat = (value: string) => {
        inputValue.value = value

        if (!value) {
            date.value = null
            hasError.value = false
            errorMessage.value = ''
            return
        }

        // Não valida enquanto está digitando
        if (!isInputComplete(value)) {
            hasError.value = false
            errorMessage.value = ''
            return
        }

        let parsed: Date | null = null

        switch (type) {
            case 'time':
                parsed = parseTimeBR(value)
                break
            case 'datetime-local':
                parsed = parseDateTimeBR(value)
                break
            case 'date':
            default:
                parsed = parseDateBR(value)
                break
        }

        if (parsed) {
            // Data válida
            date.value = parsed
            hasError.value = false
            errorMessage.value = ''
        } else {
            // Data inválida
            date.value = null
            hasError.value = true
            errorMessage.value = getErrorMessage(value)
        }
    }

    /**
     * Define data a partir de string ISO
     */
    const setFromISO = (value: string) => {
        inputValue.value = value

        if (!value) {
            date.value = null
            hasError.value = false
            errorMessage.value = ''
            return
        }

        const parsed = parseISOToLocal(value)

        if (parsed) {
            date.value = parsed
            hasError.value = false
            errorMessage.value = ''
        } else {
            date.value = null
            hasError.value = true
            errorMessage.value = 'Formato ISO inválido'
        }
    }

    /**
     * Define data a partir de Date object
     */
    const setFromDate = (value: Date | null) => {
        date.value = value
        inputValue.value = ''
        hasError.value = false
        errorMessage.value = ''
    }

    /**
     * Converte date atual para ISO string
     */
    const toISO = (): string => {
        if (!date.value) return ''

        return type === 'datetime-local' || type === 'time'
            ? toISODateTime(date.value)
            : toISODate(date.value)
    }

    /**
     * Limpa o valor
     */
    const clear = () => {
        date.value = null
        inputValue.value = ''
        hasError.value = false
        errorMessage.value = ''
    }

    return {
        date,
        displayValue,
        inputValue,
        setFromBRFormat,
        setFromISO,
        setFromDate,
        outputValue,
        toISO,
        clear,
        isValid,
        hasError,
        errorMessage
    }
}
