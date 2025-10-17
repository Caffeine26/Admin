<template>
    <v-container>
        <h1 class="mb-6">Order Management</h1>

        <v-row>
            <v-col cols="12" v-if="orderStore.loading">
                <v-skeleton-loader type="list-item-two-line" />
            </v-col>

            <v-col cols="12" v-if="orderStore.error">
                <v-alert type="error">{{ orderStore.error }}</v-alert>
            </v-col>

            <v-col cols="12" v-if="!orderStore.loading && orderStore.orders.length === 0">
                No orders found.
            </v-col>

            <v-col cols="12" md="6" lg="4" v-for="order in orderStore.orders" :key="order.id">
                <v-card outlined>
                    <v-card-title class="d-flex justify-space-between align-center">
                        <div>
                            <div class="subtitle-1 font-weight-bold">#{{ order.id }} — Table {{ order.table_id }}</div>
                            <div class="caption">Total: ${{ order.total_price }}</div>
                        </div>

                        <div class="text-right">
                            <v-chip :color="getStatusColor(order.status)" text-color="white" small>
                                {{ formatStatus(order.status) }}
                            </v-chip>
                            <!-- <div class="caption mt-1">{{ order.order_time ? formatTime(order.order_time) : '' }}</div> -->
                        </div>
                    </v-card-title>

                    <v-card-text>
                        <div class="mb-2"><strong>Special note:</strong> {{ order.special_note || '-' }}</div>

                        <div>
                            <strong>Items</strong>
                            <v-list dense>
                                <v-list-item v-for="item in order.items || []" :key="item.id">
                                    <v-list-item-content>
                                        <v-list-item-title class="text-body-2">
                                            {{ item.product?.name || 'Unknown Product' }}
                                            <span class="grey--text text--darken-1">— x{{ item.quantity }}</span>
                                            <span class="grey--text text--darken-1">({{ item.price }})</span>
                                        </v-list-item-title>
                                        <v-list-item-subtitle v-if="item.note">{{ item.note }}</v-list-item-subtitle>
                                    </v-list-item-content>
                                </v-list-item>

                                <v-list-item v-if="!(order.items || []).length">
                                    <v-list-item-content>No items in this order</v-list-item-content>
                                </v-list-item>
                            </v-list>
                        </div>
                    </v-card-text>

                    <v-card-actions>
                        <!-- LOCAL CART: status === 'ordering' -> no server actions -->
                        <template v-if="order.status === 'ordering'">
                            <v-btn text disabled>In Cart (local)</v-btn>
                        </template>

                        <!-- NEW SUBMISSION: owner can Accept (-> pending) or Reject (delete) -->
                        <template v-else-if="order.status === 'submitted'">
                            <v-btn color="success" small @click="accept(order.id)">Accept</v-btn>
                            <v-btn color="error" small @click="reject(order.id)">Reject</v-btn>
                        </template>

                        <!-- PREPARING: owner can mark ready -->
                        <template v-else-if="order.status === 'pending'">
                            <v-btn color="primary" small @click="markReady(order.id)">Mark Ready</v-btn>
                        </template>

                        <!-- READY/COMPLETED: no actions (or optionally archive) -->
                        <template v-else>
                            <v-btn text disabled>Completed</v-btn>
                        </template>

                        <v-spacer />
                        <v-btn text small @click="view(order.id)">See detail</v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useOrderStore } from '@/stores/orderStore';
import type { OrderStatus } from '@/types/order';

const orderStore = useOrderStore();

onMounted(() => {
    orderStore.fetchOrders();
});

const formatStatus = (s: string) => {
    return s.charAt(0).toUpperCase() + s.slice(1);
};

const getStatusColor = (status: string) => {
    switch (status) {
        case 'ordering': return 'grey';
        case 'submitted': return 'orange';
        case 'pending': return 'blue';
        case 'ready': return 'green';
        default: return 'grey';
    }
};

const accept = async (id: number) => {
    // submitted -> pending (owner accepted and kitchen starts)
    const res = await orderStore.updateOrderStatus(id, 'pending' as OrderStatus);
    if (!res) {
        // you can show snackbar/error handling here
        console.error('Failed to accept order', id);
    }
};

const reject = async (id: number) => {
    if (!confirm('Reject and remove this order?')) return;
    const ok = await orderStore.deleteOrder(id);
    if (!ok) console.error('Failed to delete order', id);
};

const markReady = async (id: number) => {
    const res = await orderStore.updateOrderStatus(id, 'ready' as OrderStatus);
    if (!res) console.error('Failed to mark ready', id);
};

const view = async (id: number) => {
    // open dialog or navigate to detail page
    // e.g. $router.push({ name: 'OrderDetail', params: { id } })
    console.log('view', id);
};
</script>
