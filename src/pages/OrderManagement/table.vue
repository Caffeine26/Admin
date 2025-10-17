<template>
    <v-container>
        <div class="d-flex justify-space-between align-center mb-6">
            <h1>Orders by Table & Status</h1>
            <v-btn color="secondary" prepend-icon="mdi-arrow-left" @click="back">
                Back to Orders
            </v-btn>
        </div>

        <!-- Status Tabs -->
        <v-tabs v-model="tab" background-color="primary" dark grow>
            <v-tab value="submitted">Submitted</v-tab>
            <v-tab value="pending">Pending</v-tab>
            <v-tab value="ready">Ready</v-tab>
            <v-tab value="completed">Completed</v-tab>
        </v-tabs>

        <!-- Search & Filter -->
        <v-text-field v-model="search" label="Search by Table ID or Special Note" prepend-inner-icon="mdi-magnify"
            class="my-4" outlined dense clearable />

        <!-- Orders Table -->
        <v-data-table :items="filteredOrders(tab)" :headers="headers" item-key="id" class="elevation-1" dense>
            <template #item.status="{ item }">
                <v-chip :color="statusColor(item.status)" dark small>
                    {{ item.status }}
                </v-chip>
            </template>

            <template #item.items="{ item }">
                <div>
                    <span v-for="(i, idx) in item.items" :key="idx">
                        {{ i.product.name }} x{{ i.quantity }}
                        <span v-if="i.options?.length">({{i.options.map(o => o.name).join(', ')}})</span>
                    </span>
                </div>
            </template>

            <template #item.actions="{ item }">
                <v-btn color="primary" text small @click="goToEdit(item.id)">
                    See Detail
                </v-btn>
            </template>
        </v-data-table>
    </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useOrderStore } from '@/stores/orderStore';

const router = useRouter();
const orderStore = useOrderStore();

const tab = ref('submitted');
const search = ref('');

const headers = [
    { title: 'Table ID', key: 'table_id' },
    { title: 'Status', key: 'status' },
    { title: 'Total Price', key: 'total_price' },
    { title: 'Special Note', key: 'special_note' },
    { title: 'Items', key: 'items' },
    { title: 'Actions', key: 'actions', sortable: false },
];

const back = () => router.push('/OrderManagement');

const goToEdit = (orderId: number) => {
    router.push(`/OrderManagement/${orderId}/edit`);
};

onMounted(() => {
    orderStore.fetchOrders();
});

// Filter orders by tab and search query
const filteredOrders = (status: string) => {
    return orderStore.orders
        .filter(o => o.status === status)
        .filter(o =>
            o.table_id.toString().includes(search.value) ||
            (o.special_note && o.special_note.toLowerCase().includes(search.value.toLowerCase()))
        );
};

// Status colors for chips
const statusColor = (status: string) => {
    switch (status) {
        case 'submitted': return 'blue';
        case 'pending': return 'orange';
        case 'ready': return 'green';
        case 'completed': return 'grey';
        default: return 'primary';
    }
};
</script>

<style scoped>
.v-data-table {
    font-size: 14px;
}

.v-chip {
    text-transform: capitalize;
}
</style>
