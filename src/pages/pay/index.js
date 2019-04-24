import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import {message} from 'antd'
import {NavBar, Icon, Checkbox, Toast} from 'antd-mobile'
import classNames from 'classnames'
import axios from 'axios'
import {Mutation} from "react-apollo"
import gql from "graphql-tag"
import moment from 'moment'

import {orderbyprops, update_order} from "../../../utils/gql"
import {getCookie} from "../../../utils/cookie"
import './index.css'
import {getIsWechatBrowser} from "../../../utils/func"

let clicktag = 1;  //微信发起支付点击标志
class Pay extends Component {
    constructor(props) {
        super(props)
        this.state = {
            checked: true,
            payOrder: JSON.parse(sessionStorage.getItem('payOrder'))
        }
    }

    changeCheckedStatus = (e) => {
        this.setState({
            checked: e.target.checked
        })
    }

    pay = () => {
        Toast.info('支付成功', 2);
        this.props.history.push({
            pathname: '/my'
        })
    }

    // prepay_id微信生成的预支付会话标识，用于后续接口调用中使用，该值有效期为2小时
    jsApiPay = (args, id, update_order) => {
        // console.log('jsApiPay params', args);
        let $this = this

        function onBridgeReady() {
            window.WeixinJSBridge.invoke(
                'getBrandWCPayRequest', args,
                function (res) {
                    // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回 ok，但并不保证它绝对可靠。
                    if (res.err_msg === "get_brand_wcpay_request:ok") {
                        // 成功完成支付
                        message.success('支付成功，等待发货')
                        let updatedAt = moment().format('YYYY-MM-DD HH:mm:ss')
                        const updateContent = {
                            id,
                            orderStatus: '1',
                            updatedAt
                        }
                        update_order({variables: updateContent})
                        $this.props.history.push({
                            pathname: '/my'
                        })
                    }
                    else {
                        if (res.err_msg === "get_brand_wcpay_request:cancel") {
                            message.warning('您的支付已经取消')
                        } else if (res.err_msg === "get_brand_wcpay_request:fail") {
                            message.error('支付失败，请稍后重试')
                        } else {
                            message.error('支付失败，请稍后重试')
                        }
                    }
                }
            );
        }

        if (typeof window.WeixinJSBridge === "undefined") {
            if (document.addEventListener) {
                document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false)
            } else if (document.attachEvent) {
                document.attachEvent('WeixinJSBridgeReady', onBridgeReady)
                document.attachEvent('onWeixinJSBridgeReady', onBridgeReady)
            }
        } else {
            onBridgeReady()
        }
    }

    getBridgeReady = (update_order, id, needPay) => {
        // console.log('getBridgeReady params',id,needPay)
        let isWechat = getIsWechatBrowser()
        if (clicktag === 1 && isWechat) {
            clicktag = 0   //进行标志，防止多次点击
            let openid = getCookie('openid')

            let $this = this
            axios.get('/payinfo', {
                params: {
                    needPay: parseInt(needPay * 100, 10),
                    openid,
                    tradeNo: id
                }
            })
                .then((res) => {
                    // console.log('onBridgeReady res',res)
                    $this.jsApiPay(res.data, id, update_order)
                    setTimeout(() => {
                        clicktag = 1
                    }, 5000)
                })
                .catch((error) => {
                    message.warning('网络或系统故障，请稍后重试')
                    console.log('onBridgeReady error', error)
                })
        } else {
            message.info('当前只支持在微信中打开')
        }
    }

    render() {
        let {checked, payOrder} = this.state
        let {id, orderTotalPay} = payOrder
        let user_id = getCookie('user_id')
        return (
            <div className='pay-wrap'>
                <div className='pay-navbar-wrap navbar'>
                    <NavBar
                        className='pay-navbar'
                        mode="light"
                        icon={<Icon type="left"/>}
                        onLeftClick={() => {
                            this.props.history.goBack()
                        }}
                    >订单支付</NavBar>
                </div>
                <div className='pay-content-wrap content-wrap'>
                    <div className='pay-content-price'>
                        <p>订单金额:</p>
                        <p>￥: {orderTotalPay}</p>
                    </div>
                    <div className='pay-content-type'>
                        <p>请选择支付方式</p>
                        <div>
                            <img src="https://ece-img-1254337200.cos.ap-chengdu.myqcloud.com/icon/wechat.png" alt=''/>
                            <span>微信支付</span>
                            <span>
                                <Checkbox checked={checked} onChange={(e) => this.changeCheckedStatus(e)}/>
                            </span>
                        </div>
                    </div>
                </div>
                <div className="confirm-footer">
                    <Mutation mutation={gql(update_order)}
                              onError={error => console.log('error', error)}
                              refetchQueries={[
                                  {query: gql(orderbyprops), variables: {user_id, orderStatus: '1'}},
                                  {query: gql(orderbyprops), variables: {user_id, orderStatus: '0'}},
                              ]}
                    >
                        {(update_order, {loading, error}) => (
                            <button
                                className={classNames({
                                    'confirm-button': true,
                                    'pay-disabled': !checked
                                })}
                                onClick={() => {
                                    if (checked) {
                                        // this.pay()
                                        // const updateContent = {
                                        //     id,
                                        //     orderStatus: '1',
                                        //     updatedAt: '123'
                                        // }
                                        // update_order({variables: updateContent})
                                        this.getBridgeReady(update_order, id, orderTotalPay)
                                    }
                                }}>
                                <span>确认支付</span>
                            </button>
                        )}
                    </Mutation>
                </div>
            </div>
        )
    }
}

export default withRouter(Pay)