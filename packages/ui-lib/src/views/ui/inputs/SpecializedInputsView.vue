<script setup lang="ts">
import { ref } from 'vue'
import {
    ComponentShowcase,
    GridContainer,
    CodeBlock,
    Card,
    DateInput,
    CurrencyInput,
    MaskInput,
    DateSegmentedInput,
    DateSelectInput
} from '@/shared/components'
import { formatDate } from '@/core/utils/formatters'

// Currency
const price = ref(1234.56)
const salary = ref(0) // Default 0
const largeValue = ref(1000000)

// Masks
const cpf = ref('')
const cnpj = ref('')
const phone = ref('')
const customMask = ref('') // AAA-9999
const unmaskedValue = ref('')

// Dates
const birthDate = ref<Date | null>(null) // Date object
const appointment = ref<Date | null>(new Date('2023-12-25T14:30:00')) // Date object
const wakeUpTime = ref(null) // Date/Time object
const rawIsoDate = ref('') // ISO string mode
const segmentedDate = ref<Date | null>(null)
const segmentedDateTime = ref<Date | null>(null)
const selectDate = ref<Date | null>(null)

// Test: Invalid dates to demonstrate validation
const invalidDate = ref<Date | null>(null)
const invalidSegmented = ref<Date | null>(null)
</script>

<template>
    <div class="specialized-view">
        <div class="header">
            <h1>Specialized Inputs</h1>
            <p class="lead">Inputs for specific data types with built-in formatting and parsing logic.</p>
        </div>

        <!-- Currency -->
        <ComponentShowcase title="Currency" description="Automatic currency formatting (BRL default). Returns number.">
            <template #preview>
                <GridContainer :cols="2">
                    <Card title="Values">
                        <CurrencyInput v-model="price" label="Product Price" />
                        <CurrencyInput v-model="salary" label="Monthly Salary (Zero Start)" />
                        <CurrencyInput v-model="largeValue" label="Large Value" />

                        <div class="mt-4">
                            <p><strong>Price (Number):</strong> {{ price }}</p>
                            <p><strong>Salary (Number):</strong> {{ salary }}</p>
                            <p><strong>Large:</strong> {{ largeValue }}</p>
                        </div>
                    </Card>
                </GridContainer>
            </template>
            <template #code>
                <CodeBlock language="html" code='
<CurrencyInput v-model="amount" label="Amount" />
                ' />
            </template>
        </ComponentShowcase>

        <!-- Masks -->
        <ComponentShowcase title="Masks" description="Pre-defined and custom masks (CPF, CNPJ, Phone, etc).">
            <template #preview>
                <GridContainer :cols="2">
                    <Card title="Brazilian Documents">
                        <div class="col">
                            <MaskInput v-model="cpf" mask="CPF" label="CPF" placeholder="000.000.000-00" />
                            <MaskInput v-model="cnpj" mask="CNPJ" label="CNPJ" placeholder="00.000.000/0000-00" />
                        </div>
                        <div class="mt-4">
                            <p><strong>CPF Unmasked:</strong> {{ cpf }}</p>
                            <p><strong>CNPJ Unmasked:</strong> {{ cnpj }}</p>
                        </div>
                    </Card>

                    <Card title="Contact & Custom">
                        <div class="col">
                            <MaskInput v-model="phone" mask="PHONE" label="Phone (BR)" />
                            <MaskInput v-model="customMask" mask="AAA-####" label="Placa Veículo (ABC-1234)"
                                placeholder="AAA-1111" />
                        </div>
                        <div class="mt-4">
                            <p><strong>Phone:</strong> {{ phone }}</p>
                            <p><strong>Plate:</strong> {{ customMask }}</p>
                        </div>
                    </Card>
                </GridContainer>
            </template>
            <template #code>
                <CodeBlock language="html" code='
