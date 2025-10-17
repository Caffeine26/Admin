
import { defineStore } from 'pinia'
import couponService from '@/services/couponService'
import type { Coupons } from '@/types/coupons'

export const useCouponStore = defineStore('coupon', {
  state: () => ({
    coupons: [] as Coupons[],
    loading: false,
    error: null as string | null
  }),

  actions: {
    async fetchCoupons() {
      this.loading = true
      this.error = null
      try {
        const response = await couponService.getAllCoupons()
        this.coupons = response.data
      } catch (err: any) {
        this.error = err.message || 'Failed to fetch coupons'
      } finally {
        this.loading = false
      }
    },

    async createCoupon(payload: Omit<Coupons, 'id' | 'created_at' | 'updated_at'>) {
      const response = await couponService.createCoupon(payload)
      this.coupons.push(response.data)
      return response.data
    },

    async updateCoupon(id: number, payload: Partial<Coupons>) {
      const response = await couponService.updateCoupon(id, payload)
      const index = this.coupons.findIndex(c => c.id === id)
      if (index !== -1) this.coupons[index] = response.data
      return response.data
    },

    async toggleCouponStatus(id: number, active: boolean) {
      const response = await couponService.toggleActive(id, active)
      const index = this.coupons.findIndex(c => c.id === id)
      if (index !== -1) this.coupons[index] = response.data
      return response.data
    },

   
  }
})
