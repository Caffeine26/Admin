<template>
    <v-container>
        <v-row class="mb-4" align="center" justify="space-between">
            <!-- Search field -->
            <v-col cols="12" md="6">
                <v-text-field v-model="searchQuery" label="Search products..." outlined dense clearable />
            </v-col>

            <!-- Add button -->
            <v-col cols="12" md="4" class="d-flex justify-end">
                <v-btn color="green darken-1" @click="openCreateDialog">Add Customization</v-btn>
            </v-col>
        </v-row>

        <!-- Create/Edit Dialog -->
        <v-dialog v-model="dialog.show" max-width="600px">
            <v-card>
                <v-card-title>{{ dialog.isEditing ? 'Edit Customization' : 'Add Customization' }}</v-card-title>
                <v-card-text>
                    <v-row dense>
                        <v-col cols="12" md="6">
                            <v-select v-model="form.product_id" :items="products" item-title="name" item-value="id"
                                label="Main Product" outlined dense />
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-select v-model="form.customization_id" :items="products" item-title="name"
                                item-value="id" label="Linked Product" outlined dense />
                        </v-col>
                        <v-col cols="12">
                            <v-select v-model="form.status" :items="['1', '0']" label="Status" outlined dense />
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions>
                    <v-btn color="green darken-1" text @click="submitForm">
                        {{ dialog.isEditing ? 'Update' : 'Create' }}
                    </v-btn>
                    <v-btn color="red" text @click="closeDialog">Cancel</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Customization Cards -->
        <v-row>
            <v-col v-for="item in filteredCustomizations" :key="item.id" cols="12" sm="6" md="4">
                <v-card>
                    <v-card-title>{{ item.customization?.name || 'ID: ' + item.customization_id }}</v-card-title>
                    <v-card-subtitle>Main: {{ item.product?.name || 'ID: ' + item.product_id }}</v-card-subtitle>
                    <v-card-text>Type: {{ item.customization?.type || '-' }}</v-card-text>
                    <v-card-actions>
                        <v-btn color="green darken-1" text @click="openEditDialog(item)">Edit</v-btn>
                        <v-btn color="red darken-1" text @click="confirmDeleteCustomization(item.id)">Delete</v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>

        <!-- Snackbar -->
        <v-snackbar v-model="snackbar.show" :color="snackbar.color" top timeout="3000">
            {{ snackbar.message }}
            <template v-slot:actions>
                <v-btn text @click="snackbar.show = false">Close</v-btn>
            </template>
        </v-snackbar>

        <!-- Delete Confirmation -->
        <v-dialog v-model="deleteDialog.show" max-width="400px">
            <v-card>
                <v-card-title class="text-h6">Confirm Delete</v-card-title>
                <v-card-text>Are you sure you want to delete this customization?</v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green" text @click="deleteDialog.show = false">No</v-btn>
                    <v-btn color="red darken-1" text @click="deleteCustomization">Yes</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>
<script lang="ts">
import { defineComponent, ref, reactive, computed, onMounted } from 'vue';
import { useCustomizationStore } from '@/stores/customizationStore';
import { useProductStore } from '@/stores/productStore';
import type { Customization } from '@/types/customization';
import type { Product } from '@/types/product';

export default defineComponent({
    name: 'CustomizationAdmin',
    setup() {
        const store = useCustomizationStore();
        const productStore = useProductStore();

        const searchQuery = ref('');
        const dialog = reactive({ show: false, isEditing: false });
        const snackbar = reactive({ show: false, message: '', color: 'success' });
        const deleteDialog = reactive({ show: false, customizationId: null as number | null });

        const form = reactive<Partial<Customization>>({
            id: null,
            product_id: null,
            customization_id: null,
            status: '1',
        });

        const filteredCustomizations = computed(() => {
            return store.customizations.filter(
                (c) =>
                    c.product?.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                    c.customization?.name.toLowerCase().includes(searchQuery.value.toLowerCase())
            );
        });

        const products = computed<Product[]>(() => productStore.products);

        const openEditDialog = (item: Customization) => {
            form.id = item.id;
            form.product_id = item.product_id;
            form.customization_id = item.customization_id;
            form.status = item.status;
            dialog.isEditing = true;
            dialog.show = true;
        };

        const openCreateDialog = () => {
            form.id = null;
            form.product_id = null;
            form.customization_id = null;
            form.status = '1';
            dialog.isEditing = false;
            dialog.show = true;
        };

        const closeDialog = () => { dialog.show = false; };

        const submitForm = async () => {
            try {
                if (dialog.isEditing && form.id) {
                    await store.updateStatus(form.id, form.status!);
                    snackbar.message = 'Customization updated!';
                } else {
                    await store.addCustomization({
                        product_id: form.product_id!,
                        customization_id: form.customization_id!,
                        status: form.status as '0' | '1',
                    });
                    snackbar.message = 'Customization added!';
                }
                snackbar.color = 'success';
                snackbar.show = true;
                closeDialog();
            } catch (err) {
                console.error(err);
                snackbar.message = 'Operation failed!';
                snackbar.color = 'error';
                snackbar.show = true;
            }
        };

        const confirmDeleteCustomization = (id: number) => {
            deleteDialog.customizationId = id;
            deleteDialog.show = true;
        };

        const deleteCustomization = async () => {
            if (!deleteDialog.customizationId) return;
            await store.deleteCustomization(deleteDialog.customizationId);
            deleteDialog.show = false;
            snackbar.message = 'Customization deleted!';
            snackbar.color = 'success';
            snackbar.show = true;
        };

        onMounted(() => {
            store.fetchAll();
            productStore.fetchingProducts(); // make sure products are loaded
        });

        return {
            store,
            products,
            searchQuery,
            filteredCustomizations,
            form,
            dialog,
            snackbar,
            deleteDialog,
            openEditDialog,
            openCreateDialog,
            closeDialog,
            submitForm,
            confirmDeleteCustomization,
            deleteCustomization,
        };
    },
});
</script>
