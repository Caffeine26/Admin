import api from "./api.js";
import type { PromotionItem } from '@/types/promotionitem.js'

const API_URL = '/api/promotion-item'

export const promotionItemService = {
  async fetchAll(): Promise<PromotionItem[]> {
    const res = await api.get(API_URL)
    return res.data.data
  },

  async create(data: Partial<PromotionItem>): Promise<PromotionItem> {
    const res = await api.post(API_URL, data)
    return res.data.data
  },

  async update(id: number, data: Partial<PromotionItem>): Promise<PromotionItem> {
    const res = await api.put(`${API_URL}/${id}`, data)
    return res.data.data
  },

  async delete(id: number): Promise<void> {
    await api.delete(`${API_URL}/${id}`)
  }
}
