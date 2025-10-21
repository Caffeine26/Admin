import { defineStore } from 'pinia';
import { Banners } from '@/types/banner.js';
import bannerService from '@/services/bannerService.js';

export const useBannerStore = defineStore('banner', {
  state: () => ({
    banners: [] as Banners[],
    loading: false
  }),

  actions: {
    async fetchBanners() {
      this.loading = true
      try {
        this.banners = await bannerService.getAllBanners()
      } finally {
        this.loading = false
      }
    },

    async createBanner(formData: FormData) {
      const banner = await bannerService.createBanner(formData)
      this.banners.push(banner);
    },

    async updateBanner(id: number, formData: FormData) {
      const updated = await bannerService.updateBanner(id, formData)
      const index = this.banners.findIndex(b => b.id === id)
      if (index !== -1) this.banners[index] = updated
    },

    async deleteBanner(id: number) {
      await bannerService.delete(id)
      this.banners = this.banners.filter(b => b.id !== id)
    },

    async toggleStatus(banner: Banners) {
      const newStatus = banner.status === 1 ? 0 : 1
      const updated = await bannerService.toggleStatus(banner.id, newStatus)
      const index = this.banners.findIndex(b => b.id === banner.id)
      if (index !== -1) this.banners[index] = updated
    },

    async updateOrder() {
    // Recalculate view_order based on current array order
    const payload = this.banners.map((b, index) => ({
        id: b.id,
        view_order: index + 1, // start from 1
    }));

    await bannerService.updateOrder(payload);

    // Update local state so frontend stays in sync
    this.banners.forEach((b, index) => b.view_order = index + 1);
}

  }
})
