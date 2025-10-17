<template>
    <v-container fluid class="pa-6 bg-pink-lighten-5">
        <!-- Header -->
        <div class="d-flex justify-space-between align-center mb-4">
            <h2 class="text-h5 font-weight-bold">Customer List</h2>
            <v-btn color="primary" prepend-icon="mdi-plus" @click="openCreateForm">
                New Customer
            </v-btn>
        </div>

        <!-- Data Table -->
        <v-card class="elevation-1">
            <v-data-table :headers="headers" :items="filteredCustomers" :loading="customerStore.loading" item-value="id"
                class="text-body-2">
                <!-- Status Chip -->
                <template #item.status="{ item }">
                    <v-chip :color="getStatusColor(item.status)" variant="flat" size="small" class="text-capitalize">
                        {{ item.status }}
                    </v-chip>
                </template>

                <!-- Telegram Link -->
                <template #item.telegram_url="{ item }">
                    <a v-if="item.telegram_url" :href="item.telegram_url" target="_blank"
                        class="text-blue text-decoration-none">
                        {{ item.telegram_url }}
                    </a>
                    <span v-else>-</span>
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
                            <v-text-field v-model="searchName" class="ma-2" density="compact" placeholder="Name..."
                                hide-details />
                        </td>
                        <td>
                            <v-text-field v-model="searchEmail" class="ma-2" density="compact" placeholder="Email..."
                                hide-details />
                        </td>
                        <td></td>
                        <td></td>
                    </tr>
                </template>
            </v-data-table>
        </v-card>

        <!-- Dialog Form -->
        <v-dialog v-model="showForm" width="500">
            <v-card>
                <v-card-title class="text-h6 font-weight-bold">
                    {{ editMode ? 'Edit Customer' : 'Create Customer' }}
                </v-card-title>

                <v-card-text>
                    <v-text-field v-model="form.name" label="Name" required density="compact" />
                    <v-text-field v-model="form.phone_number" label="Phone Number" density="compact" />
                    <v-text-field v-model="form.email" label="Email" density="compact" />
                    <v-text-field v-model="form.telegram_url" label="Telegram URL" density="compact" />
                    <v-select v-model="form.status" :items="['active', 'inactive', 'guest']" label="Status"
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
import { useCustomerStore } from '@/stores/customerStore'

const customerStore = useCustomerStore()

// UI State
const showForm = ref(false)
const editMode = ref(false)
const searchName = ref('')
const searchEmail = ref('')

// Data Table Headers
const headers = [
    { title: 'Name', key: 'name' },
    { title: 'Phone', key: 'phone_number' },
    { title: 'Email', key: 'email' },
    { title: 'Telegram', key: 'telegram_url' },
    { title: 'Status', key: 'status' },
    { title: 'Actions', key: 'actions', sortable: false }
]

// Form
const form = ref({
    id: null,
    name: '',
    phone_number: '',
    email: '',
    telegram_url: '',
    status: 'active'
})

// Computed: Filtered customers
const filteredCustomers = computed(() => {
    const customers = customerStore.customers || []
    return customers.filter(c => {
        const nameMatch = c.name?.toLowerCase().includes(searchName.value.toLowerCase())
        const emailMatch = c.email?.toLowerCase().includes(searchEmail.value.toLowerCase())
        return nameMatch && emailMatch
    })
})

// Lifecycle
onMounted(() => {
    customerStore.fetchCustomers()
})

// Handlers
function openCreateForm() {
    editMode.value = false
    form.value = {
        id: null,
        name: '',
        phone_number: '',
        email: '',
        telegram_url: '',
        status: 'active'
    }
    showForm.value = true
}

function openEditForm(item: any) {
    editMode.value = true
    form.value = { ...item }
    showForm.value = true
}

async function handleSave() {
    const data = {
        name: form.value.name,
        phone_number: form.value.phone_number,
        email: form.value.email,
        telegram_url: form.value.telegram_url,
        status: form.value.status
    }

    if (editMode.value && form.value.id) {
        await customerStore.updateCustomer(form.value.id, data)
    } else {
        await customerStore.addCustomer(data)
    }

    showForm.value = false
    editMode.value = false
}

async function handleDelete(id: number) {
    if (confirm('Are you sure you want to delete this customer?')) {
        await customerStore.deleteCustomer(id)
    }
}

// Helpers
function getStatusColor(status: string) {
    switch (status) {
        case 'active':
            return 'green'
        case 'inactive':
            return 'grey'
        case 'guest':
            return 'blue'
        default:
            return 'grey'
    }
}
</script>

<style scoped>
.bg-blue-lighten-5 {
    background-color: #05570e;
}
</style>
