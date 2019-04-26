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
    findMany({collection:"userCart",condition:{user_id},fields}).then((res)=>{
      console.log("cartInfo",res)
      this.setState({
        loaded:true,
        cartInfo:res
      });
    })
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
