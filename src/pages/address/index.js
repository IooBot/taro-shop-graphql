import Taro, { Component } from '@tarojs/taro'
import {ActivityIndicator, NavBar, Modal} from 'antd-mobile'
import {Icon, Row, Col, message} from 'antd'
import {Query, Mutation} from "react-apollo"
import gql from "graphql-tag"

import SingleAddress from "./singleaddress"
import {getCookie} from "../../../../utils/cookie"
import {userAddressbyprops, delete_address} from "../../../../utils/gql"
import './index.css'
import { findMany } from "../../utils/crud"

const alert = Modal.alert;

class Address extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loaded:false,
            single: false,
            addressID: '',
            addressChoosed: {}
        }
    }

    componentWillMount() {
        let state = this.props.history.location.state || ''
        if (state && state.single) {
            this.setState({
                single: true,
                addressID: 'add'
            })
        }
    }
    componentDidMount() {
      let userAddressData = findMany({collection:"userAddress",condition:{user_id: this.id}});//,fields:[]
      userAddressData.then((res)=>{
        console.log('userAddressData',res)
        this.setState({
          loaded: true,
          data: res[0],
          defaultAddress: res[0].find(data => data.default === 1) || ''
        });
      })
    }
    changePage = (bool) => {
        this.setState({
            single: bool
        })
    }

    changeAddress = (address) => {
        this.setState({
            addressID: address.id,
            addressChoosed: address
        })
    }

    render() {
        let {addressChoosed, addressID, single} = this.state
        let user_id = getCookie('user_id')
        let navContent = single ? '编辑地址' : '地址管理'

        return (
            <div>
                <div className='navbar'>
                    <NavBar
                        mode="light"
                        icon={<Icon type="left"/>}
                        onLeftClick={() => {
                            if(single){
                                this.changePage(false)
                            }else {
                                this.props.history.go(-2)
                            }
                        }}
                    >{navContent}</NavBar>
                </div>
                <div className='content-wrap'>
                    <Query query={gql(userAddressbyprops)} variables={{user_id}}>
                        {
                            ({loading, error, data, refetch}) => {
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

                                data = data.userAddressbyprops
                                // console.log('address data',data)
                                let defaultAddress = data.find(data => data.default === 1) || ''

                                return (
                                    <div>
                                        {
                                            this.state.single ?
                                                <SingleAddress
                                                    addressID={addressID}
                                                    addressChoosed={addressChoosed}
                                                    history={this.props.history}
                                                    user_id={user_id}
                                                    defaultAddress={defaultAddress}
                                                    changePage={this.changePage}
                                                    refetch={refetch}
                                                />
                                                :
                                                <AddressRender
                                                    shoppingAddress={data}
                                                    changePage={this.changePage}
                                                    changeAddress={this.changeAddress}
                                                    history={this.props.history}
                                                    refetch={refetch}
                                                />
                                        }
                                    </div>
                                )
                            }
                        }
                    </Query>
                </div>
            </div>
        )
    }
}

export default Address

class AddressRender extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    changeOrdersAddress =(address) => {
        // console.log('address',address,this.props.history)
        let {history} = this.props
        let prePage = history.location.state.prePage

        if(prePage){
            sessionStorage.setItem('ordersAddress',JSON.stringify(address))
            this.props.history.go(-2)
        }
    }

    deleteAddress = (delete_address, deleteId) => {
        alert('', `确定要删除这个收货地址吗？`, [
            { text: '取消', onPress: () => console.log('cancel') },
            {
                text: '确定',
                onPress: () => {
                    delete_address({variables:{id:deleteId}}).then((data)=>{
                        // console.log('delete data',data)
                        let num = data.data.deleteuserAddress.replace(/[^0-9]/ig,"")
                        if(num){
                            message.success('删除成功')
                            this.props.refetch()
                        }
                    })
                }
            }
        ])
    }

    render() {
        let {changePage, changeAddress, shoppingAddress} = this.props

        return (
            <div>
                <div className='address-add' onClick={() => {
                    changePage(true)
                    changeAddress({id: 'add'})
                }}>
                    <Icon type="plus"/>&nbsp;
                    添加新地址
                </div>
                {
                    !shoppingAddress.length ?
                        <div className='kind-empty gray'>
                            <p>暂无收货地址</p>
                            <p>点击下方按钮可新增地址</p>
                        </div>:''
                }
                {
                    shoppingAddress.length ?
                        <div className='other-address'>
                            {shoppingAddress.map(address => {
                                return (
                                    <div key={address.id} className='address-card'>
                                        <div className='address-info' onClick={() => this.changeOrdersAddress(address)}>
                                            <Row className='address-username-telephone'>
                                                <Col span={6} className='address-username ellipsis'>{address.username}</Col>
                                                <Col span={18} className='address-phone ellipsis'>
                                                    {address.telephone}&nbsp;&nbsp;
                                                    {address.default ?
                                                        <span className='address-label'>默认</span>:''
                                                    }
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col span={24} className='address-address'>{address.province + address.city + address.area + address.address}</Col>
                                            </Row>
                                        </div>
                                        <div className='address-edit'>
                                            <Icon
                                                type="edit"
                                                onClick={()=>{
                                                    changePage(true)
                                                    changeAddress(address)
                                                }}
                                            />
                                        </div>
                                        <Mutation mutation={gql(delete_address)}
                                                  onError={error=>console.log('error',error)}
                                        >
                                            {(delete_address,{ loading, error }) => (
                                                <div className='address-edit'>
                                                    <Icon
                                                        type="delete"
                                                        onClick={()=>{
                                                            this.deleteAddress(delete_address,address.id)
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </Mutation>
                                    </div>
                                )
                            })}
                        </div>:''
                }
            </div>
        )
    }
}
