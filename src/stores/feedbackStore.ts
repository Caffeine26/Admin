import { defineStore } from 'pinia';
import { ref } from 'vue';
import feedbackService from '@/services/feedbackService';
import type { Feedback } from '@/types/feedback';

export const useFeedbackStore = defineStore('feedback', () => {
  const feedbacks = ref<Feedback[]>([]);
  const loading = ref(false);

  const fetchFeedbacks = async () => {
    loading.value = true;
    try {
      const data = await feedbackService.getAll();
      const BASE_URL = 'http://localhost:8000';
      feedbacks.value = data.map(fb => ({
        ...fb,
        images: fb.images?.map(img => img.startsWith('http') ? img : `${BASE_URL}${img}`) || []
      }));
    } finally {
      loading.value = false;
    }
  };

  return { feedbacks, loading, fetchFeedbacks };
});
