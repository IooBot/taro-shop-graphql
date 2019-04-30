import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import moment from 'moment'
import {getCookie} from "../../utils/cookie"
import './index.scss'
import {getIsWechatBrowser} from "../../utils/func"
import CheckboxItem from "../../components/checkbox"
import ButtonItem from "../../components/button"

let clicktag = 1;  //微信发起支付点击标志
class Pay extends Component {
  config = {
    navigationBarTitleText: '订单支付'
  }

  constructor(props) {
    super(props)
    this.state = {
      checked: true,
      payOrder: {id:'1',orderTotalPay:100}
    }
  }

  message = (title) => {
    Taro.showToast({
      title,
      icon: 'none'
    });
  }

  changeCheckedStatus = (e) => {
    this.setState({
      checked: e.target.checked
    })
  }

  pay = () => {
    this.message( '支付成功')
    Taro.navigateTo({
      url: `/pages/my/index`
    })
  }

  // prepay_id微信生成的预支付会话标识，用于后续接口调用中使用，该值有效期为2小时
  jsApiPay = (args, id) => {
    // console.log('jsApiPay params', args);
    let $this = this
    Taro.requestPayment(args).then((res)=>{
      // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回 ok，但并不保证它绝对可靠。
      if (res.err_msg === "get_brand_wcpay_request:ok") {
        // 成功完成支付
        $this.message('支付成功，等待发货')
        let updatedAt = moment().format('YYYY-MM-DD HH:mm:ss')
        const updateContent = {
          id,
          orderStatus: '1',
          updatedAt
        }
        Taro.navigateTo({
          url: `/pages/my/index`
        })
      }
      else {
        if (res.err_msg === "get_brand_wcpay_request:cancel") {
          $this.message('您的支付已经取消')
        } else if (res.err_msg === "get_brand_wcpay_request:fail") {
          $this.message('支付失败，请稍后重试')
        } else {
          $this.message('支付失败，请稍后重试')
        }
      }
    })
  }

  getBridgeReady = (id, needPay) => {
    // console.log('getBridgeReady params',id,needPay)
    let isWechat = getIsWechatBrowser()
    if (clicktag === 1 && isWechat) {
      clicktag = 0   //进行标志，防止多次点击
      let openid = getCookie('openid')

      let $this = this
      Taro.request({
        url: '/payinfo',
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
          $this.jsApiPay(res.data, id)
          setTimeout(() => {
            clicktag = 1
          }, 5000)
        })
        .catch((error) => {
          $this.message('网络或系统故障，请稍后重试')
          console.log('onBridgeReady error', error)
        })
    } else {
      this.message('当前只支持在微信中打开')
    }
  }

  render() {
    let {checked, payOrder} = this.state
    let {id, orderTotalPay} = payOrder

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
          <ButtonItem
            type='primary'
            text='确认支付'
            onClick={() => {
              if (checked) {
                this.getBridgeReady(id, orderTotalPay)
              }
            }}
          />
        </View>
      </View>
    )
  }
}

export default Pay
