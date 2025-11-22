<template>
  <div class="trending-items">
    <h3>Top 5 Trending Items</h3>

    <div v-if="!topItems.length">No sales data yet.</div>

    <div v-for="(item, index) in topItems" :key="item.id" class="trending-item">
      <div class="item-rank">#{{ index + 1 }}</div>

      <!-- Image -->
      <div class="item-image-wrapper">
        <v-img
          v-if="item.image_url"
          :src="item.image_url"
          class="item-image"
          contain
        />
        <span v-else>No Image</span>
      </div>

      <div class="item-info">
        <div class="item-name">{{ item.name }}</div>
        <div class="item-price">{{ formatPrice(item.price) }} - {{ item.category_names }}</div>
      </div>

      <div class="item-sales">
        <div class="sales-count">{{ item.sales }} Sold</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useProductStore } from '@/stores/productStore'

const storageURL = import.meta.env.VITE_API_BASE_URL_STORAGE || ''

interface Item {
  id: number
  name: string
  image_url: string | null
  price: number | string
  category_names: string
  sales: number
}

// Props
const props = defineProps<{ orders: any[] }>()

// Product store
const productStore = useProductStore()

// Fetch full product list before computing top items
onMounted(async () => {
  if (!productStore.products.length) {
    await productStore.fetchProducts()
  }
})

// Price formatting
const formatPrice = (price: number | string) => {
  return typeof price === 'number' ? `$${price.toFixed(2)}` : price
}

// Compute top 5 items by sales
const topItems = computed<Item[]>(() => {
  const itemMap: Record<number, Item> = {}

  props.orders.forEach(order => {
    order.items.forEach((i: any) => {
      const product = i.product
      if (!product) return

      // Image
      const imagePath = product.image_url || product.image || null
      const image_url = imagePath ? storageURL + imagePath : null

      // Use full product from store to get category names
      const fullProduct = productStore.products.find(p => p.id === product.id)
      let category_names = 'Unknown'
      if (fullProduct?.categories?.length) {
        category_names = fullProduct.categories
          .map(c => c.name_english || c.name_khmer)
          .join(', ')
      }

      if (!itemMap[product.id]) {
        itemMap[product.id] = {
          id: product.id,
          name: product.name,
          image_url,
          price: product.price,
          category_names,
          sales: i.quantity,
        }
      } else {
        itemMap[product.id].sales += i.quantity
      }
    })
  })

  return Object.values(itemMap)
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5)
})
</script>

<style scoped>
.trending-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.trending-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  border-bottom: 1px solid #eee;
}

.item-rank {
  font-weight: bold;
  width: 24px;
  text-align: center;
}

.item-image-wrapper {
  width: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.item-image {
  width: 100%;
  height: auto;
  max-height: 100px;
  object-fit: contain;
  border-radius: 4px;
}

.item-info {
  flex: 1;
}

.item-name {
  font-weight: bold;
}

.item-price {
  font-size: 0.9em;
  color: gray;
}

.item-sales {
  text-align: right;
  font-weight: bold;
}
</style>
