import {findMany} from "../src/utils/crud";

getOrderProductData = () => {
  let {orderId} = this.props
  // console.log("getOrderProductData orderId",orderId)
  const fields = [
    "productColor", "unit", "productSize","orderPay", "productImg", "productName", "productPrice", "id", "count", "productPay",
    "product_id{id, unit, img, intro, name, price, status, stock, unit, discountRate}"
  ]
  findMany({collection:'orderProduct',condition:{order_id:orderId},fields}).then((res) => {
    // console.log("getOrderProductData res",res)
    this.setState({
      product: res
    })
  })
}


getOrderData = () => {
  let {orderStatus} = this.state
  let {user_id} = this.props
  // console.log("getOrderData orderStatus",orderStatus,"user_id",user_id)

  let fields = ["orderTotalPay", "createdAt", "orderStatus", "id", "count", "productTotalPay", "user_id.id"]
  findMany({collection:'order',condition:{user_id, orderStatus},fields}).then((res) => {
    // console.log("getOrderData res",res)
    this.setState({
      loaded:true,
      list: res
    })
  })
}

getOrderByStatus = (orderStatus) => {
  // console.log("OrderList orderStatus",orderStatus,typeof  orderStatus)

  this.setState({
    orderStatus
  },()=>{
    this.getOrderData()
  })
}
