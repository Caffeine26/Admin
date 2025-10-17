import axios from 'axios'
import { Product } from '@/types/product'

const baseURL = "http://localhost:8000/api/products"
export const storageURL = "http://localhost:8000/storage/"

function normalizeProduct(product: Product): Product {
  return {
    ...product,
    image_url: product.image_url ? storageURL + product.image_url : null,
  }
}

export default {
  async getAll() {
    const response = await axios.get<{ data: Product[] }>(baseURL)
    return {
      ...response,
      data: {
        ...response.data,
        data: response.data.data.map(normalizeProduct),
      },
    }
  },

  async getById(id: number) {
    const response = await axios.get<{ data: Product }>(`${baseURL}/${id}`)
    return { ...response, data: normalizeProduct(response.data.data) }
  },

  async create(formData: FormData) {
    const response = await axios.post(baseURL, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return { ...response, data: normalizeProduct(response.data.data) }
  },

  async update(id: number, formData: FormData) {
    // Laravel expects _method=PUT for file upload
    if (!formData.has('_method')) formData.append('_method', 'PUT')

    const response = await axios.post(`${baseURL}/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })

    return { ...response, data: normalizeProduct(response.data.data) }
  },

  async delete(id: number) {
    return axios.delete(`${baseURL}/${id}`)
  },
}
