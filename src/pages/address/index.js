import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView, Text } from '@tarojs/components'
import {AtIcon} from "taro-ui"
import {findMany,remove} from "../../utils/crud"
import {getWindowHeight} from "../../utils/style"
import Loading from "../../components/loading"
import './index.scss'

class Address extends Component {
  config = {
    navigationBarTitleText: '地址管理'
  }

  constructor(props) {
    super(props)
    this.state = {
      loaded:false,
      shoppingAddress:[],
      defaultAddress: {}
    }
  }

  componentDidMount() {
    let user_id = 'ioobot'
    let fields = ["address", "updatedAt", "telephone","default", "city", "username", "id", "area", "province"]
    let userAddressData = findMany({collection:"userAddress",condition:{user_id: user_id},fields});//,fields:[]
    userAddressData.then(res =>{
      console.log('userAddressData',res)
      this.setState({
        loaded: true,
        shoppingAddress:res,
        defaultAddress: res.find(data => data.default === 1) || ''
      });
    })
  }

  handleClick = (id) => {
    Taro.navigateTo({
      url: `/pages/address/edit/index?id=${id}`
    })
  }

  changeOrdersAddress =(address) => {
    console.log('address',address)
    Taro.setStorageSync('ordersAddress', JSON.stringify(address))
  }

  deleteAddress = (deleteId) => {
    console.log("deleteId",deleteId)
    Taro.showModal({
        title: '',
        content: '确定要删除这个收货地址吗？',
      })
      .then(res =>{
        if(res.confirm){
          remove({collection:"userAddress",condition:{id:deleteId}}).then((data)=>{
            console.log('delete data',data)
            let num = data.replace(/[^0-9]/ig,"")
            if(num){
              Taro.showToast({
                title: '删除成功',
                icon: 'none'
              });
            }
          })
        }
      })
  }

  render() {
    let {shoppingAddress, defaultAddress} = this.state
    console.log("defaultAddress",defaultAddress,defaultAddress.length)
    if (!this.state.loaded) {
      return (
        <Loading />
      )
    }
    return (
      <View className='address'>
        <ScrollView
          scrollY
          className='address__wrap'
          style={{ height: getWindowHeight() }}
        >
          <View className='address-add'>
            + 添加新地址
          </View>
          {
            !shoppingAddress.length ?
              <View className='kind-empty'>
                <Text>暂无收货地址</Text>
                <Text>点击下方按钮可新增地址</Text>
              </View>:''
          }
          {
            shoppingAddress.length ?
              <View className='other-address'>
                {shoppingAddress.map(address => (
                  <View key={address.id} className='address-card'>
                    <View className='address-info' onClick={this.changeOrdersAddress.bind(this, address)}>
                      <View className='address-username-telephone'>
                        <View className='address-username ellipsis'>{address.username}</View>
                        <View className='address-phone ellipsis'>
                          <Text>{address.telephone}</Text>
                          {address.default ?
                            <Text className='address-label'>默认</Text>:''
                          }
                        </View>
                      </View>
                      <View className='address-address'>{address.province + address.city + address.area + address.address}</View>
                    </View>
                    <View className='address-edit'>
                      <AtIcon
                        value='edit'
                        size='16'
                        onClick={this.handleClick.bind(this, address.id)}
                      />
                    </View>
                    <View className='address-edit'>
                      <AtIcon
                        value='trash'
                        size='16'
                        onClick={this.deleteAddress.bind(this, address.id)}
                      />
                    </View>
                  </View>
                ))}
              </View>:''
          }
        </ScrollView>
      </View>
    )
  }
}

export default Address
