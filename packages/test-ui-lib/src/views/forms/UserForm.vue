<script setup lang="ts">
import { ref } from 'vue'
import { DynamicForm, CodeBlock, type FormField } from '@lugand/vue-ui-lib'

const formData = ref({
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    isActive: true,
    department: ''
})

const formSchema: FormField[] = [
    { name: 'firstName', label: 'First Name', type: 'text', cols: 1 },
    { name: 'lastName', label: 'Last Name', type: 'text', cols: 1 },
    { name: 'email', label: 'Email Address', type: 'email', cols: 2, placeholder: 'john.doe@company.com' },
    {
        name: 'department',
        label: 'Department',
        type: 'select',
        cols: 1,
        options: [
            { label: 'Engineering', value: 'eng' },
            { label: 'Design', value: 'des' },
            { label: 'Marketing', value: 'mkt' },
            { label: 'Sales', value: 'sales' }
        ]
    },
    { name: 'role', label: 'Job Title', type: 'text', cols: 1 },
    { name: 'isActive', label: 'Active Employee', type: 'checkbox', cols: 2 }
]

const handleSave = (data: any) => {
    console.log('Form Submitted:', data)
    alert(JSON.stringify(data, null, 2))
}
</script>

<template>
    <div class="user-form-view">
        <h1>User Form Scenario</h1>
        <p class="description">Testing the new <strong>DynamicForm</strong> component.</p>

        <div class="card">
            <DynamicForm :schema="formSchema" v-model="formData" submit-label="Save Employee" @submit="handleSave" />
        </div>

        <div class="debug">
            <h3>Live Data:</h3>
            <CodeBlock :code="JSON.stringify(formData, null, 2)" language="json" />
        </div>
    </div>
</template>

<style scoped>
.user-form-view {
    max-width: 800px;
    margin: 0 auto;
}

.description {
    color: var(--color-text-secondary);
    margin-bottom: 2rem;
}

.card {
    padding: 2rem;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    background: var(--color-bg-secondary);
}

.debug {
    margin-top: 2rem;
}
</style>