import '@tarojs/async-await'
import Taro, { Component } from '@tarojs/taro'
//import * as QL from 'graphql-sync-multi-platform/graphql_cache.core'
import 'taro-ui/dist/style/index.scss'
import Home from './pages/home'


//import {graphqlEndpoint} from './config'
import './app.scss'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

class App extends Component {

  config = {
    pages: [
      'pages/home/index',
      'pages/kind/index',
      'pages/detail/index',
      'pages/cart/index',
      'pages/orders/index',
      'pages/address/index',
      'pages/address/edit/index',
      'pages/pay/index',
      'pages/order/index',
      'pages/user/index',
      // 'pages/message/index',
      // 'pages/manage-goods/index',
      // 'pages/manage-orders/index',
      // 'pages/manage-shop/index',
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: '服装商城',
      navigationBarTextStyle: 'black'
    },
    tabBar: {
      color: "#666",
      selectedColor: "#b4282d",
      backgroundColor: "#fafafa",
      borderStyle: 'black',
      list: [{
        pagePath: "pages/home/index",
        iconPath: "./assets/tab-bar/home.png",
        selectedIconPath: "./assets/tab-bar/home-active.png",
        text: "主页"
      }
      ,{
        pagePath: "pages/cart/index",
        iconPath: "./assets/tab-bar/cart.png",
        selectedIconPath: "./assets/tab-bar/cart-active.png",
        text: "购物车"
      }, {
        pagePath: "pages/user/index",
        iconPath: "./assets/tab-bar/user.png",
        selectedIconPath: "./assets/tab-bar/user-active.png",
        text: "我"
      }
      ]
    },
    cloud: true
  }

  componentDidMount () {
    if (process.env.TARO_ENV === 'weapp') {
      Taro.cloud.init()
    }
  }

  componentDidShow () {}

  componentDidHide () {}

  componentCatchError() {}

  componentDidCatchError () {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Home />
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
