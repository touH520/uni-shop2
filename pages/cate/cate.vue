<template>
  <view>
    <!-- 自定义搜索组件 -->
    <view class="search-box">
      <my-search @click="gotoSearch"></my-search>
    </view>
    <view class="scroll-view-container">
      <!-- 左侧的滚动视图区域 -->
      <scroll-view class="left-scroll-view" scroll-y :style="{height: wh + 'px'}">
        <block v-for="(item,index) in cateList" :key="index">
          <!-- 第一种动态绑定class--active -->
          <view :class="['left-scroll-view-item' ,index === active ? 'active' : '']" @click="activeChange(index)">{{ item.cat_name }}</view>
          <!-- 第二种动态绑定class--active -->
          <!-- <view class="left-scroll-view-item" :class="{active: index === active ? true : false}" @click="activeChange(index)">{{ item.cat_name }}</view> -->
        </block>
      </scroll-view>
      <!-- 右侧的滚动视图区域 -->
      <scroll-view class="right-scroll-view" scroll-y :style="{height: wh + 'px'}" :scrollTop="scrollTop">
        <!-- 二级分类 -->
        <view class="cate-lv2" v-for="(item2,index) in cateList2" :key="item2.cat_id">
          <view class="cate-lv2-title">
            {{ item2.cat_name }}
            <!-- 三级分类 -->
            <view class="cate-lv3-list">
              <!-- 三级分类 Item 项 -->
              <view class="cate-lv3-item" v-for="(item3, i3) in item2.children" :key="i3" @click="gotoGoodsList(item3)">
                <!-- 图片 -->
                <!-- 此处接口换了，所以替换掉原数据中dev为web -->
                <image :src="item3.cat_icon.replace('dev','web')"></image>
                <!-- 文本 -->
                <text>{{item3.cat_name}}</text>
              </view>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        //当前设备的动态高度
        wh: 0,
        //左侧导航栏数据
        cateList: [],
        //左侧选中的当前导航栏。默认第一个
        active: 0,
        //右侧导航栏数据
        cateList2: [],
        //导航栏高度
        scrollTop: 0
      };
    },
    onLoad() {
      const sysInfo = uni.getSystemInfoSync()
      // 可用高度 = 屏幕高度 - navigationBar高度 - tabBar高度 - 自定义的search组件高度
      this.wh = sysInfo.windowHeight - 50
      this.getCateList()
    },
    methods: {
      //获取左侧分类列表
      async getCateList() {
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/categories')
        if (res.meta.status !== 200) return uni.$showMsg()
        this.cateList = res.message
        //右侧导航栏默认赋值为第一项的子数据
        this.cateList2 = res.message[0].children
      },
      //点击改变active选中状态
      activeChange(index) {
        this.active = index
        //为右侧导航栏重新赋值
        this.cateList2 = this.cateList[index].children
        // 让 scrollTop 的值在 0 与 1 之间切换
        this.scrollTop = this.scrollTop ? 0 : 1
      },
      // 点击三级分类项跳转到商品列表页面
      gotoGoodsList(item3) {
        uni.navigateTo({
          url: '/subpkg/goods_list/goods_list?cid=' + item3.cat_id
        })
      },
      gotoSearch(){
        uni.navigateTo({
          url: '/subpkg/search/search'
        })
      }
    }
  }
</script>

<style lang="scss">
  .scroll-view-container {
    display: flex;

    .left-scroll-view {
      width: 120px;

      .left-scroll-view-item {
        line-height: 60px;
        background-color: #f7f7f7;
        text-align: center;
        font-size: 12px;

        // 激活项的样式
        &.active {
          background-color: #ffffff;
          position: relative;

          // 渲染激活项左侧的红色指示边线
          &::before {
            content: ' ';
            display: block;
            width: 3px;
            height: 30px;
            background-color: #c00000;
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
          }
        }
      }
    }
  }

  .cate-lv2-title {
    font-size: 12px;
    font-weight: bold;
    text-align: center;
    padding: 15px 0;
  }

  .cate-lv3-list {
    display: flex;
    flex-wrap: wrap;

    .cate-lv3-item {
      width: 33.33%;
      margin-bottom: 10px;
      display: flex;
      flex-direction: column;
      align-items: center;

      image {
        width: 60px;
        height: 60px;
      }

      text {
        font-size: 12px;
      }
    }
  }
</style>
