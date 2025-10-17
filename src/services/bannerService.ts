import axios from 'axios'
import { Banners } from '@/types/banner'

const baseURL = "http://localhost:8000/api/banners"
const storageURL = "http://localhost:8000/storage/"

// Normalize banner to include full image URL
function normalizeBanner(banner: Banners): Banners {
  return {
    ...banner,
    image_url: banner.image_url ? storageURL + banner.image_url : '',
  }
}

export default {
  // Get all banners
  async getAllBanners(): Promise<Banners[]> {
    const response = await axios.get(baseURL)
    const rawBanners = response.data?.data ?? []
    return rawBanners.map(normalizeBanner)
  },

  // Get banner by ID
  async getById(id: number): Promise<Banners> {
    const response = await axios.get(`${baseURL}/${id}`)
    const rawBanner = response.data?.data ?? response.data
    return normalizeBanner(rawBanner)
  },

  // Create banner
  async createBanner(formData: FormData): Promise<Banners> {
    const response = await axios.post(baseURL, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    const rawBanner = response.data?.data ?? response.data
    return normalizeBanner(rawBanner)
  },

  // Update banner
  async updateBanner(id: number, formData: FormData): Promise<Banners> {
    const response = await axios.put(`${baseURL}/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    const rawBanner = response.data?.data ?? response.data
    return normalizeBanner(rawBanner)
  },

  // Delete banner
  async delete(id: number) {
    return axios.delete(`${baseURL}/${id}`)
  },

  // Toggle banner status
  async toggleStatus(id: number, status: number): Promise<Banners> {
    const response = await axios.patch(`${baseURL}/${id}/status`, { status })
    const rawBanner = response.data?.data ?? response.data
    return normalizeBanner(rawBanner)
  },

  // Update order after drag-and-drop
  async updateOrder(banners: { id: number; view_order: number }[]) {
    return axios.post(`${baseURL}/reorder`, { banners })
  }
}
