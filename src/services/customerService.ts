import axios from 'axios'
import type { Customer } from '@/types/customer'

const API_URL = 'http://localhost:8000/api/customers' 
export default {
  async getAll(): Promise<Customer[]> {
    const response = await axios.get(API_URL)
    return response.data
  },

  async getById(id: number): Promise<Customer> {
    const response = await axios.get(`${API_URL}/${id}`)
    return response.data
  },

  async create(customer: Partial<Customer>): Promise<Customer> {
    const response = await axios.post(API_URL, customer)
    return response.data
  },

  async update(id: number, customer: Partial<Customer>): Promise<Customer> {
    const response = await axios.put(`${API_URL}/${id}`, customer)
    return response.data
  },

  async delete(id: number): Promise<void> {
    await axios.delete(`${API_URL}/${id}`)
  }
}
