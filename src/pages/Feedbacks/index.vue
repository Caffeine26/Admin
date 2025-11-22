<template>
  <v-container fluid class="pa-6 bg-green-lighten-4">
   
    <feedback-table
      :period-options="periodOptions"
      v-model:selected-period="selectedPeriod"
      v-model:search-table="searchTable"
      :feedbacks="store.getFeedbacksByPeriod(selectedPeriod) || []"
      @view-detail="openDetail"
      @refresh="refreshData"
    />

    <feedback-detail-dialog
      v-model="dialog"
      :feedback="selectedFeedback"
      :get-table-number="getTableNumber"
    />
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useFeedbackStore } from '@/stores/feedbackStore.js'
import { useTableStore } from '@/stores/tableStore.js'
import FeedbackTable from '@/components/feedback/FeedbackTable.vue'
import FeedbackDetailDialog from '@/components/feedback/FeedbackDetailDialog.vue'
import type { Feedback } from '@/types/feedback.js'

const store = useFeedbackStore()
const tableStore = useTableStore()

const searchTable = ref('')
const selectedPeriod = ref('All')
const dialog = ref(false)
const selectedFeedback = ref<Feedback | null>(null)

const periodOptions = ['Today', 'Yesterday', 'This Week', 'This Month', 'All']

const getTableNumber = (tableId?: number) => {
  return tableStore.tables.find(t => t.id === tableId)?.table_number ?? '-'
}

const openDetail = (feedback: Feedback) => {
  selectedFeedback.value = feedback
  dialog.value = true
}

const refreshData = async () => {
  await Promise.all([store.fetchFeedbacks(), tableStore.fetchTables()])
}

onMounted(() => refreshData())
</script>

<style scoped>
.bg-green-lighten-4 {
  background-color: #d4f7d4;
}
</style>
