<template>
    <v-container>
        <h2 class="mb-4">Edit Customization</h2>

        <!-- Search -->
        <v-text-field v-model="searchQuery" label="Search Products" prepend-inner-icon="mdi-magnify" outlined
            class="mb-4" />

        <!-- Tabs -->
        <v-tabs v-model="selectedTab" class="mb-4" grow>
            <v-tab value="menu">Menu</v-tab>
            <v-tab value="add_on">Add-On</v-tab>
            <v-tab value="modify">Modify</v-tab>
        </v-tabs>

        <!-- Product Table -->
        <v-data-table :headers="headers" :items="filteredProducts" item-value="id" class="elevation-2">
            <template #item.main="{ item }">
                <v-checkbox :model-value="selectedMainProduct?.id === item.id"
                    @update:model-value="toggleMainProduct(item)" />
            </template>

            <template #item.add_on="{ item }">
                <v-checkbox v-model="selectedAddOnIds" :value="item.id" />
            </template>

            <template #item.modify="{ item }">
                <v-checkbox v-model="selectedModifyIds" :value="item.id" />
            </template>

            <template #item.image_url="{ item }">
                <v-img :src="item.image_url" max-width="60" height="60" contain />
            </template>
        </v-data-table>

        <!-- Selected Preview -->
        <v-row class="mt-6">
            <v-col cols="12" md="4">
                <v-card outlined>
                    <v-card-title>Main Product</v-card-title>
                    <v-card-text v-if="selectedMainProduct">
                        <v-img :src="selectedMainProduct.image_url" height="100" contain class="mb-2" />
                        <p>{{ selectedMainProduct.name_english || selectedMainProduct.name }}</p>
                    </v-card-text>
                    <v-card-text v-else class="text-grey">No main product selected</v-card-text>
                </v-card>
            </v-col>

            <v-col cols="12" md="4">
                <v-card outlined>
                    <v-card-title>Add-on Products</v-card-title>
                    <v-card-text>
                        <div v-if="selectedAddOnList.length">
                            <div v-for="p in selectedAddOnList" :key="p.id" class="mb-2">
                                <v-img :src="p.image_url" max-width="60" height="60" contain />
                                <p>{{ p.name_english || p.name }}</p>
                            </div>
                        </div>
                        <p v-else class="text-grey">No add-on selected</p>
                    </v-card-text>
                </v-card>
            </v-col>

            <v-col cols="12" md="4">
                <v-card outlined>
                    <v-card-title>Modify Products</v-card-title>
                    <v-card-text>
                        <div v-if="selectedModifyList.length">
                            <div v-for="p in selectedModifyList" :key="p.id" class="mb-2">
                                <v-img :src="p.image_url" max-width="60" height="60" contain />
                                <p>{{ p.name_english || p.name }}</p>
                            </div>
                        </div>
                        <p v-else class="text-grey">No modify selected</p>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <v-row class="mt-6">
            <v-col cols="12" md="3">
                <v-checkbox v-model="status" true-value="1" false-value="0" label="Active" />
            </v-col>

            <v-col cols="12" md="3">
                <v-btn color="primary" @click="submit">Update</v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductCustomizationStore } from '@/stores/customizationStore'
import productService from '@/services/productService'
import type { Product } from '@/types/product'

const route = useRoute()
const router = useRouter()
const store = useProductCustomizationStore()

const id = Number(route.params.id)

const products = ref<Product[]>([])
const searchQuery = ref('')
const selectedMainProduct = ref<Product | null>(null)
const selectedAddOnIds = ref<number[]>([])
const selectedModifyIds = ref<number[]>([])
const status = ref('1')
const selectedTab = ref<'menu' | 'add_on' | 'modify'>('menu')

const headers = [
    { text: 'Image', value: 'image_url' },
    { text: 'Name', value: 'name' },
    { text: 'Main', value: 'main', align: 'center' },
    { text: 'Add-on', value: 'add_on', align: 'center' },
    { text: 'Modify', value: 'modify', align: 'center' },
]

// Helper to normalize image URLs
const normalizeImageUrl = (path: string | null) =>
    path ? import.meta.env.VITE_API_BASE_URL_STORAGE + `/${path.replace(/^images\//, '')}` : null

onMounted(async () => {
    try {
        // 1️⃣ Fetch all products
        const res = await productService.getAll()
        const allProducts: Product[] = Array.isArray(res?.data?.data)
            ? res.data.data
            : Array.isArray(res.data)
                ? res.data
                : []

        // Normalize images
        products.value = allProducts.map(p => ({
            ...p,
            image_url: normalizeImageUrl(p.image_url),
        }))

        // 2️⃣ Fetch customization by ID
        const row = await store.getById(id)
        if (row && row.success) {
            // Normalize main product image
            const mainProduct = products.value.find(p => p.id === Number(row.main_product))
            if (mainProduct) {
                selectedMainProduct.value = {
                    ...mainProduct,
                    image_url: normalizeImageUrl(mainProduct.image_url),
                }
            }

            // Normalize add-on and modify products
            selectedAddOnIds.value = (row.data.add_on || []).map((p: any) => {
                const prod = products.value.find(prod => prod.id === Number(p.id))
                if (prod) return prod.id
                return Number(p.id)
            })

            selectedModifyIds.value = (row.data.modify || []).map((p: any) => {
                const prod = products.value.find(prod => prod.id === Number(p.id))
                if (prod) return prod.id
                return Number(p.id)
            })

            status.value = row.status ?? '1'
        }
    } catch (err) {
        console.error('Failed to fetch products or customization', err)
    }
})


// Filtered products
const filteredProducts = computed(() =>
    products.value
        .filter(p => p.type === selectedTab.value)
        .filter(p =>
            (p.name_english || p.name || '').toLowerCase().includes(searchQuery.value.toLowerCase())
        )
)

// Selected lists
const selectedAddOnList = computed(() =>
    products.value.filter(p => selectedAddOnIds.value.includes(p.id))
)
const selectedModifyList = computed(() =>
    products.value.filter(p => selectedModifyIds.value.includes(p.id))
)

const toggleMainProduct = (item: Product) => {
    selectedMainProduct.value = selectedMainProduct.value?.id === item.id ? null : item
}

const submit = async () => {
    if (!selectedMainProduct.value) {
        alert('Please select a main product!')
        return
    }

    const payload = {
        product_id: selectedMainProduct.value.id,
        add_on_ids: selectedAddOnList.value.map(p => p.id),
        modify_ids: selectedModifyList.value.map(p => p.id),
        status: status.value,
    }

    try {
        await store.update(id, payload)
        alert('Customization updated successfully!')
        router.push('/Customization')
    } catch (err) {
        console.error(err)
        alert('Failed to update customization!')
    }
}
</script>
