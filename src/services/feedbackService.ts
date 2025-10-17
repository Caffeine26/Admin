import axios from 'axios';
import type { Feedback } from '@/types/feedback';

const API_URL = 'http://localhost:8000/api/feedbacks'; 

export default {
  getAll: async (): Promise<Feedback[]> => {
    const { data } = await axios.get<Feedback[]>(API_URL);
    return data;
  },

  getById: async (id: number): Promise<Feedback> => {
    const { data } = await axios.get<Feedback>(`${API_URL}/${id}`);
    return data;
  }
};
