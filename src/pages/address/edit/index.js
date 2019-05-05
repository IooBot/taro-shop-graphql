import React, {Component} from "react"
import {message} from 'antd'
import {InputItem, TextareaItem, Picker, Switch} from 'antd-mobile'
import {Mutation} from "react-apollo"
import gql from "graphql-tag"
import moment from 'moment'
import {district} from 'antd-mobile-full-demo-data';

import {create_update_userAddress, update_userAddress, userAddressbyprops} from "../../../../../utils/gql"
import './index.scss'
import {idGen} from "../../../../../utils/func"

class SingleAddress extends Component {
    config = {
        navigationBarTitleText: '编辑地址'
    }

    constructor(props) {
        super(props)
        let state = {
            username: '',
            telephone: '',
            province: '安徽省',
            city: '合肥市',
            area: '蜀山区',
            address: '',
            id: '',
            defaultStatus:false
        }
        if (props.addressID === 'add') {
            this.state = {...state}
        } else {
            let {province, city, area, address, telephone, username, id, default:default1} = props.addressChoosed
            let defaultStatus = default1 ? 1 : 0
            this.state = {...state, province, city, area, address, telephone, username, id, defaultStatus}
        }
        this.handleDistrict()
    }

    handleDistrict = () => {
        district.forEach((item)=>{
            let {label} = item
            item.value = label
            if(item.children){
                item.children.forEach((item)=>{
                    let {label} = item
                    item.value = label
                    if(item.children){
                        item.children.forEach((item)=>{
                            let {label} = item
                            item.value = label
                        })
                    }
                })
            }
        })
    }

    saveAddress = (user_id, mutate) => {
        let createdAt = moment().format('YYYY-MM-DD HH:mm:ss')
        let {username, telephone, province, city, area, address, defaultStatus, id} = this.state
        let areaAddress = province + city + area
        const testPhoneNum = /^1[0-9]{10}$/;
        let isPoneAvailable = testPhoneNum.test(telephone);

        if(username && isPoneAvailable && areaAddress && address){
            let addressId = id || idGen('address')

            let defaultStatus1 = defaultStatus ? 1 : 0
            const addressContent = {
                address,
                updatedAt: "",
                telephone,
                default: defaultStatus1,
                city,
                username,
                postcode: "",
                createdAt,
                deletedAt: "",
                id: addressId,
                user_id,
                area,
                province
            }

            let {defaultAddress, addressID} = this.props
            if(defaultAddress){
                let {id} = defaultAddress
                addressContent.updateID = id
                addressContent.updateDefault = 0
            }else {
                addressContent.updateID = ''
            }

            mutate({variables:addressContent}).then((data)=>{
                this.props.refetch()
                let prePage = this.props.history.location.state.prePage

                if(defaultStatus1){
                    sessionStorage.setItem('ordersAddress',JSON.stringify(addressContent))
                }
                if(prePage && addressID !== 'add'){
                    sessionStorage.setItem('ordersAddress',JSON.stringify(addressContent))
                    this.props.history.go(-2)
                }else {
                    this.props.changePage(false)
                }
            })
        }else if(!username){
            message.warning('收货人不能为空',1)
        }else if(!telephone){
            message.warning('联系电话不能为空',1);
        } else if(!isPoneAvailable){
            message.warning('请输入11位有效手机号码',1)
        }else if(!areaAddress){
            message.warning('请选择地区',1)
        }else if(!address){
            message.warning('请输入详细地址，无需包含省市',1)
        }else {
            message.warning('收货地址暂未完善',2)
        }

    }

    render() {
        let {addressID, user_id} = this.props
        let {username, telephone, province, city, area, address} = this.state

        return (
            <div>
                <div>
                    <InputItem placeholder="请填写收货人" value={username} onChange={(username) => {
                        this.setState({username})
                    }}>
                        <div>收货人</div>
                    </InputItem>
                    <InputItem placeholder="请填写联系电话" value={telephone} onChange={(telephone) => {
                        this.setState({telephone})
                    }}>
                        <div>联系电话</div>
                    </InputItem>
                    <Picker
                        data={district}
                        value={[province, city ? city : '', area ? area : '']}
                        onOk={(address) => {
                            // console.log('onOK address',address)
                            this.setState({province: address[0], city: address[1], area: address[2]})
                        }}
                    >
                        <TextareaItem
                            title="选择地区"
                            editable={false}
                            value={province+city+area}
                        />
                    </Picker>
                    <TextareaItem
                        title="详细地址"
                        placeholder="请输入详细地址，无需包含省市"
                        autoHeight
                        value={address}
                        onChange={(address) => {
                            this.setState({address})
                        }}
                    />
                    <div className='address-default-checked'>
                        <span>设为默认地址</span>
                        <span>
                            <Switch
                                checked={this.state.defaultStatus}
                                color={'#f44'}
                                onChange={() => {
                                    this.setState({
                                        defaultStatus: !this.state.defaultStatus,
                                    })
                                }}
                            />
                        </span>
                    </div>
                </div>

                <div className='address-button-group'>
                    <Mutation mutation={addressID === 'add' ? gql(create_update_userAddress) : gql(update_userAddress)}
                              refetchQueries={[
                                  {query: gql(userAddressbyprops), variables:{user_id}}
                              ]}
                              onError={error=>console.log('error',error)}
                    >
                        {(mutate,{ loading, error }) => (
                            <div className='address-add'
                                 onClick={()=>{
                                     this.saveAddress(user_id, mutate)
                                 }}
                            >
                                保存并使用
                            </div>
                        )}
                    </Mutation>
                </div>
            </div>
        )
    }
}

export default SingleAddress