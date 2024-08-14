<script>
export default {
  data() {
    return {
      isCollapse: false
    }
  },
  mounted() {},
  methods: {}
}
</script>

<template>
  <el-button @click="isCollapse = !isCollapse"> 折叠</el-button>
  <el-menu default-active="2" class="el-menu-vertical-demo" :collapse="isCollapse">
    <el-sub-menu index="1">
      <template #title>
        <el-icon><i-ep-location /></el-icon>
        <span>导航1</span>
      </template>
      <el-menu-item-group>
        <template #title><span>Group One</span></template>
        <el-menu-item index="1-1">item one</el-menu-item>
        <el-menu-item index="1-2">item two</el-menu-item>
      </el-menu-item-group>
      <el-menu-item-group title="Group Two">
        <el-menu-item index="1-3">item three</el-menu-item>
      </el-menu-item-group>
    </el-sub-menu>
    <el-menu-item index="2">
      <el-icon><i-ep-menu /></el-icon>
      <template #title>导航2</template>
    </el-menu-item>
    <el-menu-item index="3" disabled>
      <el-icon> <i-ep-Document /></el-icon>
      <template #title>导航3</template>
    </el-menu-item>
    <el-menu-item index="4">
      <el-icon><i-ep-setting /></el-icon>
      <template #title>导航4</template>
    </el-menu-item>
  </el-menu>
</template>
<style scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
</style>
