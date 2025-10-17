export interface Category {
  id: number;
  name_khmer?: string;
  name_english?: string;
  image?: string;
  image_url?: string;
  products_count?: number; // matches backend JSON
}
