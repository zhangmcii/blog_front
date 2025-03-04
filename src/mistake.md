`tag标签页` 加`下拉刷新` 的 `列表` 
问题现象： 切换标签页时，会多请求一次数据，导致展示双倍数据
～～～
    onClickTab() {
      this.currentPage = 1
      this.getFollowList()
    }
～～～

解决：
1.监听点击tag标签时不发出数据请求。因为列表的finished为false，会自动请求一次，当你监听点击tag标签时发出的网络请求会多余。
～～～
    onClickTab() {
      this.currentPage = 1
    }
～～～

2.不同tag页的列表要用不同的finished变量。公用一个finished变量时，第一页加载完成后切换到第二个tag页，第二页得到的finished为true，导致停止加载。
～～～
    <van-tab>
        <FollowsList2
          v-model:finished="fanTab.finished">
        </FollowsList2>
    </van-tab>
    <van-tab title="关注" name="followed">
        <FollowsList2
          v-model:finished="followedTab.finished">
     </van-tab>
～～～


在 data 中直接使用 props 会导致数据的重复和不一致。
背景：父组件A挂载完成对请求回的数据传递值给子组件B，B在路由进入前发送请求，把请求欧的数据给子组件C
问题现象:C在data中把props赋值给变量，props的post.praise更新了，但C模版表达式值未同步变化
~~~
 props: {
    post: {
      type: Object,
      default() {
        return {
          id: 1,
          body: '文章',
          body_html: null,
          timestamp: '2024-9-20 12:14:00',
          author: '张三',
          commentCount: 20,
          disabled: false,
          image: '',
          praise_num: 0,
          has_praised: false
        }
      }
    },
 }
  data() {
    return {
      praiseNum: this.post.praise_num,
      hasPraised: this.post.has_praised
    }
  }
  
  <el-text class="mx-1">{{ praiseNum }}</el-text>
~~~
解决：在子组件创建一个局部状态来存储props值，使用watch监听props，同时更新局部状态
结论：不要在data中使用props,这个props并不因此具有响应性
参考：https://www.51cto.com/article/801688.html




子组件初始化watch监听不到props值：
背景：父组件A挂载完成对请求回的数据传递值给子组件B
现象：父组件A传递值给子组件B，子组件第一次展示模版监听值不发生变化
～～～
props: {
    post: {
      type: Object,
      default() {
        return {
          id: 1,
          body: '文章',
          body_html: null,
          timestamp: '2024-9-20 12:14:00',
          author: '张三',
          commentCount: 20,
          disabled: false,
          image: '',
          praise_num: 0,
          has_praised: false
        }
      }
    },
 }

watch:{
   'post.has_praised'(newValue) {
      console.log('22', newValue)
      this.hasPraised = newValue
    },
}
～～～

解决：设置immediate：true 在创建侦听器时立刻执行一次回调
～～～
 'post.has_praised':{
      handler(newValue){
        this.hasPraised = newValue
      },
      immediate:true
    }
～～～

结论：1.父组件A传递值给子组件B，子组件模版监听值不发生变化
     2.watch可以监听到网络请求后值的变化

撤回提交
撤销本次提交，暂存区也撤销，但保留工作区的修改
～～～
git reset --mixed HEAD^

如果想撤销上上次提交，可以使用HEAD^^，或者HEAD～2


点赞动画
消失的组件对应leave动画
即将出现的对应enter动画

所以： 未点赞组件对应leave ，已点赞组件对应enter

 element-plus表格设置表头行或者单元格样式
 解决：样式需要加 :deep(), 即影响到子组件
 ～～～
<el-table
    :header-cell-class-name="tableHeadStyleName"
  />

 tableHeadStyleName({ row, column, rowIndex, columnIndex }){
      return 'table-header'
  }

# 重点
:deep(.table-header) {
  color: #333333;
}

# 前端有哪些性能优化手段 开启压缩优化（gzip、brotli 格式）

gzip: 是GNUzip的缩写，也是一个文件压缩程序，可以将文件压缩进后缀为.gz的压缩包。
      如果服务端支持gzip算法，则会返回以下的响应头： content-encoding: gzi

brotli： Brotli 通过变种的 LZ77 算法、Huffman 编码以及二阶文本建模等方式进行数据压缩，与其他压缩算法相比，它有着更高的压缩效率。支持Brotli压缩算法的浏览器使用的内容编码类型为br
如果服务端支持Brotli算法，则会返回以下的响应头： Content-Encoding: br


## 谁来做这个压缩？ (服务端or用户端)
我们的例子是在接到请求时，由node服务器进行压缩处理, 这也是比较普遍的一种做法，由服务端进行压缩处理。
服务器了解到我们这边有一个 gzip 压缩的需求，它会启动自己的 CPU 去为我们完成这个任务。而压缩文件这个过程本身是需要耗费时间的，大家可以理解为我们以服务器压缩的时间开销和 CPU 开销（以及浏览器解析压缩文件的开销）为代价，`省下了一些传输过程中的时间开销`。


我们现在讨论的就是构建时进行压缩，可以省去服务器压缩的时间，`减少一些服务端的消耗`。
所以构建时压缩可以： 减少 `服务端+传输过程中` 的时间开销

使用 vite-plugin-compression 对平台进行 gzip 或者 brotli 压缩

参考：https://juejin.cn/post/6844903887871148046



# 开发模式下 页面打开时出现重新加载并强制刷新页面的情况
现象:
~~~
1.new dependencies optimized: element-plus/es/components/loading/style/css, element-plus/es/components/table/style/css, element-plus/es/components/table-column/style/css

2.new dependencies optimized: vant/es/share-sheet/style/index, vant/es/list/style/index
17:37:30 [vite] ✨ optimized dependencies changed. reloading

原因:未能有效完成vite预构建
解决：
    1.在main.js中引入vant样式
    ～～～
    import 'vant/lib/index.css';
    2.element-plus的自动引入不稳定。改为手动全局引入。


主机免密传送文件到云服务器
1、原理：
将公钥拷贝到需要免登录的设备，私钥是自己的
通过用户名和主机名来核对公钥

A(公钥，私钥) --> B（A的公钥）

2、 生成登录公钥私钥对
```bash
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```
命令参数含义与之前介绍的相同。执行过程中，系统会提示你选择保存密钥的位置，默认路径是 `~/.ssh/id_rsa`，直接回车即可。如果你不想设置密码短语（即私钥的保护密码），在提示输入时直接回车两次。

### 上传公钥到云服务器
有两种常见的方法可以将 Mac 电脑生成的公钥上传到云服务器：

#### 手动操作
1. 在 Mac 的终端中，查看公钥文件内容：
```bash
cat ~/.ssh/id_rsa.pub
```
2. 全选并复制上述命令输出的公钥内容。

3. 通过 SSH 登录到云服务器。打开一个新的终端窗口，运行：
```bash
ssh username@server_ip
```
4. 登录到云服务器后，创建或编辑 `~/.ssh/authorized_keys` 文件。如果不存在 `.ssh` 目录，先创建该目录：
```bash
mkdir -p ~/.ssh
nano ~/.ssh/authorized_keys
```
5. 在打开的 `nano` 编辑器中，粘贴从 Mac 复制的公钥内容。粘贴完成后，按 `Ctrl + X`，然后按 `Y`，再按 `Enter` 保存并退出编辑器。

### 验证免密传输
完成上述操作后，在 Mac 电脑上使用 `scp` 命令尝试向云服务器传送文件，例如：
```bash
scp /path/to/local_file username@server_ip:/path/to/remote_directory
```

