<template>
  <v-container>
    <!-- Header -->
    <div class="d-flex justify-space-between align-center mb-6">
      <h1>Order Management</h1>
      
    </div>
    <v-row>
      <v-col cols="12" v-if="loading">
        <v-skeleton-loader type="card" class="mb-3" v-for="n in 3" :key="n" />
      </v-col>

      <v-col cols="12" v-if="error">
        <v-alert type="error">{{ error }}</v-alert>
      </v-col>

      <v-col cols="12" v-if="!loading && orders.length === 0">
        <v-alert type="info">No orders found.</v-alert>
      </v-col>
    </v-row>

    <!-- Orders List -->
    <v-row>
      <v-col cols="12" md="6" lg="4" v-for="order in sortedOrders" :key="order.id">
        <OrderCard
          :order="order"
          @toggle="toggleExpand(order.id)"
          :expanded="expandedOrders.includes(order.id)"
          @accept="accept(order.id)"
          @reject="reject(order.id)"
          @detail="openDetail(order)"
        />
      </v-col>
    </v-row>

    <!-- Reusable Order Detail Dialog -->
    <OrderDetailDialog
      v-model="showDialog"
      :order="selectedOrder"
      @status-updated="onStatusUpdated"
    />
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useOrderStore } from '@/stores/orderStore.js';
import OrderCard from '@/components/orders/OrderCard.vue';
import OrderDetailDialog from '@/components/orders/OrderDetail.vue';

const router = useRouter();
const store = useOrderStore();

const orders = ref([]);
const loading = ref(true);
const error = ref<string | null>(null);
const expandedOrders = ref<number[]>([]);

// Polling interval ID
let pollingInterval: number | null = null;

// Dialog state
const showDialog = ref(false);
const selectedOrder = ref(null);

const toggleExpand = (id: number) => {
  if (expandedOrders.value.includes(id)) expandedOrders.value = expandedOrders.value.filter(x => x !== id);
  else expandedOrders.value.push(id);
};

// Initial fetch (with loading spinner)
// Initial fetch (with loading spinner)
const fetchOrdersOnce = async () => {
  loading.value = true;
  try {
    await store.fetchOrders();
    orders.value = store.orders
      .map(o => ({
        ...o,
        items: o.items || [],
        table_number: o.table_number // add table_number for display
      }))
      .sort((a, b) => b.id - a.id) // latest first
      .slice(0, 15); // keep only latest 15
  } catch (err: any) {
    error.value = err.message || 'Failed to fetch orders';
  } finally {
    loading.value = false;
  }
};

// Silent polling: only update existing orders or add new ones
const pollOrders = async () => {
  try {
    await store.fetchOrders();
    const latestOrders = store.orders
      .map(o => ({
        ...o,
        items: o.items || [],
        table_number: o.table_number // use table_number
      }))
      .sort((a, b) => b.id - a.id)
      .slice(0, 15);

    // Add new or update existing orders
    latestOrders.forEach((newOrder) => {
      const index = orders.value.findIndex(o => o.id === newOrder.id);
      if (index === -1) {
        orders.value.unshift(newOrder);
      } else {
        const oldOrder = orders.value[index];
        if (
          oldOrder.status !== newOrder.status ||
          oldOrder.total_price !== newOrder.total_price ||
          oldOrder.items.length !== newOrder.items.length ||
          oldOrder.table_number !== newOrder.table_number // update table_number if changed
        ) {
          orders.value[index] = newOrder;
        }
      }
    });

    // Remove orders that are no longer in latest 15
    orders.value = orders.value.filter(o => latestOrders.some(lo => lo.id === o.id));
  } catch (err: any) {
    console.error('Polling error:', err);
  }
};


// Open order detail dialog
const openDetail = (order: any) => {
  selectedOrder.value = { ...order, items: order.items?.map(i => ({ ...i, options: i.options || [] })) || [] };
  showDialog.value = true;
};

// Accept / Reject actions
const accept = async (id: number) => {
  await store.updateOrderStatus(id, 'ready');
  await pollOrders();
};
const reject = async (id: number) => {
  if (!confirm('Reject and remove this order?')) return;
  await store.deleteOrder(id);
  await pollOrders();
};

// Update after popup status change
const onStatusUpdated = async () => {
  await pollOrders();
};

// Start polling
onMounted(() => {
  fetchOrdersOnce();
  pollingInterval = setInterval(pollOrders, 5000);
});

onUnmounted(() => {
  if (pollingInterval) clearInterval(pollingInterval);
});

// Computed sorted orders
const sortedOrders = computed(() => [...orders.value].sort((a, b) => b.id - a.id));

// Navigation
const goToCreate = () => router.push('/OrderManagement/create');
const goToTable = () => router.push('/OrderManagement/table');
</script>
