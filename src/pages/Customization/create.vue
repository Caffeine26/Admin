<template>
    <v-container>
        <div class="d-flex justify-space-between align-center mb-4">
            <h2 class="m-0">Create Customization</h2>
            <v-btn color="grey" @click="router.push('/Customization')">Back</v-btn>
        </div>

        <!--  Search -->
        <v-text-field v-model="searchQuery" label="Search Products" prepend-inner-icon="mdi-magnify" outlined
            class="mb-4" />

        <!--  Tabs for product type -->
        <v-tabs v-model="selectedTab" class="mb-4" grow>
            <v-tab value="menu">Menu</v-tab>
            <v-tab value="add_on">Add-On</v-tab>
            <v-tab value="modify">Modify</v-tab>
        </v-tabs>

        <!--  Product Table -->
        <v-data-table :headers="headers" :items="filteredProducts" item-value="id" class="elevation-2">
            <!--  Main -->
            <template #item.main="{ item }">
                <v-checkbox :model-value="selectedMainProduct?.id === item.id"
                    @update:model-value="toggleMainProduct(item)" />
            </template>

            <!--Add-on -->
            <template #item.add_on="{ item }">
                <v-checkbox v-model="selectedAddOnIds" :value="item.id" />
            </template>

            <!-- Modify -->
            <template #item.modify="{ item }">
                <v-checkbox v-model="selectedModifyIds" :value="item.id" />
            </template>

            <!--  Image -->
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
                <v-btn color="primary" @click="submit">Submit</v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProductCustomizationStore } from '@/stores/customizationStore'
import productService from '@/services/productService'

const router = useRouter()
const store = useProductCustomizationStore()


const products = ref<any[]>([])
const searchQuery = ref('')
const selectedMainProduct = ref<any | null>(null)
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

onMounted(async () => {
    try {
        const res = await productService.getAll()
        if (Array.isArray(res?.data?.data)) products.value = res.data.data
        else if (Array.isArray(res.data)) products.value = res.data
        else products.value = []
    } catch (err) {
        console.error('Failed to fetch products:', err)
        products.value = []
    }
})

//  Filtered products by search + tab
const filteredProducts = computed(() =>
    products.value
        .filter(p => p.type === selectedTab.value)
        .filter(p =>
            (p.name_english || p.name || '')
                .toLowerCase()
                .includes(searchQuery.value.toLowerCase())
        )
)

//  Computed lists for submission
const selectedMenuList = computed(() => selectedMainProduct.value ? [selectedMainProduct.value] : [])
const selectedAddOnList = computed(() =>
    products.value.filter(p => selectedAddOnIds.value.includes(p.id))
)
const selectedModifyList = computed(() =>
    products.value.filter(p => selectedModifyIds.value.includes(p.id))
)

//  Toggle main product
const toggleMainProduct = (item: any) => {
    selectedMainProduct.value = selectedMainProduct.value?.id === item.id ? null : item
}


//  Submit payload
const submit = async () => {
    if (!selectedMainProduct.value) {
        alert('Please select a main product!')
        return
    }

    // Filter add-on IDs: include only menu or add_on products
    const filteredAddOnIds = selectedAddOnList.value
        .filter(p => p.type === 'add_on' || p.type === 'menu')
        .map(p => p.id)

    // Filter modify IDs: only type modify allowed
    const filteredModifyIds = selectedModifyList.value
        .filter(p => p.type === 'modify')
        .map(p => p.id)

    const payload = {
        product_id: selectedMainProduct.value.id,
        add_on_ids: filteredAddOnIds,
        modify_ids: filteredModifyIds,
        status: status.value
    }

    console.log(' Submitting payload:', payload)

    try {
        await store.create(payload)
        alert('Customization created successfully!')
        router.push('/Customization')
    } catch (err) {
        console.error(' Failed to create customization:', err)
        alert('Failed to create customization!')
    }
}

</script>
