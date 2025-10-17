import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { Order, OrderStatus } from '@/types/order';
import { orderService } from '@/services/orderService';

export const useOrderStore = defineStore('order', () => {
  const orders = ref<Order[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const totalOrders = computed(() => orders.value.length);
  const pendingOrders = computed(() => orders.value.filter(o => o.status === 'pending'));
  const readyOrders = computed(() => orders.value.filter(o => o.status === 'ready'));

  const fetchOrders = async () => {
    loading.value = true;
    error.value = null;
    try {
      orders.value = await orderService.getAll();
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch orders';
    } finally {
      loading.value = false;
    }
  };

  const getOrderById = async (id: number): Promise<Order | null> => {
    loading.value = true;
    error.value = null;
    try {
      return await orderService.getById(id);
    } catch (err: any) {
      error.value = err.message || `Failed to fetch order ${id}`;
      return null;
    } finally {
      loading.value = false;
    }
  };

  const updateOrderStatus = async (id: number, status: OrderStatus): Promise<Order | null> => {
    loading.value = true;
    error.value = null;
    try {
      const updated = await orderService.updateStatus(id, status);
      const idx = orders.value.findIndex(o => o.id === id);
      if (idx !== -1) orders.value[idx] = updated;
      return updated;
    } catch (err: any) {
      error.value = err.message || `Failed to update status for order ${id}`;
      return null;
    } finally {
      loading.value = false;
    }
  };
  const createOrder = async (orderData: Partial<Order>): Promise<Order | null> => {
  loading.value = true;
  error.value = null;
  try {
    const newOrder = await orderService.createOrder(orderData);
    orders.value.push(newOrder); // add the new order to the local store
    return newOrder;
  } catch (err: any) {
    error.value = err.message || 'Failed to create order';
    return null;
  } finally {
    loading.value = false;
  }
};


  const deleteOrder = async (id: number): Promise<boolean> => {
    loading.value = true;
    error.value = null;
    try {
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

  return {
    orders,
    loading,
    error,
    totalOrders,
    pendingOrders,
    readyOrders,
    fetchOrders,
    getOrderById,
    updateOrderStatus,
    deleteOrder,
    createOrder,
  };
});
