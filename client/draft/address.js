import {getGlobalData} from "../src/utils/global_data";
import {findMany, insert, remove, update} from "../src/utils/crud";
import Taro from "@tarojs/taro";

getAddressData = () => {
  let user_id = getGlobalData("user_id")
  let fields = ["address", "telephone", "default", "city", "username", "id", "area", "province"]
  findMany({collection:"userAddress",condition:{user_id: user_id},fields}).then(res =>{
    // console.log('address userAddressData',res)
    this.setState({
      loaded: true,
      shoppingAddress: res
    });
  })
}


// 获取用户收货地址，缓存无则重新获取
getUserAddressData = () => {
  let selectAddress = Taro.getStorageSync('ordersAddress')
  if(selectAddress){
    this.setState({
      selectAddress
    })
  }else {
    let user_id = getGlobalData("user_id")
    let fields = ["id", "default", "username", "telephone", "province", "area", "city", "address"]
    findMany({collection:"userAddress",condition:{user_id: user_id,default:1},fields}).then(res =>{
      // console.log('orders userAddressData',res)
      this.setState({
        selectAddress: res[0]
      })
      Taro.setStorage({ key: 'ordersAddress', data: res[0] })
    })
  }
}

insert({collection:'userAddress',condition: addressContent}).then((res)=>{
  if(res.result === "ok"){
    this.message('地址创建成功')
    Taro.setStorageSync('ordersAddress', addressContent)
    this.goBackPage(1)
  }else{
    this.message('地址创建失败，请重新创建')
  }
})

update({collection: 'userAddress',condition: addressContent}).then((res)=>{
  if(res.result === "ok"){
    this.message('地址更新成功')
    Taro.setStorageSync('ordersAddress', addressContent)
    this.goBackPage(1)
  }else{
    this.message('地址更新失败，请重新创建')
  }
})

remove({collection:"userAddress",condition:{id:deleteId}}).then((data)=>{
  // console.log('delete userAddress data',data)
  if(data === "ok"){
    Taro.showToast({
      title: '删除成功',
      icon: 'none'
    })
    this.getAddressData()
  }
})
