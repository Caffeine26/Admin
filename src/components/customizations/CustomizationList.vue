<template>
  <div>
    <div v-if="customization.add_on?.length">
      <strong>Add-ons:</strong>
      <v-list dense>
        <v-list-item v-for="add in customization.add_on" :key="add.id">
          <v-list-item-content>{{ add.name }}</v-list-item-content>
          <v-list-item-action>${{ add.price }}</v-list-item-action>
        </v-list-item>
      </v-list>
    </div>

    <div v-if="customization.modify?.length" class="mt-2">
      <strong>Modify:</strong>
      <v-list dense>
        <v-list-item v-for="mod in customization.modify" :key="mod.id">
          <v-list-item-content>{{ mod.name }}</v-list-item-content>
          <v-list-item-action>${{ mod.price }}</v-list-item-action>
        </v-list-item>
      </v-list>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  customization: Object
});
</script>
