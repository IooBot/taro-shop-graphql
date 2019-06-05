import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import {connect} from "@tarojs/redux";
import './index.scss'
// import {remove} from "../../../utils/crud"

// import {setGlobalData} from "../../../utils/global_data"
@connect(({ orderMutate, orderProductMutate  }) => ({
  orderDeleteResult: orderMutate.deleteResult,
  orderProdcutDeleteResult: orderProductMutate.deleteResult,
}))
export default class OrderFooter extends Component {
  static defaultProps = {
    orderStatus: '0'
  }

  cancelOrder = (id) => {
    this.props.dispatch({
      type:'orderMutate/delete',
      payload:{id}
    });
    this.props.dispatch({
      type:'orderProductMutate/delete',
      payload:{order_id:id}
    });
  };

  payOrder = () => {
    let {order} = this.props;
    // console.log("order payOrder order",order)
    // setGlobalData('payOrder',order)
    this.props.dispatch({
      type: 'common/save',
      payload: { payOrder: order }
    });
    Taro.navigateTo({
      url: `/pages/pay/index`
    })
  }

  render () {
    let {orderStatus, order} = this.props
    const {orderDeleteResult, orderProdcutDeleteResult, dispatch} = this.props;
    if(orderDeleteResult && orderProdcutDeleteResult){
      if(orderProdcutDeleteResult == 'ok' && orderDeleteResult == 'ok'){
        Taro.showToast({
          title: '删除成功',
          icon: 'none'
        });
      }else{
        Taro.showToast({
          title: '删除失败',
          icon: 'none'
        });
      }
      dispatch({
        type: 'orderMutate/saveDeleteResult',
        payload:''
      })
      dispatch({
        type: 'orderProductMutate/saveDeleteResult',
        payload:''
      })

    }
    return (
      <View className='order-footer'>
        {
          orderStatus === '0' ?
            <View className='order-card-button-group'>
              <View className='order-footer__button'>
                <Button
                  className='order-button'
                  onClick={this.cancelOrder.bind(this,order.id)}
                >
                  <Text className='order-footer-txt'>取消</Text>
                </Button>
              </View>
              <View className='order-footer__button'>
                <Button
                  className='pay-button order-button'
                  style={{marginLeft: 5}}
                  onClick={this.payOrder}
                >
                  <Text className='order-footer-txt'>去支付</Text>
                </Button>
              </View>
            </View>:''
        }
        {
          orderStatus === '1' ?
            <View className='order-card-button-group'>
              <View className='order-footer__button'>
                <Button className='ship-button order-button'>
                  <Text className='order-footer-txt'>催发货</Text>
                </Button>
              </View>
            </View>:''
        }
        {
          orderStatus === '2' ?
            <View className='order-card-button-group'>
              <View className='order-footer__button'>
                <Button className='unbox-button order-button'>
                  <Text className='order-footer-txt'>查看物流</Text>
                </Button>
              </View>
            </View>:''
        }
        {
          orderStatus === '3' ?
            <View className='order-card-button-group'>
              <View className='order-footer__button'>
                <Button className='judge-button order-button'>
                  <Text className='order-footer-txt'>去评价</Text>
                </Button>
              </View>
              <View className='order-footer__button'>
                <Button className='more-button order-button'>
                  <Text className='order-footer-txt'>售后</Text>
                </Button>
              </View>
            </View>:''
        }
      </View>
    )
  }
}
