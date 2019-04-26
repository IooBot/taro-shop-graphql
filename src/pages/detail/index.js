import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import {Query, Mutation} from "react-apollo"
import gql from "graphql-tag"
import {message} from 'antd'
import {NavBar, Icon, ActivityIndicator, Badge, Modal} from 'antd-mobile'
import classNames from 'classnames'
import moment from 'moment'

import {productAndSpec_by_id, create_userCart, cart_by_userid} from "../../../utils/gql"
import {idGen} from '../../utils/func'
import {getCookie} from "../../utils/cookie"
import './index.scss'

class Detail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            id: ''
        }
    }

    componentWillMount() {
        let {location} = this.props
        if(location && location.state) {
            this.setState({
                id: location.state.id
            })
        }
    }

    render() {
        let {id} = this.state

        return (
            <div className='detail-wrap' >
                <div className='detail-navbar-wrap navbar'>
                    <NavBar
                        mode="light"
                        icon={<Icon type="left"/>}
                        onLeftClick={() => {this.props.history.go(-1)}}
                    >商品详情
                    </NavBar>
                </div>

                <Query query={gql(productAndSpec_by_id)} variables={{id}}>
                    {
                        ({loading, error, data}) => {
                            if (loading) {
                                return (
                                    <div className="loading-center">
                                        <ActivityIndicator text="Loading..." size="large"/>
                                    </div>
                                )
                            }
                            if (error) {
                                return 'error!'
                            }
                            // console.log('productAndSpec_by_id data',data)
                            return (
                                <DetailRender data={data} history={this.props.history}/>
                            )
                        }
                    }
                </Query>
            </div>
        )
    }
}

export default withRouter(Detail)

class DetailRender extends Component {
    constructor(props) {
        super(props)
        this.state = {
            cartCount: JSON.parse(localStorage.getItem('cartCount')),
            openSelect: false,
            buttonType: 'add'
        }
    }

    showModal = (e,key) => {
        e.preventDefault(); // 修复 Android 上点击穿透
        this.setState({
            [key]: true,
        })
    }

    changeDetailState = (state,val) => {
        this.setState({
            [state]:val
        })
    }

    changeBottomButtonType = (e,val) => {
        this.setState({
            buttonType:val
        })
        this.showModal(e,'openSelect')
    }

    render() {
        let {data} = this.props
        let {name, intro, img, price, stock, discountRate} = data.productbyid
        let {cartCount, openSelect, buttonType} = this.state
        // console.log('DetailRender openSelect',openSelect)

        return (
            <div className='detail-wrapper content-wrap'>
                <div className='detail-simple-show'>
                    {/*<div className='detail-img' style={{backgroundImage: "url('"+ img + "')"}}/>*/}
                    <img className='detail-img' src={img} alt="商品图片"/>
                    <div className='detail-intro-content'>
                        <div className='detail-name detail-padding'>{name}</div>
                        <div className='detail-intro detail-padding'>{intro}</div>
                        <div className='detail-price detail-padding'>
                            <span>￥{(price*discountRate/100).toFixed(2)}</span>&nbsp;&nbsp;
                            <span>￥{price.toFixed(2)}</span>
                            <span className='detail-stock'>库存 {stock}</span>
                        </div>
                    </div>
                </div>
                <div className='detail-complicate-show'>
                    <div className='detail-padding detail-complicate-title'>商品信息</div>
                    <div className='detail-complicate-show-img'>
                        {/*通过商品详情图片展示*/}
                        <img className='detail-img' src={img} alt="商品图片"/>
                    </div>
                </div>
                <div className='detail-footer'>
                    <div className='detail-bottom'>
                        <span className='detail-bottom-icon border-right' onClick={()=>{this.props.history.push({pathname: '/home'})}}>
                            <div className='detail-icon detail-icon-shop'/>
                        </span>
                        <span className='detail-bottom-icon'
                              onClick={()=>{
                                  this.props.history.push({
                                      pathname: '/cart',
                                      state:{
                                          updateData:true,
                                          tabHidden:false
                                      }
                                  })
                              }}
                        >
                            <div className='detail-icon detail-icon-cart'/>
                            <Badge text={cartCount} overflowCount={90} hot>
                                 <span style={{display: 'inline-block' }} />
                            </Badge>
                        </span>
                        <span className='detail-bottom-button add' onClick={(e)=>{this.changeBottomButtonType(e,'add')}}>加入购物袋</span>
                        <span className='detail-bottom-button buy' onClick={(e)=>{this.changeBottomButtonType(e,'buy')}}>立即购买</span>
                        <SelectModal
                            changeDetailState={this.changeDetailState}
                            openSelect={openSelect}
                            buttonType={buttonType}
                            productData={data}
                            price={price}
                            img={img}
                            history={this.props.history}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

class SelectModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            count: 1,
            selectColor: '',
            selectSpec:{},
            specList: [],
            colorList: []
        }
    }

