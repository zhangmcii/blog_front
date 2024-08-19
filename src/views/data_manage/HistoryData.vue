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
      loading: false,
      filter: false,
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
  watch: {
    // 当筛选卡片展开时，重新计算表格高度
    // filter() {
    //   if (this.filter) {
    //     this.$nextTick(() => {
    //       this.calTableHeight()
    //     })
    //   }
    // }
  },
  mounted() {
    this.calTableHeight()
  },
  methods: {
    // 功能：表格高度根据内容自适应
    calTableHeight() {
      const h1 = this.$refs.h1.$el.offsetHeight
      const h2 = this.$refs.h2.$el.offsetHeight
      // 其中一个40是盒子的总外边距
      this.tableHeight = `calc(100vh - ${h1}px - ${h2}px - 16px - 2px - var(--el-main-padding) * 2`
    },
    doSearch() {
      this.loading = true
      setTimeout(() => {
        this.loading = false
      }, 1500)
    },
    reCalTableHeight() {
      if (this.filter) {
        const h2 = this.$refs.h2.$el.offsetHeight
        console.log(h2)
        this.calTableHeight()
      }
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
        :focus="() => (this.filter = true)"
        :suffix-icon="i - ep - Search"
      />
    </el-col>
    <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
      <ButtonClick
        content="搜索"
        type="warning"
        size="small"
        :loading="loading"
        @do-search="doSearch"
      />
    </el-col>
  </el-row>

  <el-row ref="h2">
    <Transition @after-enter="reCalTableHeight">
      <el-card v-show="filter" :class="{ disappear: !filter }">
        分类
        <div class="close-card">
          <el-icon @click="filter = false"><i-ep-ArrowUp /></el-icon>
        </div>
      </el-card>
    </Transition>
  </el-row>

  <el-row>
    <el-skeleton :rows="12" animated :loading="loading">
      <el-table :data="tableData" style="width: 100%" :height="tableHeight">
        <el-table-column fixed prop="date" label="Date" width="80" />
        <el-table-column prop="name" label="Name" width="120" />
        <el-table-column prop="state" label="State" width="120" />
        <el-table-column prop="city" label="City" width="320" />
        <el-table-column prop="address" label="Address" width="600" />
        <el-table-column prop="zip" label="Zip" />
      </el-table>
    </el-skeleton>
  </el-row>
</template>

<style scoped>
.el-card {
  width: 100%;
  height: 200px;
  background-color: #f0f0f0;
  animation: slideIn 0.75s forwards;
}

.disappear {
  animation: fadeOut 1.5s forwards;
}
.close-card {
  font-size: 1.3rem;
  position: relative;
  top: 135px;
  left: 90%;
}
@keyframes slideIn {
  from {
    height: 0;
    opacity: 0;
  }
  to {
    height: 200px;
    opacity: 1;
  }
}

@keyframes fadeOut {
  to {
    width: 0; /* 卡片宽度 */
    height: 0; /* 卡片高度 */
    opacity: 0;
  }
}
</style>
