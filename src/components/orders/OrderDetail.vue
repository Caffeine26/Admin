<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    max-width="700"
  >
    <v-card class="pa-6" outlined elevation="4">
      <!-- Header -->
      <v-card-title>
        <div class="d-flex justify-space-between align-center w-100">
          <div>
            <h2 class="mb-1">Order #{{ order?.id }} — Table {{ order?.table_number }}</h2>
            <span class="text-caption grey--text">{{ formatDate(order?.order_time) }}</span>
          </div>

          <OrderStatus
            v-if="order"
            :status="order.status"
            :statuses="statuses"
            @update-status="updateStatus"
          />
        </div>
      </v-card-title>

      <v-divider class="my-4"></v-divider>

      <h3 class="mt-6 mb-3">Items</h3>
      <v-divider class="mb-4"></v-divider>
      <OrderItemList v-if="order" :items="order.items || []" />

      <!-- Special Note -->
      <SpecialNote v-if="order && order.special_note" :note="order.special_note" />

      <!-- Total -->
      <v-divider class="my-4"></v-divider>
      <OrderTotal v-if="order" :total="order.total_price || 0" />
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import OrderItemList from './OrderItemList.vue';
import OrderStatus from './OrderStatus.vue';
import OrderTotal from './OrderTotal.vue';
import { useOrderStore } from '@/stores/orderStore';
import type { Order, OrderStatus as OrderStatusType } from '@/types/order';

const props = defineProps<{
  modelValue: boolean
  order: Order | null
  statuses?: OrderStatusType[]
}>();

const emit = defineEmits(['update:modelValue', 'status-updated']);

const store = useOrderStore();
const order = ref<Order | null>(props.order);

watch(() => props.order, (val) => {
  order.value = val
    ? { ...val, items: val.items?.map(i => ({ ...i, options: i.options || [] })) || [] }
    : null;
});

// Default statuses
const statuses = props.statuses || ['ordering', 'submitted', 'ready'];

// Update order status
const updateStatus = async (newStatus: OrderStatusType) => {
  if (!order.value) return;
  const updated = await store.updateOrderStatus(order.value.id, newStatus);
  if (updated) {
    order.value = { ...updated, items: updated.items?.map(i => ({ ...i, options: i.options || [] })) || [] };
    emit('status-updated', updated);
  }
};

// Format order_time
const formatDate = (dateStr: string | undefined) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
};
</script>

<style scoped>
.v-card-title h2 {
  margin-bottom: 0;
}
</style>
`
