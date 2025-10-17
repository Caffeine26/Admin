import api from "./api.js";
import type { Customer } from '@/types/customer.js'

const API_URL = '/api/customers'
export default {
  async getAll(): Promise<Customer[]> {
    const response = await api.get(API_URL)
    return response.data
  },

  async getById(id: number): Promise<Customer> {
    const response = await api.get(`${API_URL}/${id}`)
    return response.data
  },

  async create(customer: Partial<Customer>): Promise<Customer> {
    const response = await api.post(API_URL, customer)
    return response.data
  },

  async update(id: number, customer: Partial<Customer>): Promise<Customer> {
    const response = await api.put(`${API_URL}/${id}`, customer)
    return response.data
  },

  async delete(id: number): Promise<void> {
    await api.delete(`${API_URL}/${id}`)
  }
}
