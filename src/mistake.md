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


# mac传后端容器到服务器执行报错了（但windows不报错）
> unable to start container process: exec: "./boot.sh": permission denied: unknown.

根因： mac直接直接独对boot.sh文件就无权限执行，打包成镜像在服务区上也无权限执行。所以在打镜像前，赋予boot.sh可执行权限
解决： chmod +x boot.sh





评论+通知模型+： 

场景：  A发了文章，B评论， C回复了B， D回复了C。  
结果：
B的操作，会通知A
C的操作，会通知A，B
D的操作，会通知A，B，C


前端：

首页会从数据库拉取该用户所有未读的通知。统一对通知分为四类： @，评论，点赞，私信，随后传递到各组件中。

如何对通知分类？
1.筛选出@的用户
	type=at
2.筛选出评论文章还是评论回复？
	3.1 type =“comment是评论文章
	3.2 type=“reply”是评论回复
3.筛选出文章点赞还是评论点赞？
	筛选出type =“like”
	2.1当commentId为None时，是文章点赞。
	2.2当commentId，postId都不为None时，是评论点赞
4.筛选出聊天
	type=chat
	只统计出同一对用户的未读的数量和最近的一条信息（前端预览需要）


定义用户的评论分为三类：根评论， 一级回复， 其他回复
￼

根据undraw-ui评论组件， 从submit函数的回调函数中结构出reply变量。当你发起的是根评论，reply对象为undefined；当发起的是一级回复或其他回复时，reply.id为直接父评论id

所以当用户发起
根评论： 传递的directParentId字段为null
一级评论或其他回复： 传递的directParentId字段就等于reply.id
				



后端：
当用户发起了评论或回复，如何正确的通知到对应用户？
1.接收到directParentId字段，根据directParentId查询数据库，得到直接父评论对象和根评论对象(因为所有的评论或回复都从属于一个根评论，要么是空值要么是其他评论对象罢了。)
2.根据directParentId字段，判断这个评论是哪种类型？（根评论 或一级回复 或 其他回复）
	2.1 根评论：    directParentCommentId =parentCommentId =None
	2.2 一级回复：directParentComment != None && (directParentComment = parentComment)
	2.3 其他回复：directParentComent != parentComment
3.如果是
3.1根评论： 
    预执行：通知文章作者（产生一条通知）
    当前不是文章作者：
        通知文章作者 有人评论了你的文章
3.3一级回复：
    预执行：通知文章作者、根评论（产生两条通知）
    当前不是文章作者：
        通知文章作者 有人评论了你的文章
    当前不是根评论用户：
        通知根评论用户 有人回复了你的评论
3.4其他回复:
    预执行：通知文章作者、根评论用户、直接父评论用户（产生三条通知）
    当前不是文章作者：
        通知文章作者 有人评论了你的文章
    当前用户不是根评论用户
        通知根评论用户 有人回复了你的评论
    当前用户不是直接父评论用户
        通知直接父评论用户 有人回复了你的评论
这样做的目的遵循一个原则，就是自己执行的操作不能通知自己。比如说A用户评论了B的文章，那么B用户会一定会收到一条通知： A评论了你的文章。  A用户作为触发方是不会收到通知的。






mysql：

class Comment(db.Model):
    __tablename__ = 'comments'
    id                             # 评论id
    body                        # 评论内容
    timestamp              # 时间戳
    disabled                  # 是否禁用
    author_id                # 用户id
    post_id                    # 文章id
    root_comment_id   # 根评论Id
    direct_parent_id     # 直接父评论id


class Notification(db.Model):
    __tablename__ = 'notifications'
    id                           # 通知id
    type                      # 通知类型
    is_read                 # 是否已读
    created_at           # 创建时间
    receiver_id           # 接收者（文章作者）
    trigger_user_id    # 触发者（评论/点赞用户）
    post_id                 # 文章id
    comment_id         # 评论id


# 上传图片：
假设最好的情况，就是上传过程中一切顺利。(最好限制一下图片的数量为三个以内，降低风险)
做法： 上传完图片后，拿到图片的URL，然后跟随文字一起送到后台

真实过程可能出现的问题：
1.上传多张图片
如果任意一个图片失败会造成不可管理的后果。前面几张上传成功了，中间一张失败，那么这个文章不会保存到数据库，但前面几张已存入云端
(这个想了一下，也好解决。无非抽个工具管理类，记录过程中失败的图片，增加失败重传机制，使不可靠变为可靠。重试次数用完，删除已上传的图片。并通知用户“图片上传异常，请稍候再试”)

2.文字失败：
重试机制：
重试次数用完，删除所有已上传图片，并通知用户“图片上传异常，请稍候再试”

3.发布次数超出限制 （已实现）
收到429状态码后，删除指定key的图片

目前这些预防措施待实现


原来想法：
想法一：将文章文字加在qiniu.upload()的Extra参数中随图片一起上传到七牛云，图片上传成功后，会将成功消息和文字通过回调请求发送给后端服务器，后端服务器拿到文字和url数据会存入数据库。

但发现七牛图不支持一个post请求上传多张图片, 这样会导致上传9张图片，会发送给后端服务器9个回调请求。不得不放弃这种想法。

想法二：
发布图文时分两次提交
第一次提交文字，在数据库生成图文记录，假设id=10。
若第一次提交文字失败，退出函数。
若第一次提交文字成功：
	上传图片至七牛云。
	若上传失败，通知用户稍后再试，并删除数据库中id=10的记录
	若图片上传成功，第二次提交图片url，设置图片url，并且修改id=10的图片状态为已提交

前端渲染：
当种类=图文，并且图片状态=已提交  才返回给前端。
定期清理 种类=图文，并且图片状态=未提交 的数据

图片存储及命名
图片在七牛云上按业务逻辑存储：
user_image/user_${this.currentUser.userInfo.id}/article/*.png  文章图片
user_image/user_${this.currentUser.userInfo.id}/avatars/*.png  用户图像
user_image/user_${this.currentUser.userInfo.id}/backgrounds/*.png   背景图片
user_image/user_${this.currentUser.userInfo.id}/comments/*.png      评论图片

图片命名规则：
1.使用uuid(目前采用)
2.包含关键信息 user_{user_id}_{时间戳(精确到时分 即可)}_{场景}_image_{版本(如v1)}.png

图片预处理：
1.上传前压缩处理

安全设置：
对于敏感的用户图片，如私人相册，将储存桶设置为私有，听过生成带签名的URL来控制访问权限 (目前无此需求)




# Base64编码

应用：常用于传输图片或音频文件。

定义：Base64，就是包括小写字母a-z、大写字母A-Z、数字0-9、符号"+"、"/"一共64个字符的字符集，（任何符号都可以转换成这个字符集中的字符，这个转换过程就叫做base64编码

# 压缩上传

用户选择了图片后，客户端立刻进行压缩
  1.用户第一次选择1张图片 --> 客户端压缩并展示
      第二次选择2张不同的图片 --> 客户端压缩并展示

    用户删除最后一张图片 --> 触发移除事件 --> 移除该原始图片和压缩的图片
    由于是3张不同名称的图片，一切正常

  2.用户第一次选择1张图片 --> 客户端压缩并展示
      第二次选择2张图片，其中1张与第一次选择的相同 --> 提示不能上传同名文件，但客户端仍然压缩并展示

    用户删除第2张图片 --> 触发移除事件 --> 第一张和第二张都移除了，因为它们的名称相同 (这是我们不想看到的情况)


  3.不能上传同名文件
当用户点击发布后，将压缩后的图片上传至七牛云