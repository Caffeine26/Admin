<template>
  <TrendingItems :orders="orderStore.orders" />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useOrderStore } from '@/stores/orderStore.js'
import TrendingItems from '@/components/charts/Trend.vue'

const orderStore = useOrderStore()

onMounted(async () => {
  await orderStore.fetchOrders()
})
</script>
