/**
 * FASE 6 - Vue SFC Template Generator
 *
 * Gera código Vue SFC (.vue) a partir de PageSchema.
 * Suporta script setup, TypeScript, scoped styles.
 */

import type { PageSchema } from "../../../core/schema-system/types";
import type { WidgetSchema } from "../../../core/widget-system/types";
import type { CodeGeneratorOptions } from "../types";

// ============================================
// VUE SFC GENERATOR
// ============================================

/**
 * Gera arquivo Vue SFC completo
 */
export function generateVueSFC(
  schema: PageSchema,
  options: CodeGeneratorOptions,
): string {
  const template = generateTemplate(schema, options);
  const script = generateScript(schema, options);
  const style = options.templateOnly ? "" : generateStyle(schema, options);

  const parts: string[] = [];

  // Template
  parts.push(template);

  // Script
  if (!options.templateOnly && script) {
    parts.push("\n");
    parts.push(script);
  }

  // Style
  if (!options.templateOnly && style) {
    parts.push("\n");
    parts.push(style);
  }

  return parts.join("");
}

// ============================================
// TEMPLATE GENERATION
// ============================================

/**
 * Gera seção <template>
 */
export function generateTemplate(
  schema: PageSchema,
  options: CodeGeneratorOptions,
): string {
  const indent = " ".repeat(options.indentSize || 2);
  const lines: string[] = [];

  // Comentário de header (se habilitado)
  if (options.includeComments) {
    lines.push("<!--");
    lines.push(`  ${schema.metadata.title || "Page Component"}`);
    if (schema.metadata.description) {
      lines.push(`  ${schema.metadata.description}`);
    }
    if (options.includeMetadata) {
      lines.push(`  Generated: ${new Date().toISOString()}`);
      lines.push(`  Version: ${schema.metadata.version}`);
    }
    lines.push("-->");
  }

  lines.push("<template>");

  // Container principal
  const containerClass = getContainerClass(schema);
  lines.push(`${indent}<div class="${containerClass}">`);

  // Widgets (index será usado para key generation quando suportar listas dinâmicas)
  const widgetLines = schema.widgets.map((widget, _index) =>
    generateWidgetTemplate(widget, options, 2),
  );
  lines.push(...widgetLines);

  lines.push(`${indent}</div>`);
  lines.push("</template>");

  return lines.join("\n");
}

/**
 * Gera template para um widget
 */
function generateWidgetTemplate(
  widget: WidgetSchema,
  options: CodeGeneratorOptions,
  indentLevel: number = 0,
): string {
  const indent = " ".repeat((options.indentSize || 2) * indentLevel);
  const componentName = getComponentName(widget.type);
  const props = generatePropsString(widget.config || {}, options);
  const vModel = hasVModelProp(widget)
    ? ' v-model="' + getVModelBinding(widget) + '"'
    : "";

  // Verificar se tem conteúdo textual em config.content ou config.text
  const textContent =
    (widget.config as any)?.content || (widget.config as any)?.text;

  // Self-closing se não tem conteúdo
  if (!textContent) {
    return `${indent}<${componentName}${props}${vModel} />`;
  }

  // Com conteúdo textual
  const lines: string[] = [];
  lines.push(`${indent}<${componentName}${props}${vModel}>`);

  // Conteúdo textual
  if (typeof textContent === "string") {
    lines.push(`${indent}  ${textContent}`);
  }

  lines.push(`${indent}</${componentName}>`);
  return lines.join("\n");
}

/**
 * Gera string de props para componente
 */
function generatePropsString(
  config: Record<string, any>,
  options: CodeGeneratorOptions,
): string {
  const props: string[] = [];

  for (const [key, value] of Object.entries(config)) {
    // Skip props especiais
    if (["preview", "editable", "context"].includes(key)) continue;

    const propStr = formatProp(key, value, options);
    if (propStr) props.push(propStr);
  }

  return props.length > 0 ? " " + props.join(" ") : "";
}

/**
 * Formata uma prop individual
 */
function formatProp(
  key: string,
  value: any,
  options: CodeGeneratorOptions,
): string {
  // Boolean true
  if (value === true) {
    return key;
  }

  // Boolean false (omite)
  if (value === false) {
    return "";
  }

  // String
  if (typeof value === "string") {
    const quote = options.singleQuotes ? "'" : '"';
    return `${key}=${quote}${escapeString(value)}${quote}`;
  }

  // Number
  if (typeof value === "number") {
    return `:${key}="${value}"`;
  }

  // Array ou Object
  if (typeof value === "object") {
    return `:${key}="${JSON.stringify(value).replace(/"/g, "'")}"`;
  }

  return "";
}

