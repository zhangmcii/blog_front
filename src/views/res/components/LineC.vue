<script setup>
import { useECharts } from '@pureadmin/utils'
import { ref } from 'vue'
const option = {
  xAxis: {
    type: 'category',
    data: ['A', 'B', 'C']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: [120, 200, 150],
      type: 'line'
    }
  ]
}
// 折线图引用
const chartRef = ref(null)

const { setOptions } = useECharts(chartRef, { theme: 'light' })

setOptions(option)
</script>

<template>
  <div id="main" ref="chartRef" style="width: 100%; height: 40vh"></div>
</template>
<style scoped></style>
