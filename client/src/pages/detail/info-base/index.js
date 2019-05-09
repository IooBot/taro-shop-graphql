import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
// import rightArrow from './assets/right-arrow.png'
import './index.scss'

export default class InfoBase extends Component {
  static defaultProps = {
    data: {}
  }

  render () {
    const { data } = this.props
    const {name, intro, price, stock, discountRate} = data
    let activityPrice = (price * discountRate / 100).toFixed(2)

    return (
      <View className='item-info-base'>
        <View className='item-info-base__header'>
          <View className='item-info-base__header-wrap'>
            <Text className='item-info-base__header-name'>{name}</Text>
            <Text className='item-info-base__header-desc'>{intro}</Text>
          </View>
          <View className='item-info-base__header-star'>
            <Text className='item-info-base__header-star-txt'>
              {`${parseInt(stock) || 0}`}
            </Text>
            <Text className='item-info-base__header-star-link'>库存</Text>
          </View>
        </View>

        <View className='item-info-base__price'>
          <Text className='item-info-base__price-symbol'>¥</Text>
          <Text className='item-info-base__price-txt'>
            {activityPrice || price}
          </Text>
          {!!activityPrice &&
            <Text className='item-info-base__price-origin'>
              ¥{price}
            </Text>
          }
        </View>
      </View>
    )
  }
}
