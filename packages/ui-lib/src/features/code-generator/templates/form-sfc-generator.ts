/**
 * Form SFC Generator
 *
 * Gera componentes Vue SFC a partir de FormSchema
 */

import type { FormSchema } from "@/features/form-renderer/types";
import type { GeneratedCode } from "../types";

/**
 * Gera um componente Vue SFC a partir de FormSchema
 */
export function generateFormSFC(schema: FormSchema): GeneratedCode {
  const componentName = toPascalCase(schema.id);

  // Gerar template
  const template = generateFormTemplate(schema);

  // Gerar script
  const script = generateFormScript(schema, componentName);

  // Gerar style (opcional)
  const style = generateFormStyle(schema);

  const content = `<template>
${template}
</template>

<script setup lang="ts">
${script}
</script>

${style ? `<style scoped lang="scss">\n${style}\n</style>` : ""}
`;

  return {
    fileName: `${componentName}.vue`,
    content: content.trim(),
    fileType: "vue-sfc",
    imports: [],
    components: [],
    warnings: [],
    stats: {
      totalLines: content.split("\n").length,
      templateLines: 0,
      scriptLines: 0,
      styleLines: 0,
      componentCount: schema.fields?.length || 0,
      importCount: 0,
      estimatedSize: new Blob([content]).size,
    },
  };
}

/**
 * Gera o template do formulário
 */
function generateFormTemplate(schema: FormSchema): string {
  const fields = schema.fields || [];

  const formAttrs = [
    `@submit.prevent="handleSubmit"`,
    `class="form-container"`,
  ];

  const lines: string[] = [];
  lines.push(`  <form ${formAttrs.join(" ")}>`);

  // Title
  if (schema.title) {
    lines.push(`    <h2 class="form-title">${schema.title}</h2>`);
  }

  // Description
  if (schema.description) {
    lines.push(`    <p class="form-description">${schema.description}</p>`);
  }

  // Render fields
  for (const field of fields) {
    lines.push(...generateFieldTemplate(field, 4));
  }

  // Action buttons
  lines.push(``);
  lines.push(`    <div class="form-actions">`);
  lines.push(
    `      <Button type="submit" variant="primary" :loading="isSubmitting">`,
  );
  lines.push(`        ${schema.submitText || "Enviar"}`);
  lines.push(`      </Button>`);
  lines.push(
    `      <Button type="button" variant="secondary" @click="handleReset">`,
  );
  lines.push(`        Limpar`);
  lines.push(`      </Button>`);
  lines.push(`    </div>`);

  // Error/Success messages
  lines.push(``);
  lines.push(
    `    <Alert v-if="submitError" variant="danger" class="form-alert">`,
  );
  lines.push(`      {{ submitError }}`);
  lines.push(`    </Alert>`);
  lines.push(``);
  lines.push(
    `    <Alert v-if="submitSuccess" variant="success" class="form-alert">`,
  );
  lines.push(`      Formulário enviado com sucesso!`);
  lines.push(`    </Alert>`);
  lines.push(`  </form>`);

  return lines.join("\n");
}

/**
 * Gera template para um field específico
 */
function generateFieldTemplate(field: any, indent: number = 0): string[] {
  const lines: string[] = [];
  const indentStr = " ".repeat(indent);

  const fieldType = field.type;
  const isRequired = field.validation?.some(
    (rule: any) => rule.type === "required",
  );

  switch (fieldType) {
    case "text":
    case "email":
    case "password":
    case "number":
    case "tel":
    case "url":
      lines.push(`${indentStr}<div class="form-field">`);
      if (field.label) {
        lines.push(
          `${indentStr}  <label>${field.label}${isRequired ? " *" : ""}</label>`,
        );
      }
      lines.push(`${indentStr}  <Input`);
      lines.push(`${indentStr}    v-model="formData.${field.name}"`);
      if (field.placeholder)
        lines.push(`${indentStr}    placeholder="${field.placeholder}"`);
      lines.push(`${indentStr}    type="${fieldType}"`);
      if (isRequired) lines.push(`${indentStr}    required`);
      if (field.disabled) lines.push(`${indentStr}    disabled`);
      lines.push(`${indentStr}  />`);
      if (field.helperText) {
        lines.push(
          `${indentStr}  <span class="helper-text">${field.helperText}</span>`,
        );
      }
      lines.push(`${indentStr}</div>`);
      break;

    case "textarea":
      lines.push(`${indentStr}<div class="form-field">`);
      if (field.label) {
        lines.push(
          `${indentStr}  <label>${field.label}${isRequired ? " *" : ""}</label>`,
        );
      }
      lines.push(`${indentStr}  <Textarea`);
      lines.push(`${indentStr}    v-model="formData.${field.name}"`);
      if (field.placeholder)
        lines.push(`${indentStr}    placeholder="${field.placeholder}"`);
      if (field.rows) lines.push(`${indentStr}    :rows="${field.rows}"`);
      if (isRequired) lines.push(`${indentStr}    required`);
      lines.push(`${indentStr}  />`);
      lines.push(`${indentStr}</div>`);
      break;

    case "select":
      lines.push(`${indentStr}<div class="form-field">`);
      if (field.label) {
        lines.push(
          `${indentStr}  <label>${field.label}${isRequired ? " *" : ""}</label>`,
        );
      }
      lines.push(`${indentStr}  <Select`);
      lines.push(`${indentStr}    v-model="formData.${field.name}"`);
      if (field.options) {
        lines.push(
          `${indentStr}    :options="${JSON.stringify(field.options)}"`,
        );
      }
      if (field.placeholder)
        lines.push(`${indentStr}    placeholder="${field.placeholder}"`);
      if (isRequired) lines.push(`${indentStr}    required`);
      lines.push(`${indentStr}  />`);
      lines.push(`${indentStr}</div>`);
      break;

    case "checkbox":
      lines.push(`${indentStr}<div class="form-field">`);
      lines.push(`${indentStr}  <Checkbox`);
      lines.push(`${indentStr}    v-model="formData.${field.name}"`);
      if (field.label) lines.push(`${indentStr}    label="${field.label}"`);
      lines.push(`${indentStr}  />`);
      lines.push(`${indentStr}</div>`);
      break;

    case "radio":
      lines.push(`${indentStr}<div class="form-field">`);
      if (field.label) {
        lines.push(
          `${indentStr}  <label>${field.label}${isRequired ? " *" : ""}</label>`,
        );
      }
      lines.push(`${indentStr}  <RadioGroup`);
      lines.push(`${indentStr}    v-model="formData.${field.name}"`);
      if (field.options) {
        lines.push(
          `${indentStr}    :options="${JSON.stringify(field.options)}"`,
        );
      }
      lines.push(`${indentStr}  />`);
      lines.push(`${indentStr}</div>`);
      break;

    case "date":
    case "time":
    case "datetime":
      lines.push(`${indentStr}<div class="form-field">`);
      if (field.label) {
        lines.push(
          `${indentStr}  <label>${field.label}${isRequired ? " *" : ""}</label>`,
        );
      }
      lines.push(`${indentStr}  <DatePicker`);
      lines.push(`${indentStr}    v-model="formData.${field.name}"`);
      if (isRequired) lines.push(`${indentStr}    required`);
      lines.push(`${indentStr}  />`);
      lines.push(`${indentStr}</div>`);
      break;

    default:
      lines.push(
        `${indentStr}<!-- Field type "${fieldType}" not yet implemented -->`,
      );
  }

  return lines;
}

