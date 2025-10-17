import { defineStore } from "pinia";
import { Promotion } from "@/types/promotions";
import PromotionService from "@/services/promotionService";

export const usePromotionStore = defineStore("promotion", {
  state: () => ({
    promotions: [] as Promotion[],
    loading: false,
    error: null as string | null,
  }),

  getters: {
    getPromotionById: (state) => {
      return (id: number) => state.promotions.find((p) => p.id === id);
    },
    activePromotions: (state) => {
      const now = new Date();
      return state.promotions.filter(
        (p) =>
          (!p.start_date || new Date(p.start_date) <= now) &&
          (!p.end_date || new Date(p.end_date) >= now)
      );
    },
  },

  actions: {
    async fetchPromotions() {
      this.loading = true;
      this.error = null;
      try {
        this.promotions = await PromotionService.getAll();
      } catch (err: any) {
        this.error = err.message || "Failed to fetch promotions";
      } finally {
        this.loading = false;
      }
    },

    async addPromotion(payload: FormData) {
      this.loading = true;
      this.error = null;
      try {
        const newPromotion = await PromotionService.create(payload);
        this.promotions.push(newPromotion);
      } catch (err: any) {
        this.error = err.message || "Failed to add promotion";
      } finally {
        this.loading = false;
      }
    },

    async updatePromotion(id: number, payload: FormData) {
      this.loading = true;
      this.error = null;
      try {
        const updated = await PromotionService.update(id, payload);
        const index = this.promotions.findIndex((p) => p.id === id);
        if (index !== -1) this.promotions[index] = updated;
      } catch (err: any) {
        this.error = err.message || "Failed to update promotion";
      } finally {
        this.loading = false;
      }
    },
    async fetchPromotionById(id: number) {
  this.loading = true;
  this.error = null;
  try {
    let promotion = this.promotions.find((p) => p.id === id);

    if (!promotion) {
      promotion = await PromotionService.getById(id);
      this.promotions.push(promotion);
    }

    return promotion;
  } catch (err: any) {
    this.error = err.message || "Failed to fetch promotion";
    throw err;
  } finally {
    this.loading = false;
  }
},


    async deletePromotion(id: number) {
      this.loading = true;
      this.error = null;
      try {
        await PromotionService.delete(id);
        this.promotions = this.promotions.filter((p) => p.id !== id);
      } catch (err: any) {
        this.error = err.message || "Failed to delete promotion";
      } finally {
        this.loading = false;
      }
    },
  },
});
