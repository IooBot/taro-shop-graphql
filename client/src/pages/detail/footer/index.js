import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { AtBadge } from 'taro-ui'
import ButtonItem from '../../../components/button'
import homeIcon from './assets/home.png'
import serviceIcon from './assets/service.png'
import cartIcon from './assets/cart.png'
import './index.scss'

const NAV_LIST = [{
  key: 'home',
  img: homeIcon,
  // img: "https://ece-img-1254337200.cos.ap-chengdu.myqcloud.com/icon/ship.png",
  url: '/pages/home/home'
}, {
  key: 'service',
  img: serviceIcon
}, {
  key: 'cart',
  img: cartIcon,
  // img: "https://ece-img-1254337200.cos.ap-chengdu.myqcloud.com/icon/cart.png",
  url: '/pages/cart/cart'
}]

export default class Footer extends Component {

  handleNav = (item) => {
    if (item.key === 'service') {
      Taro.showToast({
        title: '敬请期待',
        icon: 'none'
      })
    }else {
      Taro.switchTab({
        url: `/pages/${item.key}/index`
      })
    }
  }

  handleAdd = () => {
    this.props.onChangeAddOrBuy('add')
  }

  handleBuy = () => {
    this.props.onChangeAddOrBuy('buy')
  }

  render () {
    let {cartCount} = this.props
    return (
      <View className='item-footer'>
        {NAV_LIST.map(item => (
          <View
            key={item.key}
            className='item-footer__nav'
            onClick={this.handleNav.bind(this, item)}
          >
            {
              cartCount ?
                <AtBadge value={item.key === 'cart' ? cartCount : ''} maxValue={99}>
                  <Image
                    className='item-footer__nav-img'
                    src={item.img}
                  />
                </AtBadge>
                :
                <Image
                  className='item-footer__nav-img'
                  src={item.img}
                />
            }
          </View>
        ))}
        <View className='item-footer__buy' onClick={this.handleBuy}>
          <Text className='item-footer__buy-txt'>立即购买</Text>
        </View>
        <ButtonItem
          type='primary'
          text='加入购物车'
          onClick={this.handleAdd}
          compStyle={{
            width: Taro.pxTransform(235),
            height: Taro.pxTransform(100)
          }}
        />
      </View>
    )
  }
}
