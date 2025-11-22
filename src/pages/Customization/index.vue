<template>
  <v-container fluid>
    <!-- Header -->
    <v-row class="mb-6 align-center">
      <v-col cols="12" md="6">
        <h2 class="text-h5 font-weight-bold">Products with Customizations</h2>
      </v-col>
      <v-col cols="12" md="6" class="d-flex justify-end">
        <v-text-field
          v-model="searchText"
          label="Search Products..."
          dense
          hide-details
          outlined
          clearable
          class="me-4"
        />
        <v-btn color="primary" rounded elevation="2" @click="goCreate">
          <v-icon left>mdi-plus</v-icon> Add Customization
        </v-btn>
      </v-col>
    </v-row>

    <!-- Loading -->
    <v-row v-if="store.loading">
      <v-col cols="12" class="text-center">
        <v-progress-circular indeterminate color="primary" size="50"></v-progress-circular>
      </v-col>
    </v-row>

    <!-- Products Grid -->
    <v-row v-else dense>
      <v-col
        v-for="row in filteredProducts"
        :key="row.product.id"
        cols="12"
        sm="6"
        md="4"
      >
        <ProductCard
          :product="row"
          :expanded="expandedIds.includes(row.product.id)"
          @toggle="toggleExpand(row.product.id)"
          @edit="editCustomization"
          @delete="openDeleteDialog"
        />
      </v-col>
    </v-row>

    <!-- Delete confirmation dialog -->
    <DeleteDialog
      v-model="deleteDialog"
      @confirm="deleteCustomizationConfirmed"
    />
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useProductCustomizationStore } from '@/stores/customizationStore';
import ProductCard from '@/components/customizations/ProductCard.vue';
import DeleteDialog from '@/components/customizations/DeleteDialog.vue';

const router = useRouter();
const store = useProductCustomizationStore();

const searchText = ref('');
const expandedIds = ref<number[]>([]);

// Delete dialog state
const deleteDialog = ref(false);
const deleteProductId = ref<number | null>(null);

// Fetch all customizations on mount
onMounted(async () => {
  await store.fetchAll();
});

// Filter main products (unique)
const mainProducts = computed(() => {
  const map = new Map<number, any>();
  store.customizationRows.forEach(row => {
    if (row?.product && !map.has(row.product.id)) map.set(row.product.id, row);
  });
  return Array.from(map.values());
});

// Apply search filter
const filteredProducts = computed(() =>
  mainProducts.value.filter(p =>
    p.product.name?.toLowerCase().includes(searchText.value.toLowerCase())
  )
);

// Navigation
const goCreate = () => router.push('/Customization/create');
const editCustomization = (id: number) => router.push(`/Customization/edit/${id}`);

// Toggle expand/collapse
const toggleExpand = (id: number) => {
  expandedIds.value = expandedIds.value.includes(id)
    ? expandedIds.value.filter(eid => eid !== id)
    : [...expandedIds.value, id];
};

// Open delete dialog
const openDeleteDialog = (productId: number) => {
  deleteProductId.value = productId;
  deleteDialog.value = true;
};

// Confirm deletion
const deleteCustomizationConfirmed = async () => {
  if (deleteProductId.value === null) return;

  const productIdToDelete = deleteProductId.value;

  // Call store to delete all customizations of this product
  await store.deleteCustomization(productIdToDelete);

  // Close dialog & reset
  deleteDialog.value = false;
  deleteProductId.value = null;

  // Remove deleted product from expanded list
  expandedIds.value = expandedIds.value.filter(id => id !== productIdToDelete);
};
</script>
