<template>
  <v-dialog v-model="localModel" max-width="400">
    <v-card>
      <v-card-title class="text-h6">Confirm Deletion</v-card-title>
      <v-card-text>Are you sure you want to delete this product and its customizations?</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="cancel">Cancel</v-btn>
        <v-btn color="red" @click="confirmDelete">Delete</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { watch, ref } from 'vue';

const props = defineProps({
  modelValue: Boolean
});
const emit = defineEmits(['update:modelValue', 'confirm']);

// Local state to control v-dialog
const localModel = ref(props.modelValue);

// Keep localModel in sync with parent
watch(
  () => props.modelValue,
  (val) => (localModel.value = val)
);

// Methods
const cancel = () => {
  localModel.value = false;
  emit('update:modelValue', false);
};

const confirmDelete = () => {
  emit('confirm');
  localModel.value = false;
  emit('update:modelValue', false);
};
</script>
