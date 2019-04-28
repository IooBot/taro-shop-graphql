import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.scss'

export default class OrdersAddress extends Component {
  static defaultProps = {
    list: []
  }

  handleClick = (id) => {
    Taro.navigateTo({
      url: `/pages/detail/index?id=${id}`
    })
  }

  render () {
    const data = [{"id":"address_1555055701870_48148007","default":1,"username":"ioobot","telephone":"18722345632","province":"\u5B89\u5FBD\u7701","area":"\u8700\u5C71\u533A","city":"\u5408\u80A5\u5E02","address":"\u4E94\u91CC\u58A9","user_id":{"openid":"ioobot","id":"ioobot","__typename":"user"}}]
    let {default:isDefault, username, telephone, province, area, city, address} = data[0]
    // const data1 = ''
    return (
      <View className='orders-address'>
        {
          data ?
            <View className='orders-address__item'>

              <View className='orders-address__item-detail'>
                <View className='orders-address__item-wrap'>
                  <Text className='orders-address__item-name'>{username}</Text>&nbsp;&nbsp;
                  <Text className='orders-address__item-tel'>{telephone}</Text>
                </View>
                <View className='orders-address__item-info'>
                  {
                    isDefault ?
                      <View className='orders-address__item-label'>
                        <Text className='orders-address__item-label-tag'>默认</Text>
                      </View>:''
                  }
                  <Text className='orders-address__item-txt'>{province}{area}{city}{address}</Text>
                </View>
              </View>

              <View className='orders-address__item-icon'>{'>'}</View>
            </View>:
            <View className='orders-address__add' onClick={this.handleClick.bind(this)}>+ 添加收货地址</View>
        }
      </View>
    )
  }
}
