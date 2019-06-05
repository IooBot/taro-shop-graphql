import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView, Text } from '@tarojs/components'
import {AtIcon} from "taro-ui"
import {connect} from "@tarojs/redux";
// import {findMany,remove} from "../../utils/crud"
import {getWindowHeight} from "../../utils/style"
//import {getGlobalData} from "../../utils/global_data"
import Loading from "../../components/loading"
import './index.scss'


@connect(({ userAddressList, userAddressMutate, loading }) => ({
  deleteResult: userAddressMutate.deleteResult,
  userAddressList,
  ...loading,
}))
class Address extends Component {
  config = {
    navigationBarTitleText: '地址管理'
  }

  constructor(props) {
    super(props)
    this.state = {
      loaded:false,
      shoppingAddress:[]
    }
  }

  componentDidShow() {
    // this.getAddressData()
    const {user_id, dispatch} = this.props; // getGlobalData("user_id");
    dispatch({
      type: 'userAddressList/fetch',
      payload:{user_id},
    });
  }

  navigateToAddressEdit = (id,address) => {
    Taro.navigateTo({
      url: `/pages/addressUpdate/index?id=${id}`
    })
    if(id !== 'add'){
      Taro.setStorageSync('ordersAddress', address)
      // console.log('ordersAddress',Taro.getStorageSync('ordersAddress'))
    }
  }

  changeOrdersAddress = (address) => {
    // console.log('address',address)
    Taro.setStorageSync('ordersAddress', address)
    // console.log('changeOrdersAddress',this.$router.params)

    let {prePage, dataType}= this.$router.params
    if(prePage === 'orders') {
      Taro.navigateTo({
        url: `/pages/orders/index?dataType=${dataType}`
      })
    }
  }

  deleteAddress = (deleteId) => {
    // console.log("deleteId",deleteId)
    Taro.showModal({
      title: '',
      content: '确定要删除这个收货地址吗？',
      })
      .then(res =>{
        if(res.confirm){
          this.props.dispatch({
            type:'userAddress/delete',
            payload: {id:deleteId}
          });
        }
      })
  }

  render() {
    let {shoppingAddress} = this.state
    // console.log("shoppingAddress",shoppingAddress)
    const { userAdressList, deleteResult, effects, dispatch }  = this.props;
    if (effects['userAdressList/fetch']) { //!this.state.loaded
      return (
        <Loading />
      )
    }
    if(shoppingAddress.length ==0 && userAdressList) {
      shoppingAddress = userAdressList.list;
      this.setState({shoppingAddress: shoppingAddress});
    }
    if(deleteResult && deleteResult == 'ok'){
      Taro.showToast({
        title: '删除成功',
        icon: 'none'
      });
      this.getAddressData();
      dispatch({
        type: 'userAdressMutate/saveDeleteResult',
        payload:''
      })
    }
    return (
      <View className='address'>
        <ScrollView
          scrollY
          className='address__wrap'
          style={{ height: getWindowHeight() }}
        >
          <View className='address-add' onClick={this.navigateToAddressEdit.bind(this, 'add')}>
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
                        onClick={this.navigateToAddressEdit.bind(this, address.id, address)}
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
