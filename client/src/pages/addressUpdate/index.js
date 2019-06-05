import Taro, { Component } from '@tarojs/taro'
import { View, Picker, Text } from '@tarojs/components'
import { AtForm, AtInput, AtSwitch } from 'taro-ui'
// import {getGlobalData} from "../../utils/global_data"
import {connect} from "@tarojs/redux";
import moment from 'moment'
import {idGen} from "../../utils/func"
// import {insert, update} from "../../utils/crud"
import './index.scss'

@connect(({ userAddressMutate, common, loading }) => ({
  user_id: common.user_id,
  createResult: userAddressMutate.createResult,
  updateResult: userAddressMutate.updateResult,
  ...loading,
}))
class AddressUpdate extends Component {
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
      addressContent: {},
      defaultStatus:false
    }
    // console.log("this.$router.params",this.$router.params)
    if (this.$router.params.id === 'add') {
      this.state = {...state}
    } else if(this.$router.params.id){
      let addressChose = Taro.getStorageSync('ordersAddress')
      let {province, city, area, address, telephone, username, id, default:default1} = addressChose
      let defaultStatus = default1 ? true : false
      this.state = {...state, province, city, area, address, telephone, username, id, defaultStatus}
    }
  }

  saveAddress = () => {
    const {user_id} = this.props;// getGlobalData("user_id");
    // console.log("saveAddress user_id",user_id)
    let createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
    let {username, telephone, province, city, area, address, defaultStatus, id} = this.state;
    let areaAddress = province + city + area;
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
      // console.log("saveAddress addressContent",addressContent)

      // let fields = ["address", "telephone","default", "city", "username", "id", "area", "province"]
      this.setState({addressContent});
      if(this.$router.params.id === 'add'){
        this.props.dispatch({
          type: 'userAddressMutate/create',
          payload: addressContent,
        });

      } else if(this.$router.params.id){
        this.props.dispatch({
          type: 'userAddressMutate/update',
          payload: { condition: {id: this.$router.params.id}, data: addressContent},
        });
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

  goBackPage = (val) => {
    Taro.navigateBack({
      delta: val
    })
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
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    let region = e.detail.value
    // console.log("bindRegionChange region",region)
    this.setState({
      region,
      province: region[0],
      city: region[1],
      area: region[2]
    })
  }

  render() {
    let {username, telephone, address, province, city, area, region, addressContent} = this.state
    const { createResult, updateResult, dispatch } = this.props;
    if(createResult){
      if(createResult.result == 'ok'){
        this.message('地址创建成功')
        Taro.setStorageSync('ordersAddress', addressContent)
        this.goBackPage(1)
      }else{
        this.message('地址创建失败，请重新创建')
      }
      dispatch({
        type: 'userAddressMutate/saveCreateResult',
        payload: ''
      });
    }
    if(updateResult){
      if(updateResult.result == 'ok'){
        this.message('地址更新成功')
        Taro.setStorageSync('ordersAddress', addressContent)
        this.goBackPage(1)
      }else{
        this.message('地址更新失败，请再试')
      }
      dispatch({
        type: 'userAddressMutate/saveUpdateResult',
        payload: ''
      });
    }
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
        <View className='address-add' onClick={this.saveAddress}>保存并使用</View>
      </View>
    )
  }
}

export default AddressUpdate
