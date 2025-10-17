<template>
    <v-container fluid class="pa-6 bg-green-lighten-4">
        <!-- Header -->
        <div class="d-flex justify-space-between align-center mb-4">
            <h2 class="text-h5 font-weight-bold">Feedback List</h2>
            <v-btn color="primary" prepend-icon="mdi-refresh" @click="store.fetchFeedbacks">
                Refresh
            </v-btn>
        </div>

        <!-- Feedback Table -->
        <v-card class="elevation-1">
            <v-data-table :headers="headers" :items="filteredFeedbacks" :loading="store.loading" item-value="id"
                class="text-body-2">
                <!-- Images column -->
                <template #item.images="{ item }">
                    <v-row dense>
                        <v-col cols="4" v-for="(img, idx) in item.images" :key="idx">
                            <v-img :src="img" aspect-ratio="1" max-height="60" contain />
                        </v-col>
                    </v-row>
                </template>

                <!-- Rating -->
                <template #item.rating="{ item }">
                    <v-chip color="blue" text-color="white" small>{{ item.rating }}/5</v-chip>
                </template>

                <!-- Actions -->
                <template #item.actions="{ item }">
                    <v-btn color="primary" small @click="viewDetail(item)">
                        View Detail
                    </v-btn>
                </template>

                <!-- Table Footer Search -->
                <template #tfoot>
                    <tr>
                        <td>
                            <v-text-field v-model="searchTable" class="ma-9" density="compact"
                                placeholder="Search table" />
                        </td>
                        <td colspan="9"></td>
                    </tr>
                </template>
            </v-data-table>
        </v-card>



        <v-dialog v-model="dialog" max-width="1200px" max-height="1000px">
            <v-card>
                <v-card-title class="pb-2">
                    Feedback #{{ selectedFeedback?.id }} — Table {{ selectedFeedback?.table_id }}
                </v-card-title>

                <v-card-text>
                    <v-col cols="12">
                        <v-card color="#085C1D" class="pa-4">
                            <div class="d-flex flex-no-wrap justify-space-between align-center">
                                <!-- Left info -->
                                <div class="flex-grow-1 me-4">
                                    <v-card-title class="text-h6 text-white">
                                        {{ selectedFeedback?.customer?.name || 'Anonymous' }}
                                    </v-card-title>

                                    <v-card-subtitle class="text-white">
                                        Rating: {{ selectedFeedback?.rating }}/5
                                    </v-card-subtitle>

                                    <v-card-subtitle class="text-white mb-2">
                                        Comment: {{ selectedFeedback?.comment || '-' }}
                                    </v-card-subtitle>

                                    <div v-if="selectedFeedback?.ratings?.length">
                                        <v-chip v-for="r in selectedFeedback.ratings" :key="r.id" class="me-1 mb-1"
                                            color="white lighten-2" text-color="white" small>
                                            {{ r.type }}: {{ r.value }}/5
                                        </v-chip>
                                    </div>

                                    <v-card-actions class="mt-2">
                                        <v-btn text color="white" @click="dialog = false">
                                            Close
                                        </v-btn>
                                    </v-card-actions>
                                </div>


                                <v-avatar v-if="selectedFeedback?.images?.length" class="ma-3" rounded="0" size="125">
                                    <v-img :src="selectedFeedback.images[0]" alt="Feedback Image"></v-img>
                                </v-avatar>
                            </div>
                        </v-card>
                    </v-col>


                    <v-row dense class="mt-4" v-if="selectedFeedback?.images?.length > 1">
                        <v-col v-for="(img, idx) in selectedFeedback.images.slice(1)" :key="idx" cols="4">
                            <v-img :src="img" aspect-ratio="1" contain></v-img>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-dialog>

    </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useFeedbackStore } from '@/stores/feedbackStore'
import type { Feedback } from '@/types/feedback'

const store = useFeedbackStore()

// Search filter
const searchTable = ref('')

// Dialog
const dialog = ref(false)
const selectedFeedback = ref<Feedback | null>(null)

// Table headers
const headers = [
    { title: 'Table', key: 'table_id' },
    { title: 'Comment', key: 'comment' },
    { title: 'Rating', key: 'rating' },
    { title: 'Images', key: 'images', sortable: false },
    { title: 'Actions', key: 'actions', sortable: false }
]

// Filtered feedbacks
const filteredFeedbacks = computed(() => {
    return (store.feedbacks || []).filter(fb =>
        fb.table_id.toString().includes(searchTable.value.toLowerCase())
    )
})

// Fetch feedbacks on mount
onMounted(() => store.fetchFeedbacks())

// Open detail dialog
const viewDetail = (feedback: Feedback) => {
    selectedFeedback.value = feedback
    dialog.value = true
}
</script>

<style scoped>
.bg-green-lighten-4 {
    background-color: #d4f7d4;
}
</style>
