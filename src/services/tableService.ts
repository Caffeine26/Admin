import api from "./api.js";
import { Tables } from '@/types/table.js'

const API_URL = '/api/tables'

export default {
  // List all tables
  getAllTables() {
    return api.get<Tables[]>(API_URL)
  },

  // Get table by ID
  getTableById(id: number) {
    return api.get<Tables>(`${API_URL}/${id}`)
  },

  // Create new table
  createTable(data: Partial<Tables>) {
    return api.post<Tables>(API_URL, data)
  },

  // Update table
  updateTable(id: number, data: Partial<Tables>) {
    return api.put<Tables>(`${API_URL}/${id}`, data)
  },

  // Delete table (optional, if you want)
  deleteTable(id: number) {
    return api.delete(`${API_URL}/${id}`)
  }
}
