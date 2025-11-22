import { defineStore } from "pinia";
import { ref } from "vue";
import { feedbackService } from "@/services/feedbackService.js";
import type { Feedback } from "@/types/feedback.js";

export const useFeedbackStore = defineStore("feedback", () => {
  const feedbacks = ref<Feedback[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Fetch all feedbacks
  const fetchFeedbacks = async () => {
    loading.value = true;
    error.value = null;
    try {
      const data = await feedbackService.getAll();
      feedbacks.value = data.map(fb => ({
        ...fb,
        images: fb.images?.map((img: string) =>
          img.startsWith("http") ? img : `${import.meta.env.VITE_API_BASE_URL_STORAGE}${img.replace(/^\/storage\//, "")}`
        ) || [],
      }));
    } catch (err: any) {
      error.value = err.message || "Failed to fetch feedbacks";
    } finally {
      loading.value = false;
    }
  };

  // Fetch feedback by ID
  const fetchFeedbackById = async (id: number) => {
    loading.value = true;
    error.value = null;
    try {
      const fb = await feedbackService.getById(id);
      return {
        ...fb,
        images: fb.images?.map((img: string) =>
          img.startsWith("http") ? img : `${import.meta.env.VITE_API_BASE_URL_STORAGE}${img.replace(/^\/storage\//, "")}`
        ) || [],
      };
    } catch (err: any) {
      error.value = err.message || "Failed to fetch feedback";
      return null;
    } finally {
      loading.value = false;
    }
  };

  // -----------------------------
  // Get feedbacks by time period
  // -----------------------------
  const getFeedbacksByPeriod = (period: "Today" | "Yesterday" | "This Week" | "This Month" | "All") => {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfYesterday = new Date(startOfDay.getTime() - 24 * 60 * 60 * 1000);
    const startOfWeek = new Date(startOfDay);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Sunday start
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    return feedbacks.value.filter(fb => {
      const fbDate = new Date(fb.created_at); // make sure `created_at` exists
      switch (period) {
        case "Today": return fbDate >= startOfDay;
        case "Yesterday": return fbDate >= startOfYesterday && fbDate < startOfDay;
        case "This Week": return fbDate >= startOfWeek;
        case "This Month": return fbDate >= startOfMonth;
        case "All": default: return true;
      }
    });
  };

  return {
    feedbacks,
    loading,
    error,
    fetchFeedbacks,
    fetchFeedbackById,
    getFeedbacksByPeriod, // <-- expose this
  };
});
