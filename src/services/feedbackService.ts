import api from "./api.js";
import type { Feedback } from '@/types/feedback.js';

const API_URL = '/api/feedbacks';

export default {
  getAll: async (): Promise<Feedback[]> => {
    const { data } = await api.get<Feedback[]>(API_URL);
    return data;
  },

  getById: async (id: number): Promise<Feedback> => {
    const { data } = await api.get<Feedback>(`${API_URL}/${id}`);
    return data;
  }
};
