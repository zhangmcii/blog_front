<template>
  <button @click="submitTask">查询成绩</button>
  <div>随机数：{{ randomNumber }}</div>
  <div v-if="taskStatus">
    状态: {{ taskStatus }} <br />
    结果: {{ taskResult || '等待中...' }}
  </div>

  <button @click="submitTaskBlock">批量查询成绩</button>
</template>

<script setup>
import { ref } from 'vue'
import userApi from '@/api/user/userApi.js'
const taskId = ref(null)
const taskStatus = ref(null)
const taskResult = ref(null)
const randomNumber = ref(null)

const submitTask = async () => {
  randomNumber.value = Math.floor(Math.random() * 100)

  // 1. 提交任务
  const response = await userApi.query(randomNumber.value)
  taskId.value = response.data.task_id
  console.log('任务提交成功, 任务ID:', taskId.value)
  // 2. 启动轮询
  const pollInterval = setInterval(async () => {
    const statusResponse = await userApi.get_task(taskId.value)
    taskStatus.value = statusResponse.data.status

    if (statusResponse.data.status === 'SUCCESS') {
      taskResult.value = statusResponse.data.result
      clearInterval(pollInterval)
    }
  }, 1000) // 每秒轮询一次
}
// 生成一批随机数，然后作为参数循环提交任务。并展示每个任务的状态和结果

const submitTaskBlock = async () => {
  const randomNumbers = Array.from({ length: 10 }, () => Math.floor(Math.random() * 100))
  taskStatus.value = '批量任务提交中...'
  taskResult.value = null

  for (const number of randomNumbers) {
    const response = await userApi.query(number)
    console.log('批量任务提交成功, 任务ID:', response.data.task_id)

    // 启动轮询
    const pollInterval = setInterval(async () => {
      const statusResponse = await userApi.get_task(response.data.task_id)
      if (statusResponse.data.status === 'SUCCESS') {
        taskStatus.value = `任务 ${number} 完成`
        taskResult.value = statusResponse.data.result
        clearInterval(pollInterval)
      }
    }, 1000) // 每秒轮询一次
  }
}
</script>
