import { defineStore } from 'pinia';
import axios from 'axios';
import { Category } from '@/types/category';

export const useCategoryStore = defineStore('categoryStore', {
  state: () => ({
    categories: [] as Category[],
    loading: false,
  }),
  actions: {
    async fetchCategories() {
      this.loading = true;
      try {
        const res = await axios.get('http://localhost:8000/api/categories');
        // Add full image URL
        this.categories = res.data.data.map((c: any) => ({
          ...c,
          image_url: c.image ? `http://localhost:8000/storage/${c.image}` : null
        }));
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        this.loading = false;
      }
    },

    async createCategory(formData: FormData) {
      try {
        const res = await axios.post('http://localhost:8000/api/categories', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        const newCategory = {
          ...res.data.data,
          image_url: res.data.data.image ? `http://localhost:8000/storage/${res.data.data.image}` : null
        };
        this.categories.push(newCategory);
        return newCategory;
      } catch (error: any) {
        console.error('Failed to create category:', error.response?.data || error);
        throw error.response?.data || { error: 'Failed to create category' };
      }
    },

    async updateCategory(id: number, formData: FormData) {
      try {
        const res = await axios.post(`http://localhost:8000/api/categories/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
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
        await axios.delete(`http://localhost:8000/api/categories/${id}`);
        this.categories = this.categories.filter(c => c.id !== id);
      } catch (error: any) {
        console.error('Failed to delete category:', error.response?.data || error);
        throw error.response?.data || { error: 'Failed to delete category' };
      }
    },
  },
});
