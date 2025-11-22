<template>
  <v-card outlined>
    <v-card-title class="d-flex justify-space-between align-center">
      <div>
        <div class="subtitle-1 font-weight-bold">
          #{{ order.id }} — Table {{ order.table_number }}
        </div>
        <div class="caption">Total: ${{ formatPrice(order.total_price) }}</div>
      </div>

      <div class="d-flex align-center gap-2">
        <v-chip :color="statusColor(order.status)" text-color="white" small>
          {{ formatStatus(order.status) }}
        </v-chip>

        <v-btn icon small @click="$emit('toggle')">
          <v-icon>{{ expanded ? 'mdi-minus' : 'mdi-plus' }}</v-icon>
        </v-btn>
      </div>
    </v-card-title>

    <v-expand-transition>
      <div v-show="expanded">
        <v-card-text>
          <strong>Items:</strong>
          <OrderItemList :items="order.items || []" />
        </v-card-text>

        <v-card-actions>
          <OrderActions
            :order="order"
            @accept="$emit('accept')"
            @reject="$emit('reject')"
            @detail="$emit('detail')"
          />
        </v-card-actions>
      </div>
    </v-expand-transition>
  </v-card>
</template>

<script setup lang="ts">
import OrderItemList from './OrderItemList.vue';
import OrderActions from './OrderAction.vue';

const props = defineProps({
  order: Object,
  expanded: Boolean
});

const formatPrice = (p: number | string) => Number(p).toFixed(2);
const formatStatus = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const statusColor = (status: string) => {
  switch (status) {
    case 'submitted': return 'blue';
    case 'ready': return 'green';
    case 'completed': return 'grey';
    default: return 'purple';
  }
};
</script>
