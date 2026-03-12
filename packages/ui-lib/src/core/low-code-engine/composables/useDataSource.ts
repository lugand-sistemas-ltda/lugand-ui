/**
 * Low-Code Engine — useDataSource (Sprint 8)
 *
 * Composable que expõe os DataSources registrados no motor para os
 * componentes internos (DataBindingEditor, ColumnsConfigEditor, etc.).
 *
 * Os DataSources são injetados via provide/inject pelo LowCodeEngine.vue.
 * Componentes filhos chamam useDataSource() e recebem a lista reativa.
 *
 * USO (consumidor):
 * ```typescript
 * const { sources, getSource, getFields, createBinding } = useDataSource()
 * ```
 *
 * USO (provider — feito automaticamente pelo LowCodeEngine):
 * ```typescript
 * provide(DATA_SOURCE_KEY, computed(() => props.dataSources ?? []))
 * ```
 *
 * @module core/low-code-engine/composables/useDataSource
 */

import { inject, ref, computed } from 'vue'
import type { InjectionKey, Ref } from 'vue'
import type { DataSource, DataSourceField, DataBinding } from '../types/datasource.types'
import { isDataBinding } from '../types/datasource.types'

// ============================================================
// INJECTION KEY
// ============================================================

/**
 * InjectionKey que o LowCodeEngine usa para prover a lista de DataSources.
 * Componentes filhos injetam isso via useDataSource().
 */
export const DATA_SOURCE_KEY: InjectionKey<Ref<DataSource[]>> = Symbol('lg-data-sources')

// ============================================================
// COMPOSABLE
// ============================================================

/**
 * Acessa os DataSources registrados no LowCodeEngine ancestral.
 *
 * Se chamado fora de uma árvore com LowCodeEngine, retorna lista vazia
 * (safe — não lança erro).
 */
export function useDataSource() {
  const sourcesRef = inject(DATA_SOURCE_KEY, ref<DataSource[]>([]))

  /** Lista reativa de todos os DataSources disponíveis */
  const sources = computed(() => sourcesRef.value)

  /** Busca um DataSource pelo seu id */
  function getSource(id: string): DataSource | undefined {
    return sourcesRef.value.find(s => s.id === id)
  }

  /**
   * Retorna os campos de um DataSource.
   * Campos de tipo 'object' ou 'array' com sub-campos são retornados
   * diretos (sem drill-down) para simplificar o seletor.
   */
  function getFields(sourceId: string): DataSourceField[] {
    return getSource(sourceId)?.schema ?? []
  }

  /**
   * Cria um DataBinding com os valores fornecidos.
   * @param sourceId - ID do DataSource
   * @param fieldKey - Caminho do campo (null = resultado completo)
   */
  function createBinding(sourceId: string, fieldKey: string | null): DataBinding {
    return { __binding: true, sourceId, fieldKey }
  }

  return {
    sources,
    getSource,
    getFields,
    createBinding,
    /** Re-exportado para conveniência dos consumidores */
    isDataBinding,
  }
}
