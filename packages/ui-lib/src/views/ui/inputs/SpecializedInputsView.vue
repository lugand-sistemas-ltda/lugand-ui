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

// Dates
const birthDate = ref<Date | null>(null) // Date object
const appointment = ref<Date | null>(new Date('2023-12-25T14:30:00')) // Date object
const wakeUpTime = ref<Date | null>(null) // Date/Time object
const segmentedDate = ref<Date | null>(null)
const segmentedDateTime = ref<Date | null>(null)
const segmentedTimeOnly = ref<Date | null>(null) // Teste: apenas HH:mm
const selectDate = ref<Date | null>(null)
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
                <!-- Normal Date (Masked Input) -->
                <Card title="Normal Date (Masked Input)">
                    <GridContainer :cols="3">
                        <!-- Birth Date -->
                        <Card title="Birth Date (DD/MM/YYYY)">
                            <div class="col">
                                <DateInput v-model="birthDate" type="date" label="Birth Date" />
                                <div class="output-section">
                                    <p><strong>Formatted:</strong> {{ formatDate(birthDate || '') }}</p>
                                    <p><strong>ISO String:</strong>
                                        <code>{{ birthDate?.toISOString() || 'null' }}</code>
                                    </p>
                                </div>
                            </div>
                        </Card>

                        <!-- Appointment (Date + Time) -->
                        <Card title="Appointment (DD/MM/YYYY HH:mm)">
                            <div class="col">
                                <DateInput v-model="appointment" type="datetime-local" label="Appointment" />
                                <div class="output-section">
                                    <p><strong>Formatted:</strong> {{ formatDate(appointment || '', {
                                        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute:
                                            '2-digit'
                                    }) }}</p>
                                    <p><strong>ISO String:</strong>
                                        <code>{{ appointment?.toISOString() || 'null' }}</code>
                                    </p>
                                </div>
                            </div>
                        </Card>

                        <!-- Wake Up Time -->
                        <Card title="Wake Up Time (HH:mm)">
                            <div class="col">
                                <DateInput v-model="wakeUpTime" type="time" label="Wake Up Time" />
                                <div class="output-section">
                                    <p><strong>Formatted:</strong> {{ wakeUpTime ? formatDate(wakeUpTime, {
                                        hour: '2-digit', minute: '2-digit'
                                    }) : 'null' }}</p>
                                    <p><strong>ISO String:</strong>
                                        <code>{{ wakeUpTime?.toISOString() || 'null' }}</code>
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </GridContainer>
                </Card>

                <!-- Segmented Date (Individual Fields) -->
                <Card title="Segmented Date (Individual Fields)">
                    <GridContainer :cols="3">
                        <!-- Segmented Date Only -->
                        <Card title="Segmented Date (DD | MM | YYYY)">
                            <div class="col">
                                <DateSegmentedInput v-model="segmentedDate" label="Segmented Date" />
                                <div class="output-section">
                                    <p><strong>Formatted:</strong> {{ formatDate(segmentedDate || '') }}</p>
                                    <p><strong>ISO String:</strong>
                                        <code>{{ segmentedDate?.toISOString() || 'null' }}</code>
                                    </p>
                                </div>
                            </div>
                        </Card>

                        <!-- Segmented With Time -->
                        <Card title="With Time (DD | MM | YYYY | HH | mm)">
                            <div class="col">
                                <DateSegmentedInput v-model="segmentedDateTime" label="With Time" :enable-time="true" />
                                <div class="output-section">
                                    <p><strong>Formatted:</strong> {{ segmentedDateTime ? formatDate(segmentedDateTime,
                                        {
                                            day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute:
                                                '2-digit'
                                        }) : 'null' }}</p>
                                    <p><strong>ISO String:</strong>
                                        <code>{{ segmentedDateTime?.toISOString() || 'null' }}</code>
                                    </p>
                                </div>
                            </div>
                        </Card>

                        <!-- Time Only Test -->
                        <Card title="Time Only (HH | mm)">
                            <div class="col">
                                <DateSegmentedInput v-model="segmentedTimeOnly" label="Time Only (Hours and Minutes)"
                                    :enable-time="true" :show-date-fields="false" />
                                <div class="output-section">
                                    <p><strong>Formatted:</strong> {{ segmentedTimeOnly ? formatDate(segmentedTimeOnly,
                                        {
                                            hour: '2-digit', minute: '2-digit'
                                        }) : 'null' }}</p>
                                    <p><strong>ISO String:</strong>
                                        <code>{{ segmentedTimeOnly?.toISOString() || 'null' }}</code>
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </GridContainer>
                </Card>

                <!-- Select Drops (Dropdown Selects) -->
                <Card title="Select Drops (Dropdown Selects)">
                    <GridContainer :cols="1">
                        <Card title="Select Date (Day / Month / Year)">
                            <div class="col">
                                <DateSelectInput v-model="selectDate" label="Select Date" />
                                <div class="output-section">
                                    <p><strong>Formatted:</strong> {{ formatDate(selectDate || '') }}</p>
                                    <p><strong>ISO String:</strong>
                                        <code>{{ selectDate?.toISOString() || 'null' }}</code>
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </GridContainer>
                </Card>

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

.output-section {
    margin-top: var(--spacing-md);
    padding: var(--spacing-sm);
    background: var(--color-bg-tertiary);
    border-radius: var(--radius-sm);
    border-left: 3px solid var(--color-primary);

    p {
        margin: var(--spacing-xs) 0;
        font-size: var(--font-size-sm);
        color: var(--color-text-secondary);

        &:first-child {
            margin-top: 0;
        }

        &:last-child {
            margin-bottom: 0;
        }

        strong {
            color: var(--color-text-primary);
            font-weight: var(--font-weight-semibold);
        }
    }
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
