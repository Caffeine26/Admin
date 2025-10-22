import { Category } from '@/types/category.js';
import api from "./api.js";

const baseURL = '/api/categories';
const storageURL = import.meta.env.VITE_API_BASE_URL_STORAGE;


// Normalize banner to include full image URL
function normalizeCategory(category: Category): Category {
  return {
    ...category,
    image_url: category.image ? storageURL + category.image : '',
  }
}

export default {
  // Get all categories
  async  getAll(): Promise<Category[]> {
    const response = await api.get(baseURL);
    const rawCategory = response.data?.data ?? [];
    return rawCategory.map(normalizeCategory);
  },

  // Create new category
  async create(formData: FormData) {
    const response = await api.post(baseURL, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    const rawCategory = response.data?.data ?? response.data;
    return rawCategory.map(normalizeCategory);
  },

  // Update category
  update(id: number, formData: FormData) {
    // Laravel expects POST with _method=PUT
    if (!formData.has('_method')) {
      formData.append('_method', 'PUT');
    }

    return api.post(`${baseURL}/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // Delete category
  delete(id: number) {
    return api.delete(`${baseURL}/${id}`);
  },
};
