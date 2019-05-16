import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Button } from '@tarojs/components'
import classNames from 'classnames'
import moment from 'moment'
import CheckboxItem from "../../components/checkbox"
import './index.scss'
import {getGlobalData} from "../../utils/global_data"
import {update} from "../../utils/crud"
import {payUrl} from '../../config'

let clicktag = 1;  //微信发起支付点击标志
class Pay extends Component {
  config = {
    navigationBarTitleText: '订单支付'
  }

  constructor(props) {
    super(props)
    this.state = {
      checked: true,
      payOrder: {}
    }
  }

  componentWillMount(){
    let payOrder = getGlobalData('payOrder')
    // console.log("Pay payOrder",payOrder)

    this.setState({
      payOrder
    })
  }

  message = (title) => {
    Taro.showToast({
      title,
      icon: 'none'
    });
  }

  changeCheckedStatus = () => {
    this.setState((preState)=>({
      checked: !preState.checked
    }))
  }

  pay = () => {
    this.message('支付成功')
    Taro.navigateTo({
      url: `/pages/order/index`
    })
  }

  // prepay_id微信生成的预支付会话标识，用于后续接口调用中使用，该值有效期为2小时
  jsApiPay = (args, id) => {
    // console.log('jsApiPay params', args, id);
    let $this = this
    Taro.requestPayment(args).then((res)=>{
      console.log("requestPayment res",res)
      // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回 ok，但并不保证它绝对可靠。
      if (res.errMsg === "requestPayment:ok") {
        // console.log("pay success")
        // 成功完成支付 更新订单状态
        $this.message('支付成功，等待发货')
        Taro.navigateTo({
          url: `/pages/order/index?type=1`
        })
        // let updatedAt = moment().format('YYYY-MM-DD HH:mm:ss')
        // const updateContent = {
        //   id,
        //   orderStatus: '1',
        //   updatedAt
        // }
        // let updateOrderStatus = update({collection:"order",condition:updateContent,fields:["id"]})
        // updateOrderStatus.then((data)=>{
        //   console.log("update order data",data)
        //   if(data){
        //     $this.message('支付成功，等待发货')
        //     Taro.navigateTo({
        //       url: `/pages/order/index?type=1`
        //     })
        //   }else {
        //     $this.message('支付成功，订单创建失败，请联系商家')
        //   }
        // })
      }
    })
      .catch((err)=>{
        console.log("jsApiPay err",err)
        if (err.errMsg === "requestPayment:fail cancel") {
          $this.message('您的支付已经取消')
        } else {
          $this.message('支付失败，请稍后重试')
        }
      })
  }

  getBridgeReady = (id, needPay) => {
    // console.log('getBridgeReady params',id,needPay)
    let isWEAPP = Taro.getEnv()
    // console.log("isWEAPP",isWEAPP)
    if (clicktag === 1 && isWEAPP === 'WEAPP') {
      clicktag = 0   //进行标志，防止多次点击
      let openid = getGlobalData('openid')
      // console.log("getBridgeReady openid",openid)

      let $this = this
      Taro.request({
        url: payUrl,
        data: {
          needPay: parseInt(needPay * 100, 10),
          openid,
          tradeNo: id
        },
        header: {
          'content-type': 'application/json'
        }
        })
        .then((res) => {
          // console.log('onBridgeReady res',res)
          if(res.statusCode === 200){
            $this.jsApiPay(res.data, id)
          }else {
            $this.message(res.data)
          }
          setTimeout(() => {
            clicktag = 1
          }, 5000)
        })
        .catch((error) => {
          $this.message('网络或系统故障，请稍后重试')
          console.log('onBridgeReady error', error)
        })
    } else {
      this.message('当前只支持小程序支付')
    }
  }

  handleConfirm = () => {
    let {checked, payOrder} = this.state
    // console.log("pay payOrder",payOrder)
    let {id, orderTotalPay} = payOrder
    if (checked) {
      this.getBridgeReady(id, orderTotalPay)
    }
  }

  render() {
    let {checked, payOrder} = this.state
    // console.log("pay payOrder",payOrder)
    let {orderTotalPay} = payOrder

    return (
      <View className='pay'>
        <View className='pay__wrap'>
          <View className='pay__header content-piece'>
            <Text className='pay__header-title'>订单金额:</Text>
            <Text className='pay__header-price'>￥: {orderTotalPay}</Text>
          </View>
          <View className='pay__body content-piece'>
            <Text className='pay__body-title'>请选择支付方式</Text>
            <View className='pay__body-item'>
              <View className='pay__body-type'>
                <Image className='pay__body-type-image' src='https://ece-img-1254337200.cos.ap-chengdu.myqcloud.com/icon/wechat.png' alt='' />
                <Text className='pay__body-type-name'>微信支付</Text>
              </View>
              <View className='pay__body-select'>
                <CheckboxItem
                  checked={checked}
                  onClick={this.changeCheckedStatus}
                />
              </View>
            </View>
          </View>
        </View>
        <View className='pay__footer'>
          <Button
            className={classNames({
              'confirm-button': true,
              'pay-disabled': !checked
            })}
            onClick={this.handleConfirm}
          >
            <Text>确认支付</Text>
          </Button>
        </View>
      </View>
    )
  }
}

export default Pay
