# 📦 Components

> Complete API reference for all components in the Lugand UI Library.

---

## 🎯 Component Categories

- [Primitives](#primitives) - Base components
- [Form Inputs](#form-inputs) - Specialized inputs
- [Selection Controls](#selection-controls) - Checkboxes, radios, switches
- [Display](#display) - Cards, badges, avatars
- [Layout](#layout) - Containers, grids
- [Feedback](#feedback) - Toasts, modals
- [Navigation](#navigation) - Tabs, breadcrumbs

---

## Primitives

### Btn

General-purpose button component.

```vue
<Btn variant="primary" size="md" @click="handleClick">
  Click Me
</Btn>
```

**Props:**

- `variant?: 'primary' | 'secondary' | 'ghost' | 'danger'` - Button style (default: `'primary'`)
- `size?: 'sm' | 'md' | 'lg'` - Button size (default: `'md'`)
- `disabled?: boolean` - Disabled state (default: `false`)
- `loading?: boolean` - Loading state (default: `false`)
- `type?: 'button' | 'submit' | 'reset'` - HTML button type (default: `'button'`)

**Slots:**

- `default` - Button content

---

### Input

Basic text input component.

```vue
<Input
  v-model="email"
  type="email"
  label="Email"
  placeholder="your@email.com"
  hint="We'll never share your email"
  :error="hasError"
  error-message="Invalid email"
/>
```

**Props:**

- `modelValue: string | number` - Input value (v-model)
- `type?: string` - HTML input type (default: `'text'`)
- `label?: string` - Input label
- `placeholder?: string` - Placeholder text
- `hint?: string` - Helper text below input
- `disabled?: boolean` - Disabled state
- `readonly?: boolean` - Read-only state
- `error?: boolean` - Error state
- `errorMessage?: string` - Error message text
- `size?: 'sm' | 'md' | 'lg'` - Input size

**Emits:**

- `update:modelValue` - When value changes

---

### NumericTextInput

Text input that only accepts numeric characters. Always uses `type="text"` for full control.

```vue
<NumericTextInput v-model="age" label="Age" :maxlength="3" allowedChars="0-9" />
```

**Props:**

- `modelValue: string` - Input value
- `label?: string` - Input label
- `placeholder?: string` - Placeholder text
- `disabled?: boolean` - Disabled state
- `maxlength?: number` - Max character count
- `allowedChars?: string` - Regex character class (default: `'0-9'`)

**Emits:**

- `update:modelValue` - When value changes

**Security:**

- ✅ Blocks letters instantly (visual feedback)
- ✅ Mobile-friendly (`inputmode="numeric"`)
- ✅ HTML5 validation (`pattern` attribute)

---

## Form Inputs

### DateInput

Date input with automatic parsing and validation. Returns **Date object**.

```vue
<DateInput
  v-model="birthDate"
  type="date"
  label="Birth Date"
  placeholder="DD/MM/YYYY"
/>

<DateInput
  v-model="appointment"
  type="datetime"
  label="Appointment"
  placeholder="DD/MM/YYYY HH:mm"
/>

<DateInput
  v-model="wakeUpTime"
  type="time"
  label="Wake Up Time"
  placeholder="HH:mm"
/>
```

**Props:**

- `modelValue: Date | null` - Date object (v-model)
- `type: 'date' | 'datetime' | 'time'` - Input type
- `label?: string` - Input label
- `placeholder?: string` - Placeholder text
- `disabled?: boolean` - Disabled state
- `error?: boolean` - Error state
- `errorMessage?: string` - Error message

**Emits:**

- `update:modelValue` - Emits Date object or null

**Masks:**

- `date` → `DD/MM/YYYY`
- `datetime` → `DD/MM/YYYY HH:mm`
- `time` → `HH:mm`

**Validation:**

- ✅ No letters accepted
- ✅ Range validation (HH: 00-23, mm: 00-59)
- ✅ Semantic validation (31/02 → error)

---

### DateSegmentedInput

Date input with separate fields for day, month, year (and time).

```vue
<DateSegmentedInput v-model="segmentedDate" label="Birth Date" />

<DateSegmentedInput
  v-model="segmentedDateTime"
  label="Appointment"
  enable-time
/>
```

**Props:**

- `modelValue: Date | null` - Date object
- `label?: string` - Input label
- `enableTime?: boolean` - Show hour/minute fields (default: `false`)
- `disabled?: boolean` - Disabled state
- `error?: boolean` - External error state
- `errorMessage?: string` - External error message

**Emits:**

- `update:modelValue` - Emits Date object or null

**Fields:**

- `DD` - Day (01-31)
- `MM` - Month (01-12)
- `YYYY` - Year (4 digits)
- `HH` - Hour (00-23, if `enableTime`)
- `mm` - Minute (00-59, if `enableTime`)

**Validation:**

- ✅ Range validation per field
- ✅ Auto-blocks invalid values (99 → 9)
- ✅ Visual error on invalid dates

---

### DateSelectInput

Date input using dropdown selects.

```vue
<DateSelectInput v-model="selectDate" label="Birth Date" />
```

**Props:**

- `modelValue: Date | null` - Date object
- `label?: string` - Input label
- `disabled?: boolean` - Disabled state
- `error?: boolean` - Error state
- `errorMessage?: string` - Error message

**Emits:**

- `update:modelValue` - Emits Date object or null

**Features:**

- ✅ No manual input (dropdown only)
- ✅ Mobile-friendly
- ✅ No letter risk

---

### CurrencyInput

Numeric input with automatic currency formatting (BRL default). Returns **number**.

```vue
<CurrencyInput v-model="price" label="Product Price" />
```

**Props:**

- `modelValue: number` - Numeric value (not string)
- `label?: string` - Input label
- `placeholder?: string` - Placeholder text
- `disabled?: boolean` - Disabled state
- `error?: boolean` - Error state
- `errorMessage?: string` - Error message

**Emits:**

- `update:modelValue` - Emits number

**Format:**

- Display: `R$ 1.234,56`
- Value: `1234.56` (number type)

---

### MaskInput

Input with pattern-based masking (CPF, CNPJ, Phone, etc).

```vue
<MaskInput v-model="cpf" mask="CPF" label="CPF" placeholder="000.000.000-00" />

<MaskInput v-model="phone" mask="PHONE" label="Phone" />

<MaskInput v-model="plate" mask="AAA-####" label="License Plate" />
```

**Props:**

- `modelValue: string` - Masked value
- `mask: string | MaskType` - Mask pattern or preset
- `label?: string` - Input label
- `placeholder?: string` - Placeholder text
- `disabled?: boolean` - Disabled state

**Emits:**

- `update:modelValue` - Emits masked string

**Presets:**

- `CPF` → `000.000.000-00`
- `CNPJ` → `00.000.000/0000-00`
- `PHONE` → `(00) 00000-0000`
- `CEP` → `00000-000`
- `DATE_BR` → `DD/MM/YYYY`
- `DATETIME_BR` → `DD/MM/YYYY HH:mm`
- `TIME` → `HH:mm`

**Custom Masks:**

- `#` - Numeric digit
- `A` - Alphanumeric character
- Other chars - Literal (separators)

---

## Selection Controls

### Checkbox

Boolean checkbox input.

```vue
<Checkbox v-model="agreed" label="I agree to terms" />
```

**Props:**

- `modelValue: boolean` - Checked state
- `label?: string` - Checkbox label
- `disabled?: boolean` - Disabled state

**Emits:**

- `update:modelValue` - Emits boolean

---

### Switch

Toggle switch component.

```vue
<Switch v-model="darkMode" label="Dark Mode" color="primary" />
```

**Props:**

- `modelValue: boolean` - Switch state
- `label?: string` - Switch label
- `color?: 'primary' | 'success' | 'warning' | 'danger'` - Switch color
- `disabled?: boolean` - Disabled state

**Emits:**

- `update:modelValue` - Emits boolean

---

### Radio

Single radio button.

```vue
<Radio v-model="selected" value="option1" label="Option 1" />
```

**Props:**

- `modelValue: any` - Selected value
- `value: any` - Radio value
- `label?: string` - Radio label
- `name?: string` - Radio group name
- `disabled?: boolean` - Disabled state

**Emits:**

- `update:modelValue` - Emits selected value

---

### RadioGroup

Group of radio buttons.

```vue
<RadioGroup
  v-model="shipping"
  :options="shippingOptions"
  name="shipping"
  direction="column"
/>
```

**Props:**

- `modelValue: any` - Selected value
- `options: Array<{ label: string, value: any, disabled?: boolean }>` - Radio options
- `name?: string` - Group name (auto-generated if not provided)
- `direction?: 'row' | 'column'` - Layout direction
- `disabled?: boolean` - Disable all radios

**Emits:**

- `update:modelValue` - Emits selected value

---

## Display

### Card

Container with title, content, and optional footer.

```vue
<Card title="User Profile" subtitle="Personal information">
  <p>Content here</p>
  <template #footer>
    <Btn variant="primary">Save</Btn>
  </template>
</Card>
```

**Props:**

- `title?: string` - Card title
- `subtitle?: string` - Card subtitle
- `padding?: 'sm' | 'md' | 'lg'` - Content padding

**Slots:**

- `default` - Card content
- `footer` - Card footer

---

### Badge

Small status indicator.

```vue
<Badge variant="success">Active</Badge>
<Badge variant="error">Inactive</Badge>
```

**Props:**

- `variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'neutral'` - Badge color
- `size?: 'sm' | 'md' | 'lg'` - Badge size

**Slots:**

- `default` - Badge content

---

### Avatar

User avatar with image or initials fallback.

```vue
<Avatar src="/user.jpg" name="John Doe" size="md" status="online" />
```

**Props:**

- `src?: string` - Image URL
- `name?: string` - User name (for initials)
- `alt?: string` - Image alt text
- `size?: 'sm' | 'md' | 'lg' | 'xl'` - Avatar size
- `variant?: 'circle' | 'square' | 'rounded'` - Avatar shape
- `status?: 'online' | 'offline' | 'busy' | 'away'` - Status indicator

---

## Layout

### GridContainer

Responsive grid layout.

```vue
<GridContainer :cols="3" gap="md">
  <Card v-for="item in items" :key="item.id" :title="item.title" />
</GridContainer>
```

**Props:**

- `cols?: number | 'auto'` - Columns (default: `1`)
- `colsSm?: number` - Columns on small screens
- `colsMd?: number` - Columns on medium screens
- `colsLg?: number` - Columns on large screens
- `colsXl?: number` - Columns on extra large screens
- `gap?: 'sm' | 'md' | 'lg' | 'xl'` - Grid gap
- `minItemWidth?: string` - Min item width (for `cols="auto"`)
- `loading?: boolean` - Show loading state
- `empty?: boolean` - Show empty state

**Slots:**

- `default` - Grid items
- `loading` - Custom loading content
- `empty` - Custom empty content

---

### ScrollContainer

Scrollable container with custom scrollbar.

```vue
<ScrollContainer height="400px" direction="vertical">
  <div v-for="item in items" :key="item.id">{{ item }}</div>
</ScrollContainer>
```

**Props:**

- `height?: string` - Container height
- `direction?: 'vertical' | 'horizontal' | 'both'` - Scroll direction

**Slots:**

- `default` - Scrollable content

---

## Feedback

### Toast

Toast notification system.

```vue
<script setup>
import { useToast } from "@lugand/vue-ui-lib";

const toast = useToast();

const showSuccess = () => {
  toast.success("Operation completed!", {
    title: "Success",
    duration: 3000,
  });
};
</script>
```

**Composable: `useToast()`**

Methods:

- `success(message, options?)` - Success toast
- `error(message, options?)` - Error toast
- `warning(message, options?)` - Warning toast
- `info(message, options?)` - Info toast
- `default(message, options?)` - Default toast

**Options:**

- `title?: string` - Toast title
- `duration?: number` - Auto-dismiss duration (ms)
- `dismissible?: boolean` - Show close button
- `position?: ToastPosition` - Toast position
- `action?: { label: string, onClick: () => void }` - Action button

---

## Navigation

### Tabs

Tab navigation component.

```vue
<Tabs v-model="activeTab" :tabs="tabs" />
```

**Props:**

- `modelValue: string | number` - Active tab value
- `tabs: Array<{ label: string, value: any }>` - Tab items

**Emits:**

- `update:modelValue` - Emits selected tab value

---

## 🔄 Common Patterns

### v-model

All form components support `v-model`:

```vue
<Input v-model="name" />
<DateInput v-model="birthDate" />
<Checkbox v-model="agreed" />
```

### Error Handling

```vue
<Input v-model="email" :error="hasError" error-message="Invalid email" />

<DateInput
  v-model="birthDate"
  :error="dateError"
  error-message="Invalid date"
/>
```

### Disabled State

```vue
<Btn disabled>Disabled Button</Btn>
<Input v-model="name" disabled />
<DateInput v-model="date" disabled />
```

---

## 📝 Type Definitions

```typescript
// Import types
import type { Theme, FormField, TableColumn } from "@lugand/vue-ui-lib";

// Component props example
interface DateInputProps {
  modelValue: Date | null;
  type: "date" | "datetime" | "time";
  label?: string;
  disabled?: boolean;
  error?: boolean;
  errorMessage?: string;
}
```

---

## 🚀 Advanced Usage

### Custom Styling

Use CSS variables to customize:

```vue
<style>
.my-button {
  --color-primary: #ff6b6b;
  --radius-md: 1rem;
}
</style>

<Btn class="my-button">Custom Button</Btn>
```

### Composition

```vue
<Card title="User Form">
  <Input v-model="name" label="Name" />
  <DateInput v-model="birthDate" label="Birth Date" />
  <Btn @click="submit">Submit</Btn>
</Card>
```
