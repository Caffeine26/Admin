export interface Promotion {
    id: number;
    name_english: string;
    name_khmer: string;
    detail_des?: string;
    date?: string | null;
    discount_type: "percentage"| "custom_price"| "item_free";
    discount_value:number;
    image?:string;
    type: "single" | "combo" | "special_package"
    start_date?: string | null;
    end_date?: string | null;
    create_at?: string | null;
    updated_at?: string | null;

}