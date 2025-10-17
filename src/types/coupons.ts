export interface Coupons {
    id: number;
    code: string;
    description?: string;
    name_english: string;
    min_order: number;
    discount_type: 'percent' | 'decimal'
    discount: number;
    start_date: string;
    end_date: string;
    active: boolean;
    
}