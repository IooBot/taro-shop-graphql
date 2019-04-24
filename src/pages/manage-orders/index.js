import React, {Component} from 'react'
import './index.css'
import {withRouter} from 'react-router-dom'
import {
    SearchBar,
    NavBar,
    Accordion,
    ActivityIndicator,
    List
} from 'antd-mobile'
import {Icon} from 'antd'
import classNames from 'classnames'
import {Query} from "react-apollo"
import gql from "graphql-tag"
import {order_by_id, orderbyprops} from "../../../../utils/gql"
import {DisplayRender} from "../../../order/display"

const Item = List.Item;

class Orders extends Component {
    constructor(props) {
        super(props)
        this.state = {
            accordionKey: undefined
        }
    }

    render() {
        let {accordionKey} = this.state
        return (
            <div className='goods-wrap'>
                <NavBar
                    className='navbar'
                    mode="light"
                    icon={<Icon type="left"/>}
                    onLeftClick={() => {
                        this.props.history.go(-2)
                    }}
                >订单管理</NavBar>
                <div className='content-wrap'>
                    <div className='my-list-subtitle' style={{color: 'grey'}}><Icon type="bulb"
                                                                                    style={{marginRight: 10}}/>{accordionKey ? '折叠单项以展开更多分类' : '请选择需要打开的分类'}
                    </div>
                    <Accordion className="my-accordion" onChange={(key) => {
                        this.setState({
                            accordionKey: key[0]
                        })
                    }}>
                        <Accordion.Panel header="查询订单"
                                         className={classNames({'hidden': accordionKey !== undefined && accordionKey !== '0'})}>
                            <Search/>
                        </Accordion.Panel>
                        <Accordion.Panel header="待发货"
                                         className={classNames({'hidden': accordionKey !== undefined && accordionKey !== '1'})}>
                            <Shiping/>
                        </Accordion.Panel>
                        <Accordion.Panel header="待收货"
                                         className={classNames({'hidden': accordionKey !== undefined && accordionKey !== '2'})}>
                            <Unbox/>
                        </Accordion.Panel>
                        <Accordion.Panel header="待评价"
                                         className={classNames({'hidden': accordionKey !== undefined && accordionKey !== '3'})}>
                            <Completed/>
                        </Accordion.Panel>
                        <Accordion.Panel header="已完成"
                                         className={classNames({'hidden': accordionKey !== undefined && accordionKey !== '4'})}>
                            <Commented/>
                        </Accordion.Panel>
                    </Accordion>
                </div>
            </div>
        )
    }
}

class Search extends Component {
    constructor(props) {
        super(props)
        this.state = {
            value: '',
            searchValue: ''
        }
    }

    componentDidMount() {
        this.autoFocusInst.focus();
    }

    onChange = (value) => {
        this.setState({value});
    };

    render() {
        return (
            <div>
                <SearchBar
                    ref={ref => this.autoFocusInst = ref}
                    placeholder="请在此处输入订单编号"
                    value={this.state.value}
                    onSubmit={searchValue => this.setState({searchValue})}
                    onCancel={() => this.setState({value: ''})}
                    onChange={value => this.setState({value})}
                />
                <SearchQuery id={this.state.searchValue}/>
            </div>
        )
    }
}

