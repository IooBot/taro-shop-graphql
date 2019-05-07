import Taro, { Component } from '@tarojs/taro'
import { View, Input, Picker, Text } from '@tarojs/components'
import './index.scss'

export default class OrdersDelivery extends Component {
  constructor(props) {
    super(props)
    this.state = {
      deliveryList: ["快递配送","门店自提"],
      delivery: ["快递配送"],
    }
  }

  changeDelivery = e => {
    // console.log('changeDelivery e',e)
    let delivery = this.state.deliveryList[e.detail.value]
    this.setState({
      delivery
    })
    this.props.onChangeOrdersState('delivery',delivery)
  }

  changeRemark = (e) => {
    // console.log('changeRemark e',e)
    this.props.onChangeOrdersState('remark',e.detail.value)
  }

  render () {
    let {deliveryList, delivery} = this.state

    return (
      <View className='orders__delivery'>
        <Picker
          range={deliveryList}
          onChange={this.changeDelivery}
        >
          <view className='orders__delivery-picker'>
            <Text className='orders__delivery-picker-title'>配送方式</Text>
            <Text className='orders__delivery-picker-select'>{delivery}{' >'}</Text>
          </view>
        </Picker>
        <View className='orders__delivery-message'>
          <View className='orders__delivery-message-title'>买家留言</View>
          <View className='orders__delivery-message-input'>
            <Input
              placeholder='输入留言内容(50字以内)'
              type='text'
              maxLength={50}
              onInput={this.changeRemark}
            />
          </View>
        </View>
      </View>
    )
  }
}
