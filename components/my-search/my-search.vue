<template>
  <view class="my-search-container" :style="{'background-color': bgcolor}">
    <!-- 使用 view 组件模拟 input 输入框的样式 -->
    <view class="my-search-box" :style="{'border-radius': radius + 'px'}" @click="searchBoxHandler">
      <uni-icons type="search" size="17"></uni-icons>
      <text class="placeholder">搜索</text>
    </view>
  </view>
</template>

<script>
  export default {
    props: {
      bgcolor:{
        type: String,
        default: '#C00000'
      },
      radius:{
        type: Number,
        //单位默认是px
        default: 18
      }
    },
    data() {
      return {

      };
    },
    methods:{
      searchBoxHandler(){
        this.$emit('click')
      }
    }
  }
</script>

<style lang="scss">
  .my-search-container {
    //移除样式中的background-color，由用户自定义控制
    // background-color: #c00000;
    height: 50px;
    padding: 0 10px;
    display: flex;
    align-items: center;
  }

  .my-search-box {
    height: 36px;
    background-color: #ffffff;
    //移除样式中的border-radius，由用户自定义控制
    // border-radius: 15px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    .placeholder {
      font-size: 15px;
      margin-left: 5px;
    }
  }
</style>
