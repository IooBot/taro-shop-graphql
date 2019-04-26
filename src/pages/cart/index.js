import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import ButtonItem from '../../components/button'
import Loading from '../../components/loading'
import { getWindowHeight } from '../../utils/style'
import Tip from './tip'
// import Gift from './gift'
import Empty from './empty'
import List from './list'
import Footer from './footer'
import './index.scss'
import {findMany} from "../../utils/crud"


class Cart extends Component {
  config = {
    navigationBarTitleText: '购物车'
  }

  state = {
    loaded: false,
    login: true,
    cartInfo:[]
  }

  componentDidMount() {
    let user_id = 'ioobot'
    const fields = [
      "count",
      "id",
      "product_id{id, img, intro, name, price, status, stock, unit, discountRate}",
      "specificationStock_id{id, color, size, stock, status}"
    ]
    let cartInfo1 = findMany({collection:"userCart",condition:{user_id},fields})

    const cartInfo = [{
      "count":1,"id":"1550813365801",
      "product_id":{"id":"5","img":"https://ece-img-1254337200.cos.ap-chengdu.myqcloud.com/xs.jpg","intro":"米白","name":"打底衫内搭2019新款纯色打底针织衫带帽宽松慵懒风毛衣","price":150.0,"status":"1","stock":145,"unit":"1","discountRate":88.0},
      "specificationStock_id":
        {"id":"14","color":"米白","size":"165/88A(L)","stock":76,"status":"1"}
      }, {
        "count":1,"id":"1550813381065",
      "product_id":{"id":"3","img":"https://ece-img-1254337200.cos.ap-chengdu.myqcloud.com/wt.jpg","intro":"卡其","name":"新款双面羊绒大衣 女 短款 赫本大衣小个子 高端羊毛呢子外套","price":320.0,"status":"1","stock":103,"unit":"1","discountRate":88.0},
      "specificationStock_id":{"id":"7","color":"卡其","size":"160/84A(M)","stock":25,"status":"1"}}]
    this.setState({
      loaded:true,
      cartInfo
    });
    console.log("cartInfo",cartInfo)

  }

  render () {
    let {cartInfo} = this.state
    const isEmpty = !cartInfo.length
    const isShowFooter = !isEmpty

    if (!this.state.loaded) {
      return <Loading />
    }

    if (!this.state.login) {
      return (
        <View className='cart cart--not-login'>
          <Empty text='未登陆' />
          <View className='cart__login'>
            <ButtonItem
              type='primary'
              text='登录'
              onClick={this.toLogin}
              compStyle={{
                background: '#b59f7b',
                borderRadius: Taro.pxTransform(4)
              }}
            />
          </View>
        </View>
      )
    }

    return (
      <View className='cart'>
        <ScrollView
          scrollY
          className='cart__wrap'
          style={{ height: getWindowHeight() }}
        >
          <Tip />
          {isEmpty && <Empty />}

          {/*{!isEmpty && <Gift />}*/}

          {!isEmpty &&
            <List
              list={cartInfo}
              onUpdate={this.props.dispatchUpdate}
              onUpdateCheck={this.props.dispatchUpdateCheck}
            />
          }

          {isShowFooter &&
            <View className='cart__footer--placeholder' />
          }
        </ScrollView>

        {isShowFooter &&
          <View className='cart__footer'>
            <Footer
              cartInfo={cartInfo}
              onUpdateCheck={this.props.dispatchUpdateCheck}
            />
          </View>
        }
      </View>
    )
  }
}

export default Cart
