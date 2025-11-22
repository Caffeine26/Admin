<template>
  <div class="d-flex align-center justify-space-between mb-4">
    <div>
      <strong>Status:</strong>
      <v-chip :color="statusColor(status)" dark>{{ status }}</v-chip>
    </div>
    
  </div>
</template>

<script setup lang="ts">
import type { OrderStatus } from '@/types/order';
import { ref, watch } from 'vue';

const props = defineProps<{
  status: OrderStatus;
  statuses: OrderStatus[];
}>();

const selectedStatus = ref<OrderStatus>(props.status);

watch(() => props.status, (newStatus) => {
  selectedStatus.value = newStatus;
});


const statusColor = (status: OrderStatus | undefined) => {
  switch (status) {
    case 'submitted': return 'blue';
    case 'ready': return 'green';
    case 'ordering': return 'purple';
    default: return 'grey';
  }
};

</script>
