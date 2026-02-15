# Changelog v0.1.4 - Correção de Cores Temáticas para Alertas

## 🎨 Problema Identificado

O componente `Alert` estava usando **cores HSL fixas** que não se adaptavam aos temas:

```scss
// ❌ ANTES - Cores fixas
&--info {
  background: hsl(200, 100%, 95%); // Sempre azul claro
  color: hsl(200, 80%, 30%); // Sempre azul escuro
}
```

**Consequências:**

- ✗ Alertas info ficavam brancos em todos os temas
- ✗ Baixo contraste em temas escuros (fundo claro + texto claro)
- ✗ Não aproveitavam a paleta de cores de cada tema
- ✗ Violavam o princípio de design de não ter elementos aninhados com mesma cor do pai

---

## ✅ Solução Implementada

### 1. **Novas Variáveis CSS Semânticas**

Adicionadas em **todos os 10 temas** da biblioteca:

```scss
// Variáveis de estado (info, success, warning, error)
--color-info-bg        // Fundo do alert info
--color-info-text      // Texto do alert info
--color-info-border    // Borda do alert info

--color-success-bg
--color-success-text
--color-success-border

--color-warning-bg
--color-warning-text
--color-warning-border

--color-error-bg
--color-error-text
--color-error-border
```

### 2. **Adaptação por Tema**

#### **Temas Claros** (light, ocean, forest, pcpr, pretona, viatura)

- Fundos: `hsl(h, s, 95%)` - Muito claros, suaves
- Textos: `hsl(h, s, 25-35%)` - Escuros para contraste
- Bordas: `hsl(h, s, 60-70%)` - Médias para delimitar

#### **Temas Escuros** (dark, dracula, cyberpunk, bombeiros)

- Fundos: `hsl(h, s, 12-18%)` - Escuros, próximo do preto
- Textos: `hsl(h, s, 70-80%)` - Claros e brilhantes
- Bordas: `hsl(h, s, 35-45%)` - Médias para contraste

### 3. **Atualização do Componente Alert**

```scss
// ✅ DEPOIS - Usando variáveis CSS temáticas
&--info {
  background: var(--color-info-bg);
  color: var(--color-info-text);
}

&--bordered.alert--info {
  border-color: var(--color-info-border);
}
```

---

## 🎨 Exemplos por Tema

### **Tema Light (padrão)**

```scss
--color-info-bg: hsl(200, 100%, 95%); // Azul claro suave
--color-info-text: hsl(200, 80%, 30%); // Azul escuro legível
--color-info-border: hsl(200, 80%, 70%); // Azul médio
```

### **Tema Dark**

```scss
--color-info-bg: hsl(200, 80%, 15%); // Azul escuro profundo
--color-info-text: hsl(200, 100%, 80%); // Azul claro brilhante
--color-info-border: hsl(200, 80%, 35%); // Azul médio
```

### **Tema Dracula**

```scss
--color-info-bg: hsl(191, 50%, 15%); // Ciano escuro
--color-info-text: hsl(191, 97%, 85%); // Ciano Dracula (#8be9fd)
--color-info-border: hsl(191, 70%, 35%); // Ciano médio
```

### **Tema Cyberpunk**

```scss
--color-info-bg: hsl(180, 70%, 12%); // Ciano neon escuro
--color-info-text: hsl(180, 100%, 70%); // Ciano neon brilhante
--color-info-border: hsl(180, 100%, 50%); // Ciano neon puro
```

### **Tema Bombeiros (CBPR)**

```scss
--color-warning-bg: hsl(48, 80%, 18%); // Amarelo escuro
--color-warning-text: hsl(48, 100%, 75%); // Amarelo CBPR brilhante
--color-warning-border: hsl(48, 100%, 45%); // Amarelo alerta
```

### **Tema PCPR/Viatura**

```scss
--color-warning-bg: hsl(48, 90%, 95%); // Amarelo ouro claro
--color-warning-text: hsl(48, 100%, 25%); // Amarelo ouro escuro
--color-warning-border: hsl(48, 100%, 45%); // Amarelo ouro oficial
```

---

## 📦 Arquivos Modificados

### **Temas** (10 arquivos)

- `src/styles/themes/default.scss` - Tema light padrão
- `src/styles/themes/dark.scss` - Tema dark
- `src/styles/themes/dracula.scss` - Tema Dracula
- `src/styles/themes/cyberpunk.scss` - Tema Cyberpunk
- `src/styles/themes/ocean.scss` - Tema Ocean
- `src/styles/themes/forest.scss` - Tema Forest
- `src/styles/themes/pcpr.scss` - Tema PCPR
- `src/styles/themes/pretona.scss` - Tema Pretona (emergência)
- `src/styles/themes/bombeiros.scss` - Tema Bombeiros (CBPR)
- `src/styles/themes/viatura.scss` - Tema Viatura PMPR

### **Componente**

- `src/shared/components/feedback/Alert.vue` - Componente Alert atualizado

---

## 🔗 Aliases de Retrocompatibilidade

Para garantir compatibilidade com código existente que usa `danger`, foram adicionados **aliases automáticos** em todos os temas:

```scss
// Aliases: danger → error
--color-danger: var(--color-error-text);
--color-danger-bg: var(--color-error-bg);
--color-danger-light: var(--color-error-bg);
--color-danger-border: var(--color-error-border);
```

**Componentes afetados que agora funcionam em todos os temas:**

- `DropdownItem` - variante `danger`
- `DisclosureView` - estados de perigo
- Qualquer componente customizado que use `var(--color-danger)`

**Antes:** `--color-danger` só existia no tema **Bombeiros**  
**Agora:** `--color-danger` existe em **todos os 10 temas** via alias

---

## 🧪 Como Testar

1. **Instale a versão 0.1.4:**

```bash
npm install @lugand-sistemas-ltda/vue-ui-lib@0.1.4
```

2. **Use o componente Alert:**

```vue
<template>
  <Alert variant="info" bordered>
    Teste de alerta info - veja como adapta ao tema!
  </Alert>

  <Alert variant="success"> Operação realizada com sucesso </Alert>

  <Alert variant="warning"> Atenção: verifique os dados </Alert>

  <Alert variant="error"> Erro: algo deu errado </Alert>
</template>
```

3. **Troque entre temas:**

```vue
<ThemeSelector />
<!-- Componente da biblioteca -->
```

4. **Observe:**
   - ✅ Alertas mudam de cor em cada tema
   - ✅ Fundos claros em temas claros
   - ✅ Fundos escuros em temas escuros
   - ✅ Texto sempre legível (contraste adequado)
   - ✅ Cores respeitam identidade de cada tema

---

## 🎯 Benefícios

1. **Consistência Temática**: Alertas agora seguem as cores de cada tema
2. **Acessibilidade**: Contraste adequado em todos os temas
3. **Experiência do Usuário**: Elementos não "destoam" mais
4. **Manutenibilidade**: Cores centralizadas em variáveis CSS
5. **Escalabilidade**: Fácil adicionar novos temas com estados semânticos

---

## 🔧 Breaking Changes

**Nenhum!** Esta é uma atualização de patch (0.1.3 → 0.1.4) que corrige bugs sem quebrar compatibilidade.

---

## 📚 Documentação

Para mais detalhes sobre temas e customização, veja:

- `docs/THEMES.md` - Guia completo de temas
- `docs/COMPONENTS.md` - Documentação de componentes

---

## 🙏 Créditos

**Reportado por:** Usuário durante teste com tema dark
**Implementado por:** Equipe Lugand Sistemas
**Data:** 15/02/2026
