import Taro, { Component } from '@tarojs/taro'
import { View, Picker, Text } from '@tarojs/components'
import { AtForm, AtInput, AtSwitch } from 'taro-ui'
import moment from 'moment'
import './index.scss'
import {idGen} from "../../../utils/func"
import {insert, update} from "../../../utils/crud"

class AddressEdit extends Component {
  config = {
    navigationBarTitleText: '编辑地址'
  }

  constructor(props) {
    super(props)
    let state = {
      username: '',
      telephone: '',
      region:['','',''],
      province: '',
      city: '',
      area: '',
      address: '',
      id: '',
      defaultStatus:false
    }
    console.log("this.$router.params",this.$router.params)
    if (this.$router.params.id === 'add') {
      this.state = {...state}
    } else {
      let addressChose = Taro.getStorageSync('editChoseAddress')
      let {province, city, area, address, telephone, username, id, default:default1} = addressChose
      let defaultStatus = default1 ? true : false
      this.state = {...state, province, city, area, address, telephone, username, id, defaultStatus}
    }
  }

  saveAddress = (user_id) => {
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

      let fields = ["address", "telephone","default", "city", "username", "id", "area", "province"]

      if(this.$router.params.id === 'add'){
        insert({collection:'userAddress',condition: addressContent,fields})
        Taro.setStorageSync('ordersAddress', JSON.stringify(addressContent))
      }else {
        update({collection: 'userAddress',condition: addressContent,fields})
        Taro.setStorageSync('ordersAddress', JSON.stringify(addressContent))
      }

    }else if(!username){
      this.message('收货人不能为空')
    }else if(!telephone){
      this.message('联系电话不能为空')
    } else if(!isPoneAvailable){
      this.message('请输入11位有效手机号码')
    }else if(!areaAddress){
      this.message('请选择地区')
    }else if(!address){
      this.message('请输入详细地址，无需包含省市')
    }else {
      this.message('收货地址暂未完善')
    }
  }

  message = (title) => {
    Taro.showToast({
      title,
      icon: 'none'
    });
  }

  handleChange = (type,value) => {
    this.setState({
      [type]:value
    })
  }

  bindRegionChange =(e) => {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    let region = e.detail.value
    console.log("bindRegionChange region",region)
    this.setState({
      region,
      province: region[0],
      city: region[1],
      area: region[2]
    })
  }

  render() {
    let {user_id} = 'ioobot'
    console.log("address edit this.state",this.state)
    let {username, telephone, address, province, city, area, region} = this.state

    return (
      <View className='address-edit'>
        <AtForm>
          <AtInput
            name='username'
            title='收货人'
            type='text'
            placeholder='请填写收货人'
            value={username}
            onChange={this.handleChange.bind(this, 'username')}
          />
          <AtInput
            name='telephone'
            title='手机号码'
            type='phone'
            placeholder='请填写手机号码'
            value={telephone}
            onChange={this.handleChange.bind(this, 'telephone')}
          />
          <View className='address-edit__region'>
            <View className='address-edit__region-title'>选择地区</View>
            <Picker
              mode='region'
              onChange={this.bindRegionChange}
              value={region}
            >
              <View className='address-edit__region-item'>
                {province ?
                  province +' '+ city +' '+ area
                  :
                  <Text className='placeholder-text'>请选择省市区</Text>
                }
              </View>
            </Picker>
          </View>
          <AtInput
            name='address'
            title='详细地址'
            type='text'
            placeholder='请输入详细地址，无需包含省市'
            value={address}
            onChange={this.handleChange.bind(this, 'address')}
          />
          <AtSwitch
            title='设为默认地址'
            border={false}
            checked={this.state.defaultStatus}
            color='#f44'
            onChange={this.handleChange.bind(this, 'defaultStatus')}
          />
        </AtForm>
        <View className='address-add' onClick={this.saveAddress.bind(this,user_id)}>保存并使用</View>
      </View>
    )
  }
}

export default AddressEdit