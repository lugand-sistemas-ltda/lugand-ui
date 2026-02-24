# Document Components

Componentes para criação e edição de documentos, geração de QR Codes, assinaturas digitais e exportação para PDF.

## 📦 Componentes Disponíveis

### LgDocumentEditor

Editor de texto rico com suporte a variáveis dinâmicas.

```vue
<template>
  <lg-document-editor
    v-model="content"
    :variables="variables"
    :max-length="5000"
    @change="handleChange"
  />
</template>

<script setup>
import { ref } from "vue";
import { LgDocumentEditor } from "@lugand-sistemas-ltda/vue-ui-lib";

const content = ref("<p>Olá {{nome}}, bem-vindo!</p>");

const variables = [
  { name: "nome", label: "Nome do Cliente" },
  { name: "data", label: "Data" },
  { name: "total", label: "Valor Total" },
];

function handleChange(newContent) {
  console.log("Conteúdo alterado:", newContent);
}
</script>
```

**Props:**

- `modelValue` (string): Conteúdo HTML
- `variables` (DocumentVariable[]): Variáveis disponíveis
- `placeholder` (string): Texto placeholder
- `minHeight` (string): Altura mínima (default: '200px')
- `maxHeight` (string): Altura máxima (default: '600px')
- `maxLength` (number): Limite de caracteres
- `disabled` (boolean): Desabilitar edição
- `hideToolbar` (boolean): Ocultar barra de ferramentas
- `showFooter` (boolean): Mostrar rodapé (default: true)

**Métodos expostos:**

- `getHTML()`: Retorna HTML
- `getPlainText()`: Retorna texto puro
- `clear()`: Limpa conteúdo
- `focus()`: Foca no editor
- `isEmpty()`: Verifica se está vazio
- `insertVariable(variable)`: Insere variável

---

### LgQRCode

Componente para gerar QR Codes.

```vue
<template>
  <lg-qr-code
    value="https://example.com/verify/12345"
    :size="200"
    color="#000000"
    background-color="#FFFFFF"
  />
</template>

<script setup>
import { LgQRCode } from "@lugand-sistemas-ltda/vue-ui-lib";
</script>
```

**Props:**

- `value` (string, required): Conteúdo do QR Code
- `size` (number): Tamanho em pixels (default: 200)
- `errorCorrectionLevel` ('L' | 'M' | 'Q' | 'H'): Nível de correção (default: 'M')
- `color` (string): Cor do QR Code (default: '#000000')
- `backgroundColor` (string): Cor de fundo (default: '#FFFFFF')
- `margin` (number): Margem ao redor (default: 4)

**Métodos expostos:**

- `toDataURL()`: Exporta como data URL
- `download(filename)`: Faz download do QR Code

---

### LgSignaturePad

Canvas para capturar assinaturas digitais.

```vue
<template>
  <lg-signature-pad
    v-model="signature"
    :width="400"
    :height="200"
    pen-color="#000000"
    @save="handleSave"
  />
</template>

<script setup>
import { ref } from "vue";
import { LgSignaturePad } from "@lugand-sistemas-ltda/vue-ui-lib";

const signature = ref(null);

function handleSave(dataUrl) {
  console.log("Assinatura salva:", dataUrl);
  // Enviar para servidor, etc
}
</script>
```

**Props:**

- `modelValue` (string): Data URL da assinatura
- `width` (number): Largura do canvas (default: 400)
- `height` (number): Altura do canvas (default: 200)
- `penColor` (string): Cor da caneta (default: '#000000')
- `penWidth` (number): Espessura da caneta (default: 2)
- `backgroundColor` (string): Cor de fundo (default: '#FFFFFF')
- `disabled` (boolean): Desabilitar desenho

**Métodos expostos:**

- `clear()`: Limpa assinatura
- `undo()`: Desfaz último traço
- `toDataURL(format, quality)`: Exporta como imagem
- `isEmpty()`: Verifica se está vazio
- `getStrokes()`: Retorna traços
- `setStrokes(strokes)`: Define traços

---

## 📄 Geração de PDF (Opcional)

Para gerar PDFs, use o export separado:

### Instalação

```bash
npm install jspdf qrcode @types/qrcode
```

### Uso Básico

```typescript
import { generatePDFFromHTML } from "@lugand-sistemas-ltda/vue-ui-lib/pdf";

// Gerar PDF de HTML com variáveis
await generatePDFFromHTML(
  "<h1>Contrato</h1><p>Cliente: {{nome}}</p>",
  { nome: "João Silva", data: "23/02/2026" },
  {
    filename: "contrato.pdf",
    pageSize: "a4",
    orientation: "portrait",
  },
);
```

