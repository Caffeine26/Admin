<template>
    <v-container>
        <div class="d-flex justify-space-between align-center mb-6">
            <h1>Create New Order</h1>
            <v-btn color="secondary" @click="goBack" prepend-icon="mdi-arrow-left">
                Back
            </v-btn>
        </div>

        <v-form ref="form" v-model="valid" lazy-validation>
            <v-row>
                <!-- Table ID -->
                <v-col cols="12" md="6">
                    <v-text-field v-model="order.table_id" label="Table ID" type="number"
                        :rules="[v => !!v || 'Table ID is required']" required />
                </v-col>

                <!-- Status -->
                <v-col cols="12" md="6">
                    <v-select v-model="order.status" :items="statuses" label="Order Status"
                        :rules="[v => !!v || 'Status is required']" required />
                </v-col>

                <!-- Special Note -->
                <v-col cols="12">
                    <v-textarea v-model="order.special_note" label="Special Note" auto-grow />
                </v-col>

                <!-- Items Section -->
                <v-col cols="12">
                    <h3>Order Items</h3>
                    <v-divider class="mb-2"></v-divider>

                    <!-- Products -->
                    <v-row>
                        <v-col v-for="product in products" :key="product.id" cols="12" sm="6" md="4">
                            <v-card outlined>
                                <v-card-title>{{ product.name }}</v-card-title>
                                <v-card-subtitle>{{ product.price }} $</v-card-subtitle>
                                <v-card-actions>
                                    <v-btn color="primary" @click="addProductToOrder(product)">
                                        Add
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-col>
                    </v-row>

                    <!-- Selected Items -->
                    <v-row class="mt-4">
                        <v-col v-for="(item, index) in order.items" :key="index" cols="12">
                            <v-chip close @click:close="removeItem(index)">
                                {{ item.product_name }} x {{ item.quantity }}
                                <span v-if="item.customizations?.length">
                                    ({{item.customizations.map(c => c.name).join(", ")}})
                                </span>
                            </v-chip>
                        </v-col>
                    </v-row>
                </v-col>

                <!-- Submit -->
                <v-col cols="12" class="mt-6">
                    <v-btn color="success" @click="submitOrder" :disabled="!valid">
                        Create Order
                    </v-btn>
                </v-col>
            </v-row>
        </v-form>
    </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useOrderStore } from "@/stores/orderStore.js";
import { useProductStore } from "@/stores/productStore.js";
import { useProductCustomizationStore } from "@/stores/customizationStore.js";
import type { OrderStatus } from "@/types/order.js";

// Stores
const router = useRouter();
const orderStore = useOrderStore();
const productStore = useProductStore();
const customizationStore = useProductCustomizationStore();
const valid = ref(false);

// Statuses
const statuses: OrderStatus[] = ["ordering", "submitted", "pending", "ready"];

// Types for submission
interface CreateOrderItem {
    product_id: number;
    quantity: number;
    price: number;
    customizations?: { id: number; name: string; price?: number }[];
}

interface CreateOrderDTO {
    table_id: number;
    status: OrderStatus;
    special_note?: string;
    total_price: number;
    items: CreateOrderItem[];
}

// Local state
interface OrderItem extends CreateOrderItem {
    product_name: string;
}

const order = ref({
    table_id: null as number | null,
    status: "submitted" as OrderStatus,
    special_note: "",
    items: [] as OrderItem[],
});

const products = ref<any[]>([]);
const selectedCustomizations = ref<{ [key: number]: number[] }>({});

// Fetch products & customizations
onMounted(async () => {
    await productStore.fetchingProducts();
    await customizationStore.fetchAll();

    products.value = productStore.products.map((p) => ({
        ...p,
        customize: customizationStore.getById(p.id),
    }));
});

// Add product with optional customizations
const addProductToOrder = (product: any) => {
    const existing = order.value.items.find((i) => i.product_id === product.id);
    if (existing) {
        existing.quantity += 1;
    } else {
        const customizations =
            selectedCustomizations.value[product.id]?.map((id) => {
                const c = product.customize.find((cu: any) => cu.id === id);
                return { id: c.id, name: c.name, price: c.price || 0 };
            }) || [];

        order.value.items.push({
            product_id: product.id,
            product_name: product.name,
            quantity: 1,
            price: product.price,
            customizations,
        });
    }
};

// Remove item
const removeItem = (index: number) => order.value.items.splice(index, 1);

// Submit order
const submitOrder = async () => {
    if (!(valid.value && order.value.table_id && order.value.items.length)) {
        return alert("Please fill all required fields and add at least 1 item!");
    }

    // Calculate total price including customizations
    const total_price = order.value.items.reduce(
        (sum, i) =>
            sum +
            i.quantity * (i.price + (i.customizations?.reduce((cSum, c) => cSum + (c.price || 0), 0) || 0)),
        0
    );

    // Map order items to backend payload
    const payload: CreateOrderDTO = {
        table_id: order.value.table_id!,
        status: order.value.status,
        special_note: order.value.special_note,
        total_price,
        items: order.value.items.map((i) => ({
            product_id: i.product_id,
            quantity: i.quantity,
            price: i.price,
            customizations: i.customizations?.map((c) => ({
                id: c.id,
                name: c.name,
                price: c.price || 0,
            })),
        })),
    };

    // Call store method
    const newOrder = await orderStore.createOrder(payload);

    if (newOrder) router.push("/OrderManagement");
    else alert("Failed to create order.");
};

// Go back
const goBack = () => router.push("/OrderManagement");
</script>
