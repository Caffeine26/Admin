<template>
  <div>
    <h3>Order Count Report</h3>

    <!-- Period Selection -->
    <label for="period-select">Select Period:</label>
    <select id="period-select" v-model="selectedPeriod">
      <option value="daily">Daily</option>
      <option value="weekly">Weekly</option>
      <option value="monthly">Monthly</option>
      <option value="yearly">Yearly</option>
    </select>

    <!-- Bar Chart -->
    <BarChart :data="chartData" title="Orders Report" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useOrderStore } from '@/stores/orderStore.js'
import BarChart from '@/components/charts/BarChart.vue'

const orderStore = useOrderStore()
const selectedPeriod = ref<'daily' | 'weekly' | 'monthly' | 'yearly'>('daily')

// Fetch orders on mount
onMounted(async () => {
  await orderStore.fetchOrders()
})

// ------------------
// Labels
// ------------------
const shifts = [
  { name: 'Breakfast', start: 6, end: 11 },
  { name: 'Lunch', start: 11, end: 16 },
  { name: 'Dinner', start: 16, end: 22 },
]
const dayLabels = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const monthLabels = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

// ------------------
// Compute Chart Data
// ------------------
const chartData = computed(() => {
  const orders = orderStore.orders
  const data: Record<string, number> = {}

  if (selectedPeriod.value === 'daily') {
    shifts.forEach(s => data[s.name] = 0)
    orders.forEach(o => {
      const hour = new Date(o.order_time).getHours()
      const shift = shifts.find(s => hour >= s.start && hour < s.end)
      if (shift) data[shift.name] += 1
    })
  } 
  else if (selectedPeriod.value === 'weekly') {
    dayLabels.forEach(d => data[d] = 0)
    orders.forEach(o => {
      const day = new Date(o.order_time).getDay()
      data[dayLabels[day]] += 1
    })
  } 
  else if (selectedPeriod.value === 'monthly') {
    for (let i = 1; i <= 5; i++) data[`Week ${i}`] = 0
    orders.forEach(o => {
      const date = new Date(o.order_time)
      const weekNumber = Math.ceil(date.getDate() / 7)
      data[`Week ${weekNumber}`] += 1
    })
  } 
  else if (selectedPeriod.value === 'yearly') {
    monthLabels.forEach(m => data[m] = 0)
    orders.forEach(o => {
      const month = new Date(o.order_time).getMonth()
      data[monthLabels[month]] += 1
    })
  }

  
  return Object.keys(data).map(key => ({ label: key, value: data[key] }))
})
</script>

<style scoped>
h3 {
  margin-bottom: 16px;
}
select {
  margin-bottom: 16px;
  padding: 4px 8px;
}
</style>
