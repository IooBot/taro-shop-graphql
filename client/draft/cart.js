// 获取购物车数据
import {getGlobalData} from "../src/utils/global_data";
import {findMany} from "../src/utils/crud";
import Taro from "@tarojs/taro";

getCartData = () => {
  let user_id = getGlobalData("user_id")
  const fields = [
    "count",
    "id",
    "product_id{id, img, intro, name, price, status, stock, unit, discountRate}",
    "specificationStock_id{id, color, size, stock, status}"
  ]
  findMany({collection:"userCart",condition:{user_id},fields}).then((res)=>{
    // console.log(`cartList`,res)
    res.forEach((item)=>{
      item.checked = false
    })
    this.setState({
      loaded:true,
      cartList:res
    },()=>{
      if(res.length){
        this.sumPrice(true)
      }else {
        Taro.setStorage({key: 'cartCount', data: 0})
      }
    })
  })
}
