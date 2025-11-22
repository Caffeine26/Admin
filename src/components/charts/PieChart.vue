<template>
  <ApexChart
    type="donut"
    :series="seriesValues"
    :options="chartOptions"
    height="350"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface PieItem {
  label: string
  value: number
}

const props = defineProps<{
  seriesData: PieItem[]
}>()

// Extract values for ApexCharts
const seriesValues = computed(() => props.seriesData.map(d => d.value))

// Chart options
const chartOptions = computed(() => ({
  labels: props.seriesData.map(d => d.label),
  legend: { position: 'bottom' },
  tooltip: { enabled: true, y: { formatter: (val: number) => val.toFixed(2) } },
  dataLabels: {
    enabled: true,
    formatter: (val: number, opts: any) => {
      const i = opts.seriesIndex
      return props.seriesData[i].value.toFixed(2) // show actual average, not percentage
    },
  },
  plotOptions: {
    pie: {
      donut: {
        size: '50%',       // adjust the size of the donut hole
        labels: {
          show: true,
          name: { show: true },
          value: { show: true, formatter: (val: number) => val.toFixed(2) },
        },
      },
    },
  },
  responsive: [
    {
      breakpoint: 480,
      options: { chart: { width: 300 }, legend: { position: 'bottom' } },
    },
  ],
}))
</script>