// ============================================
// SCRIPT GENERATION
// ============================================

/**
 * Gera seção <script setup>
 */
export function generateScript(
  schema: PageSchema,
  options: CodeGeneratorOptions,
): string {
  const lines: string[] = [];
  // indent será usado quando implementarmos formatação customizável
  // const indent = ' '.repeat(options.indentSize || 2)
  const ts = options.typescript;
  const lang = ts ? ' lang="ts"' : "";

  // Script tag
  lines.push(`<script setup${lang}>`);

  // Imports
  const imports = generateImports(schema, options);
  if (imports.length > 0) {
    lines.push(...imports);
    lines.push("");
  }

  // TypeScript types (se habilitado)
  if (ts && options.includeComments) {
    lines.push("// Types");
    lines.push(
      "import type { PageSchema } from '@lugand-sistemas-ltda/vue-ui-lib'",
    );
    lines.push("");
  }

  // Data sources
  const dataSources = generateDataSources(schema, options);
  if (dataSources.length > 0) {
    if (options.includeComments) {
      lines.push("// Data Sources");
    }
    lines.push(...dataSources);
    lines.push("");
  }

  // Reactive state
  const state = generateReactiveState(schema, options);
  if (state.length > 0) {
    if (options.includeComments) {
      lines.push("// State");
    }
    lines.push(...state);
    lines.push("");
  }

  // Event handlers
  const handlers = generateEventHandlers(schema, options);
  if (handlers.length > 0) {
    if (options.includeComments) {
      lines.push("// Event Handlers");
    }
    lines.push(...handlers);
    lines.push("");
  }

  // Lifecycle hooks (se necessário)
  const lifecycle = generateLifecycleHooks(schema, options);
  if (lifecycle.length > 0) {
    if (options.includeComments) {
      lines.push("// Lifecycle");
    }
    lines.push(...lifecycle);
    lines.push("");
  }

  lines.push("</script>");

  return lines.join("\n");
}

/**
 * Gera imports
 */
function generateImports(
  schema: PageSchema,
  options: CodeGeneratorOptions,
): string[] {
  const lines: string[] = [];
  const components = extractComponentsUsed(schema);
  const packageName = options.packageName || "@lugand-sistemas-ltda/vue-ui-lib";

  // Import Vue composables
  const vueImports = ["ref", "computed", "onMounted"];
  if (options.typescript) {
    lines.push(`import { ${vueImports.join(", ")} } from 'vue'`);
  } else {
    lines.push(`import { ${vueImports.join(", ")} } from 'vue'`);
  }

  // Import components
  if (options.importStrategy === "named" || !options.importStrategy) {
    // Named imports (default)
    const componentNames = Array.from(components).sort();
    if (componentNames.length > 0) {
      lines.push(
        `import { ${componentNames.join(", ")} } from '${packageName}'`,
      );
    }
  } else if (options.importStrategy === "default") {
    // Default imports
    Array.from(components).forEach((comp) => {
      lines.push(`import ${comp} from '${packageName}/components/${comp}'`);
    });
  }

  return lines;
}

/**
 * Gera data sources
 */
function generateDataSources(
  schema: PageSchema,
  // @ts-expect-error - options será usado para configurar fetch/axios/outras libs
  options: CodeGeneratorOptions,
): string[] {
  const lines: string[] = [];

  if (!schema.dataSources) return lines;

  for (const [name, source] of Object.entries(schema.dataSources)) {
    if (source.type === "static") {
      lines.push(`const ${name} = ref(${JSON.stringify(source.config.data)})`);
    } else if (source.type === "api") {
      lines.push(`const ${name} = ref([])`);
      lines.push(`const ${name}Loading = ref(false)`);
    }
  }

  return lines;
}

/**
 * Gera reactive state
 */
function generateReactiveState(
  schema: PageSchema,
  // @ts-expect-error - options será usado para Composition API vs Options API
  options: CodeGeneratorOptions,
): string[] {
  const lines: string[] = [];

  // Procura widgets que precisam de state
  schema.widgets.forEach((widget) => {
    if (needsVModel(widget)) {
      const varName = getVModelBinding(widget);
      const initialValue = getInitialValue(widget);
      lines.push(`const ${varName} = ref(${JSON.stringify(initialValue)})`);
    }
  });

  return lines;
}

/**
 * Gera event handlers
 */
function generateEventHandlers(
  schema: PageSchema,
  options: CodeGeneratorOptions,
): string[] {
  const lines: string[] = [];

  if (!schema.eventHandlers) return lines;

  for (const [name, handler] of Object.entries(schema.eventHandlers)) {
    const isAsync = handler.handler.toString().includes("async");
    const asyncKeyword = isAsync ? "async " : "";

    if (options.includeComments) {
      lines.push(`// Handler: ${handler.event}`);
    }

    lines.push(`const ${name} = ${asyncKeyword}() => {`);
    lines.push(`  // TODO: Implement ${handler.event} handler`);
    lines.push(`  console.log('${handler.event} triggered')`);
    lines.push(`}`);
    lines.push("");
  }

  return lines;
}

