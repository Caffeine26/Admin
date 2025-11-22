import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Order, OrderStatus } from '@/types/order.js';
import { orderService } from '@/services/orderService.js';

export const useOrderStore = defineStore('order', () => {
  // ---------------------------
  // State
  // ---------------------------
  const orders = ref<Order[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // ---------------------------
  // Getters
  // ---------------------------
  const totalOrders = computed(() => orders.value.length);
  const submittedOrders = computed(() => orders.value.filter(o => o.status === 'submitted'));
  const readyOrders = computed(() => orders.value.filter(o => o.status === 'ready'));

  // ---------------------------
  // Actions
  // ---------------------------
const fetchOrders = async () => {
  loading.value = true;
  error.value = null;
  try {
    const data = await orderService.getAll();

    // Sort by latest first
    orders.value = data
      .sort((a: Order, b: Order) => b.id - a.id)
      .map((o: Order) => ({ ...o, items: o.items || [] }));
  } catch (err: any) {
    error.value = err.message || 'Failed to fetch orders';
  } finally {
    loading.value = false;
  }
};



  const getOrderById = async (id: number): Promise<Order | null> => {
    try {
      loading.value = true;
      error.value = null;
      const order = await orderService.getById(id);
      return order;
    } catch (err: any) {
      error.value = err.message || `Failed to fetch order ${id}`;
      return null;
    } finally {
      loading.value = false;
    }
  };

  const updateOrderStatus = async (id: number, status: OrderStatus): Promise<Order | null> => {
  try {
    loading.value = true;
    error.value = null;

    // Update backend
    await orderService.updateStatus(id, status);

    // Fetch full updated order including items
    const updatedOrder = await orderService.getById(id);

    // Update local store (replace full object)
    const idx = orders.value.findIndex(o => o.id === id);
    if (idx !== -1 && updatedOrder) orders.value[idx] = { ...updatedOrder, items: updatedOrder.items || [] };

    return updatedOrder || null;
  } catch (err: any) {
    error.value = err.message || `Failed to update order ${id}`;
    return null;
  } finally {
    loading.value = false;
  }
};


  const createOrder = async (orderData: Partial<Order>): Promise<Order | null> => {
    try {
      loading.value = true;
      error.value = null;

      const newOrder = await orderService.createOrder(orderData);
      orders.value.unshift(newOrder); // Add new order to top
      return newOrder;
    } catch (err: any) {
      error.value = err.message || 'Failed to create order';
      return null;
    } finally {
      loading.value = false;
    }
  };

  const deleteOrder = async (id: number): Promise<boolean> => {
    try {
      loading.value = true;
      error.value = null;

      await orderService.deleteOrder(id);
      orders.value = orders.value.filter(o => o.id !== id);
      return true;
    } catch (err: any) {
      error.value = err.message || `Failed to delete order ${id}`;
      return false;
    } finally {
      loading.value = false;
    }
  };

  // ---------------------------
  // Return State, Getters, Actions
  // ---------------------------
  return {
    orders,
    loading,
    error,
    totalOrders,
    submittedOrders,
    readyOrders,
    fetchOrders,
    getOrderById,
    updateOrderStatus,
    deleteOrder,
    createOrder,
  };
});
