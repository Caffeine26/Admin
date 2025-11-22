<template>
  <v-container fluid class="pa-6">

    <!-- Summary Cards Section -->
    <section class="mb-8">
      <SummaryCards :cards="summaryCards" />
    </section>

    <!-- Charts Section -->
    <section class="mb-8">
      <v-row dense>
        <v-col cols="12" md="6" class="mb-4">
          <FeedbackRatingsChart />
        </v-col>
        <v-col cols="12" md="6">
          <OrderCountChart />
        </v-col>
      </v-row>
    </section>

    <!-- Trending Items Section -->
    <section class="mb-8">
      <TrendingItems :orders="orderStore.orders" />
    </section>

  
    <section class="mb-8">
      <FeedbackTable
        :period-options="periodOptions"
        v-model:selected-period="selectedPeriod"
        v-model:search-table="searchTable"
        :feedbacks="recentFeedbacks"
        :getTableNumber="getTableNumber"
        @view-detail="viewFeedbackDetail"
        @refresh="refreshData"
      />
    </section>

    <FeedbackDetailDialog
      v-model="feedbackDialog"
      :feedback="selectedFeedback"
      :get-table-number="getTableNumber"
    />
    
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useOrderStore } from '@/stores/orderStore'
import { useProductStore } from '@/stores/productStore'
import { useTableStore } from '@/stores/tableStore'
import { useFeedbackStore } from '@/stores/feedbackStore'

import SummaryCards from '@/components/dashboard/SummaryCards.vue'
import FeedbackRatingsChart from '@/components/dashboard/FeedbackRatingsChart.vue'
import OrderCountChart from '@/components/dashboard/OrderCountChart.vue'
import FeedbackTable from '@/components/feedback/FeedbackTable.vue'
import FeedbackDetailDialog from '@/components/feedback/FeedbackDetailDialog.vue'
import TrendingItems from '@/components/charts/Trend.vue'
import type { Feedback } from '@/types/feedback'

// Stores
const orderStore = useOrderStore()
const productStore = useProductStore()
const tableStore = useTableStore()
const feedbackStore = useFeedbackStore()

// Dialog
const feedbackDialog = ref(false)
const selectedFeedback = ref<Feedback | null>(null)

// Filter & period
const selectedPeriod = ref('All')
const searchTable = ref('')
const periodOptions = ['Today', 'Yesterday', 'This Week', 'This Month', 'All']

// Fetch all data on mounted
onMounted(async () => {
  await Promise.all([
    productStore.fetchingProducts(),
    orderStore.fetchOrders(),
    tableStore.fetchTables(),
    feedbackStore.fetchFeedbacks()
  ])
})

// Summary Cards
const summaryCards = computed(() => [
  { title: 'Total Orders', value: orderStore.orders.length, color: 'blue' },
  { title: 'Completed Orders', value: orderStore.orders.filter(o => o.status === 'ready').length, color: 'green' },
  { title: 'Total Tables', value: tableStore.tables.length, color: 'pink' },
  { title: 'Total Feedbacks', value: feedbackStore.feedbacks.length, color: 'teal' }
])

// Helper for table number
const getTableNumber = (tableId?: number) =>
  tableStore.tables.find(t => t.id === tableId)?.table_number ?? '-'

// Computed recent feedbacks (reactive)
const recentFeedbacks = computed(() =>
  [...feedbackStore.feedbacks].reverse().slice(0, 5)
)

// Open feedback detail
const viewFeedbackDetail = (feedback: Feedback) => {
  selectedFeedback.value = feedback
  feedbackDialog.value = true
}

// Refresh table manually
const refreshData = async () => {
  await Promise.all([feedbackStore.fetchFeedbacks(), tableStore.fetchTables()])
}
</script>

<style scoped>
section {
  padding: 20px 0; /* vertical padding between sections */
  border-bottom: 1px solid #e0e0e0; /* subtle separation line */
}
section:last-of-type {
  border-bottom: none;
}
</style>
