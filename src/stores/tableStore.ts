import { defineStore } from 'pinia'
import { ref } from 'vue'
import tableService from '@/services/tableService'
import { Tables } from '@/types/table'

export const useTableStore = defineStore('tableStore', () => {
  const tables = ref<Tables[]>([])
  const currentTable = ref<Tables | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Fetch all tables from backend
  async function fetchTables() {
    loading.value = true
    error.value = null
    try {
      const res = await tableService.getAllTables()
      tables.value = res.data  // ensure res.data is the array of tables
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch tables'
    } finally {
      loading.value = false
    }
  }

  // Create a new table
  async function createTable(data: Partial<Tables>) {
    loading.value = true
    error.value = null
    try {
      const res = await tableService.createTable(data)
      tables.value.push(res.data)
    } catch (err: any) {
      error.value = err.message || 'Failed to create table'
    } finally {
      loading.value = false
    }
  }

  // Update an existing table
  async function updateTable(id: number, data: Partial<Tables>) {
    loading.value = true
    error.value = null
    try {
      const res = await tableService.updateTable(id, data)
      const index = tables.value.findIndex(t => t.id === id)
      if (index !== -1) tables.value[index] = res.data
    } catch (err: any) {
      error.value = err.message || 'Failed to update table'
    } finally {
      loading.value = false
    }
  }

  // Delete a table
  async function deleteTable(id: number) {
    loading.value = true
    error.value = null
    try {
      await tableService.deleteTable(id)
      tables.value = tables.value.filter(t => t.id !== id)
    } catch (err: any) {
      error.value = err.message || 'Failed to delete table'
    } finally {
      loading.value = false
    }
  }

  return {
    tables,
    currentTable,
    loading,
    error,
    fetchTables,
    createTable,
    updateTable,
    deleteTable,
  }
})
