import axios from 'axios';
import { Category } from '@/types/category';

const baseURL = 'http://localhost:8000/api/categories';

export default {
  // Get all categories
  getAll() {
    return axios.get<{ data: Category[] }>(baseURL);
  },

  // Create new category
  create(formData: FormData) {
    return axios.post(baseURL, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // Update category
  update(id: number, formData: FormData) {
    // Laravel expects POST with _method=PUT
    if (!formData.has('_method')) {
      formData.append('_method', 'PUT');
    }

    return axios.post(`${baseURL}/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // Delete category
  delete(id: number) {
    return axios.delete(`${baseURL}/${id}`);
  },
};
