import api from "./api.js";
import { Coupons } from '@/types/coupons.js'

const API_URL = '/api/coupons'

export default {
    getAllCoupons(){
        return api.get<Coupons[]>(API_URL)
    },

    getCouponById(id:number){
        return api.get<Coupons>(`${API_URL}/${id}`)

    },
    createCoupon(payload: Omit<Coupons, 'id'| 'create_at'| 'updated_at'>){
        return api.post<Coupons>(API_URL, payload)
    },
    updateCoupon(id:number, payload: Partial<Coupons>){
        return api.put<Coupons>(`${API_URL}/${id}`, payload)

    },
    toggleActive( id: number, active:boolean){
        return api.patch<Coupons>(`${API_URL}/${id}/status`, {active})
    },

}
