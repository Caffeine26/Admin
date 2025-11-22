<template>
  <v-container>
    <div class="d-flex justify-space-between align-center mb-4">
      <h2 class="m-0">Create Customization</h2>
      <v-btn color="grey" @click="router.push('/Customization')">Back</v-btn>
    </div>

    <!-- Search -->
    <v-text-field
      v-model="searchQuery"
      label="Search Products"
      prepend-inner-icon="mdi-magnify"
      outlined
      class="mb-4"
    />

    <!-- Tabs -->
    <v-tabs v-model="selectedTab" class="mb-4" grow>
      <v-tab value="menu">Menu</v-tab>
      <v-tab value="add_on">Add-On</v-tab>
      <v-tab value="modify">Modify</v-tab>
    </v-tabs>

    <!-- Product Table -->
    <v-data-table :headers="headers" :items="filteredProducts" item-value="id" class="elevation-2">
      <template #item.main="{ item }">
        <v-checkbox
          :model-value="selectedMainProduct?.id === item.id"
          @update:model-value="toggleMainProduct(item)"
        />
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
    <CustomizationPreview
      :main="selectedMainProduct"
      :add-ons="selectedAddOnList"
      :modifies="selectedModifyList"
    />

    <!-- Status & Submit -->
    <v-row class="mt-6 align-center">
      <v-col cols="12" md="3">
        <v-switch
          v-model="status"
          label="Active"
          inset
          color="green"
        />
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
import CustomizationPreview from '@/components/customizations/CustomizationBottomPanel.vue'

const router = useRouter()
const store = useProductCustomizationStore()

const products = ref<any[]>([])
const searchQuery = ref('')
const selectedMainProduct = ref<any | null>(null)
const selectedAddOnIds = ref<number[]>([])
const selectedModifyIds = ref<number[]>([])
const status = ref(true) // default active

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
    products.value = Array.isArray(res?.data?.data) ? res.data.data : res.data || []
  } catch (err) {
    console.error('Failed to fetch products:', err)
    products.value = []
  }
})

const filteredProducts = computed(() =>
  products.value
    .filter(p => p.type === selectedTab.value)
    .filter(p =>
      (p.name_english || p.name || '').toLowerCase().includes(searchQuery.value.toLowerCase())
    )
)

const selectedAddOnList = computed(() =>
  products.value.filter(p => selectedAddOnIds.value.includes(p.id))
)

const selectedModifyList = computed(() =>
  products.value.filter(p => selectedModifyIds.value.includes(p.id))
)

const toggleMainProduct = (item: any) => {
  selectedMainProduct.value = selectedMainProduct.value?.id === item.id ? null : item
}

const submit = async () => {
  if (!selectedMainProduct.value) {
    alert('Please select a main product!')
    return
  }

  const payload = {
    product_id: selectedMainProduct.value.id,
    add_on_ids: selectedAddOnList.value.map(p => p.id) || [],
    modify_ids: selectedModifyList.value.map(p => p.id) || [],
    status: status.value ? 1 : 0
  }

  try {
    await store.create(payload)
    alert('Customization created successfully!')
    router.push('/Customization')
  } catch (err) {
    console.error('Failed to create customization:', err)
    alert('Failed to create customization!')
  }
}
</script>
