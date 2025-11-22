<template>
  <v-list dense>
    <v-list-item v-for="(item, index) in items" :key="item.id" class="flex-column align-start">
      <!-- Main item line -->
      <v-list-item-content>
        <v-list-item-title>
          {{ index + 1 }}. {{ item.product?.name || 'Unknown Product' }} × {{ item.quantity }} — ${{ formatPrice(item.price) }}
          <span v-if="item.status">({{ item.status }})</span>
        </v-list-item-title>
      </v-list-item-content>

      <!-- Item options -->
      <v-list-item-content v-if="item.options?.length" class="ml-6">
        <v-list-item-title v-for="opt in item.options" :key="opt.id" class="option-line">
          └ {{ opt.name }} (${{ formatPrice(opt.price) }})
        </v-list-item-title>
      </v-list-item-content>

      <!-- Item note -->
      <v-list-item-content v-if="item.note" class="ml-6">
        <v-list-item-subtitle>Note: {{ item.note }}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <v-list-item v-if="!items.length">
      <v-list-item-content>No items in this order</v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script setup lang="ts">
const props = defineProps({
  items: {
    type: Array,
    default: () => []
  }
});

const formatPrice = (p: number | string) => Number(p).toFixed(2);
</script>

<style scoped>
.option-line {
  margin-left: 0.5rem; 
  font-weight: 400;
  font-size: 0.95rem;
  color: #555;
}
.ml-6 {
  margin-left: 1.5rem;
}
</style>
