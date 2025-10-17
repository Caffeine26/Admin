<template>
  <v-card>
    <v-card-title class="text-success">Recent Orders</v-card-title>

    <v-data-table :headers="headers" :items="orders">


      <template v-slot:item.status="{ item }">
        <v-chip :color="statusColor(item.status)" outlined>{{ item.status }}</v-chip>
      </template>


      <template v-slot:item.progress="{ item }">
        <v-btn v-if="item.status !== 'Ready'" variant="outlined" size="small" color="success" @click="nextStep(item)">
          {{ nextLabel(item.status) }}
        </v-btn>
      </template>


      <template v-slot:item.actions="{ item }">
        <v-btn variant="text" icon @click="edit(item)">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn variant="text" icon color="error" @click="remove(item.id)">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>

    </v-data-table>
  </v-card>


  <v-dialog v-model="dialog" max-width="500">
    <v-card>
      <v-card-title>Edit Order</v-card-title>
      <v-card-text>
        <v-text-field v-model="model.table_number" label="Table Number" type="number" />
        <v-textarea v-model="model.items" label="Items (comma separated)" />
        <v-text-field v-model="model.quantity" label="Quantity" type="number" />
        <v-select v-model="model.status" :items="statuses" label="Status" />
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="dialog = false">Cancel

        </v-btn>
        <v-btn text color="primary" @click="save">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const dialog = ref(false)
const selected = ref<number | null>(null)

const orders = ref([
  { id: 1, items: 'Fish Burger, Fries', table_number: 12, quantity: 2, status: 'Accept Order' },
  { id: 2, items: 'Beef Burger', table_number: 5, quantity: 1, status: 'Preparing' },
  { id: 3, items: 'Cheese Burger, Coke', table_number: 8, quantity: 3, status: 'Ready' },
])

// Updated headers with Progress column
const headers = [
  { title: 'ID', value: 'id' },
  { title: 'Items', value: 'items' },
  { title: 'Table Number', value: 'table_number' },
  { title: 'Quantity', value: 'quantity' },
  { title: 'Status', value: 'status' },
  { title: 'Progress', value: 'progress' },
  { title: 'Actions', value: 'actions' },
]

const statuses = ['Accept Order', 'Preparing', 'Ready']

const model = ref({
  items: '',
  table_number: 0,
  quantity: 0,
  status: 'Accept Order',
})

// Status chip colors 
function statusColor(status: string) {
  switch (status) {
    case 'Accept Order': return 'orange'
    case 'Preparing': return 'blue'
    case 'Ready': return 'green'
    default: return 'grey'
  }
}

// Label for Next Step button
function nextLabel(status: string) {
  if (status === 'Accept Order') return 'Accept Order'
  if (status === 'Preparing') return 'Mark Ready'
  return ''
}

// Next Step action
function nextStep(order: any) {
  if (order.status === 'Accept Order') order.status = 'Preparing'
  else if (order.status === 'Preparing') order.status = 'Ready'
}

// Edit  or modify the order of customer 
function edit(order: any) {
  selected.value = order.id
  model.value = { ...order }
  dialog.value = true
}

// Save updated order
function save() {
  if (selected.value !== null) {
    orders.value = orders.value.map(order =>
      order.id === selected.value ? { ...model.value, id: selected.value } : order
    )
  }
  dialog.value = false
}

// Delete order
function remove(id: number) {
  orders.value = orders.value.filter(order => order.id !== id)
}
</script>