<MaskInput v-model="cpf" mask="CPF" label="CPF" />
<MaskInput v-model="phone" mask="PHONE" label="Phone" />
<MaskInput v-model="plate" mask="AAA-####" label="Custom Mask" />
                ' />
            </template>
        </ComponentShowcase>

        <!-- Date / Time -->
        <ComponentShowcase title="Date & Time"
            description="Date parsing and formatting. Returns Date objects or ISO strings. Protected against invalid characters (letters, symbols, SQL injection).">
            <template #preview>
                <GridContainer :cols="2">
                    <Card title="DateInput (Masked: DD/MM/YYYY)">
                        <div class="col">
                            <DateInput v-model="birthDate" type="date" label="Birth Date" />
                            <p><strong>Birth:</strong> {{ formatDate(birthDate || '') }}</p>

                            <DateInput v-model="appointment" type="datetime-local" label="Appointment" />
                            <p><strong>Appointment:</strong> {{ formatDate(appointment || '', {
                                day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
                            })
                                }}</p>

                            <DateInput v-model="wakeUpTime" type="time" label="Wake Up Time" />
                            <p><strong>Wake Up:</strong> {{ wakeUpTime ? formatDate(wakeUpTime, {
                                hour: '2-digit', minute: '2-digit'
                            }) : '' }}</p>

                            <DateInput v-model="invalidDate" type="date" label="🛡️ Test: Try 'aaa', '///', '31/02'" />
                            <p v-if="invalidDate"><strong>Valid Date:</strong> {{ formatDate(invalidDate) }}</p>
                            <p v-else style="color: var(--color-text-tertiary); font-style: italic;">Invalid input will
                                show error</p>
                        </div>
                    </Card>

                    <Card title="DateSegmentedInput (DD | MM | YYYY)">
                        <div class="col">
                            <DateSegmentedInput v-model="segmentedDate" label="Segmented Date" />
                            <p><strong>Segmented:</strong> {{ formatDate(segmentedDate || '') }}</p>

                            <DateSegmentedInput v-model="segmentedDateTime" label="With Time" :enable-time="true" />
                            <p><strong>DateTime:</strong> {{ segmentedDateTime ? formatDate(segmentedDateTime, {
                                day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
                            })
                                : '' }}</p>

                            <DateSegmentedInput v-model="invalidSegmented" label="🛡️ Test: Try letters in fields" />
                            <p v-if="invalidSegmented"><strong>Valid:</strong> {{ formatDate(invalidSegmented) }}</p>
                            <p v-else style="color: var(--color-text-tertiary); font-style: italic;">Only numbers
                                accepted (0-9)</p>
                        </div>
                    </Card>

                    <Card title="DateSelectInput (Dropdowns)">
                        <div class="col">
                            <DateSelectInput v-model="selectDate" label="Select Drops" />
                            <p><strong>Select:</strong> {{ formatDate(selectDate || '') }}</p>
                        </div>
                    </Card>

                    <Card title="ISO String Mode">
                        <div class="col">
                            <DateInput v-model="rawIsoDate" type="date" label="ISO Date" outputFormat="iso-string" />
                        </div>
                        <div class="mt-4">
                            <p><strong>ISO Raw:</strong> {{ rawIsoDate }}</p>
                            <p><strong>Formatted:</strong> {{ formatDate(rawIsoDate) }}</p>
                        </div>
                    </Card>
                </GridContainer>

                <!-- Security Info -->
                <Card title="🛡️ Security Features">
                    <div
                        style="padding: var(--spacing-md); background: var(--color-bg-tertiary); border-radius: var(--radius-md);">
                        <h4 style="margin-bottom: var(--spacing-sm); color: var(--color-primary);">Protected Against:
                        </h4>
                        <ul
                            style="list-style: none; padding: 0; display: flex; flex-direction: column; gap: var(--spacing-xs);">
                            <li>❌ Letters: <code>'aaaaaaaaaa'</code> → Removed automatically</li>
                            <li>❌ Symbols: <code>'//////////'</code> → Removed automatically</li>
                            <li>❌ SQL Injection: <code>'drop database'</code> → Removed automatically</li>
                            <li>❌ XSS: <code>&lt;script&gt;alert()&lt;/script&gt;</code> → Removed automatically</li>
                            <li>⚠️ Invalid Dates: <code>'99/99/9999'</code>, <code>'31/02/2024'</code> → Visual error
                                (red border + message)</li>
                        </ul>
                    </div>
                </Card>
            </template>
            <template #code>
                <CodeBlock language="html" code='
<!-- Standard Wrapper (Masked Input) -->
<DateInput v-model="date" type="date" />
<DateInput v-model="datetime" type="datetime-local" />
<DateInput v-model="time" type="time" />

<!-- Segmented (Individual Fields) -->
<DateSegmentedInput v-model="date" />
<DateSegmentedInput v-model="datetime" :enable-time="true" />

<!-- Dropdown Selects -->
<DateSelectInput v-model="date" />

<!-- All components automatically:
     - Block non-numeric characters (a-z, symbols, etc)
     - Validate calendar dates (31/02 marked as error)
     - Show visual feedback (red border + message)
     - Return Date objects or ISO strings
-->
                ' />
            </template>
        </ComponentShowcase>

    </div>
</template>

<style lang="scss" scoped>
.specialized-view {
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

.col {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
}

.mt-4 {
    margin-top: var(--spacing-md);
    font-size: 0.9em;
    color: var(--color-text-secondary);
}

code {
    font-family: 'Courier New', monospace;
    background: var(--color-bg-secondary);
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 0.9em;
}

ul {
    margin-left: var(--spacing-md);
}

h4 {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-semibold);
}
</style>
