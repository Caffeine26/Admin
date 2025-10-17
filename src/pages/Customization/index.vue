<template>
    <v-container fluid>
        <!-- Header & Search -->
        <v-row class="mb-6 align-center">
            <v-col cols="12" md="6">
                <h2 class="text-h5 font-weight-bold">Products with Customizations</h2>
            </v-col>
            <v-col cols="12" md="6" class="d-flex justify-end">
                <v-text-field v-model="searchText" label="Search Products..." dense hide-details outlined clearable
                    class="me-4"></v-text-field>
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
            <v-col v-for="row in filteredProducts" :key="row.product.id" cols="12" sm="6" md="4">
                <v-card class="elevation-3 hover-card">
                    <!-- Product Image -->
                    <v-img :src="row.product.image_url || ''" height="220px" cover></v-img>

                    <!-- Product Info -->
                    <v-card-title class="text-h6">{{ row.product.name || 'Unnamed Product' }}</v-card-title>
                    <v-card-subtitle class="text-subtitle-1 text--primary font-weight-medium">
                        ${{ row.product.price || '0.00' }}
                    </v-card-subtitle>

                    <v-divider></v-divider>

                    <!-- Customizations Expansion -->
                    <v-expand-transition>
                        <v-card-text v-show="expandedIds.includes(row.product.id)" class="py-2">
                            <div v-if="row.customization.add_on?.length">
                                <strong>Add-ons:</strong>
                                <v-list dense>
                                    <v-list-item v-for="add in row.customization.add_on" :key="add.id">
                                        <v-list-item-content>{{ add.name }}</v-list-item-content>
                                        <v-list-item-action>${{ add.price }}</v-list-item-action>
                                    </v-list-item>
                                </v-list>
                            </div>

                            <div v-if="row.customization.modify?.length" class="mt-2">
                                <strong>Modify:</strong>
                                <v-list dense>
                                    <v-list-item v-for="mod in row.customization.modify" :key="mod.id">
                                        <v-list-item-content>{{ mod.name }}</v-list-item-content>
                                        <v-list-item-action>${{ mod.price }}</v-list-item-action>
                                    </v-list-item>
                                </v-list>
                            </div>
                        </v-card-text>
                    </v-expand-transition>

                    <!-- Actions -->
                    <v-card-actions class="justify-space-between">
                        <v-btn text small @click="toggleExpand(row.product.id)" class="text-green bold">
                            {{ expandedIds.includes(row.product.id) ? 'Hide' : 'Show' }} Customizations
                            <v-icon right>
                                {{ expandedIds.includes(row.product.id) ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
                            </v-icon>
                        </v-btn>

                        <div>
                            <v-btn icon @click="editCustomization(row.product.id)">
                                <v-icon>mdi-pencil</v-icon>
                            </v-btn>

                            <v-btn icon color="red" @click="confirmDelete(row.product.id)">
                                <v-icon>mdi-delete</v-icon>
                            </v-btn>
                        </div>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>

        <!-- Confirm Delete Dialog -->
        <v-dialog v-model="deleteDialog" max-width="400">
            <v-card>
                <v-card-title class="text-h6">Confirm Deletion</v-card-title>
                <v-card-text>Are you sure you want to delete this product and its customizations?</v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text @click="deleteDialog = false">Cancel</v-btn>
                    <v-btn color="red" @click="deleteProduct">Delete</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useProductCustomizationStore } from '@/stores/customizationStore';

const router = useRouter();
const store = useProductCustomizationStore();
const expandedIds = ref<number[]>([]);
const searchText = ref('');
const deleteDialog = ref(false);
let deleteId = ref<number | null>(null);

// Fetch data
onMounted(async () => {
    await store.fetchAll();
});

// Unique main products
const mainProducts = computed(() => {
    const map = new Map<number, any>();
    store.customizationRows.forEach(row => {
        if (row?.product && !map.has(row.product.id)) map.set(row.product.id, row);
    });
    return Array.from(map.values());
});

// Filtered by search
const filteredProducts = computed(() => {
    return mainProducts.value.filter(p =>
        p.product.name?.toLowerCase().includes(searchText.value.toLowerCase())
    );
});

// Navigation
const goDetail = (id: number) => router.push(`/Customization/detail/${id}`);
const goCreate = () => router.push('/Customization/create');
const editCustomization = (id: number) => router.push(`/Customization/edit/${id}`);

// Expand/collapse
const toggleExpand = (id: number) => {
    expandedIds.value = expandedIds.value.includes(id)
        ? expandedIds.value.filter(eid => eid !== id)
        : [...expandedIds.value, id];
};

// Delete
const confirmDelete = (id: number) => {
    deleteId.value = id;
    deleteDialog.value = true;
};

const deleteProduct = async () => {
    if (deleteId.value !== null) {
        await store.deleteCustomization(deleteId.value);
        deleteDialog.value = false;
        deleteId.value = null;
    }
};
</script>

<style scoped>
.hover-card {
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
}

.hover-card:hover {
    transform: translateY(-4px);
    box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.25);
}
</style>
