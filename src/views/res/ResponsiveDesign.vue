<template>
  <el-row>
    <el-col>
      <h1>这是标题</h1>
    </el-col>
  </el-row>
  <el-row>
    <el-col>
      <el-card header="晴天">
        <el-text>今天适合去公园</el-text>
      </el-card>
    </el-col>
    <el-col>
      <el-card header="阴天">
        <el-text>今天适合户外运动</el-text>
      </el-card>
    </el-col>
    <el-col>
      <el-card header="雨天">
        <el-text>今天适合在家</el-text>
      </el-card>
    </el-col>
  </el-row>
  <el-row>
    <el-col>
      <h3>这是底部</h3>
    </el-col>
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

<!-- <script>
import LineChart from '@/views/res/components/LineChart.vue'

export default {
    components:{
        LineChart
    },
   data(){
      return{
        obj:{
            test:{
                name:'Jack'
            }
        }
      }
   },
   mounted(){

   },
   methods:{
   
   }
}
</script> -->
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
  console   .log('c', abc.value)
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
