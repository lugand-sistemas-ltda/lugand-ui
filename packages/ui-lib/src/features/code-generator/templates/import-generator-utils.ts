/**
 * FASE 6 - Import Generator
 *
 * Gera import statements otimizados para código gerado.
 * Suporta named, default, namespace imports e tree-shaking.
 */

import type { PageSchema } from "../../../core/schema-system/types";
import type { ImportDeclaration, CodeGeneratorOptions } from "../types";

// ============================================
// IMPORT GENERATION
// ============================================

/**
 * Gera todos os imports necessários para um PageSchema
 */
export function generateImports(
  schema: PageSchema,
  options: CodeGeneratorOptions,
): ImportDeclaration[] {
  const imports: ImportDeclaration[] = [];

  // Vue core imports
  imports.push(generateVueImports(schema, options));

  // Component imports
  imports.push(...generateComponentImports(schema, options));

  // Composable imports
  imports.push(...generateComposableImports(schema, options));

  // Type imports (se TypeScript)
  if (options.typescript) {
    imports.push(...generateTypeImports(schema, options));
  }

  // Third-party imports (se houver)
  imports.push(...generateThirdPartyImports(schema, options));

  // Remove imports vazios
  return imports.filter(
    (imp) =>
      (imp.named && imp.named.length > 0) ||
      imp.default ||
      imp.namespace ||
      imp.type === "side-effect",
  );
}

/**
 * Gera import do Vue
 */
function generateVueImports(
  schema: PageSchema,
  // @ts-expect-error - options será usado para tree-shaking e otimizações futuras
  options: CodeGeneratorOptions,
): ImportDeclaration {
  const vueImports = new Set<string>();

  // Sempre precisamos de ref
  vueImports.add("ref");

  // Computed (se tiver data sources computed)
  if (hasComputedDataSources(schema)) {
    vueImports.add("computed");
  }

  // Watch (se tiver watchers)
  if (hasWatchers(schema)) {
    vueImports.add("watch");
  }

  // Lifecycle hooks
  if (needsOnMounted(schema)) {
    vueImports.add("onMounted");
  }

  if (needsOnUnmounted(schema)) {
    vueImports.add("onUnmounted");
  }

  // Reactive (se tiver objetos complexos)
  if (hasComplexObjects(schema)) {
    vueImports.add("reactive");
  }

  return {
    source: "vue",
    type: "named",
    named: Array.from(vueImports).sort(),
    isType: false,
  };
}

/**
 * Gera imports de componentes
 */
function generateComponentImports(
  schema: PageSchema,
  options: CodeGeneratorOptions,
): ImportDeclaration[] {
  const components = extractUniqueComponents(schema);
  const packageName = options.packageName || "@lugand-sistemas-ltda/vue-ui-lib";

  if (options.importStrategy === "named" || !options.importStrategy) {
    // Named imports (tree-shakeable)
    return [
      {
        source: packageName,
        type: "named",
        named: Array.from(components).sort(),
        isType: false,
      },
    ];
  }

  if (options.importStrategy === "default") {
    // Default imports individuais
    return Array.from(components).map((comp) => ({
      source: `${packageName}/components/${comp}`,
      type: "default",
      default: comp,
      isType: false,
    }));
  }

  if (options.importStrategy === "namespace") {
    // Namespace import
    return [
      {
        source: packageName,
        type: "namespace",
        namespace: "UI",
        isType: false,
      },
    ];
  }

  return [];
}

/**
 * Gera imports de composables
 */
function generateComposableImports(
  schema: PageSchema,
  options: CodeGeneratorOptions,
): ImportDeclaration[] {
  const composables = extractComposablesNeeded(schema);
  const packageName = options.packageName || "@lugand-sistemas-ltda/vue-ui-lib";

  if (composables.length === 0) return [];

  return [
    {
      source: packageName,
      type: "named",
      named: composables.sort(),
      isType: false,
    },
  ];
}

/**
 * Gera imports de types (TypeScript)
 */
function generateTypeImports(
  schema: PageSchema,
  options: CodeGeneratorOptions,
): ImportDeclaration[] {
  const types = new Set<string>();
  const packageName = options.packageName || "@lugand-sistemas-ltda/vue-ui-lib";

  // PageSchema type
  types.add("PageSchema");

  // Widget types usados
  const widgetTypes = extractWidgetTypes(schema);
  widgetTypes.forEach((type) => types.add(type));

  if (types.size === 0) return [];

  return [
    {
      source: packageName,
      type: "named",
      named: Array.from(types).sort(),
      isType: true,
    },
  ];
}

/**
 * Gera imports third-party (se houver)
 */
function generateThirdPartyImports(
  // @ts-expect-error - schema será usado para detectar dependências third-party
  schema: PageSchema,
  // @ts-expect-error - options será usado para configurar CDN vs NPM imports
  options: CodeGeneratorOptions,
): ImportDeclaration[] {
  const imports: ImportDeclaration[] = [];

  // TODO: Detectar dependências third-party no schema
  // Ex: axios, lodash, date-fns, etc.

  return imports;
}

// ============================================
// IMPORT RENDERING
// ============================================

/**
 * Converte ImportDeclaration para string de código
 */