    componentWillMount() {
        let {productData} = this.props
        this.handleData(productData.spec)
    }

    // 规格表处理
    handleData = (specs) => {
        let flag = true, selectFlag = true
        let specObject = {}, i = 0, specList = []
        let colorObject = {}, j = 0, colorList = [], selectColor = ''
        specs.forEach((item) => {
            let {id,color,size,stock,status} = item
            if(flag && status > 0) {
                selectColor = color
                flag = false
            }
            specObject[color] ? specList[specObject[color] - 1].spec.push({id, size, stock, status}) : specObject[color] = ++i && specList.push({
                color,
                spec: [{id, size, stock, status}],
            })
            if(!colorObject[color]) {
                colorObject[color] = ++j
                colorList.push({
                    id,
                    color
                })
            }
        })

        specList.forEach((items)=>{
            let {spec} = items
            spec.forEach((item)=>{
                item.select = false
                if(selectFlag && item.status > 0) {
                    item.select = true
                    selectFlag = false
                }
            })
            selectFlag = true
        })

        this.setState({
            selectColor,
            specList,
            colorList
        })
        // console.log('specList',specList)
        // console.log('colorList',colorList)
    }

    changeState = (state,val) => {
        this.setState({
            [state]:val
        })
    }

    //获取输入框的值
    getInputValue=(e)=>{
        this.setState({
            count:e.target.value
        })
    }

    // 增加
    augment=()=>{
        this.setState({
            count:this.state.count*1+1
        })
    }

    // 减少
    reduce=()=> {
        this.setState({
            count:this.state.count*1-1
        })
    }

    // 添加至购物袋
    onCreateUserCart = (create_userCart, user_id) => {
        let id = idGen('cart')
        let {productData} = this.props
        let product_id = productData.productbyid.id
        let {count, selectColor, specList} = this.state
        let specFilter = specList.filter(item=>item.color === selectColor)[0].spec.filter(item=> item.select && item.status > 0)[0]
        let specificationStock_id =  specFilter.id
        let createdAt = moment().format('YYYY-MM-DD HH:mm:ss')

        const cartContent = {
            id,
            user_id,
            product_id,
            specificationStock_id,
            count,
            createdAt,
            updatedAt: ""
        }
        // console.log('cartContent',cartContent)

        this.props.changeDetailState('openSelect',false)
        create_userCart({variables:cartContent}).then((data)=>{
            // console.log('create_userCart data',data)
            let cartCount = JSON.parse(localStorage.getItem("cartCount")) + count
            this.props.changeDetailState('cartCount',cartCount)
            message.success('成功添加至购物车')
            localStorage.setItem("cartCount",JSON.stringify(cartCount))
        })
    }

    // 立即购买
    buyNow = () => {
        let {count, selectColor, specList} = this.state
        let createdAt = moment().format('YYYY-MM-DD HH:mm:ss')
        let id = idGen('cart')
        let {productData} = this.props
        let {id:product_id, img, intro, name, price, status, stock, unit} = productData.productbyid
        let specFilter = specList.filter(item=>item.color === selectColor)[0].spec.filter(item=> item.select && item.status > 0)[0]
        let {id:specificationStock_id, size, stock:specStock, status:specStatus} =  specFilter
        let totalPrice = price * count

        let buyNowContent = [{
            count,
            createdAt,
            id,
            product_id:{
                id:product_id,
                img,
                intro,
                name,
                price,
                status,
                stock,
                unit
            },
            specificationStock_id:{
                id:specificationStock_id,
                color:selectColor,
                size,
                stock:specStock,
                status:specStatus
            }
        }]
        // console.log('buyNowContent',buyNowContent)
        sessionStorage.setItem("buyNowContent",JSON.stringify(buyNowContent))
        sessionStorage.setItem("totalPrice",JSON.stringify(totalPrice))
        sessionStorage.setItem("totalCount",JSON.stringify(this.state.count))
        this.props.changeDetailState('openSelect')
        this.props.history.push({
            pathname: '/cart/orders',
            state:{
                dataType: 'buyNowContent'
            }
        })
    }

