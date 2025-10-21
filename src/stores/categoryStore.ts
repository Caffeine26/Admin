import { defineStore } from 'pinia';
import { Category } from '@/types/category.js';
import categoryService from '@/services/categoryService.js';

export const useCategoryStore = defineStore('categoryStore', {
  state: () => ({
    categories: [] as Category[],
    loading: false,
  }),
  actions: {
    async fetchCategories() {
      this.loading = true;
      try {
        this.categories = await categoryService.getAll();
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        this.loading = false;
      }
    },

    async createCategory(formData: FormData) {
      try {
        const res = await categoryService.create(formData);
        this.categories.push(res);
        return res;
      } catch (error: any) {
        console.error('Failed to create category:', error.response?.data || error);
        throw error.response?.data || { error: 'Failed to create category' };
      }
    },

    async updateCategory(id: number, formData: FormData) {
      try {
        const res = await categoryService.update(id, formData);
        const updatedCategory = {
          ...res.data.data,
          image_url: res.data.data.image ? `http://localhost:8000/storage/${res.data.data.image}` : null
        };
        const index = this.categories.findIndex(c => c.id === id);
        if (index !== -1) {
          this.categories[index] = updatedCategory;
        }
        return updatedCategory;
      } catch (error: any) {
        console.error('Failed to update category:', error.response?.data || error);
        throw error.response?.data || { error: 'Failed to update category' };
      }
    },

    async deleteCategory(id: number) {
      try {
        await categoryService.delete(id);
        this.categories = this.categories.filter(c => c.id !== id);
      } catch (error: any) {
        console.error('Failed to delete category:', error.response?.data || error);
        throw error.response?.data || { error: 'Failed to delete category' };
      }
    },
  },
});
