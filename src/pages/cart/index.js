import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import ButtonItem from '../../components/button'
import Loading from '../../components/loading'
import { getWindowHeight } from '../../utils/style'
import Tip from './tip'
import Gift from './gift'
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

    const cartInfo = [{"count":1,"id":"1550813365801","product_id":{"id":"5","img":"https://ece-img-1254337200.cos.ap-chengdu.myqcloud.com/xs.jpg","intro":"\u7C73\u767D","name":"\u6253\u5E95\u886B\u5185\u642D2019\u65B0\u6B3E\u7EAF\u8272\u6253\u5E95\u9488\u7EC7\u886B\u5E26\u5E3D\u5BBD\u677E\u6175\u61D2\u98CE\u6BDB\u8863","price":150.0,"status":"1","stock":145,"unit":"1\u4EF6","discountRate":88.0},"specificationStock_id":{"id":"14","color":"\u7C73\u767D","size":"165/88A(L)","stock":76,"status":"1"}},{"count":1,"id":"1550813381065","product_id":{"id":"3","img":"https://ece-img-1254337200.cos.ap-chengdu.myqcloud.com/wt.jpg","intro":"\u5361\u5176","name":"\u65B0\u6B3E\u53CC\u9762\u7F8A\u7ED2\u5927\u8863 \u5973 \u77ED\u6B3E \u8D6B\u672C\u5927\u8863\u5C0F\u4E2A\u5B50 \u9AD8\u7AEF\u7F8A\u6BDB\u5462\u5B50\u5916\u5957","price":320.0,"status":"1","stock":103,"unit":"1\u4EF6","discountRate":88.0},"specificationStock_id":{"id":"7","color":"\u5361\u5176","size":"160/84A(M)","stock":25,"status":"1"}}]
    this.setState({
      loaded:true,
      cartInfo
    });
    console.log("cartInfo",cartInfo)

  }

  render () {
    let {cartInfo} = this.state
    const { cartGroupList = [] } = cartInfo
    const cartList = cartGroupList.filter(i => !i.promType)
    const isEmpty = !cartList.length
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
          <Tip list={cartInfo.policyDescList} />
          {isEmpty && <Empty />}

          {!isEmpty && <Gift data={cartGroupList[0]} />}

          {!isEmpty && cartList.map((group, index) => (
            <List
              key={index}
              promId={group.promId}
              promType={group.promType}
              list={group.cartItemList}
              onUpdate={this.props.dispatchUpdate}
              onUpdateCheck={this.props.dispatchUpdateCheck}
            />
          ))}

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
