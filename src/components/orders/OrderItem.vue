<template>
  <v-list-item class="d-flex align-center">
    <v-list-item-avatar size="80" tile>
      <v-img :src="item.product?.image_url || ''" />
    </v-list-item-avatar>

    <v-list-item-content>
      <v-list-item-title class="font-weight-bold">
        {{ item.product?.name }} x{{ item.quantity }}
      </v-list-item-title>
      <v-list-item-subtitle v-if="item.options?.length">
        Customizations: {{ item.options.map(o => o.name).join(', ') }}
      </v-list-item-subtitle>
      <v-list-item-subtitle>
        Price: {{ formatPrice(item.price) }}
      </v-list-item-subtitle>
    </v-list-item-content>
  </v-list-item>
</template>

<script setup lang="ts">
import type { OrderItem } from '@/types/order';

const props = defineProps<{
  item: OrderItem;
}>();

const formatPrice = (value: number | string | undefined) => {
  if (!value) return '$0.00';
  return `$${Number(value).toFixed(2)}`;
};
</script>
