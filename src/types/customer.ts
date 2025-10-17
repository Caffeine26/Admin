export interface Customer {
  id: number
  name: string
  phone_number: string | null
  email: string | null
  password: string | null
  telegram_uid: string | null
  telegram_url: string | null
  status: 'active' | 'inactive' | 'guest'
  created_at: string
  updated_at: string
}
