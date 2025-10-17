<template>
    <v-container>
        <h2>Create Promotion</h2>

        <v-form ref="formRef">
            <!-- Basic Info -->
            <v-text-field v-model="promotion.name_english" label="English Name" required />
            <v-text-field v-model="promotion.name_khmer" label="Khmer Name" required />
            <v-textarea v-model="promotion.detail_des" label="Details" />

            <!-- Promotion Type -->
            <v-select v-model="promotion.type" :items="['single', 'combo', 'special_package']" label="Promotion Type"
                required />

            <!-- Discount Type -->
            <v-select v-model="promotion.discount_type" :items="['percentage', 'custom_price', 'item_free']"
                label="Discount Type" required />

            <!-- Discount Inputs -->
            <v-text-field v-if="promotion.discount_type === 'percentage'" v-model.number="promotion.discount"
                label="Discount (%)" type="number" min="0" max="100" />
            <v-text-field v-if="promotion.discount_type === 'custom_price'" v-model.number="promotion.discount_value"
                label="Custom Price" type="number" min="0" />
            <v-select v-if="promotion.discount_type === 'item_free'" v-model="promotion.free_product_id"
                :items="productOptions" item-text="name" item-value="id" label="Select Free Product" />

            <!-- Dates -->
            <v-text-field v-model="promotion.start_date" type="datetime-local" label="Start Date" />
            <v-text-field v-model="promotion.end_date" type="datetime-local" label="End Date" />

            <!-- Banner Image -->
            <div class="my-4">
                <v-file-input v-model="imageFile" label="Upload Image" accept="image/*" />
                <v-img v-if="promotion.image" :src="promotion.image" max-width="300" class="mt-2" />
            </div>

            <!-- Promotion Items -->
            <h3>Promotion Products</h3>
            <v-row dense>
                <v-col v-for="(item, index) in promotion.promotion_items" :key="item.product_id" cols="12" sm="6" md="4"
                    lg="3">
                    <v-card>
                        <v-img :src="item.product?.image_url" height="150" />
                        <v-card-title>{{ item.product?.name }}</v-card-title>
                        <v-card-actions>
                            <v-btn color="red" small @click="removePromotionItem(index)">Remove</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>

            <!-- Product Selection -->
            <div v-if="promotion.type !== 'single' || promotion.discount_type !== 'item_free'">
                <h3 class="mt-6">Add Products</h3>
                <v-data-table :headers="productHeaders" :items="filteredProducts" :search="productSearch" dense>
                    <template #item.image_url="{ item }">
                        <v-img :src="item.image_url || 'https://via.placeholder.com/100'" max-width="60"
                            max-height="60" />
                    </template>
                    <template #item.actions="{ item }">
                        <v-btn small color="green" @click="addPromotionItem(item)"
                            :disabled="promotion.promotion_items.some(p => p.product_id === item.id)">Add</v-btn>
                    </template>
                </v-data-table>
            </div>

            <!-- Submit -->
            <v-btn color="primary" class="mt-4" @click="createPromotion">Create Promotion</v-btn>
        </v-form>
    </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePromotionStore } from '@/stores/promotionStore'
import { useProductStore } from '@/stores/productStore'

const router = useRouter()
const promotionStore = usePromotionStore()
const productStore = useProductStore()

const promotion = ref<any>({
    promotion_items: [],
    type: 'single',
    discount_type: 'percentage',
    discount: 0,
    custom_price: null,
    free_product_id: null
})

const imageFile = ref<File | null>(null)
const productOptions = ref<any[]>([])
const productSearch = ref('')

const productHeaders = [
    { title: 'Image', value: 'image_url', align: 'center' },
    { title: 'Name', value: 'name' },
    { title: 'Price', value: 'price' },
    { title: 'Actions', value: 'actions', align: 'center' }
]

const filteredProducts = computed(() => productOptions.value)

onMounted(async () => {
    await productStore.fetchingProducts()
    productOptions.value = productStore.products
})

// Add / Remove promotion items
const addPromotionItem = (product: any) => {
    if (promotion.value.promotion_items.some(p => p.product_id === product.id)) return
    promotion.value.promotion_items.push({ product_id: product.id, product })
}
const removePromotionItem = (index: number) => promotion.value.promotion_items.splice(index, 1)

// Create Promotion
const createPromotion = async () => {
    if ((promotion.value.type === 'combo' || promotion.value.type === 'special_package') &&
        promotion.value.promotion_items.length === 0) {
        alert('Combo or Special Package must have at least 1 product!')
        return
    }

    try {
        const formData = new FormData()
        formData.append('name_english', promotion.value.name_english)
        formData.append('name_khmer', promotion.value.name_khmer)
        formData.append('detail_des', promotion.value.detail_des || '')
        formData.append('type', promotion.value.type)
        formData.append('discount_type', promotion.value.discount_type)

        // Set discount_value based on type
        let discountValue = 0
        if (promotion.value.discount_type === 'percentage') {
            discountValue = promotion.value.discount || 0
        } else if (promotion.value.discount_type === 'custom_price') {
            discountValue = promotion.value.discount_value || 0
        } else if (promotion.value.discount_type === 'item_free') {
            discountValue = 0
        }
        formData.append('discount_value', discountValue.toString())

        if (promotion.value.free_product_id) formData.append('free_product_id', promotion.value.free_product_id.toString())
        formData.append('start_date', promotion.value.start_date || '')
        formData.append('end_date', promotion.value.end_date || '')

        if (imageFile.value) formData.append('image', imageFile.value)

        promotion.value.promotion_items.forEach((p: any) => formData.append('product_ids[]', p.product_id))

        await promotionStore.addPromotion(formData)
        alert('Promotion created!')
        router.push('/Promotions')
    } catch (err) {
        console.error(err)
        alert('Failed to create promotion')
    }
}

</script>
