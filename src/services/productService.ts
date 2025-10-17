import api from "./api.js";
import { Product } from '@/types/product.js'

const baseURL = "/api/products"
export const storageURL = import.meta.env.VITE_API_BASE_URL_STORAGE;

function normalizeProduct(product: Product): Product {
  return {
    ...product,
    image_url: product.image_url ? storageURL + product.image_url : null,
  }
}

export default {
  async getAll() {
    const response = await api.get<{ data: Product[] }>(baseURL)
    return {
      ...response,
      data: {
        ...response.data,
        data: response.data.data.map(normalizeProduct),
      },
    }
  },

  async getById(id: number) {
    const response = await api.get<{ data: Product }>(`${baseURL}/${id}`)
    return { ...response, data: normalizeProduct(response.data.data) }
  },

  async create(formData: FormData) {
    const response = await api.post(baseURL, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return { ...response, data: normalizeProduct(response.data.data) }
  },

  async update(id: number, formData: FormData) {
    // Laravel expects _method=PUT for file upload
    if (!formData.has('_method')) formData.append('_method', 'PUT')

    const response = await api.post(`${baseURL}/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })

    return { ...response, data: normalizeProduct(response.data.data) }
  },

  async delete(id: number) {
    return api.delete(`${baseURL}/${id}`)
  },
}
