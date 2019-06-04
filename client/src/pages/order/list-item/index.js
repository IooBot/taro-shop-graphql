import Taro, { Component } from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import {connect} from "@tarojs/redux";
// import {findMany} from "../../../utils/crud"
import './index.scss'

@connect(({ orderProductList, loading }) => ({
  orderProductList,
  ...loading,
}))
export default class OrderListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // product: []
    }
  }

  componentWillMount() {
    // this.getOrderProductData()
    let { orderId } = this.props;
    this.props.dispatch({
      type: 'orderProductList/fetch',
      payload: {orderId}
    });
  }

  navigateToOrderDetail = () => {
    let {orderId:id} = this.state
    Taro.navigateTo({
      url: `/pages/order/detail/index?id=${id}`
    })
  }

  render() {
    // let {product} = this.state
    const {orderProductList} = this.props;
    let product = orderProductList.list;
    return (
      <View className='order-product' onClick={this.navigateToOrderDetail}>
        {
          product.length === 1 ?
            <View className='order-product__content'>
              <Image className='order-product__content-img' src={product[0].product.img} />
              <View className='order-product__content-name'>
                {product[0].product.name}
              </View>
            </View>:
            product.map(item => (
              <Image className='order-product__content-img' key={item.id} src={item.product.img} />
          ))
        }
      </View>
    )
  }
}
