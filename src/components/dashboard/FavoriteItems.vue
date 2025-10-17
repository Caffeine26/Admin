<template>
  <v-card class="pa-40 "  >
    <v-card-title class="d-flex justify-space-between align-center">
        <span class="text-h6 font-weight-boild">Favorite Menu</span>
        <v-btn variant="text" color="success" @click="router.push('/products')">see more</v-btn>
    </v-card-title>
    <v-row  justify="center">
       <v-col  
          v-for="(item, index) in items.slice(0, 2)"
          :key="index"
          cols="12"
          sm="6"
          class="pa-2"
        >
          <ProductCard :item="item" />
      </v-col>
    </v-row>

  </v-card>
</template>
<script setup lang="ts">
import router from '@/router';
import ProductCard from './ProductCard.vue';
const items = [
  { name: 'Fish Burger', price: 12.4, image: '/fish.jpg' },
  { name: 'Beef Burger', price: 24.64, image: '/beef.jpg' },
  { name: 'Cheese Burger', price: 14.78, image: '/cheese.jpg' },
]
</script>
