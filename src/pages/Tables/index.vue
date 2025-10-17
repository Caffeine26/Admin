<template>
    <v-container fluid class="pa-6 bg-green-lighten-4">
        <!-- Header -->
        <div class="d-flex justify-space-between align-center mb-4">
            <h2 class="text-h5 font-weight-bold">Table List</h2>
            <v-btn color="green" prepend-icon="mdi-plus" @click="openCreateForm">
                New Table
            </v-btn>
        </div>

        <!-- Data Table -->
        <v-card class="elevation-1">
            <v-data-table :headers="headers" :items="filteredTables" :loading="tableStore.loading"
                item-value="table_number" class="text-body-2">
                <!-- Custom Status Display -->
                <template #item.status="{ item }">
                    <v-chip :color="getStatusColor(item.status)" variant="flat" size="small" class="text-capitalize">
                        {{ item.status }}
                    </v-chip>
                </template>

                <!-- Action Buttons -->
                <template #item.actions="{ item }">
                    <v-btn icon="mdi-pencil" size="small" color="success" @click="openEditForm(item)" />
                    <v-btn icon="mdi-delete" size="small" color="error" @click="handleDelete(item.id)" />
                </template>

                <!-- Table Footer Search -->
                <template #tfoot>
                    <tr>
                        <td>
                            <v-text-field v-model="searchNumber" class="ma-2" density="compact"
                                placeholder="Search table number..." hide-details />
                        </td>
                        <td>
                            <v-text-field v-model="searchLocation" class="ma-2" density="compact"
                                placeholder="Search location..." hide-details />
                        </td>
                        <td></td>
                    </tr>
                </template>
            </v-data-table>
        </v-card>

        <!-- Dialog Form -->
        <v-dialog v-model="showForm" width="500">
            <v-card>
                <v-card-title class="text-h6 font-weight-bold">
                    {{ editMode ? 'Edit Table' : 'Create Table' }}
                </v-card-title>
                <v-card-text>
                    <v-text-field v-model="form.table_number" label="Table Number" required density="compact" />
                    <v-text-field v-model="form.location_des" label="Location" density="compact" />
                    <v-select v-model="form.status" :items="['available', 'reserved', 'occupied']" label="Status"
                        density="compact" />
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn text @click="showForm = false">Cancel</v-btn>
                    <v-btn color="primary" @click="handleSave">Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useTableStore } from '@/stores/tableStore'

const tableStore = useTableStore()

// UI state
const showForm = ref(false)
const editMode = ref(false)
const searchNumber = ref('')
const searchLocation = ref('')

// Table headers
const headers = [
    { title: 'Table Number', key: 'table_number' },
    { title: 'Location', key: 'location_des' },
    { title: 'Status', key: 'status' },
    { title: 'Actions', key: 'actions', sortable: false },
]

// Form
const form = ref({
    id: null,
    table_number: '',
    location_des: '',
    status: 'available',
})

// Computed filtered list (safely)
const filteredTables = computed(() => {
    const tables = tableStore.tables || []
    return tables.filter((t) => {
        const numMatch = t.table_number?.toString().toLowerCase().includes(searchNumber.value.toLowerCase())
        const locMatch = t.location_des?.toLowerCase().includes(searchLocation.value.toLowerCase())
        return numMatch && locMatch
    })
})

// Lifecycle: fetch tables on mounted
onMounted(() => {
    tableStore.fetchTables()
})

// Handlers
function openCreateForm() {
    editMode.value = false
    form.value = { id: null, table_number: '', location_des: '', status: 'available' }
    showForm.value = true
}

function openEditForm(item: any) {
    editMode.value = true
    form.value = { ...item }
    showForm.value = true
}

async function handleSave() {
    const data = {
        table_number: form.value.table_number,
        location_des: form.value.location_des,
        status: form.value.status,
    }

    if (editMode.value && form.value.id) {
        await tableStore.updateTable(form.value.id, data)
    } else {
        await tableStore.createTable(data)
    }

    showForm.value = false
    editMode.value = false
}

async function handleDelete(id: number) {
    if (confirm('Are you sure you want to delete this table?')) {
        await tableStore.deleteTable(id)
    }
}

// Chip color helper
function getStatusColor(status: string) {
    switch (status) {
        case 'available':
            return 'green'
        case 'reserved':
            return 'amber'
        case 'occupied':
            return 'red'
        default:
            return 'grey'
    }
}
</script>

<style scoped>
.bg-grey-lighten-4 {
    background-color: #45dd16;
}
</style>
