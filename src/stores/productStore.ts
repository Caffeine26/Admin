import { defineStore } from 'pinia'
import productService from '@/services/productService'
import { Product } from '@/types/product'

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [] as Product[],
    loading: false,
  }),

  actions: {
    async fetchingProducts() {
      this.loading = true
      try {
        const response = await productService.getAll()
        this.products = response.data.data
      } catch (error) {
        console.error('Failed to fetch products', error)
      } finally {
        this.loading = false
      }
    },

    async createProducts(formData: FormData) {
      this.loading = true
      try {
        await productService.create(formData)
        await this.fetchingProducts()
      } catch (error) {
        console.error('Failed to create product', error)
      } finally {
        this.loading = false
      }
    },

    async updateProducts(id: number, formData: FormData) {
      this.loading = true
      try {
        await productService.update(id, formData)
        await this.fetchingProducts()
      } catch (error) {
        console.error('Failed to update product', error)
      } finally {
        this.loading = false
      }
    },

    async deleteProducts(id: number) {
      this.loading = true
      try {
        await productService.delete(id)
        await this.fetchingProducts()
      } catch (error) {
        console.error('Failed to delete product', error)
      } finally {
        this.loading = false
      }
    },

    async getProductById(id: number) {
  this.loading = true
  try {
    const response = await productService.getById(id)
    return {
      ...response.data,
      final_price: response.data.final_price ?? 0,
      rate: response.data.rate ?? 0,
    } as Product
  } catch (error) {
    console.error(`Failed to fetch product with id ${id}`, error)
    return null
  } finally {
    this.loading = false
  }
}

  },
})
