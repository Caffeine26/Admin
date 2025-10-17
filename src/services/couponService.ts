import axios from 'axios'
import { Coupons } from '@/types/coupons'

const API_URL = 'http://localhost:8000/api/coupons'

export default {
    getAllCoupons(){
        return axios.get<Coupons[]>(API_URL)
    },

    getCouponById(id:number){
        return axios.get<Coupons>(`${API_URL}/${id}`)

    },
    createCoupon(payload: Omit<Coupons, 'id'| 'create_at'| 'updated_at'>){
        return axios.post<Coupons>(API_URL, payload)
    },
    updateCoupon(id:number, payload: Partial<Coupons>){
        return axios.put<Coupons>(`${API_URL}/${id}`, payload)

    },
    toggleActive( id: number, active:boolean){
        return axios.patch<Coupons>(`${API_URL}/${id}/status`, {active})
    },
    
}