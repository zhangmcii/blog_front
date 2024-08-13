<template>
  <el-row>
    <el-col>
      <h1>这是标题</h1>
    </el-col>
  </el-row>

  <el-row :gutter="10">
    <el-col :xs="24" :sm="8" :md="8" :lg="8" :xl="8">
      <el-card header="晴天">
        <el-text>今天适合去公园</el-text>
      </el-card>
    </el-col>
    <el-col :xs="24" :sm="8" :md="8" :lg="8" :xl="8">
      <el-card header="阴天">
        <el-text>今天适合户外运动</el-text>
      </el-card>
    </el-col>
    <el-col :xs="24" :sm="8" :md="8" :lg="8" :xl="8">
      <el-card header="雨天">
        <el-text>今天适合在家</el-text>
      </el-card>
    </el-col>
  </el-row>
  <h3>这是底部</h3>

  <h1>5月28日</h1>
  <p>又到了12点了, 早点睡觉吧</p>
  <p>
    Said Tommy the Cat as he reeled back to clear whatever foreign matter may have nestled its way
    into his mighty throat. Many a fat alley rat had met its demise while staring point blank down
    the cavernous barrel of this awesome prowling machine.
  </p>
  <img
    srcset="../../assets/img/Snipaste_800.png 800w, ../../assets/img/wenxuesnv07.jpg 1600w"
    sizes="(max-width: 600px) 100vw,
        1400px"
    src="../../assets/img/wenxuesnv07.jpg"
    alt="She is wen xue snv"
  />

  <p>又到了10点半了, 早点休息吧</p>
  <p>
    Said Tommy the Cat as he reeled back to clear whatever foreign matter may have nestled its way
    into his mighty throat. Many a fat alley rat had met its demise while staring point blank down
    the cavernous barrel of this awesome prowling machine.
  </p>
  <!-- <picture>
  <source media="(max-width: 799px)" srcset="../../assets/img/row.png" />
  <source media="(min-width: 800px)" srcset="../../assets/img/bz1.jpg" />
  <img src="../../assets/img/bz1.jpg" alt="Chris standing up holding his daughter Elva" />
</picture> -->

  <video src="../../video/Windows.mp4" controls loop muted>
    <p>你的浏览器不支持 HTML 视频。可点击<a href="rabbit320.mp4">此链接</a>观看。</p>
  </video>
  <el-row>
    <LineChart />
  </el-row>
  <el-button @click="add"> 点击 </el-button>

  <el-card>
    <LineC />
  </el-card>

  <el-card>
    <LineNormal />
  </el-card>
</template>

<script setup>
import LineChart from '@/views/res/components/LineChart.vue'
import { a as var_a, add as add1 } from '@/js/testA.js'
import { ref, onMounted, watch } from 'vue'
import LineC from '@/views/res/components/LineC.vue'
import LineNormal from '@/views/res/components/LineNormal.vue'

import { test as add2 } from '@/js/combination.js'

import { fetch } from '@/js/fetch.js'

// import { getCurrentInstance } from 'vue';

// const { proxy } = getCurrentInstance()

onMounted(() => {
  console.log('hello')
  console.log('这是导入的变量', var_a)
  add1(4, 5)

  // proxy.$http.get('/dust/scenario').then( (response)=> {
  // console.log(response.data.data);
  const { data1, error } = fetch('/dust/sitename')
  console.log('数据为：', data1.value, error.value)
})

const a = ref(0)
const abc = (ref < String) | (Number > 2023)

function add() {
  a.value++
  // b.value++
  // a.value = '20230'
  abc.value = '2021'
  console.log('a', a.value)
  console.log('c', abc.value)
}
const { x, y } = add2()
console.log('x,y的值', x.value, y.value)
// watch(a,()=>{
//     console.log('发现a变化了');
// },{immediate:true})
// watch(()=>a.value,
// (newValue,oldValue)=>console.log(`a变化了${newValue},旧值为${oldValue}`))

// watch(
//     [a,b],
//     ([newa,newb],[olda,oldb])=>{
//         console.log(`a变化了${newa},b值为${newb}`)
//         console.log(`a变化了${olda},旧值为${oldb}`)
//     }
// )
</script>

<style></style>
