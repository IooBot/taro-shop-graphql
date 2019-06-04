import {Component} from "react"
import React from "react"
import {Row, Col, Icon} from 'antd'
import {NavBar} from 'antd-mobile'
import {Query} from "react-apollo"
import gql from "graphql-tag"

import {orderProduct_by_props} from "../../../../utils/gql"
import {ButtonGroupRender} from '..'
import './index.css'

class Detail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: {}
        }
    }

    componentWillMount() {
        let {location} = this.props
        if (location && location.state) {
            this.setState({
                data: location.state.data
            })
        }
    }

    statusRender = (status) => {
        switch (status) {
            case '0':
                return (
                    <div className='detail-status'>
                        <Icon type="clock-circle"/>&nbsp;
                        <span>等待付款</span>
                    </div>
                )
            case '1':
                return (
                    <div className='detail-status'>
                        <Icon type="shop"/>&nbsp;
                        <span>等待发货</span>
                    </div>
                )
            case '2':
                return (
                    <div className='detail-status'>
                        <Icon type="gift"/>&nbsp;
                        <span>等待收货</span>
                    </div>
                )
            case '3':
                return (
                    <div className='detail-status'>
                        <Icon type="like"/>&nbsp;
                        <span>完成</span>
                    </div>
                )
            default:
                return (
                    <div className='detail-status'>
                        <Icon type="clock-circle"/>&nbsp;
                        <span>等待确认</span>
                    </div>
                )
        }
    }

    productsRender = (data) => {
        return (
            data.map(data => (
                <div key={'orders-detail-'+data.id}>
                    <div className="cart-list">
                        <div className="cart-list-image">
                            <img src={data.product.img} alt=""/>
                        </div>
                        <div className="cart-orders-intro">
                            <div className='hide-extra-text'>{data.product.name}</div>
                            <div>{data.productColor}  {data.productSize}</div>
                            <div>¥ {data.product.price}</div>
                        </div>
                        <div className="cart-orders-count">
                            x {data.count}
                        </div>
                    </div>
                </div>
            ))
        )
    }

    render() {
        let {data} = this.state
        let {username, telephone, province, city, area, address} = data.userAddress_id
        return (
            <div>
                <div className='detail-wrap'>
                    <div className='navbar'>
                        <NavBar
                            mode="light"
                            icon={<Icon type="left"/>}
                            onLeftClick={() => {
                                this.props.history.go(-1)
                            }}
                        >订单详情</NavBar>
                    </div>
                    {/*内容*/}
                    <div className='content-wrap'>
                        <div className='detail-address-wrap'>
                            <div className='detail-address-backgroud-top'>
                                {this.statusRender(data.orderStatus)}
                                <div className='detail-pay'>
                                    ￥{data.productTotalPay}
                                </div>
                            </div>
                            <div className='detail-address-backgroud-bottom'/>
                            <div className='detail-address-content'>
                                <Row>
                                    <Col span={4} className='detail-address-content-icon'>
                                        <Icon type="pushpin"/>
                                    </Col>
                                    <Col span={20}>
                                        <div className='detail-address-content-username-phone'>
                                            {username}&nbsp;&nbsp;{telephone}
                                        </div>
                                        <div>
                                            地址：{province + city + area + address}
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                        <div className='detail-goods-wrap'>
                            <div className='detail-store-name'>订单号: {data.id}</div>
                            <Query query={gql(orderProduct_by_props)} variables={{order_id: data.id}}>
                                {
                                    ({loading, error, data}) => {
                                        if (error) {
                                            return 'error!'
                                        }
                                        data = data.orderProductbyprops
                                        return (
                                            <div>{this.productsRender(data)}</div>
                                        )
                                    }
                                }
                            </Query>
                            <div className='detail-contact'>联系客服</div>
                        </div>
                        <div className='detail-order-wrap'>
                            <Order data={data}/>
                        </div>
                    </div>
                    <div className='detail-footer-wrap'>
                        <ButtonGroupRender orderStatus={data.orderStatus}/>
                    </div>
                </div>
            </div>
        )
    }
}

export default Detail

class Order extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    render() {
        let {data} = this.props
        return (
            <div className='detail-order-wrapper'>
                <div className='detail-order-item'>
                    <span className='detail-order-title'>订单编号：</span>
                    <span>{data.id}</span>
                </div>
                <div className='detail-order-item'>
                    <span className='detail-order-title'>下单时间：</span>
                    <span>{data.createdAt}</span>
                </div>
            </div>
        )
    }
}
