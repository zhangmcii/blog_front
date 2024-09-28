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
import LineC from '@/views/res/components/LineC.vue'
import LineNormal from '@/views/res/components/LineNormal.vue'
</script>

<style></style>
