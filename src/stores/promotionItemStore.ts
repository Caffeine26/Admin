import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { PromotionItem } from '@/types/promotionitem'
import { promotionItemService } from '@/services/promotionItemService'

export const usePromotionItemStore = defineStore('promotionItemStore', () => {
  const promotionItems = ref<PromotionItem[]>([])
  const loading = ref(false)

  async function fetchPromotionItems() {
    loading.value = true
    try {
      promotionItems.value = await promotionItemService.fetchAll()
    } catch (error) {
      console.error('Failed to fetch promotion items:', error)
    } finally {
      loading.value = false
    }
  }

  async function addPromotionItem(data: Partial<PromotionItem>) {
    const newItem = await promotionItemService.create(data)
    promotionItems.value.push(newItem)
  }

  async function updatePromotionItem(id: number, data: Partial<PromotionItem>) {
    const updated = await promotionItemService.update(id, data)
    const index = promotionItems.value.findIndex(i => i.id === id)
    if (index !== -1) promotionItems.value[index] = updated
  }

  async function deletePromotionItem(id: number) {
    await promotionItemService.delete(id)
    promotionItems.value = promotionItems.value.filter(i => i.id !== id)
  }

  // Utility: check if a product is in any promotion
  function getPromotionItemsByProduct(productId: number) {
    return promotionItems.value.filter(i => i.product_id === productId)
  }

  return {
    promotionItems,
    loading,
    fetchPromotionItems,
    addPromotionItem,
    updatePromotionItem,
    deletePromotionItem,
    getPromotionItemsByProduct,
  }
})
