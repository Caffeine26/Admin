<template>
  <ApexChart
    type="bar"
    :series="series"
    :options="options"
    height="350"
  />
</template>

<script setup lang="ts">
import ApexChart from 'vue3-apexcharts'
import { computed, defineProps } from 'vue'

interface BarChartItem {
  label: string
  value: number
}

const props = defineProps<{
  data: BarChartItem[]
  title?: string
}>()

const series = computed(() => [
  { name: 'Orders', data: props.data.map(d => d.value) }
])

const options = computed(() => ({
  chart: { id: 'bar-chart' },
  xaxis: { categories: props.data.map(d => d.label) },
  yaxis: { title: { text: 'Number of Orders' } },
  dataLabels: { enabled: true },
  title: { text: props.title || 'Orders Report', align: 'center' }
}))
</script>
