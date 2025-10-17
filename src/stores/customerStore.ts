import { defineStore } from 'pinia'
import { ref } from 'vue'
import customerService from '@/services/customerService'
import type { Customer } from '@/types/customer'

export const useCustomerStore = defineStore('customerStore', () => {
  // 🧠 State
  const customers = ref<Customer[]>([])
  const currentCustomer = ref<Customer | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // 📦 Actions
  const fetchCustomers = async () => {
    loading.value = true
    error.value = null
    try {
      customers.value = await customerService.getAll()
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch customers'
    } finally {
      loading.value = false
    }
  }

  const fetchCustomerById = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      currentCustomer.value = await customerService.getById(id)
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch customer'
    } finally {
      loading.value = false
    }
  }

  const addCustomer = async (data: Partial<Customer>) => {
    loading.value = true
    error.value = null
    try {
      const newCustomer = await customerService.create(data)
      customers.value.push(newCustomer)
    } catch (err: any) {
      error.value = err.message || 'Failed to create customer'
    } finally {
      loading.value = false
    }
  }

  const updateCustomer = async (id: number, data: Partial<Customer>) => {
    loading.value = true
    error.value = null
    try {
      const updated = await customerService.update(id, data)
      const idx = customers.value.findIndex(c => c.id === id)
      if (idx !== -1) customers.value[idx] = updated
    } catch (err: any) {
      error.value = err.message || 'Failed to update customer'
    } finally {
      loading.value = false
    }
  }

  const deleteCustomer = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      await customerService.delete(id)
      customers.value = customers.value.filter(c => c.id !== id)
    } catch (err: any) {
      error.value = err.message || 'Failed to delete customer'
    } finally {
      loading.value = false
    }
  }

  return {
    customers,
    currentCustomer,
    loading,
    error,
    fetchCustomers,
    fetchCustomerById,
    addCustomer,
    updateCustomer,
    deleteCustomer
  }
})
