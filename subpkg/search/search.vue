<template>
  <view>
    <view class="search-box">
      <uni-search-bar @input="input" :radius="100" bgColor='#EEEEEE'></uni-search-bar>
      <!-- <uni-search-bar @confirm="search" @input="input" :radius="100" cancelButton="none" bgColor='#EEEEEE' class="uni-searchbar"></uni-search-bar> -->
    </view>
    <!-- 搜索建议栏 -->
    <view class="sugg-list" v-if="searchResults.length !== 0">
      <view class="sugg-item" v-for="(item,index) in searchResults" :key="item.goods_id" @click="gotoDetail(item.goods_id)">
        <view class="goods-name">
          {{ item.goods_name }}
        </view>
        <uni-icons type="arrowright" size="16"></uni-icons>
      </view>
    </view>
    <!-- 搜索历史 -->
    <view class="history-box" v-else>
      <!-- 标题区域 -->
      <view class="history-title" v-if="historyList.length !== 0">
        <text>搜索历史</text>
        <!-- 垃圾桶图标 -->
        <uni-icons type="trash" size="17" @click="cleanHistory"></uni-icons>
      </view>
      <!-- 用于提示当前没有历史记录 -->
      <view class="history-title" v-else>
        <text>当前没有历史记录</text>
      </view>
      <!-- 列表区域 -->
      <view class="history-list">
        <uni-tag :text="item" v-for="(item, i) in historyList" :key="i" @click="gotoGoodsList(item)"></uni-tag>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        timer: null,
        keyWord: '',
        searchResults: [],
        historyList: []
      };
    },
    onLoad() {
      //在页面加载初始的时候，从本地读取JSON格式的历史搜索，至少传递一个空字符串，防止搜索历史为空
      this.historyList = JSON.parse(uni.getStorageSync('history') || '[]')
    },
    methods: {
      input(e) {
        // console.log(e)
        //防抖
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.keyWord = e.value
          this.getSearchList()
        }, 500)
      },
      async getSearchList() {
        if (this.keyWord === '') {
          this.searchResults = []
        } else {
          const {
            data: res
          } = await uni.$http.get('/api/public/v1/goods/qsearch?query=' + this.keyWord)
          if (res.meta.status !== 200) return uni.$showMsg()
          this.searchResults = res.message
        }
        this.saveSearchHistory()
      },
      gotoDetail(goods_id) {
        uni.navigateTo({
          url: '/subpkg/goods_detail/goods_detail?goods_id=' + goods_id
        })
      },
      //历史进入商品列表页面
      gotoGoodsList(item) {
        uni.navigateTo({
          url: '/subpkg/goods_list/goods_list?query=' + item
        })
      },
      //本地存储历史记录
      saveSearchHistory() {
        //判断当前查询的关键字是否已经在历史数据中，若不在，则将其放入历史数据中
        if (this.historyList.indexOf(this.keyWord) === -1 && this.keyWord) {
          //使用unshift，往第一个位置插入元素，这样子实现历史记录的先后查询顺序
          this.historyList.unshift(this.keyWord)
        }
        //将搜索历史存在本地---JSON格式
        uni.setStorageSync('history', JSON.stringify(this.historyList))
      },
      //清空历史记录
      cleanHistory() {
        console.log(this.historyList)
        //注意，此处需用箭头函数，来将作用域作为外层，才能在传入到全局的时候作用于当前点击页面
        const clean = ()=> {
          this.historyList = []
          uni.removeStorageSync('history')
        }
        uni.$showConfirm('提示','你确认删除历史记录吗？',clean)
      }
    }
  }
</script>

<style lang="scss">
  .search-box {
    position: sticky;
    top: 0;
    z-index: 999;
  }

  .sugg-list {
    padding: 0 5px;

    .sugg-item {
      font-size: 12px;
      padding: 13px 0;
      border-bottom: 1px solid #efefef;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .goods-name {
        // 文字不允许换行（单行文本）
        white-space: nowrap;
        // 溢出部分隐藏
        overflow: hidden;
        // 文本溢出后，使用 ... 代替
        text-overflow: ellipsis;
        margin-right: 3px;
      }
    }
  }

  .history-box {
    padding: 0 5px;

    .history-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 40px;
      font-size: 13px;
      border-bottom: 1px solid #efefef;
    }

    .history-list {
      display: flex;
      flex-wrap: wrap;

      .uni-tag {
        margin-top: 5px;
        margin-right: 5px;
      }
    }
  }
</style>
