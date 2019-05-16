import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.scss'

export default class OrdersAddress extends Component {
  static defaultProps = {
    selectAddress: {}
  }

  handleClick = () => {
    let {selectAddress, dataType} = this.props
    if(selectAddress.id){
      Taro.navigateTo({
        url: `/pages/address/index?prePage=orders&dataType=${dataType}`
      })
    }else {
      Taro.navigateTo({
        url: `/pages/address/edit/index?id=add`
      })
    }
  }

  render () {
    const {selectAddress} = this.props
    // console.log("selectAddress",selectAddress)
    let {default:isDefault, username, telephone, province, area, city, address} = selectAddress

    return (
      <View className='OrdersAddress orders-address'>
        {
          selectAddress.id ?
            <View className='orders-address__item' onClick={this.handleClick}>
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
            </View>
            :
            <View className='orders-address__add' onClick={this.handleClick}>+ 添加收货地址</View>
        }
      </View>
    )
  }
}
