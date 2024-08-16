<script>
import ButtonClick from '@/util/components/ButtonClick.vue'
export default {
  components: {
    ButtonClick
  },
  data() {
    return {
      input3: '',
      tableHeight: '600',
      tableData: [
        {
          date: '2016-05-03',
          name: 'Tom',
          state: 'California',
          city: 'Los Angeles',
          address: 'No. 189, Grove St, Los Angeles',
          zip: 'CA 90036'
        },
        {
          date: '2016-05-02',
          name: 'Tom',
          state: 'California',
          city: 'Los Angeles',
          address: 'No. 189, Grove St, Los Angeles',
          zip: 'CA 90036'
        },
        {
          date: '2016-05-04',
          name: 'Tom',
          state: 'California',
          city: 'Los Angeles',
          address: 'No. 189, Grove St, Los Angeles',
          zip: 'CA 90036'
        },
        {
          date: '2016-05-01',
          name: 'Tom',
          state: 'California',
          city: 'Los Angeles',
          address: 'No. 189, Grove St, Los Angeles',
          zip: 'CA 90036'
        },
        {
          date: '2016-05-08',
          name: 'Tom',
          state: 'California',
          city: 'Los Angeles',
          address: 'No. 189, Grove St, Los Angeles',
          zip: 'CA 90036'
        },
        {
          date: '2016-05-06',
          name: 'Tom',
          state: 'California',
          city: 'Los Angeles',
          address: 'No. 189, Grove St, Los Angeles',
          zip: 'CA 90036'
        },
        {
          date: '2016-05-07',
          name: 'Tom',
          state: 'California',
          city: 'Los Angeles',
          address: 'No. 189, Grove St, Los Angeles',
          zip: 'CA 90036'
        }
      ]
    }
  },
  mounted() {
    this.calTableHeight()
  },
  methods: {
    // 功能：表格高度根据内容自适应
    calTableHeight() {
      const h1 = this.$refs.h1.$el.offsetHeight
      // 其中一个40是盒子的总外边距
      this.tableHeight = `calc(100vh - ${h1}px - 16px - var(--el-main-padding) * 2`
    }
  }
}
</script>

<template>
  <el-row ref="h1" :gutter="10">
    <el-col :xs="16" :sm="16" :md="16" :lg="16" :xl="16">
      <el-input
        v-model="input3"
        size="small"
        placeholder="Please Input"
        :suffix-icon="i - ep - Search"
      />
    </el-col>
    <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
      <ButtonClick content="搜索" type="warning" size="small" @do-search="doSearch" />
    </el-col>
  </el-row>

  <el-row>
    <el-col ref="h2">
      <el-table :data="tableData" style="width: 100%" :height="tableHeight">
        <el-table-column fixed prop="date" label="Date" width="80" />
        <el-table-column prop="name" label="Name" width="120" />
        <el-table-column prop="state" label="State" width="120" />
        <el-table-column prop="city" label="City" width="320" />
        <el-table-column prop="address" label="Address" width="600" />
        <el-table-column prop="zip" label="Zip" />
      </el-table>
    </el-col>
  </el-row>
</template>

<style scoped>
.el-table {
  width: 100%;
  height: 90%;
}
</style>
