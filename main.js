import Vue from 'vue'
import App from './App'
import store from '@/store/store.js'
// 按需导入 $http 对象
import {
  $http
} from '@escook/request-miniprogram'

// 在 uni-app 项目中，可以把 $http 挂载到 uni 顶级对象之上，方便全局调用
uni.$http = $http

//请求的根路径
$http.baseUrl = 'https://www.uinav.com'

//请求拦截器
$http.beforeRequest = function(options) {
  uni.showLoading({
    title: "数据加载中"
  })
}

//响应拦截器
$http.afterRequest = function() {
  uni.hideLoading()
}

//封装并挂载一个自定义函数----showMsg(提示框)
uni.$showMsg = function(title = '数据加载失败！', duration = 1500) {
  uni.showToast({
    title,
    duration,
    icon: 'none'
  })
}

//封装并挂载一个自定义函数----showModal(确认框)
uni.$showConfirm = function(title = '提示', content = '你确定执行该操作吗',successCallback = function() {}) {
  uni.showModal({
    title,
    content,
    success:function(res) {
      if (res.confirm) {
        uni.$showMsg('确认');
        //注意，此处传入的回调函数需定义为箭头函数
        successCallback()
      } else if(res.cancel) {
        uni.$showMsg('取消')
      }
    }
  });
}


Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
  ...App,
  store
})
app.$mount()
