import Taro, { Component } from '@tarojs/taro';
import {Grid, ActivityIndicator} from 'antd-mobile'
import {withRouter} from 'react-router-dom'
import './index.css'
import Logo from '../../../components/logo'
import {getCookie} from "../../../utils/cookie"
import { findOne} from "../../utils/crud"
//import {user_by_id} from "../../../utils/gql"
//import {Query} from "react-apollo"
//import gql from "graphql-tag"

const orderIcon = [
    {
        icon: 'https://ece-img-1254337200.cos.ap-chengdu.myqcloud.com/icon/pay.png',
        text: '待付款',
        id: 'pay'
    },
    {
        icon: 'https://ece-img-1254337200.cos.ap-chengdu.myqcloud.com/icon/ship.png',
        text: '待发货',
        id: 'ship'
    },
    {
        icon: 'https://ece-img-1254337200.cos.ap-chengdu.myqcloud.com/icon/unbox.png',
        text: '待收货',
        id: 'unbox'
    },
    {
        icon: 'https://ece-img-1254337200.cos.ap-chengdu.myqcloud.com/icon/judge.png',
        text: '待评价',
        id: 'judge'
    }
]

const toolsIcon = [
    {
        icon: 'https://ece-img-1254337200.cos.ap-chengdu.myqcloud.com/icon/address.png',
        text: '收货地址',
        id: 'address'
    },
    {
        icon: 'https://ece-img-1254337200.cos.ap-chengdu.myqcloud.com/icon/cart.png',
        text: '购物袋',
        id: 'cart'
    },
    {
        icon: 'https://ece-img-1254337200.cos.ap-chengdu.myqcloud.com/icon/message.png',
        text: '系统通知',
        id: 'message'
    }
]

const memberIcon = [
    {
        icon: 'https://ece-img-1254337200.cos.ap-chengdu.myqcloud.com/icon/card.png',
        text: '会员卡',
        id: 'card'
    },
    {
        icon: 'https://ece-img-1254337200.cos.ap-chengdu.myqcloud.com/icon/coupon.png',
        text: '优惠券',
        id: 'coupon'
    },
    {
        icon: 'https://ece-img-1254337200.cos.ap-chengdu.myqcloud.com/icon/credit.png',
        text: '积分',
        id: 'credit'
    }
]

const shopIcon = [
    {
        icon: 'https://ece-img-1254337200.cos.ap-chengdu.myqcloud.com/icon/shop.png',
        text: '店铺展示',
        id: 'shop'
    },
    {
        icon: 'https://ece-img-1254337200.cos.ap-chengdu.myqcloud.com/icon/goods.png',
        text: '商品管理',
        id: 'goods'
    },
    {
        icon: 'https://ece-img-1254337200.cos.ap-chengdu.myqcloud.com/icon/order.png',
        text: '订单管理',
        id: 'orders'
    }
];

class All extends Component {
    constructor(props) {
        super(props)
        this.state = {
          loaded: false,
          user_data:{}
        }
    }
  componentDidMount() {
    let user_id = getCookie('user_id')
    console.log(user_id)
    this.userInfo(user_id);
  }
  userInfo = (user_id) => {
    let userData = findOne({collection:"user",condition:{id: user_id}});//,fields:[]
    userData.then(res =>{
      console.log('user data',res)
      this.setState({
        loaded:true,
        user_data: res
      });
    })
   };
    render() {
      if (!this.state.loaded) {
        return (
          <div className="loading-center">
            <ActivityIndicator text="Loading..." size="large"/>
          </div>
        )
      }
      let user_data = this.state.user_data;
      let data = user_data.userbyid;
        return (
            <div className='my-wrap all'>
              <div className='avatar-area' onClick={()=>{
                    this.props.history.push({
                      pathname: `/my/profile`,
                      state: {}
                    })
                  }}>
                <div className='avatar'/>
                <div className='nickname'>{user_data.username}</div>
              </div>

                <div className='my-card order-card'>
                    <div className='card-title'>
                        电商订单
                    </div>
                    <div className='card-icons'>
                        <Grid data={orderIcon}
                              columnNum={4}
                              hasLine={false}
                              onClick={(order) => {
                                  this.props.history.push({
                                      pathname: '/my/order',
                                      state: {
                                          kind: order.id
                                      }
                                  })
                              }}
                        />
                    </div>
                </div>

                <div className='my-card tools-card'>
                    <div className='card-title'>
                        我的工具
                    </div>
                    <div className='card-icons'>
                        <Grid data={toolsIcon}
                              columnNum={4}
                              hasLine={false}
                              onClick={(tools) => {
                                  if (tools.id === 'cart') {
                                      this.props.history.push({
                                          pathname: '/cart'
                                      })
                                  } else {
                                      this.props.history.push({
                                          pathname: '/my/tools',
                                          state: {
                                              page: tools.id
                                          }
                                      })
                                  }
                              }}
                        />
                    </div>
                </div>

                <div className='my-card member-card' style={{display: 'none'}}>
                    <div className='card-title'>
                        会员中心
                    </div>
                    <div className='card-icons'>
                        <Grid data={memberIcon}
                              columnNum={4}
                              hasLine={false}
                              onClick={(member) => {
                                  this.props.history.push({
                                      pathname: '/my/member',
                                      state: {
                                          page: member.id
                                      }
                                  })
                              }}
                        />
                    </div>
                </div>

                <div className='my-card member-card'>
                    <div className='card-title'>
                        商家入口
                    </div>
                    <div className='card-icons'>
                        <Grid data={shopIcon}
                              columnNum={4}
                              hasLine={false}
                              onClick={(shop) => {
                                  this.props.history.push({
                                      pathname: '/my/manage',
                                      state: {
                                          page: shop.id
                                      }
                                  })
                              }}
                        />
                    </div>
                </div>
                <Logo/>
            </div>
        )
    }
}

export default withRouter(All)
