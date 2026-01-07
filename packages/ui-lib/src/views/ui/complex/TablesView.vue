<script setup lang="ts">
import { ref } from 'vue'
import { ComponentShowcase, CodeBlock } from '@/shared/components'
import DataTable from '@/modules/DataTable/DataTable.vue'
import type { TableColumn } from '@/modules/DataTable/types'

const fakeData = [
    { id: 1, name: 'Alice Johnson', role: 'Admin', status: 'Active', email: 'alice@example.com' },
    { id: 2, name: 'Bob Smith', role: 'User', status: 'Inactive', email: 'bob@example.com' },
    { id: 3, name: 'Charlie Brown', role: 'Editor', status: 'Active', email: 'charlie@example.com' },
    { id: 4, name: 'David Lee', role: 'User', status: 'Active', email: 'david@example.com' },
    { id: 5, name: 'Eva Green', role: 'Admin', status: 'Pending', email: 'eva@example.com' },
    { id: 6, name: 'Frank White', role: 'User', status: 'Active', email: 'frank@example.com' },
    { id: 7, name: 'Grace Hall', role: 'User', status: 'Inactive', email: 'grace@example.com' },
    { id: 8, name: 'Hank Miller', role: 'Editor', status: 'Active', email: 'hank@example.com' },
    { id: 9, name: 'Ivy Wilson', role: 'User', status: 'Active', email: 'ivy@example.com' },
    { id: 10, name: 'Jack Taylor', role: 'User', status: 'Pending', email: 'jack@example.com' },
    { id: 11, name: 'Kevin Moore', role: 'Admin', status: 'Active', email: 'kevin@example.com' },
    { id: 12, name: 'Laura Anderson', role: 'User', status: 'Inactive', email: 'laura@example.com' },
]

const columns: TableColumn[] = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'role', label: 'Role', sortable: true, filterable: true },
    { key: 'email', label: 'Email' },
    { key: 'status', label: 'Status', sortable: true },
]

const selected = ref<any[]>([])

const codeExample = `
<script setup>
import { DataTable } from '@lugand/vue-ui-lib'

const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'role', label: 'Role', sortable: true },
    { key: 'status', label: 'Status' },
]

const data = [
    { name: 'Alice', role: 'Admin', status: 'Active' },
    // ...
]
<\/script>

<template>
    <DataTable 
        :data="data" 
        :columns="columns" 
        selectable 
        pagination 
    />
</template>
`
</script>

<template>
    <div class="tables-view">
        <ComponentShowcase title="Data Table" description="Complex data table with sort, filter, and pagination.">
            <template #preview>
                <div style="width: 100%;">
                    <DataTable :data="fakeData" :columns="columns" selectable pagination
                        @update:selection="val => selected = val">
                        <template #actions>
                            <button class="btn btn--sm btn--secondary">Export</button>
                        </template>
                    </DataTable>

                    <div style="margin-top: 1rem; font-size: 0.8em; color: gray;">
                        Selected rows: {{ selected.length }}
                    </div>
                </div>
            </template>
            <template #code>
                <CodeBlock :code="codeExample" />
            </template>
        </ComponentShowcase>
    </div>
</template>
