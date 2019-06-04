import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import {connect} from "@tarojs/redux";
//import {findMany} from "../../../utils/crud"
import Loading from "../../detail"
import OrderListItem from "../list-item"
import OrderFooter from "../footer"
import './index.scss'

@connect(({ orderList, loading }) => ({
  orderList,
  ...loading,
}))
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
    let { typeIndex, user_id } = this.props;
    let orderStatus = String(typeIndex);
   // this.getOrderByStatus(orderStatus)
    this.props.dispatch({
      type: 'orderList/fetch',
      payload: {user_id, orderStatus}
    });
  }

  componentWillReceiveProps(nextProps) {
    let { typeIndex,user_id } = nextProps
    let orderStatus = String(typeIndex)
    this.props.dispatch({
      type: 'orderList/fetch',
      payload: {user_id, orderStatus}
    });
    //this.getOrderByStatus(orderStatus)
  }


  render() {
    // let {loaded, orderStatus, list} = this.state;
    const {orderStatus, orderList, effects} = this.props;
    if ( effects['orderList/fetch']) { //!loaded
      return <Loading />
    }
    let list = orderList.list;
    let content = orderStatus === '0' ? '需付款' : '实付款'

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
                <OrderFooter orderStatus={orderStatus} order={order} />
              </View>
            ))
        }
      </View>
    )
  }
}
