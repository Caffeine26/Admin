<template>

  <v-dialog v-model="model" fullscreen transition="dialog-bottom-transition">
    <v-card>
      <v-toolbar flat color="success" dark>
        <v-btn icon @click="model = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>

        <v-toolbar-title>
          Feedback #{{ feedbackData?.id }} — Table {{ getTableNumber(feedbackData?.table_id) }}
        </v-toolbar-title>
      </v-toolbar>

      <v-card-text class="pa-6">
        <h2 class="text-h5 mb-3">Rating: {{ feedbackData?.rating }}/5</h2>

        <p class="text-body-1 mb-6">
          <strong>Comment:</strong><br />
          {{ feedbackData?.comment || '-' }}
        </p>

        <h3 class="text-h6 mb-3">Images:</h3>

        <v-row v-if="feedbackImages.length">
          <v-col
            cols="12"
            sm="6"
            md="4"
            v-for="(img, idx) in feedbackImages"
            :key="idx"
            class="d-flex"
          >
            <v-img
              :src="getImage(img)"
              max-height="200"
              cover
              class="rounded-lg elevation-2 hover-scale"
              @click="openImage(getImage(img))"
            />
          </v-col>
        </v-row>

        <p v-else>No images</p>
      </v-card-text>
    </v-card>
  </v-dialog>

  <v-dialog v-model="imageDialog" max-width="95vw">
    <v-card>
      <v-img :src="selectedImage" max-height="90vh" contain />

      <v-card-actions>
        <v-btn block @click="imageDialog = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed } from "vue"

const STORAGE_URL = import.meta.env.VITE_API_BASE_URL_STORAGE

const props = defineProps({
  modelValue: Boolean,
  feedback: Object,
  getTableNumber: Function
})

const emit = defineEmits(["update:modelValue"])

const model = computed({
  get: () => props.modelValue,
  set: val => emit("update:modelValue", val)
})


const feedbackData = computed(() => props.feedback || {})

const feedbackImages = computed(() => {
  const images = feedbackData.value?.images
  if (!images) return []
  if (Array.isArray(images)) return images
  if (typeof images === "string") return [images]
  return []
})


const getImage = (path) => {
  if (!path) return ""
  if (path.startsWith("http")) return path
  return STORAGE_URL + path.replace(/^\/storage\//, "")
}


const imageDialog = ref(false)
const selectedImage = ref("")

const openImage = (src) => {
  selectedImage.value = src
  imageDialog.value = true
}
</script>

<style scoped>
.hover-scale {
  transition: 0.2s;
  cursor: pointer;
}
.hover-scale:hover {
  transform: scale(1.03);
}
</style>
