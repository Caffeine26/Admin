import { defineStore } from 'pinia';
import type { Product } from '@/types/product';
import type { Customization } from '@/types/customization';
import productCustomizationService from '@/services/product-customizationService';

export interface GroupedCustomizations {
  menu: Product[];
  add_on: Product[];
  modify: Product[];
}

export const useProductCustomizationStore = defineStore('productCustomization', {
  state: () => ({
   
    customizations: {
      menu: [],
      add_on: [],
      modify: [],
    } as GroupedCustomizations,

   
    customizationRows: [] as Customization[],

    loading: false,
  }),

  actions: {
    async fetchAll() {
      this.loading = true;
      try {
        // fetch all as array of Customization
        this.customizationRows = await productCustomizationService.getAll();
      } catch (err) {
        console.error('Failed to fetch customizations', err);
      } finally {
        this.loading = false;
      }
    },

    async getById(id: number) {
      this.loading = true;
      try {
        return await productCustomizationService.getById(id);
      } catch (err) {
        console.error('Failed to fetch customization', err);
        return null;
      } finally {
        this.loading = false;
      }
    },

    async create(payload: any) {
      this.loading = true;
      try {
        // create returns grouped structure
        const grouped = await productCustomizationService.create(payload);
        this.customizations = grouped;

        // refresh list of single rows
        await this.fetchAll();
      } catch (err) {
        console.error('Failed to create customization', err);
      } finally {
        this.loading = false;
      }
    },

    async update(id: number, payload: any) {
      this.loading = true;
      try {
        const grouped = await productCustomizationService.update(id, payload);
        this.customizations = grouped;
        await this.fetchAll();
      } catch (err) {
        console.error('Failed to update customization', err);
      } finally {
        this.loading = false;
      }
    },

    async delete(id: number) {
      this.loading = true;
      try {
        await productCustomizationService.delete(id);
        await this.fetchAll();
      } catch (err) {
        console.error('Failed to delete customization', err);
      } finally {
        this.loading = false;
      }
    },

    async optionsByProduct(productId: number) {
      this.loading = true;
      try {
        const grouped = await productCustomizationService.optionsByProduct(productId);
        this.customizations = grouped;
        return grouped;
      } catch (err) {
        console.error('Failed to fetch product options', err);
        return { menu: [], add_on: [], modify: [] };
      } finally {
        this.loading = false;
      }
    },
  },
});
