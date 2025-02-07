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