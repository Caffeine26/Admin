<template>
  <div class="d-flex gap-2">
   
    <v-btn icon color="red" @click="$emit('delete')">
      <v-icon>mdi-delete</v-icon>
    </v-btn>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['edit', 'delete']);
</script>
