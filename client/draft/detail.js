import {findMany, findOne} from "../src/utils/crud";
import Taro from "@tarojs/taro";

let detail = findOne({collection:"product",condition:{id: productId},fields:["name", "id", "intro", "price", "img", "stock", "discountRate", "status"]})
let detailSpec = findMany({collection:"specificationStock",condition:{product_id: productId},fields:["id", "color", "size", "slideImg", "detailImg", "stock", "status"]})

Promise.all([detail, detailSpec]).then((res)=>{
  // console.log('detail spec data',res)
  this.setState({
    loaded:true,
    detailInfo: res[0],
    detailSpec: res[1]
  });
})

// let user_id = getGlobalData("user_id")
// findMany({collection:"userCart",condition:{user_id},fields:["id","count"]}).then((res)=>{
// console.log(`cartList count`,res)

// 获取购物车数量更新
getCartCount = (res) => {
  let cartCount=0;
  if(res.length){
    res.forEach((item,index)=>{
      cartCount+=item.count
      if(index === res.length -1){
        Taro.setStorage({key: 'cartCount', data: cartCount})
      }
    })
  }else {
    Taro.setStorage({key: 'cartCount', data: cartCount})
  }
};
