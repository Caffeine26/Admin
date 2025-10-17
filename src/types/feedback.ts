export interface FeedbackRating {
  id: number;
  feedback_id: number;
  type: string;
  value: number;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: number;
  name: string;
  phone_number?: string;
  email?: string;
  telegram_url?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Feedback {
  id: number;
  order_id: number;
  table_id: number;
  customer_id?: number;
  comment?: string;
  images?: string[];
  rating: number;
  created_at: string;
  updated_at: string;
  ratings?: FeedbackRating[];
  customer?: Customer;
}
