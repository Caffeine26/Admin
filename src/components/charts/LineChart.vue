<template>
    <Line :chart-data="chartData" />
</template>

<script>
import { defineComponent } from "vue";
import { Line } from "vue-chartjs";

export default defineComponent({
    name: "LineChart",
    components: { Line },
    props: {
        chartData: { type: Object, required: true },
    },
});
</script>
