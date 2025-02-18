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