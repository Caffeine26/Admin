<template>
  <v-card class="elevation-3 hover-card">
    <v-img :src="product.product.image_url || ''" height="220px" cover></v-img>

    <v-card-title class="text-h6">{{ product.product.name || 'Unnamed Product' }}</v-card-title>
    <v-card-subtitle class="text-subtitle-1 text--primary font-weight-medium">
      ${{ product.product.price || '0.00' }}
    </v-card-subtitle>

    <v-divider></v-divider>

    <v-expand-transition>
      <v-card-text v-show="expanded">
        <div v-if="product.customization.add_on?.length">
          <strong>Add-ons:</strong>
          <v-list dense>
            <v-list-item v-for="add in product.customization.add_on" :key="add.id">
              <v-list-item-content>{{ add.name }}</v-list-item-content>
              <v-list-item-action>${{ add.price }}</v-list-item-action>
            </v-list-item>
          </v-list>
        </div>

        <div v-if="product.customization.modify?.length" class="mt-2">
          <strong>Modify:</strong>
          <v-list dense>
            <v-list-item v-for="mod in product.customization.modify" :key="mod.id">
              <v-list-item-content>{{ mod.name }}</v-list-item-content>
              <v-list-item-action>${{ mod.price }}</v-list-item-action>
            </v-list-item>
          </v-list>
        </div>
      </v-card-text>
    </v-expand-transition>

    <v-card-actions class="justify-space-between">
      <v-btn text small @click="$emit('toggle')" class="text-green bold">
        {{ expanded ? 'Hide' : 'Show' }} Customizations
        <v-icon right>{{ expanded ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
      </v-btn>

      <ProductActions
  :product-id="product.product.id"
  @edit="$emit('edit', product.product.id)"
  @delete="$emit('delete', product.product.id)"  
/>

    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import ProductActions from './ProductAction.vue';

const props = defineProps({
  product: Object,
  expanded: Boolean
});

const emit = defineEmits(['toggle', 'edit', 'delete']);
</script>

<style scoped>
.hover-card {
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}
.hover-card:hover {
  transform: translateY(-4px);
  box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.25);
}
</style>
