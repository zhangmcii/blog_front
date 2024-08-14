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
