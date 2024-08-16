# 侧边栏折叠

1.顶部使用按钮。切最外层<el-aside>的宽度设置为 自动

```
<style>
    :root {
      --el-aside-width: auto;
    }
    .el-aside {
      width: var(--el-aside-width);
    }
</style>
```

注意：下面表示如果存在名为`el-aside-width`的变量，就使用该变量的值，否则就使用默认值`300px`。如果没有上述的设置，那么el-aside宽度默认保持300。当你折叠后，右边主内容区域始终少了很多

```
.el-aside {
    width: var(--el-aside-width, 300px);
}

```

# 头部的搜索框和按钮 排成一列，根据屏幕尺寸按比例左右收缩

1.用<el-row>包裹这两个组件，组件外面分别用<el-col>包裹。这样他们排在来了一行上，不会因为屏幕缩小而挤成2行。

```
 <el-row  :gutter="10">
    <el-col :xs="16" :xl="16">
      <el-input
        v-model="input3"
        size="small"
        placeholder="Please Input"
        :suffix-icon="i - ep - Search"
      />
    </el-col>
    <el-col :xs="8" :xl="8">
      <ButtonClick content="搜索" type="warning" size="small" @do-search="doSearch" />
    </el-col>
  </el-row>

  <el-row>分别用响应式布局，定义各组件在一行中所占的比例
```
