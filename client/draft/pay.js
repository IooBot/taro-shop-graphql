import {update} from "../src/utils/crud";
import Taro from "@tarojs/taro";

let updateOrderStatus = update({collection:"order",condition:updateContent})
updateOrderStatus.then((data)=>{
  // console.log("update order data",data)
  if(data.result === "ok"){
    $this.message('支付成功，等待发货')
    Taro.navigateTo({
      url: `/pages/order/index?type=1`
    })
  }else {
    $this.message('支付成功，订单创建失败，请联系商家')
  }
})
