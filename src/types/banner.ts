export interface Banners{
    id: number;
    image_url?: string;
    type: 'display'|'redirect';
    view_order: number;
    link_url?: string;
    status?: 1| 0;

}