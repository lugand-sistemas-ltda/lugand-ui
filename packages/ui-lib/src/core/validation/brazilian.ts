/**
 * Validadores brasileiros
 * 
 * Validações específicas do Brasil: CPF, CNPJ, CEP, Telefone, etc.
 * Sem dependências externas.
 */

/**
 * Validar CPF (Cadastro de Pessoa Física)
 * 
 * @param cpf - CPF a ser validado (com ou sem formatação)
 * @returns true se válido
 * 
 * @example
 * ```ts
 * validateCPF('123.456.789-09') // true ou false
 * validateCPF('12345678909')     // true ou false
 * ```
 */
export function validateCPF(cpf: string): boolean {
  // Remover formatação
  cpf = cpf.replace(/[^\d]/g, '')
  
  // Validar tamanho
  if (cpf.length !== 11) return false
  
  // Validar sequências inválidas
  if (/^(\d)\1+$/.test(cpf)) return false
  
  // Validar dígitos verificadores
  const digits = cpf.split('').map(Number)
  
  // Primeiro dígito
  let sum = 0
  for (let i = 0; i < 9; i++) {
    const digit = digits[i]
    if (digit !== undefined) {
      sum += digit * (10 - i)
    }
  }
  let digit1 = 11 - (sum % 11)
  if (digit1 >= 10) digit1 = 0
  
  if (digit1 !== digits[9]) return false
  
  // Segundo dígito
  sum = 0
  for (let i = 0; i < 10; i++) {
    const digit = digits[i]
    if (digit !== undefined) {
      sum += digit * (11 - i)
    }
  }
  let digit2 = 11 - (sum % 11)
  if (digit2 >= 10) digit2 = 0
  
  return digit2 === digits[10]
}

/**
 * Validar CNPJ (Cadastro Nacional da Pessoa Jurídica)
 * 
 * @param cnpj - CNPJ a ser validado (com ou sem formatação)
 * @returns true se válido
 * 
 * @example
 * ```ts
 * validateCNPJ('12.345.678/0001-95')
 * validateCNPJ('12345678000195')
 * ```
 */
export function validateCNPJ(cnpj: string): boolean {
  // Remover formatação
  cnpj = cnpj.replace(/[^\d]/g, '')
  
  // Validar tamanho
  if (cnpj.length !== 14) return false
  
  // Validar sequências inválidas
  if (/^(\d)\1+$/.test(cnpj)) return false
  
  // Validar dígitos verificadores
  const digits = cnpj.split('').map(Number)
  
  // Primeiro dígito
  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  let sum = 0
  for (let i = 0; i < 12; i++) {
    const digit = digits[i]
    const weight = weights1[i]
    if (digit !== undefined && weight !== undefined) {
      sum += digit * weight
    }
  }
  let digit1 = sum % 11
  digit1 = digit1 < 2 ? 0 : 11 - digit1
  
  if (digit1 !== digits[12]) return false
  
  // Segundo dígito
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  sum = 0
  for (let i = 0; i < 13; i++) {
    const digit = digits[i]
    const weight = weights2[i]
    if (digit !== undefined && weight !== undefined) {
      sum += digit * weight
    }
  }
  let digit2 = sum % 11
  digit2 = digit2 < 2 ? 0 : 11 - digit2
  
  return digit2 === digits[13]
}

/**
 * Validar CEP (Código de Endereçamento Postal)
 * 
 * @param cep - CEP a ser validado (com ou sem formatação)
 * @returns true se válido
 * 
 * @example
 * ```ts
 * validateCEP('12345-678')
 * validateCEP('12345678')
 * ```
 */
export function validateCEP(cep: string): boolean {
  // Remover formatação
  cep = cep.replace(/[^\d]/g, '')
  
  // Validar tamanho
  return cep.length === 8 && /^\d{8}$/.test(cep)
}

/**
 * Validar telefone brasileiro
 * 
 * Aceita formatos:
 * - (11) 98765-4321
 * - (11) 3456-7890
 * - 11987654321
 * - 1134567890
 * 
 * @param phone - Telefone a ser validado
 * @returns true se válido
 */
export function validatePhone(phone: string): boolean {
  // Remover formatação
  phone = phone.replace(/[^\d]/g, '')
  
  // Validar tamanho (10 ou 11 dígitos)
  if (phone.length !== 10 && phone.length !== 11) return false
  
  // Validar DDD (primeiros 2 dígitos)
  const ddd = parseInt(phone.substring(0, 2))
  const validDDDs = [
    11, 12, 13, 14, 15, 16, 17, 18, 19, // SP
    21, 22, 24, // RJ
    27, 28, // ES
    31, 32, 33, 34, 35, 37, 38, // MG
    41, 42, 43, 44, 45, 46, // PR
    47, 48, 49, // SC
    51, 53, 54, 55, // RS
    61, // DF
    62, 64, // GO
    63, // TO
    65, 66, // MT
    67, // MS
    68, // AC
    69, // RO
    71, 73, 74, 75, 77, // BA
    79, // SE
    81, 87, // PE
    82, // AL
    83, // PB
    84, // RN
    85, 88, // CE
    86, 89, // PI
    91, 93, 94, // PA
    92, 97, // AM
    95, // RR
    96, // AP
    98, 99, // MA
  ]
  
  if (!validDDDs.includes(ddd)) return false
  
  // Se tem 11 dígitos, o terceiro deve ser 9 (celular)
  if (phone.length === 11 && phone[2] !== '9') return false
  
  return true
}

