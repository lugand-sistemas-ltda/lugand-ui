<script setup lang="ts">
import { ref } from 'vue'
import { Btn, DataTable } from '@lugand/vue-ui-lib'

const columns = [
    { key: 'id', label: 'ID', sortable: true, width: '80px' },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'role', label: 'Role', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
]

const data = ref([
    { id: 1, name: 'John Doe', role: 'Admin', status: 'Active' },
    { id: 2, name: 'Jane Smith', role: 'User', status: 'Inactive' },
    { id: 3, name: 'Bob Johnson', role: 'Editor', status: 'Active' },
    { id: 4, name: 'Alice Williams', role: 'User', status: 'Active' },
    { id: 5, name: 'Charlie Brown', role: 'Admin', status: 'Active' },
])

const selected = ref<any[]>([])
</script>

<template>
    <div class="dashboard-view">
        <header class="dashboard-header">
            <h1>Dashboard Scenario</h1>
            <div class="actions">
                <Btn variant="primary" size="sm">New Report</Btn>
                <Btn variant="secondary" size="sm">Export</Btn>
            </div>
        </header>

        <div class="dashboard-grid">
            <div class="card">
                <h3>Stats A</h3>
                <p>12,345</p>
            </div>
            <div class="card">
                <h3>Stats B</h3>
                <p>87%</p>
            </div>
            <div class="card">
                <h3>Stats C</h3>
                <p>Active</p>
            </div>
        </div>

        <div class="content-area">
            <h3>Recent Users</h3>
            <DataTable :data="data" :columns="columns" selectable pagination :items-per-page="5"
                @update:selection="(val: any[]) => selected = val">
                <template #actions>
                    <Btn size="sm" variant="ghost">Filter</Btn>
                </template>

                <template #status="{ value }">
                    <span :style="{
                        color: value === 'Active' ? 'green' : 'gray',
                        fontWeight: 'bold'
                    }">
                        {{ value }}
                    </span>
                </template>
            </DataTable>

            <div v-if="selected.length" style="margin-top: 1rem; padding: 1rem; background: #eee; border-radius: 4px;">
                Selected IDs: {{selected.map(r => r.id).join(', ')}}
            </div>
        </div>
    </div>
</template>

<style scoped>
.dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
}

.actions {
    display: flex;
    gap: 0.5rem;
}

.dashboard-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
}

.card {
    padding: 1.5rem;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    background: var(--color-bg-secondary);
}

.content-area {
    padding: 2rem;
    border: 1px dashed var(--color-border);
    border-radius: 8px;
    text-align: center;
    color: var(--color-text-secondary);
}
</style>
