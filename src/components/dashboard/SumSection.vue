<template>
  <v-row>
    <v-col cols="12" md="3" v-for="card in cards" :key="card.title">
      <v-card class="pa-4">
        <v-card-title>{{ card.title }}</v-card-title>
        <v-card-text class="text-h5">{{ card.value }}</v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
const cards = [
  { title: 'Orders', value: '1,248' },
  { title: 'Customers', value: '9,445' },
  { title: 'Menu', value: '539' },
  { title: 'Income', value: '$18,445' },
]
</script>
