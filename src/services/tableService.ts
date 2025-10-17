import axios from 'axios'
import { Tables } from '@/types/table'

const API_URL = 'http://localhost:8000/api/tables'

export default {
  // List all tables
  getAllTables() {
    return axios.get<Tables[]>(API_URL)
  },

  // Get table by ID
  getTableById(id: number) {
    return axios.get<Tables>(`${API_URL}/${id}`)
  },

  // Create new table
  createTable(data: Partial<Tables>) {
    return axios.post<Tables>(API_URL, data)
  },

  // Update table
  updateTable(id: number, data: Partial<Tables>) {
    return axios.put<Tables>(`${API_URL}/${id}`, data)
  },

  // Delete table (optional, if you want)
  deleteTable(id: number) {
    return axios.delete(`${API_URL}/${id}`)
  }
}
