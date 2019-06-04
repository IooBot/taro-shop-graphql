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
