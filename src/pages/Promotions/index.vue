<template>
    <v-container fluid class="pa-6 bg-green-lighten-4">
        <!-- Header -->
        <div class="d-flex justify-space-between align-center mb-4">
            <h2 class="text-h5 font-weight-bold">Promotions</h2>
            <v-btn color="primary" prepend-icon="mdi-plus" @click="toCreate">
                New Promotion
            </v-btn>
        </div>

        <!-- Promotions Data Table -->
        <v-card class="elevation-1">
            <v-data-table :headers="headers" :items="filteredPromotions" :loading="promotionStore.loading"
                item-value="id" class="text-body-2" loading-text="Loading promotions...">
                <!-- Image -->
                <template #item.image="{ item }">
                    <v-img v-if="item.image" :src="item.image" max-width="80" max-height="80" class="rounded" />
                    <span v-else>No Image</span>
                </template>

                <!-- Discount -->
                <template #item.discount="{ item }">
                    <span v-if="item.discount_type === 'percentage'">
                        {{ item.discount_value }}%
                    </span>
                    <span v-else-if="item.discount_type === 'custom_price'">
                        ${{ item.discount_value }}
                    </span>
                    <span v-else-if="item.discount_type === 'item_free'">
                        Free Item
                    </span>
                    <span v-else>-</span>
                </template>

                <!-- Promotion Type -->
                <template #item.type="{ item }">
                    <span v-if="item.type === 'single'">Single</span>
                    <span v-else-if="item.type === 'combo'">Combo</span>
                    <span v-else>-</span>
                </template>

                <!-- Start Date -->
                <template #item.start_date="{ item }">
                    {{ formatDate(item.start_date) }}
                </template>

                <!-- End Date -->
                <template #item.end_date="{ item }">
                    {{ formatDate(item.end_date) }}
                </template>

                <!-- Actions -->
                <template #item.actions="{ item }">
                    <v-btn icon color="blue" size="small" @click="toEdit(item.id)">
                        <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                </template>

                <!-- Footer Search & Filter -->
                <template #tfoot>
                    <tr>
                        <td colspan="4">
                            <v-text-field v-model="searchName" class="ma-2" density="compact"
                                placeholder="Search name..." hide-details />
                        </td>
                        <td colspan="2">
                            <v-select v-model="filterType" :items="['all', 'single', 'combo']" class="ma-2"
                                density="compact" placeholder="Filter by type" hide-details />
                        </td>
                        <td colspan="3"></td>
                    </tr>
                </template>
            </v-data-table>
        </v-card>
    </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { usePromotionStore } from "@/stores/promotionStore";

const router = useRouter();
const promotionStore = usePromotionStore();

// Table headers
const headers = [
    { title: "ID", key: "id" },
    { title: "Image", key: "image" },
    { title: "Name (EN)", key: "name_english" },
    { title: "Name (KH)", key: "name_khmer" },
    { title: "Discount", key: "discount" },
    { title: "Promotion Type", key: "type" },
    { title: "Start Date", key: "start_date" },
    { title: "End Date", key: "end_date" },
    { title: "Actions", key: "actions", sortable: false },
];

// Search & filter state
const searchName = ref("");
const filterType = ref("all");

// Filtered promotions
const filteredPromotions = computed(() => {
    return promotionStore.promotions.filter((p) => {
        const search = searchName.value.toLowerCase().trim();
        const matchesName =
            p.name_english.toLowerCase().includes(search) ||
            (p.name_khmer && p.name_khmer.toLowerCase().includes(search));
        const matchesType = filterType.value === "all" || p.type === filterType.value;
        return matchesName && matchesType;
    });
});



// Format date to show only date
function formatDate(date: string) {
    if (!date) return "-";
    return new Date(date).toLocaleDateString();
}

// Navigation
const toCreate = () => router.push("/Promotions/create");
const toEdit = (id: number) => router.push(`/Promotions/${id}/edit`);

// Fetch promotions on mount
onMounted(() => {
    promotionStore.fetchPromotions();
});
</script>

<style scoped>

</style>