    render() {
        let user_id = getCookie('user_id')
        let {price, img, buttonType} = this.props
        let {count, selectColor, specList, colorList} = this.state
        let specFilter = specList.filter(item=>item.color === selectColor)[0].spec.filter(item=> item.select && item.status > 0)[0]
        let specStock =  specFilter.stock || 0
        let selectSize =  specFilter.size

        return(
            <Modal
                popup
                visible={this.props.openSelect}
                onClose={()=>this.props.changeDetailState('openSelect',false)}
                animationType="slide-up"
                // afterClose={() => { console.log('close model')}}
            >
                <div className="popup-box" >
                    <div className="main-goods-box">
                        <div className="close-popup" onClick={()=>this.props.changeDetailState('openSelect',false)}>
                            ×
                        </div>
                        <div className="goods-box">
                            <div className="goods-info">
                                <div className="left">
                                    <img src={img || "https://gw.alipayobjects.com/zos/rmsportal/nywPmnTAvTmLusPxHPSu.png"} alt="商品图片"/>
                                </div>
                                <div className="mid">
                                    <div className="goods_price"> ￥ {price}</div>
                                    <div className="selected-type">已选择： {selectColor} / {selectSize}</div>
                                </div>
                                <div className="right">库存
                                    {specStock}
                                </div>
                            </div>
                            <div className="scroll-body">
                                <div className="goods_type">
                                    <ul>
                                        <li>
                                            <div className="type-title">颜色</div>
                                            <dl>
                                                {
                                                    colorList.map((spec)=>(
                                                        <dd
                                                            className={classNames({
                                                                'spec-red': spec.color === selectColor
                                                            })}
                                                            key={'color'+spec.id}
                                                            onClick={()=>{
                                                                this.changeState('selectColor',spec.color)
                                                            }}
                                                        >
                                                            {spec.color}
                                                        </dd>
                                                    ))
                                                }
                                            </dl>
                                        </li>
                                        <Specification specList={specList.filter(item=>item.color === selectColor)[0]} changeState={this.changeState}/>
                                    </ul>
                                </div>
                                <div className="edit-product">
                                    <div className="edit-product-text">购买数量</div>
                                    <div className="edit-product-count">
                                        <button
                                            className={classNames({
                                                'selected_button-red': true,
                                                'selected_button-disabled': count <= 1
                                            })}
                                            // disabled={count <= 1}
                                            onClick={()=>{
                                                if(count > 1){
                                                    this.reduce()
                                                }else {
                                                    message.warning('数量不能小于1个')
                                                }
                                            }}
                                        >-</button>
                                        <input className="selected_input" type="text" value={count} onChange={(e)=>{this.getInputValue(e)}}/>
                                        <button className="selected_button-red" onClick={this.augment}>+</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Mutation mutation={gql(create_userCart)}
                              refetchQueries={[
                                  {query: gql(cart_by_userid), variables:{user_id}}
                              ]}
                              onError={error=>console.log('error',error)}
                    >
                        {(create_userCart,{ loading, error }) => (
                            <div className='confirm-footer'>
                                <button
                                    className='confirm-button'
                                    onClick={()=>{
                                        if(buttonType === 'add'){
                                            this.onCreateUserCart(create_userCart, user_id)
                                        }else if(buttonType === 'buy'){
                                            this.buyNow()
                                        }
                                    }}
                                >
                                    <span>确认</span>
                                </button>
                            </div>
                        )}
                    </Mutation>
                </div>
            </Modal>
        )
    }
}


class Specification extends Component {
    constructor(props) {
        super(props)
        this.state = {
            spec:this.props.specList.spec
        }
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({
            spec:nextProps.specList.spec,
        })
    }

    // 改变选择
    changeSelectedStatus=(i)=>{
        this.setState((prevState, props) => ({
            spec: prevState.spec.map((item,index)=>{
                if(index===i){
                    item.select=true
                    // console.log('select item',item)
                    this.props.changeState('selectSpec',item)
                }else {
                    item.select=false
                }
                return item
            })
        }))
    }

    render() {
        let {spec} = this.state
        // console.log('spec',spec)

        return (
            <li>
                <div className="type-title">规格</div>
                <dl>
                    {
                        spec.map((item,index)=>(
                            <dd
                                className={classNames({
                                    'spec-gray': item.status < 1,
                                    'spec-red': item.status > 0 && item.select
                                })}
                                key={'spec'+item.id}
                                onClick={()=>{
                                    if(item.status > 0)  this.changeSelectedStatus(index)
                                }}
                            >
                                {item.size}
                            </dd>
                        ))
                    }
                </dl>
            </li>
        )
    }
}