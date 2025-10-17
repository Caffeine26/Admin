import type { Product } from './product';

export interface Customization {
  id: number;
  product_id: number;          // main product
  customization_id: number;    // linked product (add_on / modify)
  status?: '0' | '1';          // active or inactive
  created_at?: string;
  updated_at?: string;

  product?: Product;           // nested main product object
  customization?: Product;     // nested linked product object
}
