import Taro, { Component } from '@tarojs/taro'
import { View, Input, Picker, Text } from '@tarojs/components'
import './index.scss'

export default class OrdersDelivery extends Component {
  constructor(props) {
    super(props)
    this.state = {
      deliveryList: ["快递配送","门店自提"],
      delivery: ["快递配送"],
      remark:'',
    }
  }

  onChange = e => {
    console.log('onChange e',e)
    this.setState({
      delivery: this.state.deliveryList[e.detail.value]
    })
  }

  render () {
    let {deliveryList} = this.state
    return (
      <View className='orders__delivery'>
        <Picker onChange={this.onChange} range={deliveryList}>
          <view className='orders__delivery-picker'>
            <Text className='orders__delivery-picker-title'>配送方式</Text>
            <Text className='orders__delivery-picker-select'>{this.state.delivery}{' >'}</Text>
          </view>
        </Picker>
        <View className='orders__delivery-message'>
          <View className='orders__delivery-message-title'>买家留言</View>
          <View className='orders__delivery-message-input'>
            <Input
              placeholder='输入留言内容(50字以内)'
              type='text'
              maxLength={50}
              onInput={(val) => {
                // console.log('orders-remark val',val)
                this.setState({
                  remark:val
                })
              }}
            />
          </View>
        </View>
      </View>
    )
  }
}
