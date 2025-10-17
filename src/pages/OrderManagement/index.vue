<template>
    <v-container>
        <div class="d-flex justify-space-between align-center mb-6">
            <h1>Order Management</h1>

            <div class="d-flex gap-3">
                <v-btn color="success" prepend-icon="mdi-plus" rounded="lg" elevation="2" @click="goToCreate">
                    New Order
                </v-btn>

                <v-btn color="primary" prepend-icon="mdi-table" rounded="lg" elevation="2" @click="goToTable">
                    View by Table & Status
                </v-btn>
            </div>
        </div>

        <v-row>

            <v-col cols="12" v-if="orderStore.loading">
                <v-skeleton-loader type="card" class="mb-3" v-for="n in 3" :key="n" />
            </v-col>

            <v-col cols="12" v-if="orderStore.error">
                <v-alert type="error">{{ orderStore.error }}</v-alert>
            </v-col>

            <v-col cols="12" v-if="!orderStore.loading && orderStore.orders.length === 0">
                <v-alert type="info">No orders found.</v-alert>
            </v-col>


            <v-col cols="12" md="6" lg="4" v-for="order in sortedOrders" :key="order.id">
                <v-card outlined>
                    <v-card-title class="d-flex justify-space-between align-center">
                        <div>
                            <div class="subtitle-1 font-weight-bold">#{{ order.id }} — Table {{ order.table_id }}</div>
                            <div class="caption">Total: ${{ formatPrice(order.total_price) }}</div>
                        </div>

                        <div class="d-flex align-center gap-2">
                            <v-chip :color="getStatusColor(order.status)" text-color="white" small>
                                {{ formatStatus(order.status) }}
                            </v-chip>

                            <!-- Expand/collapse button -->
                            <v-btn icon small @click="toggleExpand(order.id)">
                                <v-icon>{{ expandedOrders.includes(order.id) ? 'mdi-minus' : 'mdi-plus' }}</v-icon>
                            </v-btn>
                        </div>
                    </v-card-title>

                    <!-- Expandable content -->
                    <v-expand-transition>
                        <div v-show="expandedOrders.includes(order.id)">
                            <v-card-text>
                                <div class="mb-2"><strong>Special note:</strong> {{ order.special_note || '-' }}</div>

                                <div>
                                    <strong>Items:</strong>
                                    <v-list dense>
                                        <v-list-item v-for="item in order.items || []" :key="item.id">
                                            <v-list-item-content>
                                                <v-list-item-title>
                                                    {{ item.product?.name || 'Unknown Product' }} — x{{ item.quantity }}
                                                    (${{ formatPrice(item.price) }})
                                                </v-list-item-title>
                                                <v-list-item-subtitle v-if="item.note">{{ item.note
                                                    }}</v-list-item-subtitle>
                                            </v-list-item-content>
                                        </v-list-item>

                                        <v-list-item v-if="!(order.items || []).length">
                                            <v-list-item-content>No items in this order</v-list-item-content>
                                        </v-list-item>
                                    </v-list>
                                </div>
                            </v-card-text>

                            <v-card-actions>
                                <template v-if="order.status === 'ordering'">
                                    <v-btn text small disabled>In Cart</v-btn>
                                </template>

                                <template v-else-if="order.status === 'submitted'">
                                    <v-btn color="success" small @click="accept(order.id)">Accept</v-btn>
                                    <v-btn color="error" small @click="reject(order.id)">Reject</v-btn>
                                </template>

                                <template v-else-if="order.status === 'pending'">
                                    <v-btn color="primary" small @click="markReady(order.id)">Mark Ready</v-btn>
                                </template>

                                <template v-else>
                                    <v-btn text small disabled>Completed</v-btn>
                                </template>

                                <v-spacer />
                                <v-btn text small @click="goToDetail(order.id)">See detail</v-btn>
                            </v-card-actions>
                        </div>
                    </v-expand-transition>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useOrderStore } from '@/stores/orderStore';
import type { OrderStatus } from '@/types/order';

const orderStore = useOrderStore();
const router = useRouter();

// Track expanded orders
const expandedOrders = ref<number[]>([]);
const toggleExpand = (id: number) => {
    if (expandedOrders.value.includes(id)) {
        expandedOrders.value = expandedOrders.value.filter(x => x !== id);
    } else {
        expandedOrders.value.push(id);
    }
};

// Fetch orders on mount
onMounted(() => orderStore.fetchOrders());

// Computed: most recent orders on top
const sortedOrders = computed(() => {
    return [...orderStore.orders].sort((a, b) => b.id - a.id);
});

// Navigation
const goToCreate = () => router.push('/OrderManagement/create');
const goToTable = () => router.push('/OrderManagement/table');
const goToDetail = (id: number) => router.push(`/OrderManagement/${id}/edit`);

// Helpers
const formatPrice = (p: number | string) => Number(p).toFixed(2);
const formatStatus = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const getStatusColor = (status: string) => {
    switch (status) {
        case 'ordering': return 'grey';
        case 'submitted': return 'orange';
        case 'pending': return 'blue';
        case 'ready': return 'green';
        default: return 'grey';
    }
};

// Actions
const accept = async (id: number) => await orderStore.updateOrderStatus(id, 'pending' as OrderStatus);
const reject = async (id: number) => {
    if (!confirm('Reject and remove this order?')) return;
    await orderStore.deleteOrder(id);
};
const markReady = async (id: number) => await orderStore.updateOrderStatus(id, 'ready' as OrderStatus);
</script>
