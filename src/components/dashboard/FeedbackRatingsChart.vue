<template>
  <div>
    <h3>Feedback Ratings by Table</h3>

    <!-- Table selection -->
    <label for="table-select">Select Table:</label>
    <select id="table-select" v-model="selectedTableId">
      <option v-for="table in tableStore.tables" :key="table.id" :value="table.id">
        Table {{ table.table_number }}
      </option>
    </select>

    <!-- Loading -->
    <div v-if="feedbackStore.loading || tableStore.loading">Loading...</div>

    <!-- Chart -->
    <PieChart v-else-if="chartData.length" :seriesData="chartData" />
    <div v-else>No ratings for selected table.</div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useFeedbackStore } from '@/stores/feedbackStore.js'
import { useTableStore } from '@/stores/tableStore.js'
import PieChart from '@/components/charts/PieChart.vue'

const feedbackStore = useFeedbackStore()
const tableStore = useTableStore()

const selectedTableId = ref<number | null>(null)

onMounted(async () => {
  await Promise.all([feedbackStore.fetchFeedbacks(), tableStore.fetchTables()])
  if (tableStore.tables.length) selectedTableId.value = tableStore.tables[0].id
})

interface ChartItem {
  label: string
  value: number
}

const chartData = computed<ChartItem[]>(() => {
  if (!selectedTableId.value) return []

  const tableFeedbacks = feedbackStore.feedbacks.filter(
    fb => fb.table_id === selectedTableId.value
  )
  if (!tableFeedbacks.length) return []

  const ratingSum: Record<string, number> = { Taste: 0, Decoration: 0, Service: 0 }
  const ratingCount: Record<string, number> = { Taste: 0, Decoration: 0, Service: 0 }

  tableFeedbacks.forEach(fb => {
    fb.ratings.forEach(r => {
      const type = r.type.charAt(0).toUpperCase() + r.type.slice(1)
      if (ratingSum[type] !== undefined) {
        ratingSum[type] += r.value
        ratingCount[type] += 1
      }
    })
  })

  return Object.keys(ratingSum).map(type => ({
    label: type,
    value: parseFloat((ratingSum[type] / ratingCount[type]).toFixed(2)),
  }))
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
