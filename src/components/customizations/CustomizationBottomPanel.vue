<template>
  <v-row class="mt-6">
    <v-col cols="12" md="4">
      <v-card outlined>
        <v-card-title>Main Product</v-card-title>
        <v-card-text v-if="main">
          <v-img :src="main.image_url" height="100" contain class="mb-2" />
          <p>{{ main.name_english || main.name }}</p>
        </v-card-text>
        <v-card-text v-else class="text-grey">No main product selected</v-card-text>
      </v-card>
    </v-col>

    <v-col cols="12" md="4">
      <v-card outlined>
        <v-card-title>Add-on Products</v-card-title>
        <v-card-text>
          <div v-if="addOns.length">
            <div v-for="p in addOns" :key="p.id" class="mb-2">
              <v-img :src="p.image_url" max-width="60" height="60" contain />
              <p>{{ p.name_english || p.name }}</p>
            </div>
          </div>
          <p v-else class="text-grey">No add-on selected</p>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col cols="12" md="4">
      <v-card outlined>
        <v-card-title>Modify Products</v-card-title>
        <v-card-text>
          <div v-if="modifies.length">
            <div v-for="p in modifies" :key="p.id" class="mb-2">
              <v-img :src="p.image_url" max-width="60" height="60" contain />
              <p>{{ p.name_english || p.name }}</p>
            </div>
          </div>
          <p v-else class="text-grey">No modify selected</p>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
const props = defineProps({
  main: Object,
  addOns: Array,
  modifies: Array
})
</script>
