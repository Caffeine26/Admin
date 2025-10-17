import { Category } from '@/types/category.js';
import api from "./api.js";

const baseURL = '/api/categories';

export default {
  // Get all categories
  getAll() {
    return api.get<{ data: Category[] }>(baseURL);
  },

  // Create new category
  create(formData: FormData) {
    return api.post(baseURL, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
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
