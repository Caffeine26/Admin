import api from "./api.js";
import { Promotion } from "@/types/promotions.js";

const API_URL = "/api/promotions";

export default {
  getAll(): Promise<Promotion[]> {
    return api.get(API_URL).then((res) => res.data.data);
  },

  getById(id: number): Promise<Promotion> {
    return api.get(`${API_URL}/${id}`).then((res) => res.data.data);
  },


  create(payload: FormData): Promise<Promotion> {
    return api.post(API_URL, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => res.data.data);
  },

  update(id: number, payload: FormData): Promise<Promotion> {
    return api.post(`${API_URL}/${id}?_method=PUT`, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => res.data.data);
  },

  delete(id: number): Promise<void> {
    return api.delete(`${API_URL}/${id}`).then(() => {});
  },
};
