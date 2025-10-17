<template>
    <v-data-table :headers="headers" :items="orders" class="elevation-1">
        <template #item.actions="{ item }">
            <NuxtLink :to="`/OrderManagement/${item.id}/edit`">
                <v-btn small color="primary">Detail</v-btn>
            </NuxtLink>
        </template>
    </v-data-table>
</template>

<script setup lang="ts">
defineProps<{ orders: any[] }>();

const headers = [
    { text: 'ID', value: 'id' },
    { text: 'Table', value: 'table_id' },
    { text: 'Status', value: 'status' },
    { text: 'Total Price', value: 'total_price' },
    { text: 'Actions', value: 'actions', sortable: false },
];
</script>
