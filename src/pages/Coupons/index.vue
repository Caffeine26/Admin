<template>
    <v-container fluid class="pa-6 bg-green-lighten-4">
        <!-- Header -->
        <div class="d-flex justify-space-between align-center mb-4">
            <h2 class="text-h5 font-weight-bold">Coupon Management</h2>
            <v-btn color="primary" prepend-icon="mdi-plus" @click="openForm()">
                Add New Coupon
            </v-btn>
        </div>

        <!-- Coupon Data Table -->
        <v-card class="elevation-1">
            <v-data-table :headers="headers" :items="filteredCoupons" :loading="store.loading" item-value="id"
                class="text-body-2">
                <!-- Discount Column -->
                <template #item.discount="{ item }">
                    <span class="font-weight-bold text-success">
                        {{ item.discount_type === 'percent' ? item.discount + '%' : '$' + item.discount }}
                    </span>
                </template>

                <!-- Period Column -->
                <template #item.period="{ item }">
                    {{ formatDate(item.start_date) }} → {{ formatDate(item.end_date) }}
                </template>

                <!-- Action Column -->
                <template #item.actions="{ item }">
                    <v-btn icon color="primary" @click="openForm(item)">
                        <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                </template>

                <!-- Table Footer Search -->
                <template #tfoot>
                    <tr>
                        <td>
                            <v-text-field v-model="searchName" placeholder="Search by name..." class="ma-2"
                                density="compact" hide-details />
                        </td>
                        <td>
                            <v-text-field v-model="searchCode" placeholder="Search by code..." class="ma-2"
                                density="compact" hide-details />
                        </td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                </template>
            </v-data-table>
        </v-card>

        <!-- Dialog Form -->
        <v-dialog v-model="dialog" width="600">
            <v-card>
                <v-card-title class="text-h6 font-weight-bold">
                    {{ editingCoupon ? 'Edit Coupon' : 'Add New Coupon' }}
                </v-card-title>
                <v-card-text>
                    <v-form ref="formRef" v-model="valid">
                        <v-text-field v-model="form.name_english" label="Name" required density="compact" />
                        <v-text-field v-model="form.code" label="Code" required density="compact" />
                        <v-text-field v-model="form.description" label="Description" density="compact" />
                        <v-text-field v-model="form.min_order" type="number" label="Min Order ($)" density="compact" />
                        <v-select v-model="form.discount_type" :items="['percent', 'decimal']" label="Discount Type"
                            density="compact" />
                        <v-text-field v-model="form.discount" type="number" label="Discount" density="compact" />
                        <v-text-field v-model="form.start_date" type="date" label="Start Date" density="compact" />
                        <v-text-field v-model="form.end_date" type="date" label="End Date" density="compact" />
                        <v-switch v-model="form.active" label="Active" inset />
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn text @click="closeForm">Cancel</v-btn>
                    <v-btn color="primary" @click="saveCoupon">
                        {{ editingCoupon ? 'Update' : 'Create' }}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useCouponStore } from '@/stores/couponStore'
import type { Coupons } from '@/types/coupons'

const store = useCouponStore()

// UI State
const dialog = ref(false)
const valid = ref(false)
const editingCoupon = ref<Coupons | null>(null)
const formRef = ref()

// Form
const form = ref({
    name_english: '',
    code: '',
    description: '',
    min_order: 0,
    discount_type: 'percent',
    discount: 0,
    start_date: '',
    end_date: '',
    active: true,
})

// Footer search
const searchName = ref('')
const searchCode = ref('')

// Table headers
const headers = [
    { title: 'Name', key: 'name_english' },
    { title: 'Code', key: 'code' },
    { title: 'Discount', key: 'discount' },
    { title: 'Period', key: 'period' },
    { title: 'Actions', key: 'actions', sortable: false },
]

// Computed filtered coupons
const filteredCoupons = computed(() => {
    const list = store.coupons || []
    return list.filter((c) => {
        const nameMatch = c.name_english?.toLowerCase().includes(searchName.value.toLowerCase())
        const codeMatch = c.code?.toLowerCase().includes(searchCode.value.toLowerCase())
        return nameMatch && codeMatch
    })
})

// Lifecycle
onMounted(() => {
    store.fetchCoupons()
})

// Handlers
function formatDate(date: string) {
    return new Date(date).toLocaleDateString()
}

function openForm(coupon?: Coupons) {
    if (coupon) {
        editingCoupon.value = coupon
        form.value = { ...coupon }
    } else {
        editingCoupon.value = null
        form.value = {
            name_english: '',
            code: '',
            description: '',
            min_order: 0,
            discount_type: 'percent',
            discount: 0,
            start_date: '',
            end_date: '',
            active: true,
        }
    }
    dialog.value = true
}

function closeForm() {
    dialog.value = false
}

async function saveCoupon() {
    if (editingCoupon.value) {
        await store.updateCoupon(editingCoupon.value.id, form.value)
    } else {
        await store.createCoupon(form.value as any)
    }
    dialog.value = false
}
</script>
