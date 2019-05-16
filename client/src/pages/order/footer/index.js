import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import './index.scss'

export default class OrderFooter extends Component {
  static defaultProps = {
    orderStatus: '0'
  }

  cancelOrder = (id) => {

  }

  payOrder = () => {

  }


  render () {
    let {orderStatus, orderId} = this.props

    return (
      <View className='order-footer'>
        {
          orderStatus === '0' ?
            <View className='order-card-button-group'>
              <View className='order-footer__button'>
                <Button
                  className='order-button'
                  onClick={this.cancelOrder}
                >
                  <Text className='order-footer-txt'>取消</Text>
                </Button>
              </View>
              <View className='order-footer__button'>
                <Button
                  className='pay-button order-button'
                  style={{marginLeft: 5}}
                  onClick={this.payOrder}
                >
                  <Text className='order-footer-txt'>去支付</Text>
                </Button>
              </View>
            </View>:''
        }
        {
          orderStatus === '1' ?
            <View className='order-card-button-group'>
              <View className='order-footer__button'>
                <Button className='ship-button order-button'>
                  <Text className='order-footer-txt'>催发货</Text>
                </Button>
              </View>
            </View>:''
        }
        {
          orderStatus === '2' ?
            <View className='order-card-button-group'>
              <View className='order-footer__button'>
                <Button className='unbox-button order-button'>
                  <Text className='order-footer-txt'>查看物流</Text>
                </Button>
              </View>
            </View>:''
        }
        {
          orderStatus === '3' ?
            <View className='order-card-button-group'>
              <View className='order-footer__button'>
                <Button className='judge-button order-button'>
                  <Text className='order-footer-txt'>去评价</Text>
                </Button>
              </View>
              <View className='order-footer__button'>
                <Button className='more-button order-button'>
                  <Text className='order-footer-txt'>售后</Text>
                </Button>
              </View>
            </View>:''
        }
      </View>
    )
  }
}
