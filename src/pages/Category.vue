<template>
    <v-container>
        <!-- Top Controls -->
        <v-row class="mb-4" align="center" justify="space-between">
            <v-col cols="12" md="6">
                <v-text-field v-model="searchQuery" label="Search categories..." outlined dense clearable />
            </v-col>
            <v-col cols="12" md="4" class="d-flex justify-end align-center">
                <v-select v-model="sortLetter" :items="letters" label="Sort by letter" outlined dense hide-details
                    class="mr-2" />
                <v-btn color="green darken-1" @click="openCreateDialog">Add Category</v-btn>
            </v-col>
        </v-row>

        <!-- CREATE / EDIT DIALOG -->
        <v-dialog v-model="dialog.show" max-width="600px">
            <v-card>
                <v-card-title>{{ dialog.isEditing ? 'Edit Category' : 'Create Category' }}</v-card-title>
                <v-card-text>
                    <v-row dense>
                        <v-col cols="12" md="6">
                            <v-text-field v-model="form.name_khmer" label="Name Khmer" outlined dense />
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field v-model="form.name_english" label="Name English" outlined dense />
                        </v-col>
                        <v-col cols="12">
                            <v-file-input v-model="form.image" label="Upload Image" outlined dense accept="image/*" />
                            <v-img v-if="previewImage" :src="previewImage" max-width="120" max-height="120"
                                class="mt-2 rounded-lg" />
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions>
                    <v-btn color="green darken-1" text @click="submitForm">{{ dialog.isEditing ? 'Update' : 'Create'
                        }}</v-btn>
                    <v-btn color="red" text @click="closeDialog">Cancel</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- CATEGORY CARDS -->
        <v-row>
            <v-col v-for="category in filteredCategories" :key="category.id" cols="12" sm="6" md="4">
                <v-card>
                    <v-img :src="category.image_url" height="200" class="rounded-lg" cover></v-img>
                    <v-card-title class="text-h6">{{ category.name_khmer }} / {{ category.name_english }}</v-card-title>
                    <v-card-subtitle>Products: {{ category.products_count ?? 0 }}</v-card-subtitle>
                    <v-card-actions>
                        <v-btn color="green darken-1" text @click="openEditDialog(category)">Edit</v-btn>
                        <v-btn color="red darken-1" text @click="confirmDeleteCategory(category.id)">Delete</v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>

        <!-- LOADING -->
        <v-row v-if="categoryStore.loading" justify="center">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </v-row>

        <!-- SNACKBAR -->
        <v-snackbar v-model="snackbar.show" :color="snackbar.color" top timeout="3000">
            {{ snackbar.message }}
            <template #actions>
                <v-btn text @click="snackbar.show = false">Close</v-btn>
            </template>
        </v-snackbar>

        <!-- DELETE CONFIRM -->
        <v-dialog v-model="deleteDialog.show" max-width="400px">
            <v-card>
                <v-card-title class="text-h6">Confirm Delete</v-card-title>
                <v-card-text>Are you sure you want to delete this category?</v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green" text @click="deleteDialog.show = false">No</v-btn>
                    <v-btn color="red darken-1" text @click="deleteCategory">Yes</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, computed, onMounted } from 'vue';
import { useCategoryStore } from '@/stores/categoryStore.js';
import { Category } from '@/types/category.js';

export default defineComponent({
    name: 'CategoryAdmin',
    setup() {
        const categoryStore = useCategoryStore();
        const searchQuery = ref('');
        const sortLetter = ref('All');
        const letters = ref(['All', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')]);

        const form = reactive({
            id: null as number | null,
            name_khmer: '',
            name_english: '',
            image: null as File | null,
        });

        const dialog = reactive({ show: false, isEditing: false });
        const snackbar = reactive({ show: false, message: '', color: 'success' });
        const deleteDialog = reactive({ show: false, categoryId: null as number | null });

        const previewImage = computed(() =>
            form.image ? URL.createObjectURL(form.image) : ''
        );

        const filteredCategories = computed(() => {
            let list = categoryStore.categories.filter(
                (c) =>
                    c.name_khmer.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                    c.name_english.toLowerCase().includes(searchQuery.value.toLowerCase())
            );
            if (sortLetter.value !== 'All') {
                list = list.filter((c) => c.name_english.toUpperCase().startsWith(sortLetter.value));
            }
            return list;
        });

        const submitForm = async () => {
            if (!form.name_khmer || !form.name_english) {
                snackbar.message = 'Please fill all required fields!';
                snackbar.color = 'error';
                snackbar.show = true;
                return;
            }

            const formData = new FormData();
            formData.append('name_khmer', form.name_khmer);
            formData.append('name_english', form.name_english);

            if (form.image instanceof File) {
                formData.append('image', form.image);
            }

            if (dialog.isEditing && form.id !== null) {
                formData.set('_method', 'PUT');
            }

            try {
                if (dialog.isEditing && form.id !== null) {
                    await categoryStore.updateCategory(form.id, formData);
                    snackbar.message = 'Category updated successfully!';
                } else {
                    await categoryStore.createCategory(formData);
                    snackbar.message = 'Category created successfully!';
                }
                snackbar.color = 'success';
                snackbar.show = true;
                closeDialog();
                resetForm();
                await categoryStore.fetchCategories();
            } catch (error: any) {
                console.error('Save error:', error.response?.data || error);
                snackbar.message = error.response?.data?.error || 'Failed to save category!';
                snackbar.color = 'error';
                snackbar.show = true;
            }
        };

        const openEditDialog = (category: Category) => {
            form.id = category.id;
            form.name_khmer = category.name_khmer ?? '';
            form.name_english = category.name_english ?? '';
            form.image = null;
            dialog.isEditing = true;
            dialog.show = true;
        };

        const openCreateDialog = () => {
            resetForm();
            dialog.isEditing = false;
            dialog.show = true;
        };

        const closeDialog = () => { dialog.show = false; };

        const confirmDeleteCategory = (id: number) => {
            deleteDialog.show = true;
            deleteDialog.categoryId = id;
        };

        const deleteCategory = async () => {
            if (!deleteDialog.categoryId) return;
            try {
                await categoryStore.deleteCategory(deleteDialog.categoryId);
                snackbar.message = 'Category deleted successfully!';
                snackbar.color = 'success';
                snackbar.show = true;
            } catch (error) {
                snackbar.message = 'Failed to delete category!';
                snackbar.color = 'error';
                snackbar.show = true;
            } finally {
                deleteDialog.show = false;
                deleteDialog.categoryId = null;
            }
        };

        const resetForm = () => {
            form.id = null;
            form.name_khmer = '';
            form.name_english = '';
            form.image = null;
        };

        onMounted(() => categoryStore.fetchCategories());

        return {
            categoryStore, searchQuery, sortLetter, letters,
            filteredCategories, form, dialog, snackbar, previewImage,
            deleteDialog, submitForm, openEditDialog, openCreateDialog,
            closeDialog, deleteCategory, confirmDeleteCategory,
        };
    },
});
</script>

<style scoped>
.v-card {
    transition: transform 0.2s;
}

.v-card:hover {
    transform: scale(1.03);
}
</style>
