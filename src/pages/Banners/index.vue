<template>
    <v-container>
        <div class="d-flex justify-space-between align-center mb-4">
            <h2>Banner List</h2>
            <router-link to="/banners/create">
                <v-btn color="primary">Create New Banner</v-btn>
            </router-link>
        </div>

        <v-alert v-if="loading" type="info">Loading banners...</v-alert>

        <v-row v-else>
            <v-col cols="12">
                <draggable v-model="banners" item-key="id" @end="updateOrder">
                    <template #item="{ element }">
                        <v-card class="mb-3 d-flex align-center pa-3" outlined>
                            <v-img :src="element.image_url" max-width="150" height="80" class="rounded mr-4" />
                            <div class="flex-grow-1">
                                <p><strong>Type:</strong> {{ element.type }}</p>
                                <p>
                                    <strong>Status:</strong>
                                    <v-switch v-model="element.status" :true-value="1" :false-value="0"
                                        @change="toggleStatus(element)" />
                                </p>
                            </div>
                            <div class="d-flex gap-2">
                                <router-link :to="`/banners/edit/${element.id}`">
                                    <v-btn small color="warning">Edit</v-btn>
                                </router-link>
                                <v-btn small color="red" @click="deleteBanner(element.id)">Delete</v-btn>
                            </div>
                        </v-card>
                    </template>
                </draggable>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue'
import { useBannerStore } from '@/stores/bannerStore'
import draggable from 'vuedraggable'


export default defineComponent({
    components: { draggable },
    setup() {

        const bannerStore = useBannerStore()
        const banners = computed({
            get: () => bannerStore.banners,
            set: val => (bannerStore.banners = val)
        })

        const { fetchBanners, toggleStatus, deleteBanner, updateOrder, loading } = bannerStore

        onMounted(() => {
            fetchBanners()
        })

        return { banners, toggleStatus, deleteBanner, updateOrder, loading }
    }
})
</script>
c