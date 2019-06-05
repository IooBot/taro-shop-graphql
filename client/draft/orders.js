import {insert, remove} from "../src/utils/crud";
import {setGlobalData} from "../src/utils/global_data";
import Taro from "@tarojs/taro";

let createOrder = insert({collection:'order',condition:orderContent})
let createOrderLogistics = insert({collection:'orderLogistics',condition:orderLogistics})
let deleteUserCart = remove({collection:"userCart",condition:{where:{id: {_in: deleteIdList}}}})
return insert({collection:'orderProduct',condition:orderProduct}).then((data)=>{
  // console.log('create orderProduct data',data)
  return data
})

Promise.all([createOrder, createOrderLogistics, deleteUserCart, createOrderProduct]).then((data)=> {
  // console.log('onSubmitOrderAndProduct data',data)
  if(data[0].result === "ok") {
    setGlobalData('payOrder',orderContent)
    this.changeOrdersState('createOrderStatus', false)
    Taro.navigateTo({
      url: `/pages/pay/index`
    })
    if(dataType === 'cartSelected'){
      let cartCount = parseInt(Taro.getStorageSync('cartCount')) - totalCount
      Taro.setStorageSync('cartCount',cartCount)
      Taro.removeStorageSync('cartList')
    }
  }
}).catch((err)=>{
  this.changeOrdersState('createOrderStatus', false)
  console.log('submit order error',err)
  Taro.showToast({
    title:'订单创建失败，请稍后重试',
    icon: 'none'
  })
})
