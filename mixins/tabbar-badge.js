import {mapGetters} from 'vuex'

export default {
  onShow(){
    this.setBadge()
  },
  computed:{
    ...mapGetters('m_cart',['total'])
  },
  watch:{
    //监听total的变化，变化就再次执行setBadge
    total(){
      this.setBadge()
    }
  },
  methods:{
    setBadge(){
      uni.setTabBarBadge({
        index: 2,
        //注意，此处的text需要定义为string类型
        text: this.total + ''
      })
    }
  }
}