/**
 * Gera o script do formulário
 */
function generateFormScript(
  schema: FormSchema,
  _componentName: string,
): string {
  const lines: string[] = [];

  // Imports
  lines.push(`import { ref, reactive } from 'vue'`);
  lines.push(
    `import { Button, Input, Textarea, Select, Checkbox, RadioGroup, DatePicker, Alert } from '@lugand-sistemas-ltda/vue-ui-lib'`,
  );
  lines.push(``);

  // Form data interface
  const formFields = schema.fields || [];
  const fieldTypes = formFields.map((f) => ({
    name: f.name,
    type: getTypeFromField(f),
  }));

  if (fieldTypes.length > 0) {
    lines.push(`interface FormData {`);
    for (const field of fieldTypes) {
      lines.push(`  ${field.name}: ${field.type}`);
    }
    lines.push(`}`);
    lines.push(``);
  }

  // State
  lines.push(`const formData = reactive<FormData>({`);
  for (const field of fieldTypes) {
    const defaultValue = getDefaultValue(field.type);
    lines.push(`  ${field.name}: ${defaultValue},`);
  }
  lines.push(`})`);
  lines.push(``);
  lines.push(`const isSubmitting = ref(false)`);
  lines.push(`const submitError = ref<string | null>(null)`);
  lines.push(`const submitSuccess = ref(false)`);
  lines.push(``);

  // Methods
  lines.push(`async function handleSubmit() {`);
  lines.push(`  isSubmitting.value = true`);
  lines.push(`  submitError.value = null`);
  lines.push(`  submitSuccess.value = false`);
  lines.push(``);
  lines.push(`  try {`);
  lines.push(`    // TODO: Implement your API call here`);
  lines.push(`    console.log('Form submitted:', formData)`);
  lines.push(`    submitSuccess.value = true`);
  lines.push(`  } catch (error) {`);
  lines.push(
    `    submitError.value = error instanceof Error ? error.message : 'Erro desconhecido'`,
  );
  lines.push(`  } finally {`);
  lines.push(`    isSubmitting.value = false`);
  lines.push(`  }`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`function handleReset() {`);
  for (const field of fieldTypes) {
    const defaultValue = getDefaultValue(field.type);
    lines.push(`  formData.${field.name} = ${defaultValue}`);
  }
  lines.push(`  submitError.value = null`);
  lines.push(`  submitSuccess.value = false`);
  lines.push(`}`);

  return lines.join("\n");
}

/**
 * Gera estilos do formulário
 */
function generateFormStyle(_schema: FormSchema): string {
  return `.form-container {
  max-width: 600px;
  margin: 0 auto;
  padding: var(--spacing-xl);
}

.form-title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--spacing-md);
  color: var(--color-text-primary);
}

.form-description {
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-lg);
}

.form-field {
  margin-bottom: var(--spacing-lg);
  
  label {
    display: block;
    margin-bottom: var(--spacing-xs);
    font-weight: var(--font-weight-medium);
    color: var(--color-text-primary);
  }
  
  .helper-text {
    display: block;
    margin-top: var(--spacing-xs);
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
  }
}

.form-actions {
  display: flex;
  gap: var(--spacing-md);
  margin-top: var(--spacing-xl);
}

.form-alert {
  margin-top: var(--spacing-lg);
}
`;
}

/**
 * Helpers
 */

function toPascalCase(str: string): string {
  return str
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");
}

function getTypeFromField(field: any): string {
  const type = field.type;

  if (type === "checkbox") return "boolean";
  if (type === "number") return "number";
  if (type === "date" || type === "time" || type === "datetime")
    return "string";

  return "string";
}

function getDefaultValue(type: string): string {
  if (type === "boolean") return "false";
  if (type === "number") return "0";
  if (type.includes("[]")) return "[]";
  return "''";
}
