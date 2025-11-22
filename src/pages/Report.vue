<template>
  <div>
    <!-- Your existing table or content -->
    <BarChart :chart-data="ratingChartData" />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import BarChart from "@/components/charts/BarChart.vue";
import { useFeedbackStore } from "@/stores/feedbackStore.js";

const store = useFeedbackStore();

// Compute chart data based on feedback ratings
const ratingChartData = computed(() => {
  // Example: count how many feedbacks for each rating 1–5
  const counts = [0, 0, 0, 0, 0]; // index 0 = rating 1, index 4 = rating 5

  (store.feedbacks || []).forEach(fb => {
    if (fb.rating >= 1 && fb.rating <= 5) {
      counts[fb.rating - 1]++;
    }
  });

  return {
    labels: ["1⭐", "2⭐", "3⭐", "4⭐", "5⭐"],
    datasets: [
      {
        label: "Feedback Ratings",
        data: counts,
        backgroundColor: [
          "#f44336", // red
          "#ff9800", // orange
          "#ffeb3b", // yellow
          "#4caf50", // green
          "#2196f3"  // blue
        ],
      },
    ],
  };
});
</script>
