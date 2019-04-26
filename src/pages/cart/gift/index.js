import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.scss'

export default class Gift extends Component {
  static defaultProps = {
    data: {}
  }

  render () {
    // const { data } = this.props

    return (
      <View className='cart-gift'>
        <Text className='cart-gift__tag'>promTitle</Text>
        <Text className='cart-gift__txt'>
          promTip
        </Text>
        <Text className='cart-gift__arrow'>{'>'}</Text>
        <View className='cart-gift__line' />
        <Text className='cart-gift__link'>jumpTitle</Text>
      </View>
    )
  }
}
