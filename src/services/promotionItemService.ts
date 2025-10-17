import axios from 'axios'
import type { PromotionItem } from '@/types/promotionitem'

const API_URL = 'http://localhost:8000/api/promotion-item'

export const promotionItemService = {
  async fetchAll(): Promise<PromotionItem[]> {
    const res = await axios.get(API_URL)
    return res.data.data
  },

  async create(data: Partial<PromotionItem>): Promise<PromotionItem> {
    const res = await axios.post(API_URL, data)
    return res.data.data
  },

  async update(id: number, data: Partial<PromotionItem>): Promise<PromotionItem> {
    const res = await axios.put(`${API_URL}/${id}`, data)
    return res.data.data
  },

  async delete(id: number): Promise<void> {
    await axios.delete(`${API_URL}/${id}`)
  }
}