/**
 * Validar placa de veículo (Mercosul)
 * 
 * Formatos aceitos:
 * - ABC-1234 (antigo)
 * - ABC1D23 (Mercosul)
 * 
 * @param plate - Placa a ser validada
 * @returns true se válido
 */
export function validatePlate(plate: string): boolean {
  // Remover formatação e converter para uppercase
  plate = plate.replace(/[^\dA-Za-z]/g, '').toUpperCase()
  
  // Validar formato antigo (ABC1234)
  if (/^[A-Z]{3}\d{4}$/.test(plate)) return true
  
  // Validar formato Mercosul (ABC1D23)
  if (/^[A-Z]{3}\d[A-Z]\d{2}$/.test(plate)) return true
  
  return false
}

/**
 * Validar data brasileira (DD/MM/YYYY)
 * 
 * @param date - Data a ser validada
 * @returns true se válida
 * 
 * @example
 * ```ts
 * validateBRDate('31/12/2023') // true
 * validateBRDate('32/13/2023') // false
 * ```
 */
export function validateBRDate(date: string): boolean {
  // Validar formato
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(date)) return false
  
  const parts = date.split('/').map(Number)
  const day = parts[0]
  const month = parts[1]
  const year = parts[2]
  
  // Validar ranges básicos
  if (day === undefined || month === undefined || year === undefined) return false
  if (month < 1 || month > 12) return false
  if (day < 1 || day > 31) return false
  if (year < 1900 || year > 2100) return false
  
  // Validar dias por mês
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  
  // Ano bissexto
  if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
    daysInMonth[1] = 29
  }
  
  const maxDays = daysInMonth[month - 1]
  if (maxDays === undefined || day > maxDays) return false
  
  return true
}

/**
 * Validar hora brasileira (HH:MM ou HH:MM:SS)
 * 
 * @param time - Hora a ser validada
 * @returns true se válida
 */
export function validateBRTime(time: string): boolean {
  // Validar formato
  if (!/^\d{2}:\d{2}(:\d{2})?$/.test(time)) return false
  
  const parts = time.split(':').map(Number)
  const hour = parts[0]
  const minute = parts[1]
  const second = parts[2]
  
  // Validar ranges
  if (hour === undefined || minute === undefined) return false
  if (hour < 0 || hour > 23) return false
  if (minute < 0 || minute > 59) return false
  if (second !== undefined && (second < 0 || second > 59)) return false
  
  return true
}

/**
 * Validar moeda brasileira (R$)
 * 
 * Aceita formatos:
 * - R$ 1.234,56
 * - 1.234,56
 * - 1234,56
 * - 1234.56 (ponto como decimal)
 * 
 * @param currency - Valor em moeda a ser validado
 * @returns true se válido
 */
export function validateBRCurrency(currency: string): boolean {
  // Remover R$ e espaços
  currency = currency.replace(/R\$?\s*/g, '').trim()
  
  // Validar formato com vírgula como decimal
  if (/^\d{1,3}(\.\d{3})*(,\d{2})?$/.test(currency)) return true
  
  // Validar formato com ponto como decimal
  if (/^\d{1,3}(,\d{3})*(\.\d{2})?$/.test(currency)) return true
  
  // Validar formato simples
  if (/^\d+(,\d{2})?$/.test(currency)) return true
  if (/^\d+(\.\d{2})?$/.test(currency)) return true
  
  return false
}

/**
 * Validar PIS/PASEP
 * 
 * @param pis - PIS/PASEP a ser validado (11 dígitos)
 * @returns true se válido
 */
export function validatePIS(pis: string): boolean {
  // Remover formatação
  pis = pis.replace(/[^\d]/g, '')
  
  // Validar tamanho
  if (pis.length !== 11) return false
  
  // Validar sequências inválidas
  if (/^(\d)\1+$/.test(pis)) return false
  
  // Validar dígito verificador
  const weights = [3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  const digits = pis.split('').map(Number)
  
  let sum = 0
  for (let i = 0; i < 10; i++) {
    const digit = digits[i]
    const weight = weights[i]
    if (digit !== undefined && weight !== undefined) {
      sum += digit * weight
    }
  }
  
  const remainder = sum % 11
  const digit = remainder < 2 ? 0 : 11 - remainder
  
  return digit === digits[10]
}

/**
 * Validar Título de Eleitor
 * 
 * @param titulo - Título de eleitor (12 dígitos)
 * @returns true se válido
 */
export function validateTituloEleitor(titulo: string): boolean {
  // Remover formatação
  titulo = titulo.replace(/[^\d]/g, '')
  
  // Validar tamanho
  if (titulo.length !== 12) return false
  
  // Validar sequências inválidas
  if (/^(\d)\1+$/.test(titulo)) return false
  
  const digits = titulo.split('').map(Number)
  
  // Primeiro dígito verificador
  let sum = 0
  for (let i = 0; i < 8; i++) {
    const digit = digits[i]
    if (digit !== undefined) {
      sum += digit * (9 - i)
    }
  }
  let digit1 = sum % 11
  if (digit1 === 10) digit1 = 0
  
  if (digit1 !== digits[10]) return false
  
  // Segundo dígito verificador
  sum = 0
  const d8 = digits[8]
  const d9 = digits[9]
  const d10 = digits[10]
  if (d8 !== undefined) sum += d8 * 4
  if (d9 !== undefined) sum += d9 * 3
  if (d10 !== undefined) sum += d10 * 2
  let digit2 = sum % 11
  if (digit2 === 10) digit2 = 0
  
  return digit2 === digits[11]
}