class SearchQuery extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    shouldComponentUpdate(nextProps) {
        return nextProps.id !== this.props.id;
    }

    statusRender = (status) => {
        switch (status) {
            case '0':
                return '等待付款'
            case '1':
                return '等待发货'
            case '2':
                return '等待收货'
            case '3':
                return '等待评价'
            case '4':
                return '完成'
            default:
                return '等待确认'
        }
    }

    render() {
        let {id} = this.props
        return (
            <Query query={gql(order_by_id)} variables={{id}} className='search-query'>
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
                        data = data.orderbyid
                        if (data === null) {
                            return (
                                <div className='order-tip-wrap'>
                                    <div className='order-tip'>请输入正确的订单号</div>
                                </div>
                            )
                        } else {
                            let {id, orderStatus, orderTotalPay, productTotalPay, count, remark, user_id, userAddress_id, createdAt, orderLogistics_id, orderPay_id} = data
                            let {telephone: telephoneUser, username: usernameUser, email} = user_id
                            let {province, city, area, address, telephone, username} = userAddress_id
                            let logisticsFee, LogisticsStatus, expressCreatedAt
                            if (orderLogistics_id !== null) {
                                logisticsFee = orderLogistics_id.logisticsFee
                                LogisticsStatus = orderLogistics_id.LogisticsStatus
                                expressCreatedAt = orderLogistics_id.createdAt
                            }
                            if (orderPay_id !== null) {

                            }

                            const all = {
                                '订单编号': id,
                                '状态': this.statusRender(orderStatus),
                                "备注": remark,
                                "产品总量": count,
                                "产品总计价格": productTotalPay,
                                "订单总计价格": orderTotalPay,
                                "订单人名称": username,
                                "订单电话": telephone,
                                "订单地址": province + city + area + address,
                                "下单时间": createdAt,
                                "用户名称": usernameUser,
                                "用户邮箱": email,
                                "用户电话": telephoneUser,
                                "物流费用": logisticsFee,
                                "物流状态": LogisticsStatus,
                                "发货时间": expressCreatedAt
                            }

                            return (
                                <List>
                                    {
                                        Object.keys(all).map((key, index) => (
                                                <Item key={index}><span className='item-title'>{key}：</span><span
                                                    className='item-value'>{all[key]}</span></Item>
                                            )
                                        )
                                    }
                                </List>
                            )
                        }
                    }
                }
            </Query>
        )
    }
}

class Shiping extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        return (
            <Query query={gql(orderbyprops)} variables={{orderStatus: '1'}}>
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
                        data = data.orderbyprops


                        return (
                            <div>
                                {
                                    data.length === 0 ?
                                        <div className='order-tip-wrap'>
                                            <div className='order-tip'>还没有这种订单</div>
                                        </div>
                                        :
                                        <DisplayRender
                                            data={data}
                                            orderStatus='1'
                                            button={false}
                                            history={this.props.history}
                                        />
                                }
                            </div>
                        )
                    }
                }
            </Query>
        )
    }
}

class Unbox extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        return (
            <Query query={gql(orderbyprops)} variables={{orderStatus: '2'}}>
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
                        data = data.orderbyprops
                        console.log(data)
                        return (
                            <div>
                                {
                                    data.length === 0 ?
                                        <div className='order-tip-wrap'>
                                            <div className='order-tip'>还没有这种订单</div>
                                        </div>
                                        :
                                        <DisplayRender
                                            data={data}
                                            orderStatus='2'
                                            button={false}
                                            history={this.props.history}
                                        />
                                }
                            </div>
                        )
                    }
                }
            </Query>
        )
    }
}

class Completed extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        return (
            <Query query={gql(orderbyprops)} variables={{orderStatus: '3'}}>
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
                        data = data.orderbyprops
                        console.log(data)
                        return (
                            <div>
                                {
                                    data.length === 0 ?
                                        <div className='order-tip-wrap'>
                                            <div className='order-tip'>还没有这种订单</div>
                                        </div>
                                        :
                                        <DisplayRender
                                            data={data}
                                            orderStatus='3'
                                            button={false}
                                            history={this.props.history}
                                        />
                                }
                            </div>
                        )
                    }
                }
            </Query>
        )
    }
}

class Commented extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        return (
            <Query query={gql(orderbyprops)} variables={{orderStatus: '4'}}>
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
                        data = data.orderbyprops
                        console.log(data)
                        return (
                            <div>
                                {
                                    data.length === 0 ?
                                        <div className='order-tip-wrap'>
                                            <div className='order-tip'>还没有这种订单</div>
                                        </div>
                                        :
                                        <DisplayRender
                                            data={data}
                                            orderStatus='4'
                                            button={false}
                                            history={this.props.history}
                                        />
                                }
                            </div>
                        )
                    }
                }
            </Query>
        )
    }
}


export default withRouter(Orders)