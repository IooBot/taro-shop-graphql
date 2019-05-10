import Taro, { Component } from '@tarojs/taro';
import { View, ScrollView } from '@tarojs/components'
import { AtGrid } from "taro-ui"
import './index.scss'
import Loading from "../../components/loading"
import Logo from '../../components/logo'
import {findOne} from "../../utils/crud"
import {getWindowHeight} from "../../utils/style"

const orderIcon = [
  {
    image: 'https://ece-img-1254337200.cos.ap-chengdu.myqcloud.com/icon/pay.png',
    value: '待付款',
    id: 0
  },
  {
    image: 'https://ece-img-1254337200.cos.ap-chengdu.myqcloud.com/icon/ship.png',
    value: '待发货',
    id: 1
  },
  {
    image: 'https://ece-img-1254337200.cos.ap-chengdu.myqcloud.com/icon/unbox.png',
    value: '待收货',
    id: 2
  },
  {
    image: 'https://ece-img-1254337200.cos.ap-chengdu.myqcloud.com/icon/judge.png',
    value: '待评价',
    id: 3
  }
]

const toolsIcon = [
  {
    image: 'https://ece-img-1254337200.cos.ap-chengdu.myqcloud.com/icon/address.png',
    value: '收货地址',
    id: 'address'
  },
  {
    image: 'https://ece-img-1254337200.cos.ap-chengdu.myqcloud.com/icon/cart.png',
    value: '购物袋',
    id: 'cart'
  }
]

// const shopIcon = [
//   {
//     image: 'https://ece-img-1254337200.cos.ap-chengdu.myqcloud.com/icon/shop.png',
//     value: '店铺展示',
//     id: 'shop'
//   },
//   {
//     image: 'https://ece-img-1254337200.cos.ap-chengdu.myqcloud.com/icon/goods.png',
//     value: '商品管理',
//     id: 'goods'
//   },
//   {
//     image: 'https://ece-img-1254337200.cos.ap-chengdu.myqcloud.com/icon/order.png',
//     value: '订单管理',
//     id: 'orders'
//   }
// ];

class All extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loaded: false,
      user_data:{}
    }
  }

  componentDidMount() {
    let user_id = 'ioobot'
    console.log(user_id)
    this.userInfo(user_id);
  }

  userInfo = (user_id) => {
    let userData = findOne({collection:"user",condition:{id: user_id},fields:["id", "email", "telephone", "username", "openid"]});//,fields:[]
    userData.then(res =>{
      console.log('user data',res)
      this.setState({
        loaded:true,
        user_data: res
      });
    })
  }

  navigateTo = (page,type,id) => {
    let url = type ? `/pages${page}?${type}=${id}` : `/pages${page}`
    Taro.navigateTo({
      url
    })
  }

  switchTab = () => {
    Taro.switchTab({
      url: '/pages/cart/index'
    })
  }

  render() {
    if (!this.state.loaded) {
      return (
        <Loading />
      )
    }
    // let user_data = this.state.user_data
    return (
      <View className='user'>
        <ScrollView
          scrollY
          className='cart__wrap'
          style={{ height: getWindowHeight() }}
        >
          <View className='user-info'>
            <View className='avatar'>
              <open-data type='userAvatarUrl'></open-data>
            </View>
            <View className='nickname'>
              <open-data type='userNickName' lang='zh_CN'></open-data>
            </View>
          </View>

          <View className='my-card order-card'>
            <View className='card-title'>
              电商订单
            </View>
            <View className='card-icons'>
              <AtGrid data={orderIcon}
                columnNum={4}
                hasBorder={false}
                onClick={(order) => {
                  this.navigateTo('/order/index','type',order.id)
                }}
              />
            </View>
          </View>

          <View className='my-card tools-card'>
            <View className='card-title'>
              我的工具
            </View>
            <View className='card-icons'>
              <AtGrid data={toolsIcon}
                columnNum={4}
                hasBorder={false}
                onClick={(tools) => {
                  if (tools.id === 'address') {
                    this.navigateTo('/address/index')
                  }else if(tools.id === 'cart'){
                    this.switchTab()
                  }
                }}
              />
            </View>
          </View>

          {/*<View className='my-card member-card'>*/}
            {/*<View className='card-title'>*/}
              {/*商家入口*/}
            {/*</View>*/}
            {/*<View className='card-icons'>*/}
              {/*<AtGrid data={shopIcon}*/}
                {/*columnNum={4}*/}
                {/*hasBorder={false}*/}
                {/*onClick={(shop) => {*/}
                  {/*this.navigateTo('/manage-shop/index','page',shop.id)*/}
                {/*}}*/}
              {/*/>*/}
            {/*</View>*/}
          {/*</View>*/}
          <Logo />
        </ScrollView>
      </View>
    )
  }
}

export default All