### Gerar PDF de Template

```typescript
import { generatePDFFromTemplate } from "@lugand-sistemas-ltda/vue-ui-lib/pdf";

const template = {
  id: "contrato-001",
  name: "Contrato Padrão",
  version: "1.0",
  layout: {
    pageSize: "a4",
    orientation: "portrait",
    margins: { top: 20, right: 20, bottom: 20, left: 20 },
  },
  blocks: [
    {
      id: "titulo",
      type: "heading",
      content: "CONTRATO Nº {{numero}}",
      style: { fontSize: 18, align: "center", bold: true },
    },
    {
      id: "corpo",
      type: "text",
      content: "Contratante: {{contratante}}\nData: {{data}}",
    },
    {
      id: "qrcode",
      type: "qrcode",
      content: "https://verify.com/{{numero}}",
      position: { x: 160, y: 260 },
    },
  ],
  variables: [
    { name: "numero", label: "Número", type: "text", required: true },
    { name: "contratante", label: "Contratante", type: "text", required: true },
    { name: "data", label: "Data", type: "date", required: true },
  ],
};

await generatePDFFromTemplate(template, {
  numero: "CTR-2026-001",
  contratante: "João Silva",
  data: "23/02/2026",
});
```

---

## 🎯 Exemplo Completo

```vue
<template>
  <div class="document-app">
    <h2>Editor de Documentos</h2>

    <!-- Editor -->
    <lg-document-editor
      v-model="content"
      :variables="variables"
      placeholder="Digite o documento aqui..."
    />

    <!-- Preview de Variáveis -->
    <div class="preview">
      <h3>Preencha os dados:</h3>
      <input v-model="data.cliente" placeholder="Nome do Cliente" />
      <input v-model="data.data" type="date" />
      <input v-model="data.valor" placeholder="Valor" />
    </div>

    <!-- Assinatura -->
    <div class="signature-section">
      <h3>Assinatura:</h3>
      <lg-signature-pad v-model="signature" />
    </div>

    <!-- QR Code -->
    <div class="qrcode-section">
      <h3>QR Code de Verificação:</h3>
      <lg-qr-code :value="qrUrl" />
    </div>

    <!-- Exportar -->
    <button @click="exportPDF">Gerar PDF</button>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import {
  LgDocumentEditor,
  LgSignaturePad,
  LgQRCode,
} from "@lugand-sistemas-ltda/vue-ui-lib";
import { generatePDFFromHTML } from "@lugand-sistemas-ltda/vue-ui-lib/pdf";

const content = ref(`
  <h1>CONTRATO DE PRESTAÇÃO DE SERVIÇOS</h1>
  <p>Cliente: {{cliente}}</p>
  <p>Data: {{data}}</p>
  <p>Valor: {{valor}}</p>
`);

const variables = [
  { name: "cliente", label: "Nome do Cliente" },
  { name: "data", label: "Data" },
  { name: "valor", label: "Valor do Contrato" },
];

const data = ref({
  cliente: "João Silva",
  data: "2026-02-23",
  valor: "R$ 5.000,00",
});

const signature = ref(null);

const qrUrl = computed(
  () => `https://verify.example.com/contract/${Date.now()}`,
);

async function exportPDF() {
  await generatePDFFromHTML(content.value, data.value, {
    filename: "contrato.pdf",
    metadata: {
      title: "Contrato de Prestação de Serviços",
      author: "Sistema",
      subject: "Contrato",
    },
  });
}
</script>
```

---

## 📚 Tipos TypeScript

```typescript
interface DocumentVariable {
  name: string;
  label?: string;
  defaultValue?: string;
}

interface PDFOptions {
  filename?: string;
  pageSize?: "a4" | "letter" | "legal";
  orientation?: "portrait" | "landscape";
  margins?: { top: number; right: number; bottom: number; left: number };
  metadata?: {
    title?: string;
    author?: string;
    subject?: string;
    keywords?: string;
  };
  preview?: boolean;
}
```

---

## 🚀 Próximos Passos

Esta implementação fornece os componentes base. Próximas melhorias:

1. **Document Builder UI**: Interface visual para criar templates
2. **Template Library**: Biblioteca de templates reutilizáveis
3. **Mock Data**: Templates de exemplo pré-configurados
4. **Advanced PDF**: Suporte a tabelas complexas, múltiplas páginas, etc.

---

## 📝 Notas

- Bundle principal: ~502 KB (sem PDF)
- PDF generation é opcional e tree-shakeable
- Todos os componentes são standalone e podem ser usados independentemente
- TypeScript completo com tipos exportados
