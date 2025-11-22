import { defineStore } from 'pinia'
import { ref } from 'vue'
import tableService from '@/services/tableService.js'
import type { Tables } from '@/types/table.js'

export const useTableStore = defineStore('tableStore', () => {
  // State
  const tables = ref<Tables[]>([])
  const currentTable = ref<Tables | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Fetch all tables
  const fetchTables = async () => {
    loading.value = true
    error.value = null
    try {
      const res = await tableService.getAllTables()
      tables.value = Array.isArray(res.data) ? res.data : []
    } catch (err: any) {
      console.error('Fetch Tables Error:', err)
      error.value = err.message || 'Failed to fetch tables'
    } finally {
      loading.value = false
    }
  }

  // Create a new table
  const createTable = async (data: Partial<Tables>) => {
    loading.value = true
    error.value = null
    try {
      const res = await tableService.createTable(data)
      if (res.data) tables.value.push(res.data)
    } catch (err: any) {
      console.error('Create Table Error:', err)
      error.value = err.message || 'Failed to create table'
    } finally {
      loading.value = false
    }
  }

  // Update an existing table
  const updateTable = async (id: number, data: Partial<Tables>) => {
    loading.value = true
    error.value = null
    try {
      const res = await tableService.updateTable(id, data)
      const index = tables.value.findIndex(t => t.id === id)
      if (index !== -1 && res.data) tables.value[index] = res.data
    } catch (err: any) {
      console.error('Update Table Error:', err)
      error.value = err.message || 'Failed to update table'
    } finally {
      loading.value = false
    }
  }

  // Delete a table
  const deleteTable = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      await tableService.deleteTable(id)
      tables.value = tables.value.filter(t => t.id !== id)
    } catch (err: any) {
      console.error('Delete Table Error:', err)
      error.value = err.message || 'Failed to delete table'
    } finally {
      loading.value = false
    }
  }

  // Optional: get table by ID
  const getTableById = (id: number): Tables | undefined => {
    return tables.value.find(t => t.id === id)
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
    getTableById
  }
})
