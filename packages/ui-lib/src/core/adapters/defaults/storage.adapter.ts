/**
 * Adapter de Storage usando localStorage
 * 
 * Implementação padrão de persistência usando localStorage do browser
 */

import type { StorageAdapter } from '../types'

/**
 * Adapter localStorage (sempre disponível no browser)
 */
export class LocalStorageAdapter<T = any> implements StorageAdapter<T> {
  name = 'localStorage'
  
  /**
   * Salvar item no localStorage
   */
  async save(key: string, value: T): Promise<void> {
    try {
      const json = JSON.stringify(value)
      localStorage.setItem(key, json)
    } catch (error) {
      throw new Error(
        `Erro ao salvar no localStorage [${key}]: ${
          error instanceof Error ? error.message : 'Desconhecido'
        }`
      )
    }
  }
  
  /**
   * Carregar item do localStorage
   */
  async load(key: string): Promise<T | null> {
    try {
      const json = localStorage.getItem(key)
      if (json === null) return null
      return JSON.parse(json)
    } catch (error) {
      throw new Error(
        `Erro ao carregar do localStorage [${key}]: ${
          error instanceof Error ? error.message : 'Desconhecido'
        }`
      )
    }
  }
  
  /**
   * Deletar item do localStorage
   */
  async delete(key: string): Promise<void> {
    localStorage.removeItem(key)
  }
  
  /**
   * Listar keys (com filtro opcional por prefixo)
   */
  async list(prefix?: string): Promise<string[]> {
    const keys: string[] = []
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && (!prefix || key.startsWith(prefix))) {
        keys.push(key)
      }
    }
    
    return keys
  }
  
  /**
   * Limpar todo o localStorage
   */
  async clear(): Promise<void> {
    localStorage.clear()
  }
  
  /**
   * Verificar se key existe
   */
  async exists(key: string): Promise<boolean> {
    return localStorage.getItem(key) !== null
  }
  
  /**
   * Obter tamanho aproximado usado (em bytes)
   */
  async getSize(): Promise<number> {
    let size = 0
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key) {
        const value = localStorage.getItem(key) || ''
        size += key.length + value.length
      }
    }
    
    // Converter para bytes (cada char = ~2 bytes em UTF-16)
    return size * 2
  }
}

/**
 * Adapter usando IndexedDB (para volumes maiores de dados)
 * 
 * IndexedDB suporta até ~50% do espaço em disco disponível,
 * enquanto localStorage está limitado a ~5-10 MB
 */
export class IndexedDBAdapter<T = any> implements StorageAdapter<T> {
  name = 'indexedDB'
  private dbName: string
  private storeName: string
  private version: number
  
  constructor(
    dbName = 'lugand-ui-storage',
    storeName = 'schemas',
    version = 1
  ) {
    this.dbName = dbName
    this.storeName = storeName
    this.version = version
  }
  
  /**
   * Obter conexão com IndexedDB
   */
  private async getDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version)
      
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        
        // Criar object store se não existir
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName)
        }
      }
    })
  }
  
  /**
   * Salvar item
   */
  async save(key: string, value: T): Promise<void> {
    const db = await this.getDB()
    const tx = db.transaction(this.storeName, 'readwrite')
    const store = tx.objectStore(this.storeName)
    
    return new Promise((resolve, reject) => {
      const request = store.put(value, key)
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }
  
  /**
   * Carregar item
   */
  async load(key: string): Promise<T | null> {
    const db = await this.getDB()
    const tx = db.transaction(this.storeName, 'readonly')
    const store = tx.objectStore(this.storeName)
    
    return new Promise((resolve, reject) => {
      const request = store.get(key)
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result || null)
    })
  }
  
  /**
   * Deletar item
   */
  async delete(key: string): Promise<void> {
    const db = await this.getDB()
    const tx = db.transaction(this.storeName, 'readwrite')
    const store = tx.objectStore(this.storeName)
    
    return new Promise((resolve, reject) => {
      const request = store.delete(key)
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }
  
  /**
   * Listar keys
   */
  async list(prefix?: string): Promise<string[]> {
    const db = await this.getDB()
    const tx = db.transaction(this.storeName, 'readonly')
    const store = tx.objectStore(this.storeName)
    
    return new Promise((resolve, reject) => {
      const request = store.getAllKeys()
      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        const keys = request.result as string[]
        resolve(
          prefix
            ? keys.filter(k => k.startsWith(prefix))
            : keys
        )
      }
    })
  }
  
  /**
   * Limpar tudo
   */
  async clear(): Promise<void> {
    const db = await this.getDB()
    const tx = db.transaction(this.storeName, 'readwrite')
    const store = tx.objectStore(this.storeName)
    
    return new Promise((resolve, reject) => {
      const request = store.clear()
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }
  
  /**
   * Verificar se key existe
   */
  async exists(key: string): Promise<boolean> {
    const value = await this.load(key)
    return value !== null
  }
  
  /**
   * Obter tamanho aproximado usado
   */
  async getSize(): Promise<number> {
    // IndexedDB não tem API direta para tamanho
    // Estimativa baseada em serialização
    const keys = await this.list()
    let size = 0
    
    for (const key of keys) {
      const value = await this.load(key)
      if (value) {
        const json = JSON.stringify(value)
        size += json.length * 2 // UTF-16
      }
    }
    
    return size
  }
}

/**
 * Adapter de memória (para testes ou uso temporário)
 */
export class MemoryStorageAdapter<T = any> implements StorageAdapter<T> {
  name = 'memory'
  private storage = new Map<string, T>()
  
  async save(key: string, value: T): Promise<void> {
    this.storage.set(key, value)
  }
  
  async load(key: string): Promise<T | null> {
    return this.storage.get(key) || null
  }
  
  async delete(key: string): Promise<void> {
    this.storage.delete(key)
  }
  
  async list(prefix?: string): Promise<string[]> {
    const keys = Array.from(this.storage.keys())
    return prefix ? keys.filter(k => k.startsWith(prefix)) : keys
  }
  
  async clear(): Promise<void> {
    this.storage.clear()
  }
  
  async exists(key: string): Promise<boolean> {
    return this.storage.has(key)
  }
  
  async getSize(): Promise<number> {
    let size = 0
    for (const [key, value] of this.storage) {
      const json = JSON.stringify(value)
      size += (key.length + json.length) * 2
    }
    return size
  }
}
