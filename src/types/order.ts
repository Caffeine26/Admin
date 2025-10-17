import { Product } from './product';

export interface OrderItemOption {
  id: number;
  name: string;
  price?: number;
  created_at?: string;
  updated_at?: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  base_price: number;
  price: number;
  discount: number;
  note?: string;
  options?: OrderItemOption[];
  product?: Product; // product is optional
}

export type OrderStatus = 'ordering' | 'submitted' | 'pending' | 'ready';

export interface Order {
  id: number;
  table_id: number;
  coupon_id?: number | null;
  status: OrderStatus;
  total_price: number | string;
  special_note?: string | null;
  order_time?: string | null;
  estimate_time?: string | null;
  created_at?: string;
  updated_at?: string;
  customer_id?: number | null;
  items?: OrderItem[]; // optional, some orders have no items
}
