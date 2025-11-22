import { defineStore } from 'pinia';
import type { Product } from '@/types/product.js';
import type { Customization } from '@/types/customization.js';
import productCustomizationService from '@/services/product-customizationService.js';

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
      const grouped = await productCustomizationService.create(payload);
      this.customizations = grouped;
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

 
async deleteCustomization(productId: number) {
  this.loading = true;
  try {
    await productCustomizationService.delete(productId);
    this.customizationRows = this.customizationRows.filter(
      row => row.product.id !== productId
    );
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
