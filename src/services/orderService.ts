
import axios from 'axios';
import { Order } from '@/types/order';

const API_URL = 'http://localhost:8000/api/orders'; // adjust to your backend

export const orderService = {
  getAll: async (): Promise<Order[]> => {
    const res = await axios.get(API_URL);
    const raw = res.data?.data || [];
    return raw.map((o: any) => ({ ...o, items: o.items || [] }));
  },

  getById: async (id: number): Promise<Order> => {
    const res = await axios.get(`${API_URL}/${id}`);
    const o = res.data?.data;
    return { ...o, items: o.items || [] };
  },

  updateStatus: async (id: number, status: string): Promise<Order> => {
    // PATCH used to update partial resource (status)
    const res = await axios.patch(`${API_URL}/${id}`, { status });
    const o = res.data?.order || res.data?.data || res.data;
    return { ...o, items: o.items || [] };
  },
  createOrder: async (orderData: Partial<Order>): Promise<Order> => {
    const res = await axios.post(API_URL, orderData);
    const o = res.data?.order || res.data?.data || res.data;
    return { ...o, items: o.items || [] };
  },

  deleteOrder: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
  },
};
