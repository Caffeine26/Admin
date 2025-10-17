import axios from "axios";
import { Promotion } from "@/types/promotions";

const API_URL = "http://localhost:8000/api/promotions";

export default {
  getAll(): Promise<Promotion[]> {
    return axios.get(API_URL).then((res) => res.data.data);
  },

  getById(id: number): Promise<Promotion> {
    return axios.get(`${API_URL}/${id}`).then((res) => res.data.data);
  },

  
  create(payload: FormData): Promise<Promotion> {
    return axios
      .post(API_URL, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => res.data.data);
  },

  update(id: number, payload: FormData): Promise<Promotion> {
    return axios
      .post(`${API_URL}/${id}?_method=PUT`, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => res.data.data);
  },

  delete(id: number): Promise<void> {
    return axios.delete(`${API_URL}/${id}`).then(() => {});
  },
};
