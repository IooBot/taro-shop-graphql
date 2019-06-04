import Taro from "@tarojs/taro";
import {insert} from "../src/utils/crud";

let preCartCount = parseInt(Taro.getStorageSync('cartCount')) || 0
let cartCount = preCartCount + count

// 购物车数量显示更新
this.props.onChangeDetailState('cartCount',cartCount)
Taro.showToast({
  title: '成功添加至购物车',
  icon: 'none'
})
Taro.setStorageSync('cartCount',cartCount)

insert({collection:'userCart',condition:cartContent}).then(()=>{
  // console.log('create_userCart data',data)

})
