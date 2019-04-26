import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import {message} from 'antd'
import {NavBar, Icon, List, Picker, ActivityIndicator, InputItem} from 'antd-mobile'
import classNames from 'classnames'
import {Query, Mutation} from "react-apollo"
import gql from "graphql-tag"
import moment from 'moment'

import {user_default_address, create_order, create_order_product, orderbyprops} from "../../../utils/gql"
import {idGen} from "../../../utils/func"
import {getCookie} from "../../../utils/cookie"
import './index.css'
import {findMany} from "../../utils/crud";

const Item = List.Item
const Brief = Item.Brief

const delivery = [
    {
        label: "快递配送",
        value: "快递配送",
    },
    {
        label: "门店自提",
        value: "门店自提",
    }
]

class CartOrders extends Component {
    constructor(props) {
        super(props)
        this.state = {
            cartList: [],
            unfoldList: [],
            totalPrice: JSON.parse(sessionStorage.getItem('totalPrice')),
            totalCount: JSON.parse(sessionStorage.getItem('totalCount')),
            delivery: ["快递配送"],
            height: '100%',
            unfoldStatus: true,
            foldStatus: false,
            selectAddress: JSON.parse(sessionStorage.getItem('ordersAddress')),
            remark:''
        }
    }

    componentWillMount() {
        // console.log('CartOrders componentWillMount',this.props)
        let type = this.props.history.location.state.dataType
        let cartList = JSON.parse(sessionStorage.getItem(type))
        if (cartList.length > 3) {
            let cartList1 = cartList.slice(0, 3)
            let unfoldList = cartList.slice(3)
            this.setState({
                cartList: cartList1,
                unfoldList
            })
        } else {
            this.setState({
                cartList
            })
        }
    }
  componentDidMount() {
    let user_id = getCookie('user_id');
    let userAddressData = findMany({collection:"userAddress",condition:{user_id: user_id,default:1}});//,fields:[]
    userAddressData.then(res =>{
      console.log('userAddressData',res)
      this.setState({
        loaded: true,
        defaultAddress: res
      });
    })
  }
    onChangeDelivery = (val) => {
        this.setState({
            delivery: val,
        })
    }

    onChangeHeight = (height, unfoldStatus, foldStatus) => {
        this.setState({
            height,
            unfoldStatus,
            foldStatus
        })
    }

    onSubmitOrderAndProduct = (user_id,create_order,create_order_product) => {
        let ordersAddress = JSON.parse(sessionStorage.getItem('ordersAddress'))

        if(ordersAddress){
            let {totalCount, totalPrice, remark, delivery} = this.state
            let createdAt = moment().format('YYYY-MM-DD HH:mm:ss')
            let {id:userAddress_id, telephone, username, province, city, area, address} = ordersAddress
            let addressData = String(province + city + area + address)
            let tag = telephone ? telephone.replace(/[^0-9]/ig, "").slice(-4) : Math.random().toString(10).substr(2,4)
            const orderId = createdAt.replace(/[^0-9]/ig, "").substr(2) + tag
            let orderLogisticsId = idGen('deliver')

            const orderContent = {
                remark,
                updatedAt: "",
                orderLogistics_id: orderLogisticsId,
                orderTotalPay: totalPrice,
                createdAt,
                orderStatus: "0",
                userAddress_id,
                id:orderId,
                count: totalCount,
                user_id,
                productTotalPay: totalPrice,
                orderPay_id: "",
                deleteId:[]
            }

            const orderLogistics = {
                updatedAt: "",
                deliveryTime: "",
                serviceStore: "",
                expressName:delivery[0],
                logisticsFee: 0.0,
                expressId: "",
                createdAt,
                order_id: orderId,
                consigneeTel: telephone,
                orderLogisticsId,
                consignAddress: addressData,
                LogisticsStatus: "0",
                user_id,
                consigneeName: username
            }

            let type = this.props.history.location.state.dataType
            let shopping = JSON.parse(sessionStorage.getItem(type))
            if(type === 'cartSelected') orderContent.deleteId = shopping.map(item => item.id)

            // console.log('createOrder orderContent',orderContent)

            let createOrder = create_order({variables:{...orderContent, ...orderLogistics}})

            let createOrderProduct = shopping.map((item,index) => {
                let createdAt = moment().format('YYYY-MM-DD HH:mm:ss')
                let orderProductId =  createdAt.replace(/[^0-9]/ig, "").substr(2) + tag +index
                let {count, product_id:productData, specificationStock_id:specData} = item
                let {id:product_id, img, name, price, unit} = productData
                let {id:specId, color, size} = specData
                // console.log('product',index,item,product_id)

                const orderProduct = {
                    updatedAt: "",
                    productColor: color,
                    unit,
                    product_id,
                    specificationStock_id:specId,
                    productSize:size,
                    orderPay: price,
                    createdAt,
                    productImg:img,
                    productName: name,
                    order_id: orderId,
                    productPrice:price,
                    id:orderProductId,
                    user_id,
                    count,
                    productPay: price,
                    orderPay_id: "",
                }
                // console.log(`orderProduct${index}`,orderProduct)

                return create_order_product({variables:orderProduct}).then((data)=>{
                    // console.log('ok data',index,data)
                    return data.data
                })
            })

            Promise.all([createOrder, createOrderProduct]).then((data)=> {
                // console.log('onSubmitOrderAndProduct data',data)
                sessionStorage.setItem('payOrder',JSON.stringify(orderContent))
                if(type === 'cartSelected'){
                    let cartCount = JSON.parse(localStorage.getItem("cartCount")) - totalCount
                    localStorage.setItem("cartCount",JSON.stringify(cartCount))
                    localStorage.removeItem("cartList")
                }

                this.props.history.push({
                    pathname:'/cart/pay',
                    state:{}
                })
            }).catch((err)=>{
                console.log('submit error',err)
            })
        }else {
            message.warning('请添加收货地址')
        }

    }

