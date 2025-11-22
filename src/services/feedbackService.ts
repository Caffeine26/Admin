import api from "./api.js";
import type { Feedback } from "@/types/feedback.js";

const API_URL = "/api/feedbacks";

export const feedbackService = {
  // Fetch all feedbacks
  getAll: async (): Promise<Feedback[]> => {
    const res = await api.get<Feedback[] | { data: Feedback[] }>(API_URL);
    const raw = Array.isArray(res.data) ? res.data : res.data.data;
    return raw.map((fb: Feedback) => ({
      ...fb,
      images: fb.images || [],
    }));
  },

  // Fetch feedback by ID
  getById: async (id: number): Promise<Feedback> => {
    const res = await api.get<Feedback | { data: Feedback }>(`${API_URL}/${id}`);
    const fb = 'data' in res.data ? res.data.data : res.data;
    return {
      ...fb,
      images: fb.images || [],
    };
  },
};
