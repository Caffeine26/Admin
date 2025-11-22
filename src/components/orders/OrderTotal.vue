<template>
  <div class="d-flex justify-space-between font-weight-bold mt-4">
    <span>Total:</span>
    <span>{{ formatPrice(total) }}</span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ total: number }>();

const formatPrice = (value: number | undefined) => {
  if (!value) return '$0.00';
  return `$${Number(value).toFixed(2)}`;
};
</script>