    render() {
        let {cartList, unfoldList, height, unfoldStatus, foldStatus, totalPrice, selectAddress} = this.state
        let user_id = getCookie('user_id')

        return (
            <div className='orders-wrap'>
                <div className='orders-navbar-wrap navbar'>
                    <NavBar
                        className='orders-navbar'
                        mode="light"
                        icon={<Icon type="left"/>}
                        onLeftClick={() => {
                            // this.props.history.goBack()
                            this.props.history.push({
                                pathname:'/cart',
                                state:{
                                    updateData:true,
                                    tabHidden:false
                                }
                            })
                        }}
                    >订单确认</NavBar>
                </div>
                <div className='orders-content-wrap content-wrap'>
                    <div className='orders-address'>
                        {
                            selectAddress ?
                                <OrdersAddress props={this.props} selectAddress={selectAddress} />:
                                <Query query={gql(user_default_address)} variables={{user_id, default:1}}>
                                    {
                                        ({loading, error, data}) => {
                                            if (loading) {
                                                return (
                                                    <div className="loading-center">
                                                        <ActivityIndicator size="large"/>
                                                        <span>加载中...</span>
                                                    </div>
                                                )
                                            }
                                            if (error) {
                                                return 'error!'
                                            }
                                            let defaultAddress = data.defaultAddress[0]

                                            if(defaultAddress){
                                                return (
                                                    <OrdersAddress props={this.props} selectAddress={defaultAddress} />
                                                )
                                            }else {
                                                return (
                                                    <div className='orders-address-add'
                                                         onClick={() => {
                                                             this.props.history.push({
                                                                 pathname:'/my/tools',
                                                                 state: {
                                                                     page: 'address',
                                                                     prePage: 'orders',
                                                                     single: true
                                                                 }})
                                                         }}
                                                    >+ 添加收货地址</div>
                                                )
                                            }
                                        }
                                    }
                                </Query>
                        }
                    </div>
                    <div className='orders-detail'>
                        <div className='cart-content'>
                            {
                                cartList.map((item, index) => {
                                    return (
                                        <div key={'cart-orders-'+item.id}>
                                            <div className="cart-list">
                                                <div className="cart-list-image">
                                                    <img src={item.product_id.img || "https://gw.alipayobjects.com/zos/rmsportal/nywPmnTAvTmLusPxHPSu.png"} alt=""/>
                                                </div>
                                                <div className="cart-orders-intro">
                                                    <div className='hide-extra-text'>{item.product_id.name}</div>
                                                    <div>{item.specificationStock_id.color}  {item.specificationStock_id.size}</div>
                                                    <div>¥ {item.product_id.price}</div>
                                                </div>
                                                <div className="cart-orders-count">
                                                    x {item.count}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                            <div className={classNames({'packup': !unfoldList.length, 'packup-unfold': true})}
                                 style={{height: height}}>
                                {
                                    unfoldStatus ?
                                        <div onClick={() => {
                                            this.onChangeHeight(96 * unfoldList.length + 42, false, true)
                                        }}>
                                            <div className='packup-title'>展开全部商品</div>
                                            <div>∨</div>
                                        </div>
                                        : ''
                                }
                                {
                                    foldStatus ?
                                        <div onClick={() => {
                                            this.onChangeHeight('100%', true, false)
                                        }}>
                                            {
                                                unfoldList.map((item, index) => {
                                                    return (
                                                        <div key={index}>
                                                            <div className="cart-list">
                                                                <div className="cart-list-image">
                                                                    <img src={item.product_id.img} alt=""/>
                                                                </div>
                                                                <div className="cart-orders-intro">
                                                                    <div className='hide-extra-text'>{item.product_id.name}</div>
                                                                    <div>{item.specificationStock_id.color}  {item.specificationStock_id.size}</div>
                                                                    <div>¥ {item.product_id.price}</div>
                                                                </div>
                                                                <div className="cart-orders-count">
                                                                    x {item.count}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }
                                            <div className='packup-title'>收起</div>
                                            <div>∧</div>
                                        </div> : ''
                                }

                            </div>
                        </div>
                    </div>
                    <div className='orders-delivery'>
                        <div>
                            <Picker
                                data={delivery}
                                value={this.state.delivery}
                                cols={1}
                                onChange={this.onChangeDelivery}
                            >
                                <List.Item arrow="horizontal">配送方式</List.Item>
                            </Picker>
                        </div>
                        <div className="orders-message">
                            <InputItem
                                labelNumber={4}
                                placeholder="输入留言内容(50字以内)"
                                maxLength={50}
                                onBlur={(val) => {
                                    // console.log('orders-remark val',val)
                                    this.setState({
                                        remark:val
                                    })
                                }}
                            >
                                <div className='orders-message-title'>买家留言</div>
                            </InputItem>
                        </div>
                    </div>
                    <div className='orders-price'>
                        <div>商品金额
                            <span>¥ {totalPrice}</span>
                        </div>
                        <div>运费
                            <span>¥ 0.00</span>
                        </div>
                    </div>
                </div>
                <Mutation mutation={gql(create_order)}
                          onError={error=>console.log('create_order error',error)}
                >
                    {(create_order,{ loading, error }) => (
                        <div className="orders-footer">
                            <div className="jiesuan">
                                <div className='jiesuan-total'>
                                    <span>合计：</span>
                                    <span className="jiesuan-total_price">¥ {totalPrice}</span>
                                </div>
                                <Mutation
                                    mutation={gql(create_order_product)}
                                    onError={error=>console.log('create_order_product error',error)}
                                    refetchQueries={[{query: gql(orderbyprops), variables: {user_id, orderStatus:'0'}}]}
                                >
                                    {(create_order_product,{ loading, error }) => (
                                        <button className="jiesuan-button"
                                                onClick={()=>{
                                                    this.onSubmitOrderAndProduct(user_id,create_order,create_order_product)
                                                }}>
                                            <span>提交订单</span>
                                        </button>
                                    )}
                                </Mutation>
                            </div>
                        </div>
                    )}
                </Mutation>
            </div>
        )
    }
}

export default withRouter(CartOrders)

const OrdersAddress =({props,selectAddress}) => {
    let {default:isDefault, username, telephone, province, area, city, address} = selectAddress
    sessionStorage.setItem('ordersAddress',JSON.stringify(selectAddress))

    return (
        <List>
            <Item
                arrow="horizontal"
                multipleLine
                onClick={() => {
                    props.history.push({
                        pathname:'/my/tools',
                        state: {
                            page: 'address',
                            prePage: 'orders'
                        }})
                }}>
                <div>
                    <span>{username}</span>&nbsp;&nbsp;
                    <span>{telephone}</span>
                </div>
                <div>
                    <div>
                        {
                            isDefault ?
                                <div className="orders-address-label">
                                    <span className='address-label'>默认</span>
                                </div>:''
                        }
                        <Brief style={{fontSize: 13}}>{province}{area}{city}{address}</Brief>
                    </div>
                </div>
            </Item>
        </List>
    )
}
