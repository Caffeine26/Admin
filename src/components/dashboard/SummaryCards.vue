<template>
  <v-row dense class="mb-6">
    <v-col cols="12" sm="6" md="3" v-for="card in cards" :key="card.title">
      <v-card :color="card.color" dark class="pa-4">
        <div class="text-h6">{{ card.title }}</div>
        <div class="text-h4 font-weight-bold mt-2">{{ card.value }}</div>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps<{
  cards: { title: string; value: number; color: string }[]
}>()
</script>
