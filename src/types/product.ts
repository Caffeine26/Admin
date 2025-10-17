export interface Product {
    id: number;
    name: string;
    price: number;
    final_price: number;
    category_id: number;
    description?: string;
    rate?: number;
    type?: 'menu' | 'add_on' | 'modify';
    parent_id?: number | null;
    image_url?: string;
}
