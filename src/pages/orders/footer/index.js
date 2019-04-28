import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import ButtonItem from '../../../components/button'
import './index.scss'

export default class OrdersFooter extends Component {
  static defaultProps = {
    cartInfo: {},
  }

  handleOrder = () => {
    Taro.showToast({
      title: '敬请期待',
      icon: 'none'
    })
  }

  render () {

    return (
      <View className='orders-footer'>
        <View className='orders-footer__amount'>
          <Text className='orders-footer__select-txt'>
            合计
          </Text>
          <Text className='orders-footer__amount-txt'>
            ¥{parseFloat(100).toFixed(2)}
          </Text>
        </View>
        <View className='orders-footer__btn'>
          <ButtonItem
            type='primary'
            text='提交订单'
            onClick={this.handleOrder}
          />
        </View>
      </View>
    )
  }
}
