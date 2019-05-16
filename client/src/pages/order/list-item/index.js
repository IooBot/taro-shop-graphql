import Taro, { Component } from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import {findMany} from "../../../utils/crud"
import './index.scss'

export default class OrderListItem extends Component {
  constructor(props) {
    super(props)
    this.state = {
      product: []
    }
  }

  componentWillMount() {
    this.getOrderProductData()
  }

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

  navigateToOrderDetail = () => {
    let {orderId:id} = this.state
    Taro.navigateTo({
      url: `/pages/order/detail/index?id=${id}`
    })
  }

  render() {
    let {product} = this.state

    return (
      <View className='order-product' onClick={this.navigateToOrderDetail}>
        {
          product.length === 1 ?
            <View className='order-product__content'>
              <Image className='order-product__content-img' src={product[0].product_id.img} />
              <View className='order-product__content-name'>
                {product[0].product_id.name}
              </View>
            </View>:
            product.map(item => (
              <Image className='order-product__content-img' key={item.id} src={item.product_id.img} />
          ))
        }
      </View>
    )
  }
}