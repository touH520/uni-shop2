<template>
  <view>
    <view class="goods-list">
      <view v-for="(goods,index) in goodsList" :key="goods.goods_id" @click="gotoDetail(goods.goods_id)">
        <my-goods :goods="goods"></my-goods>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        //请求参数
        queryObj: {
          //查询关键词
          query: '',
          //分类ID
          cid: '',
          // 页数索引
          pagenum: 1,
          // 每页长度
          pagesize: 10,
        },
        //商品列表
        goodsList: [],
        //总数，用于分页
        total: 0,
        // 是否正在请求数据(节流阀)
        isloading: false
      };
    },
    //页面挂载事件(原生)
    onLoad(options) {
      this.queryObj.query = options.query || ''
      this.queryObj.cid = options.cid || ''
      this.getGoodsList()
    },
    //下拉触底事件(原生)
    onReachBottom() {
      //判断数据是否加载完毕
      if (this.queryObj.pagenum * this.queryObj.pagesize >= this.total) return uni.$showMsg('数据加载完毕！')
      //仍在加载中，直接返回，不请求
      if (this.isloading) return
      //查询页面数加1
      this.queryObj.pagenum += 1
      this.getGoodsList()
    },
    //下拉刷新事件(原生)
    onPullDownRefresh() {
      //1、重置关键函数
      this.queryObj.pagenum = 1
      this.total = 0
      this.isloading = false
      this.goodsList = []

      // 2、重新发起请求
      this.getGoodsList(() => uni.stopPullDownRefresh())
    },
    methods: {
      async getGoodsList(cb) {
        //打开节流阀
        this.isloading = true
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/goods/search', this.queryObj)
        //关闭节流阀
        this.isloading = false
        //只要数据请求完毕，且传递函数存在则立即调用
        cb&&cb()
        if (res.meta.status !== 200) return uni.$showMsg()
        this.goodsList = [...this.goodsList, ...res.message.goods]
        this.total = res.message.total
      },
      gotoDetail(goods_id) {
        uni.navigateTo({
          url: '/subpkg/goods_detail/goods_detail?goods_id=' + goods_id
        })
      },
    }
  }
</script>

<style lang="scss">

</style>
