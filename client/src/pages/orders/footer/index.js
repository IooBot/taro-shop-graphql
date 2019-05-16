import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import ButtonItem from '../../../components/button'
import './index.scss'

export default class OrdersFooter extends Component {

  handleOrder = (e) => {
    // console.log("OrdersFooter handleOrder")
    e.stopPropagation()
    this.props.onSubmitOrderAndProduct()
    Taro.navigateTo({
      url: `/pages/pay/index`
    })
  }

  render () {
    const {totalPrice} = this.props
    return (
      <View className='orders-footer'>
        <View className='orders-footer__amount'>
          <Text className='orders-footer__select-txt'>
            合计:
          </Text>
          <Text className='orders-footer__amount-txt'>
            ¥{parseFloat(totalPrice).toFixed(2)}
          </Text>
        </View>
        <View className='orders-footer__btn'>
          <ButtonItem
            type='primary'
            text='提交订单'
            onClick={this.handleOrder.bind(this)}
          />
        </View>
      </View>
    )
  }
}
