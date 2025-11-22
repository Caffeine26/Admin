<template>
  <div>
    <div class="d-flex justify-space-between align-center mb-4">
      <h2 class="text-h5 font-weight-bold">Feedback List</h2>

      <div class="d-flex align-center gap-4">
        <v-select
          v-model="modelPeriod"
          :items="periodOptions"
          label="Period"
          density="compact"
          hide-details
          style="width: 180px"
        />

        <v-btn color="primary" prepend-icon="mdi-refresh" @click="$emit('refresh')">
          Refresh
        </v-btn>
      </div>
    </div>

    <v-card class="elevation-1">
      <v-data-table
        :headers="headers"
        :items="filteredItems"
        item-value="id"
        class="text-body-2"
      >
        <template #item.table_number_display="{ item }">
          {{ getTableNumber(item.table_id) }}
        </template>

        <template #item.images="{ item }">
  <div class="image-container">
    <v-img
      v-for="(img, idx) in item.images"
      :key="idx"
      :src="getImageUrl(img)"
      height="60"
      width="60"
      class="mr-2 rounded-lg elevation-3"
      cover
    />
  </div>
</template>

        <template #item.rating="{ item }">
          <v-chip color="blue" text-color="white" small>
            {{ item.rating }}/5
          </v-chip>
        </template>

        <template #item.actions="{ item }">
          <v-btn color="primary" small @click="$emit('view-detail', item)">
            View Detail
          </v-btn>
        </template>

        <template #tfoot>
          <tr>
            <td>
              <v-text-field
                v-model="modelSearch"
                class="ma-9"
                density="compact"
                placeholder="Search table"
              />
            </td>
            <td colspan="9"></td>
          </tr>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useTableStore } from '@/stores/tableStore.js'

const STORAGE_URL = import.meta.env.VITE_API_BASE_URL_STORAGE
const tableStore = useTableStore()

const props = defineProps({
  feedbacks: Array,
  periodOptions: Array,
  selectedPeriod: String,
  searchTable: String,
})

const emit = defineEmits(['view-detail', 'refresh', 'update:selectedPeriod', 'update:searchTable'])

const modelPeriod = computed({
  get: () => props.selectedPeriod,
  set: val => emit('update:selectedPeriod', val)
})


const modelSearch = computed({
  get: () => props.searchTable,
  set: val => emit('update:searchTable', val)
})


const getTableNumber = (tableId) => {
  return tableStore.tables.find(t => t.id === tableId)?.table_number ?? '-'
}


const getImageUrl = (path) => {
  if (!path) return ""
  if (path.startsWith("http")) return path
  return STORAGE_URL + path.replace(/^\/storage\//, "")
}

const filteredItems = computed(() => {
  return (props.feedbacks || []).filter(fb =>
    getTableNumber(fb.table_id).toString().includes(modelSearch.value)
  )
})

const headers = [
  { title: 'Table Number', key: 'table_number_display' },
  { title: 'Comment', key: 'comment' },
  { title: 'Rating', key: 'rating' },
  { title: 'Images', key: 'images', sortable: false },
  { title: 'Actions', key: 'actions', sortable: false }
]
</script>
<style scoped>
.image-container {
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 10px 0;
}

.v-data-table td {
  height: auto !important;
  padding-top: 12px !important;
  padding-bottom: 12px !important;
}

</style>