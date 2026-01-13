<script setup lang="ts">
import { ref } from 'vue'
import {
    ComponentShowcase,
    GridContainer,
    Switch,
    Radio,
    RadioGroup,
    Checkbox,
    CodeBlock,
    Card,
    Select
} from '@/shared/components'

// Switch State
const switch1 = ref(false)
const switch2 = ref(true)
const switch3 = ref(false)
const switch4 = ref(true)

// Checkbox State
const check1 = ref(false)
const check2 = ref(true)
const check3 = ref(false)
const check4 = ref(true)

// Radio State
const radioSingle = ref('opt1')
const radioGroupValue = ref('express')

// Select State
const selectValue = ref('')
const selectOptions = [
    { label: 'Option 1', value: 'opt1' },
    { label: 'Option 2', value: 'opt2' },
    { label: 'Option 3', value: 'opt3' }
]

const shippingOptions = [
    { label: 'Standard Shipping (Free)', value: 'standard' },
    { label: 'Express Shipping (+$15.00)', value: 'express' },
    { label: 'Overnight Shipping (+$35.00)', value: 'overnight', disabled: true }
]
</script>

<template>
    <div class="switches-view">
        <div class="header">
            <h1>Selection Inputs</h1>
            <p class="lead">Componentes para opções booleanas e seleção única.</p>
        </div>

        <!-- SWITCHES -->
        <ComponentShowcase title="Switches" description="Alternância imediata entre dois estados.">
            <template #preview>
                <GridContainer :cols="2">
                    <Card title="Basic Usage">
                        <div class="demo-col">
                            <Switch v-model="switch1" label="Notifications" />
                            <Switch v-model="switch2" label="Dark Mode" color="primary" />
                            <Switch v-model="switch3" label="Airplane Mode" color="warning" />
                            <Switch v-model="switch4" label="Disabled Option" disabled />
                        </div>
                    </Card>
                    <div class="state-preview">
                        <p><strong>Notifications:</strong> {{ switch1 }}</p>
                        <p><strong>Dark Mode:</strong> {{ switch2 }}</p>
                    </div>
                </GridContainer>
            </template>
            <template #code>
                <CodeBlock language="html" code='
<Switch v-model="notifications" label="Notifications" />
<Switch v-model="darkMode" label="Dark Mode" color="primary" />
<Switch v-model="airplaneMode" label="Airplane Mode" color="warning" />
<Switch v-model="disabled" label="Disabled Option" disabled />
                ' />
            </template>
        </ComponentShowcase>

        <!-- CHECKBOXES -->
        <ComponentShowcase title="Checkboxes" description="Seleção múltipla independente ou booleanos.">
            <template #preview>
                <GridContainer :cols="2">
                    <Card title="Basic Checkbox">
                        <div class="demo-col">
                            <Checkbox v-model="check1" label="Accept Terms" />
                            <Checkbox v-model="check2" label="Subscribe Newsletter" />
                            <Checkbox v-model="check3" label="Remember Me" error errorMessage="Authentication failed" />
                            <Checkbox v-model="check4" label="Disabled Option" disabled />
                        </div>
                    </Card>
                    <div class="state-preview">
                        <p><strong>Terms:</strong> {{ check1 }}</p>
                        <p><strong>Subscribe:</strong> {{ check2 }}</p>
                    </div>
                </GridContainer>
            </template>
            <template #code>
                <CodeBlock language="html" code='
<Checkbox v-model="terms" label="Accept Terms" />
<Checkbox v-model="news" label="Subscribe Newsletter" />
<Checkbox v-model="remember" label="Remember Me" error errorMessage="Error" />
<Checkbox v-model="disabled" label="Disabled Option" disabled />
                ' />
            </template>
        </ComponentShowcase>

        <!-- RADIOS -->
        <ComponentShowcase title="Radios" description="Seleção única entre múltiplas opções mutuamente exclusivas.">
            <template #preview>
                <GridContainer :cols="1">
                    <Card title="Radio Group">
                        <RadioGroup v-model="radioGroupValue" :options="shippingOptions" name="shipping" />
                        <div class="mt-4">
                            Selected: <strong>{{ radioGroupValue }}</strong>
                        </div>
                    </Card>

                    <Card title="Standalone Radios">
                        <div class="demo-row">
                            <Radio v-model="radioSingle" value="opt1" label="Option 1" name="single" />
                            <Radio v-model="radioSingle" value="opt2" label="Option 2" name="single" />
                            <Radio v-model="radioSingle" value="opt3" label="Option 3 (Disabled)" disabled
                                name="single" />
                        </div>
                    </Card>
                </GridContainer>
            </template>
            <template #code>
                <CodeBlock language="html" code='
<!-- Group Usage (Recommended) -->
<RadioGroup 
    v-model="shipping" 
    :options="options" 
    name="shipping-method"
/>

<!-- Standalone Usage -->
<Radio v-model="val" value="1" label="Option 1" name="opts" />
<Radio v-model="val" value="2" label="Option 2" name="opts" />
                ' />
            </template>
        </ComponentShowcase>

        <!-- SELECT -->
        <ComponentShowcase title="Select" description="Seleção de uma única opção a partir de um menu suspenso.">
            <template #preview>
                <GridContainer :cols="2">
                    <Card title="Basic Select">
                        <Select v-model="selectValue" :options="selectOptions" label="Choose an option"
                            placeholder="Select an option" />
                    </Card>
                    <Card title="States">
                        <div class="demo-col">
                            <Select v-model="selectValue" label="Disabled Select" :options="selectOptions" disabled />
                        </div>
                    </Card>
                </GridContainer>
            </template>
            <template #code>
                <CodeBlock language="html" code='
<Select 
    v-model="selectedOption" 
    :options="options" 
    label="Choose an option"
    placeholder="Select an option"
/>
                ' />
            </template>
        </ComponentShowcase>
    </div>
</template>

<style lang="scss" scoped>
.switches-view {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xl);
    padding-bottom: var(--spacing-2xl);
}

.header {
    h1 {
        font-size: var(--font-size-3xl);
        font-weight: var(--font-weight-bold);
        margin-bottom: var(--spacing-sm);
        color: var(--color-text-primary);
    }

    .lead {
        font-size: var(--font-size-lg);
        color: var(--color-text-secondary);
    }
}

.demo-col {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
}

.demo-row {
    display: flex;
    gap: var(--spacing-lg);
    flex-wrap: wrap;
}

.mt-4 {
    margin-top: var(--spacing-md);
}
</style>
