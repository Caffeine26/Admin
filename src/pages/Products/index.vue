<template>
    <div class="p-6">
        <h1 class="text-2xl font-bold mb-4">Products</h1>

        <!-- Controls -->
        <v-row class="mb-4" align="center" justify="space-between">
            <v-col cols="12" md="5">
                <v-text-field v-model="searchName" label="Search Products" prepend-inner-icon="mdi-magnify" dense
                    clearable />
            </v-col>

            <v-col cols="12" md="3">
                <v-select v-model="filterType" :items="['All', 'menu', 'add_on', 'modify']" label="Filter by Type"
                    dense />
            </v-col>

            <v-col cols="12" md="3" class="text-right">
                <v-btn color="green" @click="goToCreate">+ Add Product</v-btn>
            </v-col>
        </v-row>

        <!-- Product Table -->
        <v-data-table-server :headers="headers" :items="serverItems" :items-length="totalItems" :loading="loading"
            :items-per-page="itemsPerPage" item-value="id" @update:options="loadItems" class="elevation-1">
            <!-- Image -->
            <template #item.image_url="{ item }">
                <v-img v-if="item.image_url" :src="item.image_url" class="product-image" width="70" height="70" cover />
                <span v-else>No Image</span>
            </template>

            <!-- Type -->
            <template #item.type="{ item }">
                <v-chip small color="primary" text-color="white">{{ item.type }}</v-chip>
            </template>

            <!-- Price -->
            <template #item.price="{ item }">
                <div class="font-weight-bold">
                    <span v-if="isInPromotion(item)" class="text-decoration-line-through text-grey mr-2">
                        ${{ item.price }}
                    </span>
                    <span :class="isInPromotion(item) ? 'text-red' : ''">
                        ${{ getDiscountedPrice(item).toFixed(2) }}
                    </span>
                </div>
            </template>

            <!-- Actions -->
            <template #item.actions="{ item }">
                <v-btn icon color="blue" @click="goToEdit(item.id)">
                    <v-icon>mdi-pencil</v-icon>
                </v-btn>
            </template>
        </v-data-table-server>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useProductStore } from '@/stores/productStore'
import { usePromotionStore } from '@/stores/promotionStore'
import { usePromotionItemStore } from '@/stores/promotionItemStore'

const router = useRouter()
const productStore = useProductStore()
const promotionStore = usePromotionStore()
const promotionItemStore = usePromotionItemStore()

// Table state
const itemsPerPage = ref(5)
const headers = ref([
    { title: 'ID', key: 'id', align: 'start' },
    { title: 'Name', key: 'name', align: 'start' },
    { title: 'Price', key: 'price', align: 'end' },
    { title: 'Type', key: 'type', align: 'center' },
    { title: 'Image', key: 'image_url', align: 'center', sortable: false },
    { title: 'Actions', key: 'actions', align: 'center', sortable: false },
])
const serverItems = ref<any[]>([])
const totalItems = ref(0)
const loading = ref(true)

// Filters
const searchName = ref('')
const filterType = ref('All')

// Helpers
const isInPromotion = (product: any) =>
    promotionStore.promotions.some(promo =>
        promo.promotion_items?.some((pi: any) => pi.product_id === product.id)
    )

const getDiscountedPrice = (product: any) => {
    // Convert price to number
    const price = Number(product.price)
    if (isNaN(price)) return 0

    for (const promo of promotionStore.promotions) {
        if (promo.discount && promo.promotion_items?.length) {
            const inPromo = promo.promotion_items.some(
                (pi: any) => pi.product_id === product.id
            )
            if (inPromo) return price * (1 - Number(promo.discount || 0) / 100)
        }
    }

    return price
}

// Load items
function loadItems({ page = 1, itemsPerPage, sortBy }: any = {}) {
    loading.value = true
    setTimeout(() => {
        let items = productStore.products.slice()

        // Search
        if (searchName.value) {
            const term = searchName.value.toLowerCase()
            items = items.filter(p => p.name.toLowerCase().includes(term))
        }

        // Filter
        if (filterType.value !== 'All') items = items.filter(p => p.type === filterType.value)

        // Sort
        if (sortBy?.length) {
            const { key: sortKey, order: sortOrder } = sortBy[0]
            items.sort((a, b) =>
                sortOrder === 'desc' ? (b[sortKey] > a[sortKey] ? 1 : -1) : a[sortKey] > b[sortKey] ? 1 : -1
            )
        }

        // Pagination
        const start = (page - 1) * itemsPerPage
        const end = start + itemsPerPage
        serverItems.value = items.slice(start, end)
        totalItems.value = items.length
        loading.value = false
    }, 100)
}

// Navigation
const goToCreate = () => router.push('/products/create')
const goToEdit = (id: number) => router.push(`/products/${id}/edit`)

// On mount: fetch products & promotions & promotion_items
onMounted(async () => {
    await productStore.fetchingProducts()
    await promotionStore.fetchPromotions()
    await promotionItemStore.fetchPromotionItems()
    loadItems({ page: 1, itemsPerPage: itemsPerPage.value, sortBy: [] })
})

// Watch filters
watch([searchName, filterType], () => loadItems({ page: 1, itemsPerPage: itemsPerPage.value, sortBy: [] }))
</script>

<style scoped>
.product-image {
    width: 70px;
    height: 70px;
    object-fit: cover;
    border-radius: 4px;
    display: block;
    margin: auto;
}

.v-data-table th,
.v-data-table td {
    vertical-align: middle;
}
</style>