export function renderImport(
  declaration: ImportDeclaration,
  options: CodeGeneratorOptions,
): string {
  const quote = options.singleQuotes ? "'" : '"';

  // Side-effect import
  if (declaration.type === "side-effect") {
    return `import ${quote}${declaration.source}${quote}`;
  }

  // Type import (TypeScript)
  const typeKeyword = declaration.isType ? "type " : "";

  // Named imports
  if (
    declaration.type === "named" &&
    declaration.named &&
    declaration.named.length > 0
  ) {
    const named = declaration.named.join(", ");
    return `import ${typeKeyword}{ ${named} } from ${quote}${declaration.source}${quote}`;
  }

  // Default import
  if (declaration.type === "default" && declaration.default) {
    return `import ${declaration.default} from ${quote}${declaration.source}${quote}`;
  }

  // Namespace import
  if (declaration.type === "namespace" && declaration.namespace) {
    return `import * as ${declaration.namespace} from ${quote}${declaration.source}${quote}`;
  }

  return "";
}

/**
 * Renderiza array de imports
 */
export function renderImports(
  declarations: ImportDeclaration[],
  options: CodeGeneratorOptions,
): string[] {
  return declarations
    .map((decl) => renderImport(decl, options))
    .filter((line) => line !== "");
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Extrai componentes únicos usados no schema
 */
function extractUniqueComponents(schema: PageSchema): Set<string> {
  const components = new Set<string>();

  schema.widgets.forEach((widget) => {
    const componentName = widgetTypeToComponentName(widget.type);
    components.add(componentName);
  });

  return components;
}

/**
 * Extrai composables necessários
 */
function extractComposablesNeeded(schema: PageSchema): string[] {
  const composables = new Set<string>();

  // Se usa theme
  if (schema.theme) {
    composables.add("useTheme");
  }

  // Se usa data tables
  if (hasDataTables(schema)) {
    composables.add("useTableState");
  }

  // Se usa forms
  if (hasForms(schema)) {
    composables.add("useFormValidation");
  }

  return Array.from(composables);
}

/**
 * Extrai types de widgets
 */
function extractWidgetTypes(schema: PageSchema): Set<string> {
  const types = new Set<string>();

  // Adiciona types específicos baseado nos widgets
  schema.widgets.forEach((widget) => {
    if (widget.type === "data-table") {
      types.add("TableColumn");
    }
    if (widget.type === "form-renderer") {
      types.add("FormField");
    }
  });

  return types;
}

/**
 * Converte widget type para component name
 */
function widgetTypeToComponentName(type: string): string {
  return type
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

/**
 * Verifica se schema tem computed data sources
 */
function hasComputedDataSources(_schema: PageSchema): boolean {
  // TODO: Adicionar suporte para computed data sources
  return false;
}

/**
 * Verifica se schema tem watchers
 */
function hasWatchers(
  // @ts-expect-error - schema será usado quando suporte a watchers for implementado
  schema: PageSchema,
): boolean {
  // TODO: Adicionar campo watchers no PageSchema
  return false;
}

/**
 * Verifica se precisa de onMounted
 */
function needsOnMounted(schema: PageSchema): boolean {
  // Se tem data sources API, precisa de onMounted
  if (!schema.dataSources) return false;
  return Object.values(schema.dataSources).some((ds) => ds.type === "api");
}

/**
 * Verifica se precisa de onUnmounted
 */
function needsOnUnmounted(schema: PageSchema): boolean {
  // Se tem scripts onUnmount
  return !!schema.scripts?.onUnmount;
}

/**
 * Verifica se tem objetos complexos
 */
function hasComplexObjects(schema: PageSchema): boolean {
  // Se tem data sources com objetos complexos
  if (!schema.dataSources) return false;
  return Object.values(schema.dataSources).some(
    (ds) => ds.type === "store" || ds.type === "api",
  );
}

/**
 * Verifica se tem data tables
 */
function hasDataTables(schema: PageSchema): boolean {
  return schema.widgets.some((w) => w.type === "data-table");
}

/**
 * Verifica se tem forms
 */
function hasForms(schema: PageSchema): boolean {
  return schema.widgets.some(
    (w) => w.type === "form-renderer" || w.type === "form-builder",
  );
}

// ============================================
// IMPORT OPTIMIZATION
// ============================================

/**
 * Otimiza imports (merge, dedupe, tree-shake)
 */
export function optimizeImports(
  declarations: ImportDeclaration[],
): ImportDeclaration[] {
  const optimized = new Map<string, ImportDeclaration>();

  declarations.forEach((decl) => {
    const key = `${decl.source}-${decl.type}`;

    if (optimized.has(key)) {
      // Merge com existing
      const existing = optimized.get(key)!;

      if (decl.type === "named" && decl.named) {
        existing.named = existing.named || [];
        existing.named.push(...decl.named);
        existing.named = Array.from(new Set(existing.named)).sort();
      }
    } else {
      optimized.set(key, { ...decl });
    }
  });

  return Array.from(optimized.values());
}

/**
 * Ordena imports (Vue > lib > third-party > relative)
 */
export function sortImports(
  declarations: ImportDeclaration[],
): ImportDeclaration[] {
  return declarations.sort((a, b) => {
    const orderA = getImportOrder(a.source);
    const orderB = getImportOrder(b.source);

    if (orderA !== orderB) {
      return orderA - orderB;
    }

    return a.source.localeCompare(b.source);
  });
}

/**
 * Determina ordem de import
 */
function getImportOrder(source: string): number {
  if (source === "vue") return 1;
  if (source.startsWith("@lugand")) return 2;
  if (source.startsWith("@/")) return 4;
  if (source.startsWith("./") || source.startsWith("../")) return 5;
  return 3; // third-party
}
