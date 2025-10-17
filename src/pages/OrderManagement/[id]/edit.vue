<template>
    <v-container class="d-flex justify-center mt-8">
        <v-card class="pa-6" max-width="700" outlined elevation="4">
            <v-card-title class="justify-center">
                <h2>Order #{{ order?.id }}</h2>
            </v-card-title>

            <v-divider class="my-4"></v-divider>

            <!-- Status -->
            <div class="d-flex align-center justify-space-between mb-4">
                <div>
                    <strong>Status:</strong>
                    <v-chip :color="statusColor(order?.status)" dark>{{ order?.status }}</v-chip>
                </div>
                <v-div class="d-flex gap-2 align-center">
                    <v-select v-model="selectedStatus" :items="statuses" label="Update Status" dense outlined />
                    <v-btn color="success" @click="updateStatus">Update</v-btn>
                </v-div>
            </div>

            <!-- Items -->
            <h3 class="mt-6 mb-3">Items</h3>
            <v-divider class="mb-4"></v-divider>
            <v-list dense>
                <v-list-item v-for="item in order?.items" :key="item.id" class="d-flex align-center">
                    <v-list-item-avatar size="80" tile>
                        <v-img :src="item.product?.image_url || ''" />
                    </v-list-item-avatar>

                    <v-list-item-content>
                        <v-list-item-title class="font-weight-bold">
                            {{ item.product?.name }} x{{ item.quantity }}
                        </v-list-item-title>
                        <v-list-item-subtitle v-if="item.options?.length">
                            Customizations: {{item.options.map(o => o.name).join(', ')}}
                        </v-list-item-subtitle>
                        <v-list-item-subtitle>
                            Price: {{ formatPrice(item.price) }}
                        </v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
            </v-list>

            <!-- Special Note -->
            <div v-if="order?.special_note" class="mt-6">
                <strong>Special Note:</strong>
                <p class="ml-2">{{ order.special_note }}</p>
            </div>

            <!-- Total -->
            <v-divider class="my-4"></v-divider>
            <div class="d-flex justify-space-between font-weight-bold">
                <span>Total:</span>
                <span>{{ formatPrice(order?.total_price) }}</span>
            </div>
        </v-card>
    </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useOrderStore } from '@/stores/orderStore';
import type { Order, OrderStatus } from '@/types/order';

const route = useRoute();
const store = useOrderStore();

const order = ref<Order | null>(null);
const selectedStatus = ref<OrderStatus>('ordering');
const statuses: OrderStatus[] = ['ordering', 'submitted', 'pending', 'ready'];

onMounted(async () => {
    const id = Number(route.params.id);
    order.value = await store.getOrderById(id);
    if (order.value) selectedStatus.value = order.value.status;
});

// Update order status
async function updateStatus() {
    if (order.value) {
        await store.updateOrderStatus(order.value.id, selectedStatus.value);
        order.value.status = selectedStatus.value;
    }
}

// Format price
const formatPrice = (value: number | string | undefined) => {
    if (!value) return '$0.00';
    return `$${Number(value).toFixed(2)}`;
};

// Status color
const statusColor = (status: OrderStatus | undefined) => {
    switch (status) {
        case 'submitted': return 'blue';
        case 'pending': return 'orange';
        case 'ready': return 'green';
        case 'ordering': return 'purple';
        default: return 'grey';
    }
};
</script>

<style scoped>
.v-card {
    min-width: 500px;
}

.v-list-item {
    border-bottom: 1px solid #eee;
    padding-bottom: 8px;
    margin-bottom: 8px;
}

.v-list-item:last-child {
    border-bottom: none;
}
</style>
