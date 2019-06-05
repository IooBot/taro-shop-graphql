import {remove} from "../src/utils/crud";
import Taro from "@tarojs/taro";

cancelOrder = (id) => {
  let deleteOrder = remove({collection: "order",condition: {id}})
  let deleteOrderProduct = remove({collection: "orderProduct",condition:{order_id:id}})
  Promise.all([deleteOrder, deleteOrderProduct]).then((res)=>{
    // console.log('delete order res',res)
    if(res[0] === "ok" && res[1] === "ok"){
      Taro.showToast({
        title: '删除成功',
        icon: 'none'
      })
    }
  })
}
