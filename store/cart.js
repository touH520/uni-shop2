export default {
  namespaced: true,

  state: () => ({
    // 购物车的数组，用来存储购物车中每个商品的信息对象
    // 每个商品的信息对象，都包含如下 6 个属性：
    // { goods_id, goods_name, goods_price, goods_count, goods_small_logo, goods_state }
    cart: JSON.parse(uni.getStorageSync('cart') || '[]'),
  }),

  mutations: {
    addToCart(state, goods) {
      //根据传入的goods_id在购物车中查找是否由该商品
      const findResult = state.cart.find((x) => x.goods_id === goods.goods_id)
      //如果没查找到当前商品，则直接unshift进cart中(用unshift，新添加在前)
      if (!findResult) {
        state.cart.unshift(goods)
      } else {
        //如果查询到，则只在相应的产品中加数量
        findResult.goods_count++
      }
    },
    // 将购物车中的数据持久化存储到本地
    saveToStorage(state) {
      uni.setStorageSync('cart', JSON.stringify(state.cart))
    },
    //修改购物车中商品的选中状态
    updateGoodsState(state, goods) {
      //根据传入的goods_id在购物车中查找是否由该商品
      const findResult = state.cart.find((x) => x.goods_id === goods.goods_id)
      //有对应的商品
      if (findResult) {
        findResult.goods_state = goods.goods_state
      }
      //持久化存储到本地
      this.commit('m_cart/saveToStorage')
    },
    //修改购物车钟商品的数量
    updateGoodsCount(state, goods) {
      //根据传入的goods_id在购物车中查找是否由该商品
      const findResult = state.cart.find((x) => x.goods_id === goods.goods_id)
      //有对应的商品
      if (findResult) {
        findResult.goods_count = goods.goods_count
      }
      //持久化存储到本地
      this.commit('m_cart/saveToStorage')
    },
    //根据id删除商品
    removeGoodsById(state, goods_id) {
      // 调用数组的 filter 方法进行过滤
      state.cart = state.cart.filter(x => x.goods_id !== goods_id)
      // 持久化存储到本地
      this.commit('m_cart/saveToStorage')
    },
    //全选和全不选
    updateAllGoodsState(state, newState) {
      state.cart.forEach(x => x.goods_state = newState)
    }
  },

  getters: {
    //计算购物车中的总量
    total(state) {
      let c = 0
      // 循环统计商品的数量，累加到变量 c 中
      state.cart.forEach(goods => c += goods.goods_count)
      return c
    },
    checkedCount(state) {
      // 先使用 filter 方法，从购物车中过滤器已勾选的商品
      // 再使用 reduce 方法，将已勾选的商品总数量进行累加
      // reduce() 的返回值就是已勾选的商品的总数量
      return state.cart.filter(x => x.goods_state).reduce((total, item) => total += item.goods_count, 0)
    },
    checkedGoodsAmount(state) {
      // 先使用 filter 方法，从购物车中过滤器已勾选的商品
      // 再使用 reduce 方法，将已勾选的商品数量 * 单价之后，进行累加
      // reduce() 的返回值就是已勾选的商品的总价
      // 最后调用 toFixed(2) 方法，保留两位小数
      return state.cart.filter(x => x.goods_state).reduce((total, item) => total += item.goods_count * item.goods_price, 0).toFixed(2)
    }
  }
}
