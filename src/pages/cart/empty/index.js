import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Button } from '@tarojs/components'
// import empty from './assets/empty.png'
import cart_empty from './assets/cart_empty.jpg'
import './index.scss'

export default class Empty extends Component {

  handleClick = () => {
    Taro.switchTab({
      url: `/pages/home/index`
    })
  }

  render () {
    return (
      <View className='cart-empty' >
        <Image className='cart-empty__img' src={cart_empty} alt='img' width={100} />
        <View className='cart-empty__txt'>购物袋空空如也</View>
        <View>
          <Button className='empty-button' onClick={this.handleClick}>
            去逛逛
          </Button>
        </View>
      </View>
    )
  }
}
