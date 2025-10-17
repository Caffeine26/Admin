<template>
  <v-container fluid class="pa-6">
    <!-- Summary Cards -->
    <v-row dense class="mb-6">
      <v-col cols="12" sm="6" md="3" v-for="card in summaryCards" :key="card.title">
        <v-card :color="card.color" dark class="pa-4">
          <div class="text-h6">{{ card.title }}</div>
          <div class="text-h4 font-weight-bold mt-2">{{ card.value }}</div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Recent Feedback -->
    <v-row dense class="mb-6">
      <v-col cols="12">
        <v-card>
          <v-card-title>Recent Feedback</v-card-title>
          <v-data-table :headers="feedbackHeaders" :items="recentFeedbacks" item-value="id" class="text-body-2">

            <!-- Customer Name -->
            <template #item["customer.name"]="{ item }">
              {{ item.customer?.name || 'Anonymous' }}
            </template>

            <!-- Images -->
            <template #item.images="{ item }">
              <v-row dense>
                <v-col cols="4" v-for="(img, idx) in item.images" :key="idx">
                  <v-img :src="img" aspect-ratio="1" max-height="60" contain></v-img>
                </v-col>
              </v-row>
            </template>

            <!-- Actions -->
            <template #item.actions="{ item }">
              <v-btn small color="primary" @click="viewFeedbackDetail(item)">View Detail</v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <!-- Feedback Detail Dialog -->
    <v-dialog v-model="feedbackDialog" max-width="1000px">
      <v-card v-if="selectedFeedback">
        <v-card-title class="pb-2">
          Feedback #{{ selectedFeedback.id }} — Table {{ selectedFeedback.table_id }}
        </v-card-title>

        <v-card-text>
          <v-card color="#085C1D" class="pa-4" elevation="2">
            <div class="d-flex flex-no-wrap justify-space-between align-center">
              <!-- Left Info -->
              <div class="flex-grow-1 me-4">
                <v-card-title class="text-h6 text-white">
                  {{ selectedFeedback.customer?.name || 'Anonymous' }}
                </v-card-title>

                <v-card-subtitle class="text-white mb-1 bold">
                  Rating: {{ selectedFeedback.rating }}/5
                </v-card-subtitle>

                <v-card-subtitle class="text-white mb-3">
                  Comment: {{ selectedFeedback.comment || '-' }}
                </v-card-subtitle>

                <div v-if="selectedFeedback.ratings?.length">
                  <v-chip v-for="r in selectedFeedback.ratings" :key="r.id" class="me-1 mb-1" color="white lighten-2"
                    text-color="black" small>
                    {{ r.type }}: {{ r.value }}/5
                  </v-chip>
                </div>

                <!-- Close Button -->
                <v-card-actions class="mt-3">
                  <v-btn text color="white" @click="feedbackDialog = false">Close</v-btn>
                </v-card-actions>
              </div>

              <!-- Right Main Image -->
              <div v-if="selectedFeedback.images?.length" class="ma-3">
                <v-img :src="selectedFeedback.images[0]" height="125" width="125" contain></v-img>
              </div>
            </div>
          </v-card>

          <!-- Additional Images -->
          <v-row dense class="mt-4" v-if="selectedFeedback.images?.length > 1">
            <v-col v-for="(img, idx) in selectedFeedback.images.slice(1)" :key="idx" cols="4">
              <v-img :src="img" aspect-ratio="1" contain class="elevation-1"></v-img>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useOrderStore } from '@/stores/orderStore'
import { useTableStore } from '@/stores/tableStore'
import { useFeedbackStore } from '@/stores/feedbackStore'
import type { Feedback } from '@/types/feedback'

// Stores
const orderStore = useOrderStore()
const tableStore = useTableStore()
const feedbackStore = useFeedbackStore()

// Dialog
const feedbackDialog = ref(false)
const selectedFeedback = ref<Feedback | null>(null)

// Summary Cards
const summaryCards = computed(() => [
  { title: 'Total Orders', value: orderStore.orders.length, color: 'blue' },
  { title: 'Completed Orders', value: orderStore.orders.filter(o => o.status === 'ready').length, color: 'green' },
  { title: 'Total Tables', value: tableStore.tables.length, color: 'pink' },
  { title: 'Total Feedbacks', value: feedbackStore.feedbacks.length, color: 'teal' }
])

// Recent Feedback Table
const feedbackHeaders = [
  { title: 'Table', key: 'table_id' },
  { title: 'Customer', key: 'customer.name' },
  { title: 'Comment', key: 'comment' },
  { title: 'Rating', key: 'rating' },
  { title: 'Images', key: 'images', sortable: false },
  { title: 'Actions', key: 'actions', sortable: false }
]
const recentFeedbacks = computed(() => [...feedbackStore.feedbacks].reverse().slice(0, 5))

// Lifecycle
onMounted(() => {
  orderStore.fetchOrders()
  tableStore.fetchTables()
  feedbackStore.fetchFeedbacks()
})

// Feedback Detail
const viewFeedbackDetail = (fb: Feedback) => {
  selectedFeedback.value = fb
  feedbackDialog.value = true
}
</script>

<style scoped>
.bg-green-lighten-4 {
  background-color: #d4f7d4;
}
</style>