/**
 * Gera lifecycle hooks
 */
function generateLifecycleHooks(
  schema: PageSchema,
  // @ts-expect-error - options será usado para Vue 2 vs Vue 3 hooks
  options: CodeGeneratorOptions,
): string[] {
  const lines: string[] = [];

  // onMounted para carregar data sources
  if (schema.dataSources) {
    const apiSources = Object.entries(schema.dataSources).filter(
      ([_, source]) => source.type === "api",
    );

    if (apiSources.length > 0) {
      lines.push("onMounted(async () => {");
      apiSources.forEach(([name, _source]) => {
        lines.push(`  // Load ${name} from API`);
        lines.push(`  ${name}Loading.value = true`);
        lines.push(`  // TODO: Implement API call`);
        lines.push(`  ${name}Loading.value = false`);
      });
      lines.push("})");
    }
  }

  return lines;
}

// ============================================
// STYLE GENERATION
// ============================================

/**
 * Gera seção <style>
 */
export function generateStyle(
  schema: PageSchema,
  options: CodeGeneratorOptions,
): string {
  const lines: string[] = [];
  const scoped = options.scopedStyles !== false ? " scoped" : "";
  const lang =
    options.styleLang && options.styleLang !== "css"
      ? ` lang="${options.styleLang}"`
      : "";

  lines.push(`<style${lang}${scoped}>`);

  // Container styles
  const containerClass = getContainerClass(schema);
  lines.push(`.${containerClass} {`);

  // Layout styles baseado em schema.layout
  if (schema.layout?.strategy === "grid") {
    lines.push(`  display: grid;`);
    lines.push(`  gap: var(--spacing-md);`);
  } else if (schema.layout?.strategy === "flex") {
    lines.push(`  display: flex;`);
    lines.push(`  flex-direction: column;`);
    lines.push(`  gap: var(--spacing-md);`);
  } else {
    lines.push(`  padding: var(--spacing-lg);`);
  }

  lines.push(`}`);

  // Custom theme styles
  if (schema.theme) {
    lines.push("");
    lines.push("/* Custom Theme */");
    if (schema.theme.colors) {
      Object.entries(schema.theme.colors).forEach(([key, value]) => {
        lines.push(`.${containerClass} {`);
        lines.push(`  --color-${key}: ${value};`);
        lines.push(`}`);
      });
    }
  }

  lines.push("</style>");

  return lines.join("\n");
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Extrai componentes usados no schema
 */
function extractComponentsUsed(schema: PageSchema): Set<string> {
  const components = new Set<string>();

  schema.widgets.forEach((widget) => {
    const componentName = getComponentName(widget.type);
    components.add(componentName);
  });

  return components;
}

/**
 * Converte widget type para component name
 */
function getComponentName(type: string): string {
  // Remove prefixos, converte para PascalCase
  const name = type
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");

  return name;
}

/**
 * Gera nome da classe container baseado no schema
 */
function getContainerClass(schema: PageSchema): string {
  const base = schema.metadata.title || "page";
  return (
    base
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "") + "-container"
  );
}

/**
 * Verifica se widget tem v-model
 */
function hasVModelProp(widget: WidgetSchema): boolean {
  // Widgets de input geralmente usam v-model
  const vModelTypes = [
    "input",
    "textarea",
    "select",
    "checkbox",
    "radio",
    "switch",
  ];
  return vModelTypes.some((type) => widget.type.toLowerCase().includes(type));
}

/**
 * Verifica se widget precisa de state
 */
function needsVModel(widget: WidgetSchema): boolean {
  return hasVModelProp(widget);
}

/**
 * Gera nome da variável para v-model
 */
function getVModelBinding(widget: WidgetSchema): string {
  const baseName = widget.id.replace(/[^a-zA-Z0-9]/g, "_");
  return `${baseName}Value`;
}

/**
 * Obtém valor inicial para widget
 */
function getInitialValue(widget: WidgetSchema): any {
  if (widget.config?.value !== undefined) {
    return widget.config.value;
  }

  // Defaults baseados no tipo
  if (widget.type.includes("checkbox")) return false;
  if (widget.type.includes("number")) return 0;
  return "";
}

/**
 * Escapa string para uso em template
 */
function escapeString(str: string): string {
  return str
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/'/g, "\\'")
    .replace(/\n/g, "\\n");
}
