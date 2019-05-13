import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import {findMany} from "../../../utils/crud"
import Loading from "../../detail"
import OrderListItem from "../list-item"
import './index.scss'
import OrderFooter from "../footer"

export default class OrderList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loaded: false,
      orderStatus: '0',
      list:[]
    }
  }

  componentWillMount() {
    let {typeIndex} = this.props
    let orderStatus = String(typeIndex)

    this.setState({
      orderStatus
    },()=>{
      this.getOrderData()
    })
  }

  getOrderData = () => {
    let {orderStatus} = this.state
    console.log("getOrderData orderStatus",orderStatus)
    let user_id = 'ioobot'
    let fields = ["orderTotalPay", "createdAt", "orderStatus", "id", "count", "productTotalPay", "user_id.id"]
    findMany({collection:'order',condition:{user_id, orderStatus},fields}).then((res) => {
      console.log("getOrderData res",res)
      this.setState({
        loaded:true,
        list: res
      })
    })
  }

  render() {
    let {loaded, orderStatus, list} = this.state
    let content = orderStatus === '0' ? '需付款' : '实付款'

    if (!loaded) {
      return <Loading />
    }

    return (
      <View className='order-wrap'>
        {
          list.length === 0 ?
            <View className='order-empty' />
            :
            list.map(order => (
              <View key={order.id} className='order-card'>
                <View className='order-card-top'>订单号: {order.id}</View>
                <OrderListItem orderId={order.id} />
                <View className='order-card-bottom'>
                  <View className='order-card-count'>
                    共{order.count}件商品 {content}:
                  </View>
                  <View className='order-card-pay'>
                    ￥{Math.round(order.productTotalPay * 100) / 100}
                  </View>
                </View>
                <OrderFooter orderStatus={orderStatus} orderId={order.id} />
              </View>
            ))
        }
      </View>
    )
  }
}