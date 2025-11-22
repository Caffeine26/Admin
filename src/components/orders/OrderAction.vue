<template>
  <v-row class="align-center justify-space-between no-gutters">
    
    <v-col class="d-flex gap-2" cols="auto">
      <template v-if="order.status === 'submitted'">
        <v-btn color="success" small elevation="2" rounded @click="$emit('accept')">
          Accept
        </v-btn>
        <v-btn color="error" small elevation="2" rounded @click="$emit('reject')">
          Reject
        </v-btn>
      </template>

      <template v-else-if="order.status === 'ready'">
        <v-btn text small color="grey" disabled>
          Ready
        </v-btn>
      </template>

      <template v-else>
        <v-btn text small color="grey" disabled>
          Completed
        </v-btn>
      </template>
    </v-col>

    <v-col cols="auto" class="d-flex justify-end">
      <v-btn outlined small color="primary" elevation="1" rounded @click="$emit('detail')">
        See Detail
      </v-btn>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
const props = defineProps({
  order: Object
});
</script>

<style scoped>
.v-btn {
  min-width: 90px;
  text-transform: none;
  font-weight: 500;
  margin:4px;
}

.v-btn:hover {
  opacity: 0.85;
}
</style>
